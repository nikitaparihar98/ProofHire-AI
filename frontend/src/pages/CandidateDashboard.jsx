import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, CheckCircle2, ClipboardList, Loader2, LogOut, MessageSquare, Send } from 'lucide-react';
import CandidateMessages from '../components/CandidateMessages';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage, getCandidateDashboard, submitCandidateAssessment } from '../services/api';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const candidate = dashboard?.candidate;
  const task = dashboard?.assigned_task;
  const isEvaluated = dashboard?.submission_status === 'Evaluated' || candidate?.status === 'Evaluated';

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getCandidateDashboard();
      setDashboard(data);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load candidate dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!authLoading && user?.role === 'candidate') {
      loadDashboard();
    }
  }, [authLoading, user]);

  const stats = useMemo(() => ([
    { label: 'Assessment Status', value: candidate?.status || 'Not Started', icon: <Activity className="text-indigo-600" /> },
    { label: 'AI Score', value: `${candidate?.overall_score || 0}/100`, icon: <CheckCircle2 className="text-emerald-600" /> },
    { label: 'Assigned Task', value: task?.title || 'Not assigned', icon: <ClipboardList className="text-blue-600" /> },
  ]), [candidate, task]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await submitCandidateAssessment({ answer });
      setAnswer('');
      setSuccess('Assessment submitted and evaluated successfully.');
      await loadDashboard();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to submit assessment'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (user?.role !== 'candidate') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Candidate access required</h1>
          <Link to="/login" className="mt-4 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-200 flex flex-col p-6 z-40">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900">ProofHire AI</h1>
          <p className="text-sm text-slate-500">Candidate Portal</p>
        </div>
        <nav className="flex-1 space-y-2">
          <Link className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold" to="/candidate-dashboard">
            <ClipboardList size={18} /> Dashboard
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold" to="/candidate-profile">
            <CheckCircle2 size={18} /> Profile
          </Link>
        </nav>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="font-bold text-slate-900 truncate">{candidate?.name || user?.name}</p>
          <p className="text-xs text-slate-500 truncate">{candidate?.email || user?.email}</p>
          <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-xs font-bold text-rose-600">
            <LogOut size={14} /> Log out
          </button>
        </div>
      </aside>

      <main className="ml-[260px] p-8 max-w-[1500px]">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, {candidate?.name || user?.name}</h2>
            <p className="mt-1 text-slate-500">{candidate?.role} assessment workflow for {candidate?.email || user?.email}</p>
          </div>
          <Link to="/candidate-profile" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">
            View Profile
          </Link>
        </header>

        {error && <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}
        {success && <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{success}</div>}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="mb-4">{stat.icon}</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="mt-1 text-xl font-black text-slate-900 line-clamp-2">{stat.value}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <section className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {!task ? (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                <ClipboardList className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No assessments assigned yet</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md">Complete your profile or wait for a recruiter to assign a technical task based on your role.</p>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-100 p-6">
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-600">{candidate?.role}</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{task.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{task.prompt}</p>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluation Focus</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.evaluation_focus?.map((item) => (
                        <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item}</span>
                      ))}
                    </div>
                  </div>



{isEvaluated ? (
  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
    <h4 className="font-bold text-emerald-900">AI Evaluation Complete</h4>
    <p className="mt-2 text-sm text-emerald-800">{candidate?.ai_feedback}</p>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-bold text-emerald-900">Strengths</p>
        <ul className="mt-2 list-disc pl-5 text-emerald-800">
          {(candidate?.strengths || []).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <p className="font-bold text-emerald-900">Improvements</p>
        <ul className="mt-2 list-disc pl-5 text-emerald-800">
          {(candidate?.weaknesses || []).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </div>
  </div>
) : dashboard?.status === 'in_progress' ? (
  <form onSubmit={handleSubmit} className="space-y-4">
    <textarea
      value={answer}
      onChange={(event) => setAnswer(event.target.value)}
      rows={10}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
      placeholder="Write your answer, approach, code, SQL, analysis, or design rationale here..."
    />
    <button
      type="submit"
      disabled={submitting || answer.trim().length < 20}
      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 disabled:opacity-50"
    >
      {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
      Submit for AI Evaluation
    </button>
  </form>
) : (
  <button
    onClick={() => navigate(`/candidate/assessments/${dashboard?.assignment_id}`)}
    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg"
  >
    Start Assessment
  </button>
)}
                </div>
              </>
            )}
          </section>

          <section className="xl:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[560px] flex flex-col">
            <div className="border-b border-slate-100 p-6 flex items-center gap-3">
              <MessageSquare className="text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900">Recruiter Chat</h3>
                <p className="text-xs text-slate-500">Messages are saved and refresh automatically.</p>
              </div>
            </div>
            <CandidateMessages
              candidateId={candidate?.id}
              senderType="candidate"
              senderId={String(user?.id || candidate?.id)}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
