import React, { useState, useEffect } from 'react';
import { Activity, Clock, Monitor, ShieldAlert, User, Search } from 'lucide-react';
import { getActiveSessions } from '../services/api';
import { Link } from 'react-router-dom';

export default function Assessments() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getActiveSessions();
        setSessions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Assessments</h1>
          <p className="text-slate-500 text-sm">Monitor candidates currently taking the AI proctored test.</p>
        </div>
        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase animate-pulse">
           {sessions.length} Candidates Active
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map(session => (
            <div key={session.id} className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm border-l-4 border-l-emerald-500 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900">{session.candidate_name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{session.role}</p>
                   </div>
                </div>
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                  session.risk_level === 'High' ? 'bg-rose-100 text-rose-700' : 
                  session.risk_level === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  Risk: {session.risk_level}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Time Elapsed</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                       <Clock size={14} className="text-indigo-500" />
                       {Math.floor((new Date() - new Date(session.started_at)) / 60000)}m
                    </div>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Events</span>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                       <ShieldAlert size={14} className="text-amber-500" />
                       {session.events?.length || 0}
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                <Link 
                  to={`/monitor/${session.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Join Monitoring
                </Link>
              </div>
              
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-16 h-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="bg-emerald-50 p-10 rounded-full mb-8 relative">
             <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
             <Activity className="h-16 w-16 text-emerald-200 relative z-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Active Assessments</h3>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
            There are currently no candidates taking live tests. When a candidate begins their assessment, they will appear here instantly for proctoring.
          </p>
        </div>
      )}
    </div>
  );
}
