import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Tab role selection
  const [role, setRole] = useState('candidate'); // 'candidate' or 'recruiter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login({ email: email.trim(), password });
      navigate(user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetRole) => {
    setLoading(true);
    setError('');
    const demoEmail = targetRole === 'candidate' ? 'candidate@proofhire.ai' : 'recruiter@proofhire.ai';
    const demoPassword = 'password';
    setRole(targetRole);

    try {
      const user = await login({ email: demoEmail, password: demoPassword });
      navigate(user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden mesh-gradient transition-colors duration-300">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transition-all focus:outline-none shadow-sm"
          aria-label="Toggle Theme"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px] select-none">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>

      {/* Main Split-Screen Container */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-[3rem] shadow-2xl backdrop-blur-md overflow-hidden relative z-10">
        
        {/* Left Column: Brand Storytelling & Tagline */}
        <div className="md:col-span-6 p-8 md:p-14 flex flex-col justify-center space-y-8 bg-slate-50/50 dark:bg-slate-950/40 border-r border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-xs select-none">P</span>
            <span className="font-bold text-sm text-slate-600 dark:text-slate-300 font-mono tracking-wider">ProofHire AI</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
              Hire on proof.<br />
              <span className="text-indigo-600 dark:text-indigo-400">Not on paper.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The only hiring platform that tells you why—why someone was selected, why they weren't, and why a weaker resume might be your strongest hire.
            </p>
          </div>

          {/* Pillars List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-lg mt-0.5 animate-pulse">check_circle</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Skill Over Resume</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Evaluate actual task performance first, credentials second.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-lg mt-0.5 animate-pulse">feedback</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Explainable Rejection</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Precise, actionable decisions that build deep candidate trust.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-lg mt-0.5 animate-pulse">stars</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Hidden Talent Mode</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Auto-flag and promote strong code-performers from non-traditional paths.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sleek Glassmorphic Form */}
        <div className="md:col-span-6 p-8 md:p-14 flex flex-col justify-center bg-transparent">
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Sign In</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your portal to continue</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          {/* Capsule Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl mb-6">
            <button
              onClick={() => setRole('candidate')}
              type="button"
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'candidate'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => setRole('recruiter')}
              type="button"
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'recruiter'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Recruiter
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400"
                placeholder={role === 'candidate' ? 'candidate@proofhire.ai' : 'recruiter@proofhire.ai'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Entering Portal...' : `Enter ${role === 'candidate' ? 'Candidate' : 'Recruiter'} Portal`}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              Demo Portals Quick Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('candidate')}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl hover:bg-indigo-100/70 dark:hover:bg-indigo-500/20 transition-all group"
              >
                <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">person_pin</span>
                <span>Candidate Demo</span>
              </button>
              <button
                onClick={() => handleQuickLogin('recruiter')}
                type="button"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-100/70 dark:hover:bg-emerald-500/20 transition-all group"
              >
                <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">corporate_fare</span>
                <span>Recruiter Demo</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Need a fresh account?{' '}
            <Link to="/recruiter-signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
