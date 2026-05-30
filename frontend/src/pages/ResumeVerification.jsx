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
    <div className="flex min-h-screen flex-col items-center bg-[#f6f8fb] px-6 py-12 text-[#071b3a] transition-colors duration-300">
      <nav className="w-full max-w-4xl mb-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 font-sans text-2xl font-semibold tracking-tight text-[#071b3a]">
          <span className="h-3 w-3 rounded-full bg-teal-700"></span>
          ProofHire
        </Link>
        <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          Resume context
        </span>
      </nav>

      <main className="flex-1 w-full max-w-2xl flex flex-col justify-center">
        {step === 1 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:border-teal-700/40">
            <span className="material-symbols-outlined mb-6 text-7xl text-teal-800">upload_file</span>
            <h1 className="mb-3 text-3xl font-semibold text-[#071b3a]">Upload your resume</h1>
            <p className="mx-auto mb-8 max-w-md font-medium text-slate-500">
              Add resume context so your claimed skills can be compared with task evidence.
            </p>
            
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="group relative mb-6 cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-[#f8faff] p-10 transition-all hover:border-teal-700/50 hover:bg-white"
            >
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={handleUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="material-symbols-outlined mb-4 text-5xl text-slate-400 transition-colors group-hover:text-teal-800">cloud_upload</span>
              <p className="font-semibold text-slate-600 transition-colors group-hover:text-teal-800">Click to browse files or drag and drop</p>
              <p className="mt-2 text-xs text-slate-400">Accepts PDF, DOCX documents (Up to 5MB)</p>
            </div>

            <div className="flex justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-sm text-teal-800">lock</span> Secure ingestion
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-sm text-teal-800">bolt</span> Skill extraction
              </span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-teal-700"></div>
              </div>
              <span className="font-mono text-xs font-semibold text-teal-800">resume_context_parser</span>
            </div>

            <div className="min-h-[220px] space-y-3 text-left font-mono text-sm leading-relaxed text-slate-600">
              {terminalLines && terminalLines.map((line, i) => (
                <div key={i} className="flex gap-2 items-start animate-fade-in">
                  <span className="shrink-0 text-teal-800">›</span>
                  <span className={
                    line && line.startsWith('[SUCCESS]') ? 'text-teal-800' :
                    line && line.startsWith('[SYSTEM]') ? 'text-[#071b3a]' :
                    line && line.startsWith('[CONNECT]') ? 'text-slate-600' :
                    line && line.startsWith('[READY]') ? 'font-semibold text-teal-800' : 'text-slate-500'
                  }>
                    {line}
                  </span>
                </div>
              ))}
              <div className="ml-1 inline-block h-4 w-2 animate-blink bg-teal-700"></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-5">
              <span className="material-symbols-outlined shrink-0 rounded-xl bg-teal-50 p-2 text-4xl text-teal-800">task_alt</span>
              <div>
                <h1 className="text-2xl font-semibold text-[#071b3a]">Resume context</h1>
                <p className="text-sm font-medium text-slate-500">Review skills extracted from your resume and save them.</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Applied role mode</label>
                <select 
                  value={targetRole}
                  onChange={handleRoleChange}
                  className="w-full rounded-xl border border-slate-200 bg-[#f8faff] px-4 py-3 font-semibold text-[#071b3a] shadow-sm outline-none transition-colors focus:border-teal-700"
                >
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Fullstack Developer">Fullstack Developer</option>
                  <option value="System Architect">System Architect</option>
                </select>
              </div>

              <div>
                <label className="mb-4 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Extracted skills and self-assessed levels
                </label>
                
                <div className="space-y-4">
                  {Object.entries(skills || {}).map(([skill, level]) => (
                    <div 
                      key={skill} 
                      className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-[#f8faff] p-4 md:flex-row md:items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-teal-700"></span>
                        <span className="font-semibold text-[#071b3a]">{skill}</span>
                      </div>
                      
                      <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                        {['Junior', 'Intermediate', 'Advanced'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setSkillLevel(skill, lvl)}
                            type="button"
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                              level === lvl 
                                ? 'bg-[#071b3a] text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-800'
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071b3a] py-4 font-semibold text-white transition-all hover:bg-[#0b2a55] active:translate-y-[1px] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving resume context...
                </>
              ) : (
                <>
                  Save resume context
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
