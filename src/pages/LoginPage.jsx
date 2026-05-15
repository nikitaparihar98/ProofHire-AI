import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [role, setRole] = useState('candidate'); // 'candidate' or 'recruiter'
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'candidate') {
      navigate('/candidate-dashboard');
    } else {
      // Recruiter login goes to external dashboard, alert for now
      alert("Recruiter Dashboard is hosted on an external service. Redirecting...");
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display text-primary mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant">Sign in to continue to Recruit AI</p>
          </div>

          <div className="flex bg-surface-container-high rounded-lg p-1 mb-8">
            <button
              onClick={() => setRole('candidate')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                role === 'candidate'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => setRole('recruiter')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                role === 'recruiter'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              Recruiter
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-outline text-primary focus:ring-primary" />
                <span className="text-on-surface-variant">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-dark transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-medium shadow-lg shadow-primary/30 transition-all active:scale-[0.98]"
            >
              Sign In as {role === 'candidate' ? 'Candidate' : 'Recruiter'}
            </button>
          </form>

          {role === 'recruiter' && (
            <div className="mt-6 text-center text-sm text-on-surface-variant">
              Don't have a recruiter account?{' '}
              <Link to="/recruiter-signup" className="text-primary font-medium hover:underline">
                Sign up here
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
