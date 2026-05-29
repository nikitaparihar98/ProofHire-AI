import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  Loader2,
  Mic,
  MicOff,
  Monitor,
  Play,
  Send,
  ShieldAlert,
  Star,
  User,
  Video,
  VideoOff,
  Volume2,
} from 'lucide-react';
import { getInterviewById, saveInterviewSimulation, updateInterview } from '../services/api';
import { useAuth } from '../context/AuthContext';

const questionBank = [
  'Welcome. To begin, introduce yourself and summarize the role you are interviewing for.',
  'Walk me through the project you are most proud of and the tradeoffs you made.',
  'Describe a difficult bug or analysis problem. How did you isolate the root cause?',
  'How would you explain a technical decision to a non-technical stakeholder?',
  'Tell me about a time you improved performance, reliability, or maintainability.',
  'What would you do in your first week if you joined this team?',
];

const scoreAreas = ['Technical Depth', 'Communication', 'Problem Solving', 'Role Fit'];

const defaultScores = {
  'Technical Depth': 3,
  Communication: 3,
  'Problem Solving': 3,
  'Role Fit': 3,
};

const parseSimulation = (notes) => {
  if (!notes) return null;
  try {
    const parsed = JSON.parse(notes);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const evaluateTranscript = (transcript) => {
  const answers = transcript.filter((item) => item.speaker !== 'AI Interviewer' && item.speaker !== 'ProofHire AI');
  const answerText = answers.map((item) => item.text).join(' ').toLowerCase();
  const wordCount = answerText.split(/\s+/).filter(Boolean).length;
  const technicalSignals = ['api', 'database', 'model', 'testing', 'performance', 'system', 'analysis', 'debug', 'sql', 'python'];
  const signalCount = technicalSignals.filter((word) => answerText.includes(word)).length;
  const communication = Math.min(5, Math.max(1, Math.round(wordCount / 35)));
  const technical = Math.min(5, Math.max(1, 2 + Math.round(signalCount / 2)));
  const problemSolving = answerText.includes('debug') || answerText.includes('root cause') || answerText.includes('tradeoff') ? 4 : 3;
  const roleFit = answers.length >= 4 ? 4 : 3;
  const average = ((technical + communication + problemSolving + roleFit) / 4).toFixed(1);

  return {
    average,
    summary:
      answers.length === 0
        ? 'Waiting for candidate responses.'
        : `AI captured ${answers.length} response(s). Current signal is ${average}/5 based on specificity, structure, and role relevance.`,
    strengths: signalCount > 2 ? ['Specific technical vocabulary', 'Role-relevant examples'] : ['Basic communication signal captured'],
    concerns: wordCount < 80 ? ['Responses are still short; recruiter should review depth.'] : [],
    answer_count: answers.length,
    word_count: wordCount,
    technical_signal_count: signalCount,
  };
};

const pickSignals = (answer) => {
  const text = answer.toLowerCase();
  const signals = [
    ['python', 'Python'],
    ['sql', 'SQL'],
    ['api', 'API design'],
    ['database', 'database design'],
    ['model', 'modeling'],
    ['testing', 'testing'],
    ['debug', 'debugging'],
    ['root cause', 'root-cause analysis'],
    ['performance', 'performance'],
    ['stakeholder', 'stakeholder communication'],
    ['tradeoff', 'tradeoff reasoning'],
    ['team', 'team collaboration'],
  ];

  return signals.filter(([needle]) => text.includes(needle)).map(([, label]) => label);
};

const buildAiReply = ({ answer, nextQuestion, finished, role }) => {
  const words = answer.split(/\s+/).filter(Boolean);
  const signals = pickSignals(answer);
  const shortAnswer = words.length < 25;

  if (finished) {
    return shortAnswer
      ? 'Thanks. I have completed the interview. Your answers were brief, so the recruiter should review for depth before making a decision.'
      : `Thanks. I have completed the interview. I noted ${signals.slice(0, 2).join(' and ') || 'your examples'} as part of your ${role || 'role'} signal. The recruiter can now review the transcript and evaluation.`;
  }

  if (shortAnswer) {
    return `I need a little more depth there. In your next answer, please include the situation, the action you took, and the result. ${nextQuestion}`;
  }

  if (signals.length > 0) {
    return `Good, I heard evidence around ${signals.slice(0, 2).join(' and ')}. I am going to probe the next area now. ${nextQuestion}`;
  }

  return `Thanks. I captured the answer, but I will look for more concrete technical evidence in the next response. ${nextQuestion}`;
};

export default function InterviewRoom() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const saveTimerRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [answer, setAnswer] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [notes, setNotes] = useState('');
  const [scores, setScores] = useState(defaultScores);
  const [reviewDirty, setReviewDirty] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState('not_started');
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [aiEvaluation, setAiEvaluation] = useState(evaluateTranscript([]));
  const [malpracticeFlags, setMalpracticeFlags] = useState([]);

  const isRecruiter = user?.role === 'recruiter';
  const canStartInterview = !isRecruiter && interview?.status === 'Scheduled' && simulationStatus === 'not_started';
  function speakText(text) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  const applySimulation = (data, shouldSpeak = false, preserveReview = false) => {
    const simulation = parseSimulation(data.notes);
    setInterview(data);
    setTranscript(simulation?.transcript || []);
    if (!preserveReview) {
      setScores({ ...defaultScores, ...(simulation?.scores || {}) });
      setNotes(simulation?.recruiter_notes || (!simulation ? data.notes || '' : ''));
    }
    setSimulationStatus(simulation?.simulation_status || 'not_started');
    setActiveQuestion(simulation?.active_question || 0);
    setAiEvaluation(simulation?.ai_evaluation || evaluateTranscript(simulation?.transcript || []));
    setMalpracticeFlags(simulation?.malpractice_flags || []);

    if (shouldSpeak && simulation?.simulation_status === 'in_progress') {
      speakText(questionBank[simulation?.active_question || 0]);
    }
  };

  useEffect(() => {
    async function fetchInterview() {
      try {
        const data = await getInterviewById(interviewId);
        applySimulation(data, user?.role === 'candidate');
      } catch (error) {
        console.error(error);
        navigate(user?.role === 'candidate' ? '/candidate/interviews' : '/interviews');
      } finally {
        setLoading(false);
      }
    }

    fetchInterview();
  }, [interviewId, navigate, user?.role]);

  useEffect(() => {
    if (!isRecruiter) return undefined;

    const interval = window.setInterval(async () => {
      try {
        const data = await getInterviewById(interviewId);
        applySimulation(data, false, reviewDirty);
      } catch (error) {
        console.error('Failed to refresh interview monitor', error);
      }
    }, 2500);

    return () => window.clearInterval(interval);
  }, [interviewId, isRecruiter, reviewDirty]);

  useEffect(() => {
    let cancelled = false;

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    async function startCamera() {
      if (!cameraOn) {
        stopCamera();
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera preview is not supported in this browser.');
        return;
      }

      try {
        setCameraError('');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error(error);
        setCameraError('Camera permission was blocked or no camera was found.');
        setCameraOn(false);
      }
    }

    startCamera();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [cameraOn]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Use Chrome or Edge, or type your answer.');
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0].transcript;
        if (event.results[index].isFinal) finalText += text;
        else interimText += text;
      }
      const spokenText = `${finalText || interimText}`.trim();
      if (spokenText) setAnswer(spokenText);
    };

    recognition.onerror = (event) => {
      setSpeechError(`Speech input stopped: ${event.error}`);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!interview || isRecruiter) return undefined;

    window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      saveInterviewSimulation(interviewId, {
        transcript,
        scores,
        recruiter_notes: notes,
        simulation_status: simulationStatus,
        active_question: activeQuestion,
        ai_evaluation: aiEvaluation,
        malpractice_flags: malpracticeFlags,
      }).catch((error) => console.error('Failed to save interview simulation', error));
    }, 600);

    return () => window.clearTimeout(saveTimerRef.current);
  }, [activeQuestion, aiEvaluation, interview, interviewId, isRecruiter, malpracticeFlags, notes, scores, simulationStatus, transcript]);

  useEffect(() => {
    if (isRecruiter || simulationStatus !== 'in_progress') return undefined;

    const handleVisibilityChange = () => {
      if (!document.hidden) return;

      const flag = `Tab switched away during interview at ${new Date().toLocaleTimeString()}`;
      setMalpracticeFlags((items) => (items.includes(flag) ? items : [...items, flag]));
      setTranscript((items) => [
        ...items,
        {
          speaker: 'Proctoring',
          text: flag,
        },
      ]);
    };

    window.addEventListener('blur', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRecruiter, simulationStatus]);

  const averageScore = useMemo(() => {
    const values = Object.values(scores);
    return (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1);
  }, [scores]);

  const latestAiMessage = useMemo(() => {
    return [...transcript].reverse().find((item) => item.speaker === 'AI Interviewer')?.text || '';
  }, [transcript]);

  const startAiInterview = () => {
    const intro = {
      speaker: 'ProofHire AI',
      text: `AI online interview started for ${interview?.candidate_name}.`,
    };
    const firstQuestion = { speaker: 'AI Interviewer', text: questionBank[0] };
    setTranscript([intro, firstQuestion]);
    setSimulationStatus('in_progress');
    setActiveQuestion(0);
    speakText(questionBank[0]);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is not available in this browser.');
      return;
    }

    try {
      setSpeechError('');
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      console.error(error);
      setSpeechError('Speech recognition could not start. Try again in a moment.');
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    if (simulationStatus === 'not_started' && interview?.status === 'Scheduled') {
      startAiInterview();
      window.setTimeout(startListening, 350);
      return;
    }

    if (simulationStatus !== 'in_progress') {
      setSpeechError('This interview is not accepting voice input right now.');
      return;
    }

    startListening();
  };

  const submitAnswer = () => {
    if (!answer.trim() || simulationStatus !== 'in_progress') return;

    const nextQuestion = activeQuestion + 1;
    const finished = nextQuestion >= questionBank.length;
    const aiResponse = buildAiReply({
      answer: answer.trim(),
      nextQuestion: finished ? '' : questionBank[nextQuestion],
      finished,
      role: interview?.candidate_role,
    });
    const updatedTranscript = [
      ...transcript,
      { speaker: interview?.candidate_name || 'Candidate', text: answer.trim() },
      {
        speaker: 'AI Interviewer',
        text: aiResponse,
      },
    ];
    const evaluation = evaluateTranscript(updatedTranscript);

    setTranscript(updatedTranscript);
    setAnswer('');
    setActiveQuestion(finished ? activeQuestion : nextQuestion);
    setSimulationStatus(finished ? 'completed' : 'in_progress');
    setAiEvaluation(evaluation);
    speakText(aiResponse);
    if (listening && recognitionRef.current) recognitionRef.current.stop();
  };

  const saveRecruiterReview = async () => {
    try {
      setSaving(true);
      await saveInterviewSimulation(interviewId, {
        transcript,
        scores,
        recruiter_notes: notes,
        simulation_status: simulationStatus,
        active_question: activeQuestion,
        ai_evaluation: aiEvaluation,
        malpractice_flags: malpracticeFlags,
      });
      setReviewDirty(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save recruiter review');
    } finally {
      setSaving(false);
    }
  };

  const completeInterview = async () => {
    try {
      setSaving(true);
      await saveRecruiterReview();
      await updateInterview(interviewId, 'Completed');
      navigate('/interviews');
    } catch (error) {
      console.error(error);
      alert('Failed to complete interview');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to={isRecruiter ? '/interviews' : '/candidate/interviews'}
            className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={18} /> Back to interviews
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{interview?.interview_title}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {interview?.candidate_name} | {interview?.candidate_role} | {new Date(interview?.scheduled_time).toLocaleString()}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-700">
            <Bot size={14} /> {isRecruiter ? 'Recruiter monitor mode' : 'AI online interview'}
          </div>
        </div>

        {isRecruiter ? (
          <button
            onClick={completeInterview}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
            Finalize Review
          </button>
        ) : (
          <button
            onClick={startAiInterview}
            disabled={!canStartInterview}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-60"
          >
            <Play size={18} />
            {simulationStatus === 'not_started'
              ? 'Start AI Interview'
              : simulationStatus === 'in_progress'
                ? 'Interview Running'
                : 'Interview Completed'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-sm">
          <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-2">
            <div className="relative flex items-center justify-center overflow-hidden border-b border-slate-800 bg-slate-900 md:border-b-0 md:border-r">
              <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white">
                <User size={14} /> Candidate
              </div>
              {cameraOn && !cameraError ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="h-full min-h-[420px] w-full object-cover" />
                  <div className="absolute bottom-5 left-5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white">
                    Camera preview
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  <VideoOff className="h-16 w-16 text-slate-600" />
                  <p className="max-w-xs text-sm font-semibold text-slate-500">
                    {cameraError || 'Camera is off. Turn it on to see the local preview.'}
                  </p>
                </div>
              )}
            </div>

            <div className="relative flex items-center justify-center bg-slate-950">
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs font-bold text-white">
                <Bot size={14} /> AI Interviewer
              </div>
              <div className="space-y-5 px-8 text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-400/10 text-indigo-200">
                  <Bot size={54} />
                </div>
                <p className="text-sm font-bold leading-6 text-slate-300">
                  {simulationStatus === 'not_started'
                    ? 'Waiting to begin.'
                    : simulationStatus === 'completed'
                      ? 'Interview complete.'
                      : latestAiMessage || questionBank[activeQuestion]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-5 py-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Clock size={15} /> Status: {simulationStatus.replace('_', ' ')}
            </div>
            {!isRecruiter && (
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  disabled={simulationStatus === 'completed' || interview?.status !== 'Scheduled'}
                  className={`rounded-xl p-3 text-white hover:bg-slate-700 disabled:opacity-50 ${listening ? 'bg-rose-600' : 'bg-slate-800'}`}
                  title={listening ? 'Stop speech input' : simulationStatus === 'not_started' ? 'Start interview and speak' : 'Speak your answer'}
                >
                  {listening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button onClick={() => setCameraOn((value) => !value)} className="rounded-xl bg-slate-800 p-3 text-white hover:bg-slate-700">
                  {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
                <button onClick={() => speakText(questionBank[activeQuestion])} className="rounded-xl bg-slate-800 p-3 text-white hover:bg-slate-700">
                  <Volume2 size={18} />
                </button>
                <button className="rounded-xl bg-slate-800 p-3 text-white hover:bg-slate-700">
                  <Monitor size={18} />
                </button>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-indigo-700">
              <Bot size={20} />
              <h2 className="text-lg font-black">{isRecruiter ? 'Live AI Evaluation' : 'AI Interviewer'}</h2>
            </div>
            <p className="text-sm font-semibold leading-6 text-indigo-900">{aiEvaluation.summary}</p>
            <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm font-black text-indigo-800">
              AI signal: {aiEvaluation.average || '0.0'}/5
            </div>
            {isRecruiter && (
              <div className="mt-4 grid grid-cols-1 gap-3 text-xs font-bold md:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-3 text-emerald-700">
                  Strengths: {(aiEvaluation.strengths || []).join(', ') || 'Waiting for signal'}
                </div>
                <div className="rounded-2xl bg-white/70 p-3 text-amber-700">
                  Concerns: {(aiEvaluation.concerns || []).join(', ') || 'None yet'}
                </div>
              </div>
            )}
            {!isRecruiter && simulationStatus === 'not_started' && (
              <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs font-bold text-indigo-800">
                Click Start AI Interview or press the mic button to begin voice mode.
              </p>
            )}
            {speechError && !isRecruiter && (
              <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs font-bold text-rose-700">{speechError}</p>
            )}
          </section>

          <section className={`rounded-[2rem] border p-6 shadow-sm ${
            malpracticeFlags.length > 0
              ? 'border-rose-200 bg-rose-50'
              : 'border-emerald-100 bg-emerald-50'
          }`}>
            <div className={`mb-3 flex items-center gap-2 ${
              malpracticeFlags.length > 0 ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              <ShieldAlert size={20} />
              <h2 className="text-lg font-black">Interview Proctoring</h2>
            </div>
            {malpracticeFlags.length > 0 ? (
              <div className="space-y-2">
                {malpracticeFlags.map((flag) => (
                  <p key={flag} className="rounded-2xl bg-white/80 p-3 text-xs font-bold text-rose-700">
                    {flag}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-emerald-800">No tab switch or focus-loss events detected.</p>
            )}
          </section>

          {isRecruiter && (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Recruiter Scorecard</h2>
                <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">{averageScore}/5</div>
              </div>
              <div className="space-y-4">
                {scoreAreas.map((area) => (
                  <label key={area} className="block">
                    <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                      <span>{area}</span>
                      <span className="inline-flex items-center gap-1 text-indigo-600"><Star size={12} /> {scores[area]}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scores[area]}
                      onChange={(event) => {
                        setScores({ ...scores, [area]: Number(event.target.value) });
                        setReviewDirty(true);
                      }}
                      onMouseUp={saveRecruiterReview}
                      className="w-full accent-indigo-600"
                    />
                  </label>
                ))}
              </div>
            </section>
          )}

          {isRecruiter && (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">Recruiter Notes</h2>
              <textarea
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setReviewDirty(true);
                }}
                onBlur={saveRecruiterReview}
                rows="6"
                className="mt-4 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                placeholder="Capture final hiring signal..."
              />
            </section>
          )}
        </aside>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-black text-slate-900">Live Interview Transcript</h2>
          <p className="mt-1 text-sm text-slate-500">
            Candidate speech is captured here and saved for recruiter monitoring and evaluation.
          </p>
        </div>
        <div className="max-h-80 space-y-3 overflow-y-auto p-6">
          {transcript.map((item, index) => (
            <div key={`${item.speaker}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{item.speaker}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{item.text}</p>
            </div>
          ))}
          {transcript.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-6 text-sm font-bold text-slate-400">
              No transcript yet. The candidate has not started the AI interview.
            </p>
          )}
        </div>
        {!isRecruiter && (
          <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row">
            <input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submitAnswer();
              }}
              disabled={simulationStatus !== 'in_progress'}
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-60"
              placeholder={listening ? 'Listening...' : 'Speak with the mic or type your answer...'}
            />
            <button
              onClick={submitAnswer}
              disabled={simulationStatus !== 'in_progress' || !answer.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              <Send size={17} /> Submit Answer
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
