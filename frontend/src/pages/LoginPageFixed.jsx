import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-primary mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant">Sign in to continue to ProofHire AI</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-medium shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-on-surface-variant">
            Need an account?{' '}
            <Link to="/recruiter-signup" className="text-primary font-medium hover:underline">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
