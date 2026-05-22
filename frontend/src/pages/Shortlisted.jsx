import React, { useState, useEffect } from 'react';
import { CheckCircle, Users, Search, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCandidates from '../hooks/useCandidates';
import CandidateCard from '../components/CandidateCard';
import ScheduleInterviewModal from '../components/ScheduleInterviewModal';

export default function Shortlisted() {
  const { filteredCandidates: candidates, loading, error } = useCandidates('Shortlisted');
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const handleScheduleClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsScheduleModalOpen(true);
  };

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="text-teal-600" /> Shortlisted Candidates
          </h1>
          <p className="text-slate-500 text-sm">Review top talent ready for the final interview stage.</p>
        </div>
        <div className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 uppercase">
           {candidates.length} Qualified
        </div>
      </div>

      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map(candidate => (
            <div key={candidate.id} className="relative group">
               <CandidateCard candidate={candidate} />
               <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => handleScheduleClick(candidate)}
                    className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                     <Calendar size={14} /> Schedule
                  </button>
                  <button 
                    onClick={() => navigate(`/messages?candidateId=${candidate.id}`)}
                    className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                     <Mail size={14} /> Message
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="bg-teal-50 p-10 rounded-full mb-8">
             <CheckCircle className="h-16 w-16 text-teal-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Shortlisted Talent</h3>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
            Candidates will appear here once you mark them as "Shortlisted" after reviewing their AI assessment reports.
          </p>
        </div>
      )}

      <ScheduleInterviewModal 
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
        onScheduled={() => {}}
      />
    </div>
  );
}
