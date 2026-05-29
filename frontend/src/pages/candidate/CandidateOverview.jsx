import React, { useEffect, useState } from 'react';
import { Loader2, Activity, CheckCircle2, ClipboardList, Video, ArrowRight } from 'lucide-react';
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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const candidate = dashboard?.candidate;
  const task = dashboard?.assigned_task;
  const assignmentId = dashboard?.assignment_id;
  const isEvaluated = dashboard?.submission_status === 'Evaluated' || candidate?.status === 'Evaluated';
  const scheduledInterviews = dashboard?.scheduled_interviews || 0;
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}</h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Here's an overview of your application progress.</p>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {/* Resume Verification CTA Banner */}
      {(() => {
        const hasUploadedResume = candidate?.resume_skills && Object.keys(candidate.resume_skills).length > 0;
        return !hasUploadedResume ? (
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-indigo-600/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
            <div className="relative z-10 space-y-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-200">upload_file</span>
                Verify Your Resume Claims Against Code Proof
              </h2>
              <p className="text-sm text-indigo-100 max-w-xl font-medium">
                Upload your resume now to instantly cross-reference self-assessed skill levels against sandbox task realities. Unlock your "Hidden Talent" mode!
              </p>
            </div>
            <Link 
              to="/resume-verification" 
              className="shrink-0 px-5 py-3 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-colors shadow-md relative z-10 flex items-center gap-2 text-sm"
            >
              Upload & Verify Resume <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 text-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  Resume Verified Successfully
                  <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Active
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  AI has extracted {Object.keys(candidate.resume_skills).length} claimed skills. Sandbox code outputs are being cross-referenced.
                </p>
              </div>
            </div>
            <Link 
              to="/resume-verification" 
              className="shrink-0 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">edit</span> Re-verify Resume
            </Link>
          </div>
        );
      })()}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Status</p>
            <p className="text-lg font-bold text-slate-900">{candidate?.status || 'In Progress'}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Latest Score</p>
            <p className="text-lg font-bold text-slate-900">{candidate?.overall_score || 0}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Active Tasks</p>
            <p className="text-lg font-bold text-slate-900">{task && !isEvaluated ? '1 Pending' : 'None'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
            <Video size={24} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Interviews</p>
            <p className="text-lg font-bold text-slate-900">
              {scheduledInterviews} Scheduled
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Task */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Current Task</h2>
            <Link to="/candidate/tasks" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {!task ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50">
              <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-500">No active tasks right now.</p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${isEvaluated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {isEvaluated ? 'Completed' : 'Pending'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{task.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6">{task.prompt}</p>
              
              <Link 
                to={isEvaluated ? `/candidate/results/${assignmentId}` : `/candidate/assessments/${assignmentId}`} 
                className="w-full block text-center py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                {isEvaluated ? 'View Feedback' : 'Continue Task'}
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
             <div className="flex gap-4 relative">
               <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0 z-10 border-4 border-white">
                 <Activity size={16} />
               </div>
               <div className="flex-1 pt-2">
                 <p className="text-sm font-bold text-slate-900">Application Submitted</p>
                 <p className="text-xs text-slate-500 mt-1">You applied for {user?.role || 'the position'}</p>
               </div>
             </div>
             {isEvaluated && (
               <div className="flex gap-4 relative">
                 <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0 z-10 border-4 border-white">
                   <CheckCircle2 size={16} />
                 </div>
                 <div className="flex-1 pt-2">
                   <p className="text-sm font-bold text-slate-900">Assessment Evaluated</p>
                   <p className="text-xs text-slate-500 mt-1">Your technical assessment was scored by AI.</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
