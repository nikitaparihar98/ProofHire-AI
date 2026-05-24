import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, Send, Clock, Eye, ShieldCheck, Info, Loader2, BrainCircuit, Lock } from 'lucide-react';
import { startLiveSession, completeLiveSession, evaluateCandidate } from '../services/api';
import useLiveAssessment from '../hooks/useLiveAssessment';
import { useAuth } from '../context/AuthContext';

/**
 * CandidateTest Component
 * STRICTLY for candidates only.
 * Features: Secure test portal, webcam proctoring, malpractice logging, auto-submission.
 */
export default function CandidateTest() {
  const { user } = useAuth();
  const [step, setStep] = useState('setup'); // setup, active, completed
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', role: user?.role || 'Frontend Developer' });
  const [taskData, setTaskData] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || prev.name, email: user.email || prev.email, role: user.role || prev.role }));
    }
  }, [user]);
  const [sessionId, setSessionId] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [warnings, setWarnings] = useState([]);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize monitoring hook (Candidate Role)
  const { logEvent } = useLiveAssessment(sessionId, false);

  // Timer logic
  useEffect(() => {
    if (step !== 'active') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Candidate Security: Tab & Paste Monitoring
  useEffect(() => {
    if (step !== 'active' || !sessionId) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logEvent('tab_switch', 'Candidate switched tabs or minimized the window', 'warning');
        setWarnings(prev => [...prev, "Tab Switching Detected. This incident has been flagged."]);
      }
    };

    const handlePaste = (e) => {
      const text = e.clipboardData.getData('text');
      if (text.length > 50) {
        logEvent('paste_large', `Candidate pasted a large block of text (${text.length} chars)`, 'warning');
        setWarnings(prev => [...prev, "Large Copy-Paste Detected. Potential plagiarism flagged."]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('paste', handlePaste);
    };
  }, [step, sessionId]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, frameRate: 15 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      return true;
    } catch (err) {
      console.error("Camera access error:", err);
      return false;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!formData.name || isInitializing) return;

    setIsInitializing(true);
    
    // Request webcam immediately for candidate verification
    const cameraStarted = await startCamera();
    if (!cameraStarted) {
      alert("System Conflict: Webcam access is mandatory for this proctored session. Please enable permissions in your browser settings.");
      setIsInitializing(false);
      return;
    }

    try {
      const data = await startLiveSession({
        name: formData.name,
        role: formData.role,
        email: formData.email
      });
      if (data && data.session_id) {
        setSessionId(data.session_id);
        setStep('active');
        console.log("Candidate session initialized:", data.session_id);
      } else {
        throw new Error("Invalid session metadata");
      }
    } catch (err) {
      console.error("Session init failed:", err);
      alert("Network Error: Could not establish secure link to proctoring server.");
      stopCamera();
    } finally {
      setIsInitializing(false);
    }
  };

  const autoSubmit = () => {
    handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto && !window.confirm("CONFIRM SUBMISSION: Are you sure you want to finalize your assessment? You will no longer be able to edit your responses.")) return;
    
    setIsSubmitting(true);
    try {
      const completeRes = await completeLiveSession(sessionId);
      stopCamera();

      const evaluationData = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        submission_data: {
          test_type: "Live Assessment",
          completion_time: `${Math.floor((3600 - timeLeft) / 60)} mins`,
          answer: taskData,
          live_malpractice_flags: completeRes.malpractice_flags || []
        }
      };

      await evaluateCandidate(evaluationData);
      setStep('completed');
    } catch (err) {
      console.error("Submission crash:", err);
      alert("Submission Failure: Your session data has been cached. Please do not close this tab and contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- RENDERING ---

  if (step === 'completed') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center space-y-8 animate-in zoom-in-95 duration-500 border border-slate-100">
          <div className="bg-emerald-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Successful</h1>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">Your proctored session data and technical responses have been securely archived. The recruiter will review your AI evaluation shortly.</p>
          </div>
          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Reference Token</p>
            <p className="font-mono text-indigo-600 text-xl font-bold">{sessionId?.split('-')[0].toUpperCase()}</p>
          </div>
          <p className="text-sm text-slate-400 font-medium">Session Terminated • Safe to Close Tab</p>
        </div>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-xl">
              <Lock size={14} className="text-indigo-400" /> Secure Candidate Portal
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">ProofHire AI</h1>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-14 space-y-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Verification</h2>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">Please initialize your assessment session. Note that by proceeding, you consent to live webcam proctoring and activity logging for academic integrity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { icon: <Camera />, label: 'Visual Check', sub: 'Camera active for duration', color: 'text-indigo-600' },
                   { icon: <AlertTriangle />, label: 'Proctored', sub: 'Tab switching is logged', color: 'text-amber-600' },
                   { icon: <Clock />, label: 'Timed Task', sub: '60 minutes total', color: 'text-emerald-600' },
                   { icon: <ShieldCheck />, label: 'AI Integrity', sub: 'Authenticity verification', color: 'text-blue-600' },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                      <div className={`p-2.5 bg-white rounded-xl shadow-sm ${item.color} group-hover:scale-110 transition-transform`}>{React.cloneElement(item.icon, { size: 20 })}</div>
                      <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{item.sub}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <form onSubmit={handleStart} className="space-y-8 pt-4">
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Full Name</label>
                      <input 
                        required
                        disabled={isInitializing}
                        type="text" 
                        placeholder="e.g. Jane Doe"
                        className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <input 
                        required
                        disabled={isInitializing}
                        type="email" 
                        placeholder="jane.doe@example.com"
                        className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Applied Role</label>
                      <select 
                        disabled={isInitializing}
                        className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Engineer">Backend Engineer</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Product Manager">Product Manager</option>
                      </select>
                   </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isInitializing}
                  className="w-full bg-indigo-600 text-white font-black py-5.5 rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {isInitializing ? (
                    <><Loader2 className="animate-spin" /> ESTABLISHING LINK...</>
                  ) : (
                    <>INITIALIZE SECURE SESSION <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </div>
            <div className="bg-slate-950 py-4 text-center">
               <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em]">ProofHire AI • Authorized Session Host Alpha-9</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CANDIDATE ASSESSMENT INTERFACE
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-sans overflow-hidden">
      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-4rem)]">
        
        {/* Assessment Column */}
        <div className="flex-1 flex flex-col gap-6 h-full">
          <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-full ring-1 ring-white/5">
            <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-900/60">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/10">
                  <BrainCircuit className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white uppercase">Technical Challenge</h2>
                  <div className="flex items-center gap-3 mt-1.5">
                     <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">{formData.role}</span>
                     <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> LIVE SESSION</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 w-full md:w-auto">
                 <div className="flex-1 md:flex-none flex items-center gap-5 bg-black/60 px-10 py-4.5 rounded-[1.5rem] border border-white/5 shadow-inner group">
                    <Clock className="w-7 h-7 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-4xl font-black tabular-nums tracking-tighter text-white">{formatTime(timeLeft)}</span>
                 </div>
                 <button 
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="px-12 py-5 bg-emerald-600 text-white font-black rounded-[1.5rem] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/20 flex items-center gap-3 uppercase text-sm tracking-[0.2em] disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" /> ARCHIVING...</> : 'FINALIZE TASK'}
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-10 flex flex-col gap-8">
              <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-[2rem] flex items-start gap-5">
                 <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400"><Info size={24} /></div>
                 <div className="space-y-1">
                    <p className="text-sm font-black text-indigo-100 uppercase tracking-widest">Assessment Instructions</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                      Implement your technical solution. Note: AI behavioral analysis is active. Focus on logic, security, and scalability. Your response will be analyzed for plagiarism.
                    </p>
                 </div>
              </div>

              <textarea 
                spellCheck="false"
                className="flex-1 w-full p-10 bg-black/40 text-indigo-50 font-mono text-xl border border-white/5 rounded-[2.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none resize-none transition-all placeholder:text-slate-800 shadow-inner leading-relaxed selection:bg-indigo-500/30"
                placeholder="// Initialize implementation logic here...
// The evaluation engine will rank your solution based on structural integrity."
                value={taskData}
                onChange={(e) => setTaskData(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Proctoring Column */}
        <div className="w-full lg:w-[450px] flex flex-col gap-8">
          
          {/* Visual Proctor */}
          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative group">
            <div className="absolute top-8 left-8 z-20 flex items-center gap-3 bg-rose-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl ring-4 ring-rose-600/10">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              SECURE PROCTORING ACTIVE
            </div>
            
            <div className="relative aspect-[4/3] bg-black overflow-hidden border-b border-white/5">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1] opacity-60 group-hover:opacity-80 transition-opacity"
              ></video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-2xl">
                 <span>{formData.name.toUpperCase()}</span>
                 <span className="text-emerald-500">SECURE-LINK</span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Visual AI Stream</span>
                <span className="text-[10px] font-black text-emerald-400 flex items-center gap-2 px-3 py-1 bg-emerald-400/5 rounded-lg border border-emerald-400/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> SYNCHRONIZED
                </span>
              </div>
              <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                 <div className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 w-full rounded-full animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
              </div>
            </div>
          </div>

          {/* Integrity Shield */}
          <div className="flex-1 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <ShieldCheck size={24} className="text-indigo-400" />
                </div>
                <h3 className="font-black text-xs tracking-[0.3em] uppercase text-white">Integrity Guard</h3>
              </div>
              <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                 <span className="text-[10px] font-black text-rose-500 uppercase tabular-nums tracking-widest">{warnings.length} INCIDENTS</span>
              </div>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
              {warnings.length > 0 ? (
                warnings.map((warn, i) => (
                  <div key={i} className="flex gap-5 p-5 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] animate-in slide-in-from-right-4 duration-300">
                    <AlertTriangle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                       <p className="text-[10px] text-rose-100 font-black uppercase tracking-widest">Violation Detected</p>
                       <p className="text-xs text-rose-300/60 mt-1.5 leading-relaxed font-bold">{warn}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30 space-y-6">
                   <div className="p-8 bg-black/40 rounded-full border border-white/5 shadow-2xl">
                      <ShieldCheck size={56} className="text-slate-600" />
                   </div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-loose max-w-[200px]">Proctoring system initialized & security verified</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-black/40 border-t border-white/5">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                     <span>TKN: {sessionId?.split('-')[0].toUpperCase()}</span>
                  </div>
                  <span>PROT-v1.4</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
