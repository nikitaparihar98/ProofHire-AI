import React, { useState, useEffect } from 'react';
import { XCircle, Users, AlertCircle, Info } from 'lucide-react';
import useCandidates from '../hooks/useCandidates';
import CandidateCard from '../components/CandidateCard';

export default function Rejected() {
  const { filteredCandidates: candidates, loading, error } = useCandidates('Rejected');

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <XCircle className="text-rose-600" /> Rejected Pipeline
          </h1>
          <p className="text-slate-500 text-sm">Archived candidates who did not meet role or authenticity requirements.</p>
        </div>
        <div className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 uppercase">
           {candidates.length} Profiles
        </div>
      </div>

      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map(candidate => (
            <div key={candidate.id} className="relative group">
               <CandidateCard candidate={candidate} />
               <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-100 flex gap-2 items-start">
                  <Info className="text-rose-500 flex-shrink-0" size={14} />
                  <div>
                    <p className="text-[10px] font-bold text-rose-900 uppercase">Rejection Reason</p>
                    <p className="text-xs text-rose-700 mt-0.5 line-clamp-2">{candidate.rejection_reason || "Not specified."}</p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="bg-slate-50 p-10 rounded-full mb-8">
             <XCircle className="h-16 w-16 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rejected Pipeline is Empty</h3>
          <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
            Profiles marked as "Rejected" will appear here. This section serves as an archive for candidates who did not meet the role criteria.
          </p>
        </div>
      )}
    </div>
  );
}
