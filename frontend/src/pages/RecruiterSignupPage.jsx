import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';

const candidateRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'AI/ML Engineer',
  'UI/UX Designer',
  'Product Manager',
];

export default function RecruiterSignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [accountType, setAccountType] = useState('candidate');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    applied_role: candidateRoles[0],
  });
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

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: accountType,
        applied_role: accountType === 'candidate' ? form.applied_role : 'Recruiter',
      });
      navigate(user.role === 'candidate' ? '/candidate-dashboard' : '/recruiter-dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 py-12 relative overflow-hidden mesh-gradient transition-colors duration-300">
      
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

      <div className="max-w-xl w-full bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] shadow-2xl backdrop-blur-md overflow-hidden relative z-10">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Create Account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
              {accountType === 'candidate' 
                ? 'Show what you can build. Get evaluated on code, not pedigree.' 
                : 'Stop guessing. Instantly identify top performers and bypass resume bias.'
              }
            </p>
          </div>

          {/* Capsule Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 mb-6">
            {['candidate', 'recruiter'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all capitalize ${
                  accountType === type 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50/70 dark:border-rose-500/20 dark:bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400"
                placeholder="Darshini Sivakumar"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400"
                placeholder="you@example.com"
              />
            </div>

            {accountType === 'candidate' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Target Role</label>
                <select
                  value={form.applied_role}
                  onChange={(event) => updateField('applied_role', event.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-900 dark:text-slate-200 cursor-pointer"
                >
                  {candidateRoles.map((role) => (
                    <option key={role} value={role} className="text-slate-800">{role}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900 dark:text-slate-200 placeholder-slate-400"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/25 transition-all active:scale-95 disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating Account...' : `Create ${accountType === 'candidate' ? 'Candidate' : 'Recruiter'} Account`}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
