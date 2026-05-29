import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Role-Based Tasks</h1>
          <p className="mt-2 text-slate-500">
            Tasks generated for {dashboard?.candidate?.role}. Submit the assigned assessment from your dashboard.
          </p>
        </header>

        {error && <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-indigo-600">{task.task_type}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{task.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{task.prompt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {task.evaluation_focus.map((item) => (
                  <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item}</span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-bold text-slate-500">{task.time_limit_minutes} minutes</span>
                <Link to={`/candidate/assessments/${task.id}`} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Open Assessment</Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
