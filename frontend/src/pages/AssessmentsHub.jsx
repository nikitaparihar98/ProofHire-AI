import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
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
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Assessment workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#071b3a]">Assessment</h1>
          <p className="mt-2 text-slate-500">Your current assessment is based on your selected role: {candidate?.role}.</p>
        </header>

        {error && <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${completed ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-700'}`}>
                {completed ? 'Evaluated' : dashboard?.submission_status || 'Assigned'}
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-[#071b3a]">{task?.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{task?.prompt}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-[#f8faff] px-6 py-5 text-[#071b3a]">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Task score</p>
              <p className="mt-1 text-4xl font-semibold">{candidate?.overall_score || 0}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {task?.evaluation_focus?.map((item) => (
              <span key={item} className="rounded-full bg-[#f8faff] px-3 py-1 text-xs font-semibold text-slate-600">{item}</span>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
<Link to={completed ? `/candidate/results/${dashboard?.assignment_id}` : `/candidate/assessments/${dashboard?.assignment_id}`} className="inline-flex rounded-xl bg-[#071b3a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b2a55]">
              {completed ? 'View Evaluation Report' : 'Start Assessment'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
