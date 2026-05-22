import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Link as LinkIcon, CheckCircle2, XCircle, RefreshCw, Video, MapPin, Tag } from 'lucide-react';
import { getInterviews, updateInterview } from '../services/api';
import { Link } from 'react-router-dom';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await getInterviews();
      setInterviews(data);
    } catch (err) {
      console.error("Failed to fetch interviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateInterview(id, status);
      fetchInterviews();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <div className="h-20 bg-white rounded-3xl animate-pulse"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Calendar className="text-indigo-600" size={24} />
            </div>
            Interview Scheduler
          </h1>
          <p className="text-slate-500 mt-1">Manage your upcoming candidate evaluations and technical sessions.</p>
        </div>
        <button 
          onClick={fetchInterviews}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw size={18} />
          Sync Data
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="bg-slate-50 p-10 rounded-full mb-6">
            <Calendar className="h-16 w-16 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Interviews Found</h3>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
            Schedule an interview from the candidate's profile or the pipeline dashboard to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {interviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
              
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl shadow-slate-100">
                  {interview.candidate_name?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{interview.candidate_name}</h3>
                  <p className="text-sm font-bold text-slate-400 mb-3">{interview.candidate_role}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      interview.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      interview.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {interview.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      <Tag size={12} className="text-indigo-400" /> {interview.interview_title}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mx-0 lg:mx-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule Info</p>
                   <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Clock size={16} className="text-indigo-500" />
                      {new Date(interview.scheduled_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                   </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Mode</p>
                   <div className="flex items-center gap-2 text-slate-700 font-bold">
                      {interview.mode === 'Online' ? <Video size={16} className="text-emerald-500" /> : <MapPin size={16} className="text-rose-500" />}
                      {interview.mode} Session
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link 
                  to={`/candidate/${interview.candidate_id}`}
                  className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all flex flex-col items-center gap-1 min-w-[80px]"
                  title="View Profile"
                >
                  <LinkIcon size={18} />
                  <span className="text-[10px] font-bold uppercase">Profile</span>
                </Link>
                
                {interview.status === 'Scheduled' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(interview.id, 'Completed')}
                      className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all flex flex-col items-center gap-1 min-w-[80px]"
                      title="Mark as Completed"
                    >
                      <CheckCircle2 size={18} />
                      <span className="text-[10px] font-bold uppercase">Finish</span>
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(interview.id, 'Cancelled')}
                      className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all flex flex-col items-center gap-1 min-w-[80px]"
                      title="Cancel Interview"
                    >
                      <XCircle size={18} />
                      <span className="text-[10px] font-bold uppercase">Cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
