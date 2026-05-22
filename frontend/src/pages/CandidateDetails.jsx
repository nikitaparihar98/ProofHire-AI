import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  BrainCircuit, 
  ShieldAlert, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Terminal,
  Activity,
  AlertCircle,
  Award,
  Info,
  MessageSquare
} from 'lucide-react';
import { getCandidateById, updateCandidateDecision } from '../services/api';
import ScoreBadge from '../components/ScoreBadge';
import ScoreChart from '../components/ScoreChart';
import AuthenticityBadge from '../components/AuthenticityBadge';
import StrengthWeaknessSection from '../components/StrengthWeaknessSection';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';

export default function CandidateDetails() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      console.log(`DEBUG: Fetching candidate ID: ${id}`);
      const data = await getCandidateById(id);
      console.log("DEBUG: Candidate Data Received", data);
      setCandidate(data);
      setError(null);
    } catch (err) {
      console.error("DEBUG: Failed to fetch candidate", err);
      setError("Failed to load candidate profile. Please check if the ID is valid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const handleDecision = async (status) => {
    try {
      setUpdating(true);
      await updateCandidateDecision(id, { status });
      await fetchCandidate(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Failed to update candidate status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-12 text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-rose-400 mb-4" />
        <h2 className="text-2xl font-bold text-rose-900 mb-2">Candidate Not Found</h2>
        <p className="text-rose-700 mb-8">{error || "The candidate you are looking for does not exist or has been removed."}</p>
        <Link to="/candidates" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-rose-200 text-rose-700 font-bold rounded-xl hover:bg-rose-100 transition-all">
          <ArrowLeft size={18} /> Back to Pipeline
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/candidates" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Pipeline
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info & AI Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100 flex-shrink-0">
                  <User size={40} />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{candidate?.name || "Unknown Candidate"}</h1>
                  <p className="text-lg font-bold text-slate-400 mb-6">{candidate?.email || "No Email"}</p>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 mt-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl shadow-sm text-slate-700">
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      {candidate?.role || "Position Not Specified"}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl shadow-sm text-slate-700">
                      <Award className="w-4 h-4 text-amber-500" />
                      {candidate?.experience_level || "Junior"}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl shadow-sm text-slate-700">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      {candidate?.overall_score || 0}% Score
                    </div>
                  </div>
                </div>
            </div>

            <div className="p-10 pt-0 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session ID</p>
                    <p className="text-sm font-mono text-slate-700">PH-{String(id).padStart(4, '0')}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assessment Type</p>
                    <p className="text-sm font-bold text-slate-700">{candidate?.assessment_type || "General"}</p>
                  </div>
               </div>

               <StrengthWeaknessSection strengths={candidate?.strengths || []} weaknesses={candidate?.weaknesses || []} />

               <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BrainCircuit size={120} className="text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <Terminal className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">AI Technical Evaluation</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line relative z-10 text-base">
                    {candidate?.ai_feedback || "No AI evaluation generated yet."}
                  </p>
               </div>
            </div>
          </div>

          {/* Authenticity Detail Card */}
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-2">
                 <ShieldAlert className="w-5 h-5 text-slate-700" />
                 <h3 className="font-bold text-slate-900 tracking-tight">Security & Malpractice Report</h3>
               </div>
               <AuthenticityBadge riskLevel={candidate?.plagiarism_risk_level || "Low"} />
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Malpractice Events</h4>
                    {(candidate?.malpractice_flags || []).length > 0 ? (
                      <div className="space-y-2">
                        {candidate.malpractice_flags.map((flag, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 shadow-sm">
                             <AlertTriangle size={14} /> {flag}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 shadow-sm">
                        <CheckCircle size={14} /> No malpractice detected.
                      </div>
                    )}
                  </div>
               </div>
               
               <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="text-indigo-500" size={20} />
                    <h4 className="font-bold text-slate-900">Authenticity Summary</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {candidate?.authenticity_summary || "Automated proctoring has not detected any significant anomalies during this session."}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Decision & Score */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 p-10 text-center space-y-8">
             <h3 className="text-xl font-bold text-slate-900 tracking-tight">Final Assessment</h3>
             <div className="flex justify-center py-4">
                <ScoreChart score={candidate?.overall_score || 0} />
             </div>
             <ScoreBadge recommendation={candidate?.hiring_recommendation || "Pending"} score={candidate?.overall_score || 0} />
             
             <div className="pt-6 border-t border-slate-100 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recruiter Decision</p>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                     onClick={() => handleDecision('Shortlisted')}
                     disabled={updating || candidate.status === 'Shortlisted'}
                     className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${
                       candidate.status === 'Shortlisted' 
                       ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' 
                       : 'bg-white border-2 border-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 shadow-sm'
                     }`}
                    >
                      <CheckCircle size={18} /> Shortlist
                    </button>
                    <button 
                     onClick={() => handleDecision('Rejected')}
                     disabled={updating || candidate.status === 'Rejected'}
                     className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all ${
                       candidate.status === 'Rejected' 
                       ? 'bg-rose-100 text-rose-700 border-2 border-rose-200' 
                       : 'bg-white border-2 border-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-sm'
                     }`}
                    >
                      <XCircle size={18} /> Reject
                    </button>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 p-10 text-center space-y-6">
              <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto">
                 <MessageSquare size={32} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-2">Communication</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">Coordinate interviews and message this candidate in the dedicated modules.</p>
                <div className="grid grid-cols-1 gap-3">
                  <Link 
                    to={`/messages?candidateId=${candidate.id}`}
                    className="block w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Go to Chat
                  </Link>
                  <button 
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="block w-full py-4 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
           </div>
        </div>

      </div>
      <ScheduleInterviewModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)}
        candidate={candidate}
        onScheduled={fetchCandidate}
      />
    </div>
  );
}
