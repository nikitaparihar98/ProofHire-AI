import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RecruiterSignupPage() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    alert("Signup successful! You can now log in.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-surface rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display text-primary mb-2">Create Recruiter Account</h1>
            <p className="text-on-surface-variant">Join Recruit AI and find your perfect candidate</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Work Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="john@acmecorp.com"
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
                minLength={8}
              />
              <p className="text-xs text-on-surface-variant mt-2">Must be at least 8 characters.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-medium shadow-lg shadow-primary/30 transition-all active:scale-[0.98] text-lg"
              >
                Create Account
              </button>
            </div>
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
