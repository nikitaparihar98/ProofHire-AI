// src/pages/candidate/CandidateAssessmentPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAssessment, saveAssessmentDraft, submitAssessment } from '../../services/api';
import { Loader2, AlertTriangle, Clock, Brain, Check, FileText } from 'lucide-react';

function RichEditor({ value, onChange, disabled }) {
  return (
    <div className="relative rounded-[2rem] border border-slate-200 overflow-hidden shadow-inner bg-slate-900">
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
        <span>challenges_editor.txt</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Autosaving</span>
      </div>
      <textarea
        className="w-full h-[400px] p-6 bg-slate-950 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="// Write your implementation, detailed explanations, or code answers here..."
      />
    </div>
  );
}

function Countdown({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl font-mono font-bold text-sm shadow-sm">
      <Clock size={16} className="animate-pulse" />
      <span>Time Remaining: {mins}:{secs.toString().padStart(2, '0')}</span>
    </div>
  );
}

function ProctoringOverlay({ visible, onClose }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight">Window Focus Lost</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Please keep your focus on this window. Leaving the assessment screen or performing copy/paste actions is logged as a proctoring flag.
          </p>
        </div>
        <button 
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl font-bold transition shadow-lg shadow-indigo-100" 
          onClick={onClose}
        >
          I Understand, Continue
        </button>
      </div>
    </div>
  );
}

function EvaluationOverlay({ steps, onFinish }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index >= steps.length) {
      const timer = setTimeout(onFinish, 1200);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setIndex(index + 1), 1800);
    return () => clearTimeout(timer);
  }, [index, steps, onFinish]);

  if (index >= steps.length) return null;

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50 text-white animate-in fade-in duration-300">
      <div className="max-w-md w-full px-6 text-center space-y-8">
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/30 relative">
          <div className="absolute inset-0 bg-indigo-600 rounded-full animate-ping opacity-25"></div>
          <Brain size={40} className="animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight">AI Assessment Evaluator</h3>
          <p className="text-slate-400 text-sm font-medium">Analyzing candidate submissions using ProofHire AI</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-left">
          {steps.map((step, idx) => {
            const isCompleted = idx < index;
            const isActive = idx === index;
            return (
              <div key={idx} className={`flex items-center gap-3 transition-opacity duration-300 ${isCompleted || isActive ? 'opacity-100' : 'opacity-30'}`}>
                {isCompleted ? (
                  <div className="w-5 h-5 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-400 shrink-0" />
                ) : (
                  <div className="w-5 h-5 bg-slate-800 rounded-full shrink-0"></div>
                )}
                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CandidateAssessmentPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [draft, setDraft] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [malpracticeLog, setMalpracticeLog] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showProctor, setShowProctor] = useState(false);
  const [showEval, setShowEval] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  // Fetch assessment details on mount
  useEffect(() => {
    async function fetch() {
      try {
        const data = await getAssessment(assessmentId);
        setAssessment(data);
        setDraft(data.draft_answer || '');
        setTimeLeft(data.time_left_seconds || data.duration * 60);
        
        if (data.malpractice_log) {
          try {
            const parsed = typeof data.malpractice_log === 'string' 
              ? JSON.parse(data.malpractice_log) 
              : data.malpractice_log;
            setMalpracticeLog(Array.isArray(parsed) ? parsed : []);
          } catch {
            setMalpracticeLog([]);
          }
        }
      } catch (e) {
        console.error(e);
        navigate('/candidate/dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [assessmentId, navigate]);

  // Autosave draft every 30 seconds
  useEffect(() => {
    if (!assessment || submitting) return;
    const interval = setInterval(async () => {
      try {
        await saveAssessmentDraft(assessmentId, {
          draft_answer: draft,
          time_left_seconds: timeLeft,
          malpractice_log: malpracticeLog,
        });
      } catch (e) {
        console.error('Autosave failed', e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [assessmentId, draft, timeLeft, assessment, malpracticeLog, submitting]);

  useEffect(() => {
    if (!assessment || submitting || timeLeft <= 0) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, submitting, timeLeft]);

  // Proctoring event listeners – track window focus changes and copy-paste events
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        setShowProctor(true);
        const msg = `Tab switched away at ${new Date().toLocaleTimeString()}`;
        setMalpracticeLog(prev => [...prev, msg]);
      }
    }
    function handleCopyPaste(e) {
      setShowProctor(true);
      const actionType = e.type === 'copy' ? 'Copy' : 'Paste';
      const msg = `${actionType} action detected at ${new Date().toLocaleTimeString()}`;
      setMalpracticeLog(prev => [...prev, msg]);
    }
    
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, []);

  const handleSubmit = async () => {
    if (submitting) return;
    setConfirmSubmit(false);
    setSubmitting(true);
    setShowEval(true);
    try {
      await submitAssessment(assessmentId, { 
        final_answer: draft,
        malpractice_log: malpracticeLog
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!assessment || submitting || timeLeft > 0) return;
    handleSubmit();
  }, [assessment, submitting, timeLeft]);

  const evalSteps = [
    { text: 'Scanning submission structure...' },
    { text: 'Checking codebase technical accuracy...' },
    { text: 'Evaluating system architecture & performance...' },
    { text: 'Synthesizing evaluation scoring reports...' },
    { text: 'Writing AI feedback and insights...' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  const task = assessment?.task;

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Panel */}
      <header className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {assessment?.custom_title || task?.title || 'Technical Assessment'}
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              Candidate: <span className="text-slate-900">{assessment?.candidate?.name}</span> • Role: <span className="text-slate-900">{task?.role || assessment?.candidate?.role}</span>
            </p>
          </div>
          
          <div className="shrink-0 flex flex-wrap gap-3">
            <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              {assessment?.difficulty || 'Medium'}
            </span>
            <span className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              {assessment?.duration || 60} Min
            </span>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <FileText size={14} /> Problem Description & Prompt
          </h4>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {task?.prompt || assessment?.custom_prompt}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {task?.evaluation_focus?.map(focus => (
              <span key={focus} className="text-[10px] font-black uppercase tracking-wider bg-slate-100 border border-slate-200/60 px-3 py-1 rounded-full text-slate-600">
                {focus}
              </span>
            ))}
          </div>
          
          {timeLeft > 0 && (
            <Countdown 
              seconds={timeLeft} 
            />
          )}
        </div>
      </header>

      {/* Code Editor */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Your Solution</h3>
          {malpracticeLog.length > 0 && (
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle size={12} /> Proctoring Flags: {malpracticeLog.length}
            </span>
          )}
        </div>
        <RichEditor value={draft} onChange={setDraft} disabled={submitting} />
      </section>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <Link 
          to="/candidate/dashboard" 
          className="px-5 py-3 border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition"
        >
          Exit Assessment
        </Link>
        <button
          className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
          onClick={() => setConfirmSubmit(true)}
          disabled={submitting}
        >
          Submit Challenge
        </button>
      </div>

      {/* Confirmation Dialog */}
      {confirmSubmit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-md w-full space-y-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submit Assessment?</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Once submitted, you will not be able to edit your solution. ProofHire AI will immediately begin evaluation.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfirmSubmit(false)} 
                className="py-3 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 text-slate-600 transition text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition text-sm shadow-md"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proctoring Warning Overlay */}
      <ProctoringOverlay visible={showProctor} onClose={() => setShowProctor(false)} />
      
      {/* Evaluation Process Overlay */}
      {showEval && (
        <EvaluationOverlay steps={evalSteps} onFinish={() => {
          setShowEval(false);
          navigate(`/candidate/results/${assessmentId}`);
        }} />
      )}
      
    </div>
  );
}
