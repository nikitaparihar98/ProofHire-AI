import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Monitor, 
  ShieldAlert, 
  User, 
  Clock, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal,
  CameraOff,
  Eye,
  Lock,
  Search
} from 'lucide-react';
import { getLiveSession } from '../services/api';

export default function LiveMonitoring() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await getLiveSession(sessionId);
      setSession(data);
    } catch (err) {
      console.error(err);
      setError("Session not found or connection lost.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [sessionId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4 text-slate-400">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p className="font-bold uppercase tracking-widest text-xs">Initializing Secure Monitoring...</p>
    </div>
  );

  if (error || !session) return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-6 shadow-xl">
      <div className="bg-rose-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-rose-500">
        <Activity size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Session Inactive</h2>
      <p className="text-slate-500">{error || "The live session has ended or is no longer reachable."}</p>
      <button 
        onClick={() => navigate('/assessments')}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
      >
        Back to Active Queue
      </button>
    </div>
  );

  const timeElapsed = Math.floor((new Date() - new Date(session.started_at)) / 60000);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Recruiter Monitoring Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/assessments')} 
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-indigo-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Eye size={20} className="text-indigo-600" /> Live Assessment Monitoring
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Recruiter Mode • {session.candidate_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Session Active
           </div>
           <div className="flex items-center gap-2 bg-slate-900 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <Lock size={12} /> Encrypted Feed
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Feed & Console (Col 1-8) */}
        <div className="lg:col-span-8 space-y-6">
           {/* Visual Feed Emulator */}
           <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative group">
              <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                 <div className="bg-rose-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div> FEED: {session.id.split('-')[0].toUpperCase()}
                 </div>
              </div>
              
              <div className="aspect-video bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
                 <CameraOff className="text-slate-800 w-32 h-32 absolute opacity-10" />
                 <div className="text-center z-10 space-y-6">
                    <div className="relative">
                       <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                       <div className="bg-slate-800 p-6 rounded-full inline-block border border-slate-700 shadow-2xl relative z-10">
                          <Monitor className="text-indigo-400 w-12 h-12" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <p className="text-indigo-100 font-black uppercase tracking-[0.3em] text-xs">Awaiting Visual Stream</p>
                       <p className="text-slate-500 font-bold text-[10px]">Secure candidate feed is currently encrypted.</p>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
                 <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Link</span>
                       <span className="text-emerald-400 text-sm font-black">STABLE (98ms)</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Logic</span>
                       <span className="text-slate-300 text-sm font-black">AI ACTIVE</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl border border-slate-700 hover:bg-slate-700 transition-all uppercase tracking-widest">Screenshot</button>
                    <button className="px-5 py-2.5 bg-rose-600/20 text-rose-500 text-xs font-black rounded-xl border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest">Manual Flag</button>
                 </div>
              </div>
           </div>

           {/* Live Response Terminal */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-indigo-600" />
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Live Candidate Response</h3>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <Lock size={10} /> READ-ONLY MONITORING MODE
                 </div>
              </div>
              <div className="p-8 bg-slate-950 min-h-[400px] relative">
                 <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
                 </div>
                 <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap leading-relaxed relative z-10 h-full overflow-y-auto">
                    {session.current_response || "// Candidate is currently thinking or preparing response..."}
                 </pre>
                 <div className="absolute bottom-6 right-6 p-3 bg-slate-900/80 backdrop-blur border border-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                    Monitoring Session Alpha
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Insights & Actions (Col 9-12) */}
        <div className="lg:col-span-4 space-y-6">
           {/* Candidate Profile Card */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-8">
              <div className="flex items-center gap-5">
                 <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                    <User size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">{session.candidate_name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{session.role}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 text-center space-y-1">
                    <Clock className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Elapsed</span>
                    <span className="text-lg font-black text-slate-900 tabular-nums">{timeElapsed}m</span>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 text-center space-y-1">
                    <ShieldAlert className="w-5 h-5 text-rose-500 mx-auto mb-2" />
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Violations</span>
                    <span className="text-lg font-black text-rose-600 tabular-nums">{session.has_malpractice ? (
                      <span className="text-lg font-black text-rose-600 tabular-nums">Detected</span>
                    ) : (
                      <span className="text-lg font-black text-slate-600 tabular-nums">None</span>
                    )}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Risk</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      session.risk_level === 'High' ? 'bg-rose-500 text-white' : 
                      session.risk_level === 'Medium' ? 'bg-amber-500 text-white' : 
                      'bg-emerald-500 text-white'
                    }`}>
                      {session.risk_level}
                    </span>
                 </div>
                 <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      session.risk_level === 'High' ? 'bg-rose-500 w-full' : 
                      session.risk_level === 'Medium' ? 'bg-amber-500 w-1/2' : 
                      'bg-emerald-500 w-1/5'
                    }`}></div>
                 </div>
              </div>
           </div>

           {/* Real-time Event Log */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[450px]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-2">
                    <Search size={16} className="text-slate-400" />
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900">Event Timeline</h3>
                 </div>
                 <span className="text-[9px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg border border-slate-200 uppercase">Live</span>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
                 {session.events?.length > 0 ? (
                   session.events.map((event, i) => (
                     <div key={i} className="flex gap-4 relative animate-in slide-in-from-right-4 duration-300">
                        {i !== session.events.length - 1 && <div className="absolute left-[9px] top-6 bottom-[-24px] w-0.5 bg-slate-100"></div>}
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10 ${
                          event.severity === 'warning' ? 'bg-rose-100 text-rose-600' : 
                          event.severity === 'critical' ? 'bg-rose-600 text-white' :
                          'bg-indigo-100 text-indigo-600'
                        }`}>
                           {event.severity === 'warning' ? <AlertTriangle size={10} /> : <Terminal size={10} />}
                        </div>
                        <div className="space-y-1">
                           <p className="text-[11px] font-black text-slate-900 leading-none">{event.type.replace('_', ' ').toUpperCase()}</p>
                           <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{event.message}</p>
                           <p className="text-[9px] text-slate-400 font-mono">{new Date(event.timestamp).toLocaleTimeString()}</p>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                      <Terminal size={40} className="text-slate-200" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Events Logged</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Recruiter Action Center */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
              <Activity className="absolute -bottom-6 -right-6 w-32 h-32 opacity-5" />
              <div className="space-y-1 relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-widest">Intervention Panel</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Authorized Recruiter Actions Only</p>
              </div>
              <div className="grid grid-cols-1 gap-3 relative z-10">
                 <button className="w-full py-3.5 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Mark as Valid
                 </button>
                 <button className="w-full py-3.5 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-rose-600/20">
                    <XCircle size={14} /> Terminate Session
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
