import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RecruitAiLandingPage() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="font-body-md text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-margin-desktop h-20 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-xl">
            <span className="font-headline-lg text-headline-sm md:text-headline-sm font-black text-primary tracking-tighter">ProofHire AI</span>
            <div className="hidden md:flex gap-lg">
              <Link className="text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md" to="#">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            {user ? (
              <Link 
                to={user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard'} 
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold font-label-md text-label-md shadow-lg shadow-indigo-200/50 dark:shadow-none transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold font-label-md text-label-md shadow-lg shadow-indigo-200/50 dark:shadow-none transition-all"
                >
                  Go to Dashboard
                </Link>
                <Link to="/login" className="px-md py-xs text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">Login</Link>
                <Link 
                  to="/recruiter-signup" 
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold font-label-md text-label-md hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:bg-surface-container-high dark:hover:bg-slate-800 transition-all focus:outline-none"
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[20px] select-none">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-[1440px] mx-auto pt-20">
        {/* Custom style injection for premium animations */}
        <style>{`
          @keyframes scan-laser {
            0% { top: 10%; opacity: 0.4; }
            50% { top: 90%; opacity: 1.0; }
            100% { top: 10%; opacity: 0.4; }
          }
          .laser-line {
            animation: scan-laser 4s ease-in-out infinite;
          }
          @keyframes float-light {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-float-card {
            animation: float-light 6s ease-in-out infinite;
          }
        `}</style>

        {/* Immersive Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-gradient px-margin-desktop py-xl bg-slate-50 text-slate-900 dark:bg-slate-900/90 dark:text-white">
          <div className="absolute inset-0 hero-pattern pointer-events-none opacity-5 dark:opacity-10"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-center relative z-10 w-full">
            
            {/* Left Column: Bold Copywriting & 3 Pillars */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50/80 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full text-label-sm font-bold shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
                THE ONLY HIRING PLATFORM THAT ANSWERS 'WHY'
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent">
                Hire on proof.<br />
                <span className="text-indigo-600 dark:text-indigo-400">Not on paper.</span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Every other ATS tells you who applied. ProofHire AI uses multi-step agentic AI evaluation to answer who can actually do the job. 
              </p>
              
              {/* The 3 Pillars explaining the 'WHY' naturally */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20 dark:border-indigo-500/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-lg shadow-indigo-600/50"></span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Skill Over Resume</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Evaluate actual task performance first, credentials and keywords second.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20 dark:border-indigo-500/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-lg shadow-indigo-600/50"></span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Explainable Rejection</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Zero silent rejections. Get precise, actionable feedback candidates and managers trust.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20 dark:border-indigo-500/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-lg shadow-indigo-600/50"></span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Hidden Talent Mode</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bypass candidate pedigree bias. Auto-flag and promote strong code-performers.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-6">
                <Link 
                  to={user ? (user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard') : '/login'} 
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                >
                  Get Assessed
                </Link>
                <Link 
                  to={user ? (user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard') : '/login'} 
                  className="px-8 py-4 bg-transparent border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-white rounded-2xl font-bold text-sm transition-all active:scale-95"
                >
                  Start Hiring
                </Link>
              </div>
            </div>
            
            {/* Right Column: Premium Proctoring IDE Widget */}
            <div className="lg:col-span-6 relative mt-16 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-square bg-[#0f172a] rounded-[2.5rem] border border-slate-800 shadow-2xl p-6 overflow-hidden animate-float-card">
                
                {/* Editor Title Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-bold">proctor_assessment.js</span>
                </div>

                {/* Laser Scanning line animation */}
                <div className="laser-line absolute left-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 via-purple-500 via-pink-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)] pointer-events-none"></div>

                {/* Simulated Code Lines */}
                <pre className="mt-6 font-mono text-xs text-slate-400 space-y-3 overflow-x-auto leading-relaxed select-none">
                  <code>{`1  import { useState } from 'react';
2  
3  export default function proofhire_task() {`}</code>
                  <code className="text-indigo-300">{`4    const [verified, setVerified] = useState(true);`}</code>
                  <code>{`5  
6    return (
7      <div className="proctor-check flex gap-md">`}</code>
                  <code className="text-pink-300">{`8        <Badge status="React Verified" />`}</code>
                  <code className="text-purple-300">{`9        <Badge status="Security Secure" />`}</code>
                  <code>{`10     </div>
11   );
12 }`}</code>
                </pre>

                {/* High Fidelity Floating Indicator Badges */}
                <div className="absolute bottom-12 right-6 space-y-3 z-20">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl shadow-lg backdrop-blur-md animate-pulse">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>React Verified</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-xl shadow-lg backdrop-blur-md animate-pulse delay-500">
                    <span className="material-symbols-outlined text-[16px]">shield</span>
                    <span>Security Secure</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-xl shadow-lg backdrop-blur-md animate-pulse delay-1000">
                    <span className="material-symbols-outlined text-[16px]">code</span>
                    <span>Valid Code</span>
                  </div>
                </div>

                {/* Abstract Ambient Lights */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-900 px-margin-desktop text-slate-800 dark:text-white transition-colors">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-3xl">monitoring</span>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">92.5%</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Evaluation & Proctoring Accuracy</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 p-4 border-y md:border-y-0 md:border-x border-slate-200 dark:border-slate-900">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">14 Days</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Time-to-Hire Saved per Candidate Pool</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-3xl">stars</span>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">3.4x</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Increase in Hires from Unconventional Paths</div>
              </div>
            </div>
          </div>
        </section>



        {/* Feature Cards Section (No jargon, clear benefit) */}
        <section className="py-28 bg-slate-50 dark:bg-slate-900 px-margin-desktop text-slate-800 dark:text-white transition-colors">
          <div className="max-w-[1200px] mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Product Capabilities</span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Who can actually do the job?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Every other hiring tool answers "Who applied?". We give you verified performance metrics and proof.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Feature 1 */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-2xl">analytics</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Skill-Over-Resume Ranking</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Candidates are ranked directly by their live coding task performance, bypassing keyword-stuffed resume templates.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Proctoring & Malpractice Flags</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Tab-lock logs, copy-paste block proctoring, and originality engines guarantee absolute code authenticity.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Explainable Decisions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">No black boxes or cold silent rejections. Get precise, actionable feedback on edge case handling and design trade-offs.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-2xl">diversity_3</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Hidden Talent Mode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Highlight exceptional performers from non-traditional CS backgrounds automatically, actively breaking credential bias.</p>
              </div>

            </div>
          </div>
        </section>


        {/* How It Works Section (5-Step pipeline) */}
        <section className="py-28 bg-white dark:bg-slate-955/20 px-margin-desktop text-slate-950 dark:text-white transition-colors">
          <div className="max-w-[1200px] mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Evaluation Flow</span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Simple, Powerful, Hard to Copy</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">ProofHire AI operates on a robust 3-layer system: Resume (context) → Task (proof) → Agentic AI (judgment).</p>
            </div>

            {/* 5 Step Flow Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step 01</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">Resume Context</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Upload PDF resume to establish background context, skills, and target applied role.</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
                  <span>Resume</span>
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step 02</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">Task Assignment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Instantly receive a customized, role-specific engineering task tailored by the recruiter.</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
                  <span>Task</span>
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step 03</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">Monitored Solve</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Complete your coding task inside our secure, real-time proctored workspace editor.</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
                  <span>Proof</span>
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step 04</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">Agentic Evaluation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Our agentic AI reviews syntax, styling, error handling, reliability, and edge case responses.</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
                  <span>AI Judgment</span>
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                </div>
              </div>

              {/* Step 5 */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Step 05</div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">Skills Gap Match</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Recruiter reviews the side-by-side gap grid in the pipeline and extends the verified offer.</p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
                  <span>Hire</span>
                  <span className="material-symbols-outlined text-[16px]">handshake</span>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* Split Path Section (The Portals) */}
        <section className="py-28 px-margin-desktop bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
          <div className="max-w-[1200px] mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Two Pathways</span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Tailored for Candidates & Recruiters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1000px] mx-auto">
              {/* Candidate Path */}
              <div className="group relative bg-white dark:bg-slate-950 p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:border-indigo-500">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center w-full">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-8 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                    <span className="material-symbols-outlined text-4xl">person_search</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Are you a Candidate?</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
                    Stop applying blindly. Get assessed on what you can build and let your code do the talking, regardless of your background or degree.
                  </p>
                  <div className="w-full max-w-xs">
                    <Link 
                      to={user ? (user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard') : '/login'} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all block text-center shadow-lg shadow-indigo-600/20"
                    >
                      Get Assessed
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recruiter Path */}
              <div className="group relative bg-white dark:bg-slate-950 p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center text-center overflow-hidden transition-all duration-500 hover:border-indigo-500">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center w-full">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-8 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                    <span className="material-symbols-outlined text-4xl">corporate_fare</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Are you a Recruiter?</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
                    Bypass keyword matching. Screen, verify, and filter talent using actionable, secure, and proctored technical tasks.
                  </p>
                  <div className="w-full max-w-xs">
                    <Link 
                      to={user ? (user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard') : '/login'} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all block text-center shadow-lg shadow-indigo-600/20"
                    >
                      Start Hiring
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full pt-20 pb-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-[1200px] mx-auto px-margin-desktop">
          
          {/* Emotional closer card reinforcing the Hidden Talent angle */}
          <div className="mb-20 p-8 md:p-12 rounded-[2rem] bg-gradient-to-r from-indigo-50/50 via-slate-50/60 to-indigo-50/50 border border-slate-200 dark:from-indigo-950/40 dark:via-slate-900/50 dark:to-indigo-950/40 dark:border-slate-800 text-center space-y-4 max-w-4xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-4xl text-indigo-500 dark:text-indigo-400">auto_awesome</span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              "Because your strongest hire is often hiding behind a weak resume."
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              ProofHire AI replaces credential and pedigree bias with verified technical execution. Let us help you unlock the hidden potential of modern teams.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-xl pb-16">
            <div className="flex flex-col gap-md max-w-xs">
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">P</span>
                ProofHire AI
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                Precision engineering for the global talent economy. We believe in a world where the right talent always finds the right opportunity.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-12 w-full md:w-auto">
              <div className="flex flex-col gap-3">
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">Product</span>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">Assessment AI</Link>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">ATS Connect</Link>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">Enterprise</Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">Resources</span>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">Intelligence Hub</Link>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">Guides</Link>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">API Docs</Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-black text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">Legal</span>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">Privacy</Link>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">Ethics Policy</Link>
                <Link className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="#">Terms</Link>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-md animate-in">
            <span className="text-[11px] text-slate-500 dark:text-slate-500">© 2024 ProofHire AI Inc. Built for the future of work.</span>
            <div className="flex gap-lg">
              <Link className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest" to="#">System Normal</Link>
              <Link className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-widest" to="#">Security Certs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
