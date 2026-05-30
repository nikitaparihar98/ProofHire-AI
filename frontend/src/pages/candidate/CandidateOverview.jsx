import React, { useEffect, useState } from 'react';
import { Loader2, Activity, CheckCircle2, ClipboardList, Video, ArrowRight, FileSearch, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage, getCandidateDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CandidateOverview() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCandidateDashboard()
      .then((data) => {
        setDashboard(data);
        setError('');
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to load dashboard')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
      </div>
    );
  }

  const candidate = dashboard?.candidate || {};
  const task = dashboard?.assigned_task;
  const assignmentId = dashboard?.assignment_id;
  const isEvaluated = dashboard?.submission_status === 'Evaluated' || candidate?.status === 'Evaluated';
  const scheduledInterviews = dashboard?.scheduled_interviews || 0;
  const resumeSkills =
    candidate?.resume_skills && typeof candidate.resume_skills === 'object' && !Array.isArray(candidate.resume_skills)
      ? candidate.resume_skills
      : {};
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Candidate workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#071b3a]">Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">Track your task evidence, resume context, and feedback in one place.</p>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {/* Resume Verification CTA Banner */}
      {(() => {
        const hasUploadedResume = Object.keys(resumeSkills).length > 0;
        return !hasUploadedResume ? (
          <div className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
            <div className="relative z-10 space-y-2">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-[#071b3a]">
                <FileSearch className="h-5 w-5 text-teal-800" />
                Add resume context
              </h2>
              <p className="max-w-xl text-sm font-medium leading-6 text-slate-500">
                Upload your resume so ProofHire can compare claimed skills with task evidence. Resume context supports the review, but the task stays the source of proof.
              </p>
            </div>
            <Link 
              to="/resume-verification" 
              className="relative z-10 flex shrink-0 items-center gap-2 rounded-xl bg-[#071b3a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2a55]"
            >
              Upload resume <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-teal-100 bg-teal-50 p-6 text-slate-800 shadow-sm md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="flex items-center gap-1.5 text-base font-semibold text-[#071b3a]">
                  Resume context added
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-800">
                    Active
                  </span>
                </h2>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {Object.keys(resumeSkills).length} claimed skills extracted for comparison with task evidence.
                </p>
              </div>
            </div>
            <Link 
              to="/resume-verification" 
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-teal-700 hover:text-teal-800"
            >
              Update resume
            </Link>
          </div>
        );
      })()}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-teal-700/40">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
            <Activity size={24} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-400">Status</p>
            <p className="text-lg font-semibold text-[#071b3a]">{candidate?.status || 'In Progress'}</p>
          </div>
        </div>
        
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-teal-700/40">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8faff] text-[#071b3a]">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-400">Latest score</p>
            <p className="text-lg font-semibold text-[#071b3a]">{candidate?.overall_score || 0}%</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-teal-700/40">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-400">Active tasks</p>
            <p className="text-lg font-semibold text-[#071b3a]">{task && !isEvaluated ? '1 pending' : 'None'}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-teal-700/40">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8faff] text-[#071b3a]">
            <Video size={24} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-slate-400">Interviews</p>
            <p className="text-lg font-semibold text-[#071b3a]">
              {scheduledInterviews} scheduled
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Task */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#071b3a]">Current task</h2>
            <Link to="/candidate/tasks" className="flex items-center gap-1 text-sm font-semibold text-teal-800 hover:underline">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          {!task ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-[#f8faff] px-4 py-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-500">No active tasks right now.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-[#f8faff] p-6">
              <span className={`mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${isEvaluated ? 'bg-teal-50 text-teal-800' : 'bg-amber-100 text-amber-700'}`}>
                {isEvaluated ? 'Completed' : 'Pending'}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-[#071b3a]">{task.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6">{task.prompt}</p>
              
              <Link 
                to={isEvaluated ? `/candidate/results/${assignmentId}` : `/candidate/assessments/${assignmentId}`} 
                className="block w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-teal-700 hover:text-teal-800"
              >
                {isEvaluated ? 'View Feedback' : 'Continue Task'}
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#071b3a]">Recent activity</h2>
          <div className="space-y-6">
             <div className="flex gap-4 relative">
               <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-teal-50 text-teal-800">
                 <Activity size={16} />
               </div>
               <div className="flex-1 pt-2">
                 <p className="text-sm font-semibold text-[#071b3a]">Application submitted</p>
                 <p className="text-xs text-slate-500 mt-1">You applied for {user?.role || 'the position'}</p>
               </div>
             </div>
             {isEvaluated && (
               <div className="flex gap-4 relative">
                 <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-teal-50 text-teal-800">
                   <CheckCircle2 size={16} />
                 </div>
                 <div className="flex-1 pt-2">
                   <p className="text-sm font-semibold text-[#071b3a]">Assessment evaluated</p>
                   <p className="mt-1 text-xs text-slate-500">Your technical task has a generated proof packet.</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
