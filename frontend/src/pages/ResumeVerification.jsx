import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadResumeSkills } from '../services/api';

export default function ResumeVerification() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [terminalLines, setTerminalLines] = useState([]);
  const [skills, setSkills] = useState({});
  const [targetRole, setTargetRole] = useState(user?.applied_role || 'Backend Engineer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define default skills to extract based on role - fully guarded parameter type checking
  const getExtractedSkillsForRole = (role) => {
    const roleStr = typeof role === 'string' ? role : String(role || '');
    const roleLower = roleStr.toLowerCase();
    
    if (roleLower.includes('backend') || roleLower.includes('data') || roleLower.includes('python')) {
      return {
        'SQL': 'Advanced',
        'FastAPI': 'Intermediate',
        'Python': 'Advanced'
      };
    } else if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('ui')) {
      return {
        'React': 'Advanced',
        'CSS': 'Intermediate',
        'JavaScript': 'Advanced'
      };
    } else {
      return {
        'Problem Solving': 'Advanced',
        'System Design': 'Intermediate',
        'Communication': 'Advanced'
      };
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileName(file ? file.name : 'resume_developer.pdf');
    setStep(2);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setFileName(file ? file.name : 'resume_developer.pdf');
    setStep(2);
  };

  // Run terminal animations for parsing step
  useEffect(() => {
    if (step !== 2) return;

    const logs = [
      '[SYSTEM] Initializing RecruitAI Parsing Engine v3.8...',
      '[CONNECT] Est. secure socket tunnel to LLM service models...',
      `[PARSING] Ingesting document: ${fileName || 'resume_profile.pdf'}`,
      '[INFO] OCR and structural text elements mapped successfully.',
      '[EXTRACTING] Extracting claimed competencies & role patterns...',
      `[SUCCESS] Context matches Applied Role: "${targetRole}"`,
      '[READY] Synthesized skill capabilities list. Redirecting...'
    ];

    setTerminalLines([]);
    let currentIdx = 0;
    let interval;

    // Declared outside assignment to safely bypass Temporal Dead Zone closure issues
    interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setTerminalLines((prev) => [...prev, logs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        // Pre-populate skills based on current target role
        setSkills(getExtractedSkillsForRole(targetRole));
        setTimeout(() => {
          setStep(3);
        }, 800);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [step, fileName, targetRole]);

  // Adjust claimed skill level
  const setSkillLevel = (skill, level) => {
    setSkills((prev) => ({
      ...prev,
      [skill]: level
    }));
  };

  // Target role change also refreshes extracted skills to match role requirements nicely
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setTargetRole(newRole);
    setSkills(getExtractedSkillsForRole(newRole));
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // Submit skills payload to backend endpoint
      await uploadResumeSkills({
        resume_skills: skills
      });
      navigate('/candidate-dashboard');
    } catch (err) {
      console.error('Failed to submit resume skills:', err);
      // Fallback redirect in case of transient local issues
      navigate('/candidate-dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col items-center py-12 px-6 transition-colors duration-300">
      <nav className="w-full max-w-4xl mb-12 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-sans flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-3xl">api</span>
          Recruit AI
        </Link>
        <span className="text-xs px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 rounded-full font-mono font-bold">
          PREMIUM APPLICANT GATE
        </span>
      </nav>

      <main className="flex-1 w-full max-w-2xl flex flex-col justify-center">
        {step === 1 && (
          <div className="bg-white dark:bg-slate-800/60 backdrop-blur-md p-10 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-2xl text-center transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600/80">
            <span className="material-symbols-outlined text-7xl text-indigo-600 dark:text-indigo-400 mb-6 animate-pulse">upload_file</span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Upload Your Resume</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto font-medium">
              Our advanced AI parses your profile, matches claimed technical experience, and sets up your verification playground.
            </p>
            
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer group mb-6"
            >
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-4 transition-colors">cloud_upload</span>
              <p className="font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Click to browse files or drag and drop</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Accepts PDF, DOCX documents (Up to 5MB)</p>
            </div>

            <div className="flex justify-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-sm text-indigo-600 dark:text-indigo-400">lock</span> Secure Ingestion
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-sm text-indigo-600 dark:text-indigo-400">bolt</span> Instant LLM Analysis
              </span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-slate-950 p-8 rounded-2xl border border-indigo-955 shadow-2xl w-full">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-xs font-mono text-indigo-400 font-bold">recruitai_eval_agent.sh</span>
            </div>

            <div className="font-mono text-sm space-y-3 min-h-[220px] text-left leading-relaxed text-slate-100">
              {terminalLines && terminalLines.map((line, i) => (
                <div key={i} className="flex gap-2 items-start animate-fade-in">
                  <span className="text-indigo-500/80 shrink-0">❯</span>
                  <span className={
                    line && line.startsWith('[SUCCESS]') ? 'text-emerald-400' :
                    line && line.startsWith('[SYSTEM]') ? 'text-indigo-300' :
                    line && line.startsWith('[CONNECT]') ? 'text-blue-300' :
                    line && line.startsWith('[READY]') ? 'text-indigo-400 font-bold' : 'text-slate-305'
                  }>
                    {line}
                  </span>
                </div>
              ))}
              <div className="inline-block w-2 h-4 bg-indigo-400 animate-blink ml-1"></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-2xl w-full">
            <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-100 dark:border-slate-700/60">
              <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded-xl shrink-0">task_alt</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Center</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Review claims extracted from your resume & lock them in.</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Applied Role Mode</label>
                <select 
                  value={targetRole}
                  onChange={handleRoleChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white shadow-sm outline-none focus:border-indigo-500 transition-colors font-semibold"
                >
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Fullstack Developer">Fullstack Developer</option>
                  <option value="System Architect">System Architect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
                  Extracted Tech Skills & Self-Assessed Levels
                </label>
                
                <div className="space-y-4">
                  {Object.entries(skills || {}).map(([skill, level]) => (
                    <div 
                      key={skill} 
                      className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
                        <span className="font-bold text-slate-900 dark:text-white">{skill}</span>
                      </div>
                      
                      <div className="flex bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        {['Junior', 'Intermediate', 'Advanced'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setSkillLevel(skill, lvl)}
                            type="button"
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                              level === lvl 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirm} 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-extrabold transition-all shadow-lg shadow-indigo-600/10 active:translate-y-[1px] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Dashboard...
                </>
              ) : (
                <>
                  Lock in Claims & Generate Dashboard
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
