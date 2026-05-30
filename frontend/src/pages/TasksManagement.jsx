import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage, getCandidateDashboard, getTasksForRole } from '../services/api';

export default function TasksManagement() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (!authLoading && user?.role === 'candidate') {
      getCandidateDashboard()
        .then(async (data) => {
          setDashboard(data);
          setTasks(await getTasksForRole(data.candidate.role));
          setError('');
        })
        .catch((err) => setError(getApiErrorMessage(err, 'Failed to load tasks')))
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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Task evidence</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#071b3a]">Role-based tasks</h1>
          <p className="mt-2 text-slate-500">
            Tasks generated for {dashboard?.candidate?.role}. Submit the assigned assessment from your dashboard.
          </p>
        </header>

        {error && <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-700/40">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">{task.task_type}</p>
              <h2 className="mt-2 text-xl font-semibold text-[#071b3a]">{task.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{task.prompt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {task.evaluation_focus.map((item) => (
                  <span key={item} className="rounded-full bg-[#f8faff] px-3 py-1 text-xs font-semibold text-slate-600">{item}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-slate-500">{task.time_limit_minutes} minutes</span>
                <Link to={`/candidate/assessments/${task.id}`} className="rounded-xl bg-[#071b3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b2a55]">Open Assessment</Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
