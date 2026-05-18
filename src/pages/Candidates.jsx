import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Filter, ArrowUpDown, FilterX, UserPlus } from 'lucide-react';
import useCandidates from '../hooks/useCandidates';
import CandidateCard from '../components/CandidateCard';
import CandidateUploadModal from '../components/CandidateUploadModal';

export default function Candidates() {
  const { candidates, loading, error, refresh } = useCandidates();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const roles = useMemo(() => {
    const uniqueRoles = new Set(candidates.map(c => c.role));
    return ['All', ...Array.from(uniqueRoles)];
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (roleFilter !== 'All') result = result.filter(c => c.role === roleFilter);
    if (statusFilter !== 'All') result = result.filter(c => c.status === statusFilter);

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'score-desc') return b.overall_score - a.overall_score;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
    return result;
  }, [candidates, searchQuery, roleFilter, statusFilter, sortBy]);

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Pipeline</h1>
          <p className="text-slate-500 text-sm">View and manage all candidates across all stages.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <UserPlus size={18} />
          Add Candidate
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-center sticky top-24 z-10">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-1 gap-3 w-full">
          <select
            className="flex-1 px-3 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl text-xs font-bold text-slate-600 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="Not Attended">Not Attended</option>
            <option value="Attending">Attending</option>
            <option value="Evaluated">Evaluated</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="flex-1 px-3 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl text-xs font-bold text-slate-600 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            className="flex-1 px-3 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl text-xs font-bold text-slate-600 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="name-asc">Name A-Z</option>
          </select>

          <button 
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('All');
              setStatusFilter('All');
              setSortBy('newest');
            }}
            className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <FilterX size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 flex flex-col items-center text-center">
           <Search size={32} className="mb-2 opacity-50" />
           <p className="font-bold">{error}</p>
           <button onClick={refresh} className="mt-4 text-indigo-600 font-bold hover:underline">Try Again</button>
        </div>
      )}

      {!error && (
        filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCandidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center animate-in fade-in zoom-in duration-700">
            <div className="bg-slate-50 p-10 rounded-full mb-8 relative">
               <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-ping"></div>
               <Users className="h-16 w-16 text-slate-200 relative z-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pipeline is Empty</h3>
            <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
              {candidates.length === 0 
                ? "You haven't added any candidates yet. Start building your team by adding an applicant." 
                : "No candidates match your current filters. Try broadening your criteria."}
            </p>
            {candidates.length === 0 && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-10 px-8 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-3 uppercase text-xs tracking-widest"
              >
                <UserPlus size={18} />
                Add Candidate
              </button>
            )}
          </div>
        )
      )}

      <CandidateUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onRefresh={refresh}
      />
    </div>
  );
}
