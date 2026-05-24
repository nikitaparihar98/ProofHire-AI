import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage, getCandidateDashboard } from '../services/api';

export default function AssessmentsHub() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        .catch((err) => setError(getApiErrorMessage(err, 'Failed to load assessment')))
        .finally(() => setLoading(false));
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const candidate = dashboard?.candidate;
  const task = dashboard?.assigned_task;
  const completed = dashboard?.submission_status === 'Evaluated' || candidate?.status === 'Evaluated';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Assessment</h1>
          <p className="mt-2 text-slate-500">Your current assessment is based on your selected role: {candidate?.role}.</p>
        </header>

        {error && <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {completed ? 'Evaluated' : dashboard?.submission_status || 'Assigned'}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">{task?.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{task?.prompt}</p>
            </div>
            <div className="rounded-2xl bg-slate-900 px-6 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Score</p>
              <p className="mt-1 text-4xl font-black">{candidate?.overall_score || 0}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {task?.evaluation_focus?.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item}</span>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
<Link to={completed ? `/candidate/results/${dashboard?.assignment_id}` : `/candidate/assessments/${dashboard?.assignment_id}`} className="inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">
              {completed ? 'View Evaluation Report' : 'Start Assessment'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
