import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, ChevronRight, ClipboardCheck, FileSearch, ShieldCheck } from 'lucide-react';
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

const accountCopy = {
  candidate: {
    title: 'Create your candidate workspace',
    description: 'Start with your target role, then complete assigned tasks and review explainable feedback.',
    cta: 'Create candidate account',
  },
  recruiter: {
    title: 'Create your recruiter workspace',
    description: 'Invite candidates, review task evidence, and make decisions with clearer proof.',
    cta: 'Create recruiter account',
  },
};

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

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    window.localStorage?.setItem('theme', 'light');
  }, []);

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
      navigate(user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  const activeCopy = accountCopy[accountType];

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#071b3a]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
            <span className="h-3 w-3 rounded-full bg-teal-700" />
            ProofHire
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-teal-700 hover:text-teal-800"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.95fr_1fr]">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-3 rounded-md bg-teal-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">
            <CheckSquare className="h-4 w-4" />
            Join ProofHire
          </div>
          <h1 className="max-w-xl text-5xl font-normal leading-[1.08] tracking-tight md:text-6xl">
            Build a hiring process people can understand.
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
          ProofHire keeps assessments, authenticity signals, and explainable feedback in one calm workspace.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <FileSearch className="mt-1 h-5 w-5 text-teal-700" />
              <div>
                <p className="font-semibold text-slate-950">Resume context</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Use the resume as background, not the final decision.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ClipboardCheck className="mt-1 h-5 w-5 text-[#082653]" />
              <div>
                <p className="font-semibold text-slate-950">Task evidence</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Let candidates show how they approach real work.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="mt-1 h-5 w-5 text-amber-700" />
              <div>
                <p className="font-semibold text-slate-950">Authenticity signals</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Surface risk signals without pretending the prototype has enterprise-scale data.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] md:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Create account</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{activeCopy.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{activeCopy.description}</p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-[#f6f8fb] p-1">
            {['candidate', 'recruiter'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition ${
                  accountType === type
                    ? 'bg-white text-[#071b3a] shadow-sm'
                    : 'text-slate-500 hover:text-[#071b3a]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Full name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                placeholder="Darshini Sivakumar"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                placeholder="you@example.com"
              />
            </div>

            {accountType === 'candidate' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700">Target role</label>
                <select
                  value={form.applied_role}
                  onChange={(event) => updateField('applied_role', event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                >
                  {candidateRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-[#071b3a] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2a55] disabled:opacity-60"
            >
              {loading ? 'Creating account...' : activeCopy.cta}
              {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-800 hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
