import { useState } from 'react';
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
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-surface rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-primary mb-2">Create Account</h1>
            <p className="text-on-surface-variant">Start a real ProofHire AI workflow</p>
          </div>

          <div className="flex bg-surface-container-high rounded-lg p-1 mb-6">
            {['candidate', 'recruiter'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`flex-1 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  accountType === type ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Darshini Sivakumar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            {accountType === 'candidate' && (
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Target Role</label>
                <select
                  value={form.applied_role}
                  onChange={(event) => updateField('applied_role', event.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  {candidateRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-medium shadow-lg shadow-primary/30 transition-all active:scale-[0.98] text-lg disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : `Create ${accountType === 'candidate' ? 'Candidate' : 'Recruiter'} Account`}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
