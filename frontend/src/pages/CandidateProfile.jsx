import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail, ShieldCheck, Target, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage, getCandidateDashboard } from '../services/api';

export default function CandidateProfile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(() => {
    try {
      const email = user?.email || '';
      return window.localStorage?.getItem('avatar_' + email.trim().toLowerCase()) || '';
    } catch {
      return '';
    }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        const email = user?.email || '';
        window.localStorage?.setItem('avatar_' + email.trim().toLowerCase(), reader.result);
        window.dispatchEvent(new Event('candidate-avatar-updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (!authLoading && user?.role === 'candidate') {
      getCandidateDashboard()
        .then((data) => {
          setDashboard(data);
          setError('');
        })
        .catch((err) => setError(getApiErrorMessage(err, 'Failed to load profile')))
        .finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
      </div>
    );
  }

  const candidate = dashboard?.candidate;
  const task = dashboard?.assigned_task;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        {error && <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative group shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-teal-50 text-3xl font-semibold uppercase text-teal-800 shadow-lg">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    candidate?.name?.[0] || user?.name?.[0] || 'C'
                  )}
                </div>
                <input 
                  type="file" 
                  id="candidate-avatar-input" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange} 
                />
                <label 
                  htmlFor="candidate-avatar-input" 
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full border border-slate-100 bg-white p-1.5 text-slate-500 shadow-md transition-colors hover:text-teal-800"
                >
                  <Camera size={14} />
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#071b3a]">{candidate?.name || user?.name}</h1>
                <p className="mt-2 text-lg font-semibold text-teal-800">{candidate?.role}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2"><Mail size={16} /> {candidate?.email || user?.email}</span>
                  <span className="inline-flex items-center gap-2"><Target size={16} /> {candidate?.status}</span>
                  <span className="inline-flex items-center gap-2"><ShieldCheck size={16} /> {candidate?.plagiarism_risk_level || 'Low'} risk</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#f8faff] px-6 py-5 text-[#071b3a]">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Task score</p>
              <p className="mt-1 text-4xl font-semibold">{candidate?.overall_score || 0}</p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#071b3a]">Assigned assessment</h2>
            <p className="mt-3 font-semibold text-teal-800">{task?.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{task?.prompt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {task?.evaluation_focus?.map((item) => (
                <span key={item} className="rounded-full bg-[#f8faff] px-3 py-1 text-xs font-semibold text-slate-600">{item}</span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#071b3a]">Evaluation feedback</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {candidate?.ai_feedback || 'Submit your role-specific assessment to generate an AI evaluation report.'}
            </p>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-[#071b3a]">Strengths</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  {(candidate?.strengths || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#071b3a]">Improvement areas</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                  {(candidate?.weaknesses || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
