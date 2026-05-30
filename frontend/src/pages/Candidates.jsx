import React, { useState, useMemo } from 'react';
import { Users, Search, FilterX, UserPlus } from 'lucide-react';
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

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-40 rounded-2xl border border-slate-200 bg-white"></div>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Proof packets</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#071b3a]">Candidate pipeline</h1>
          <p className="mt-1 text-sm text-slate-500">View task evidence, authenticity signals, and candidate stages.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#071b3a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2a55]"
        >
          <UserPlus size={18} />
          Add Candidate
        </button>
      </div>

      <div className="sticky top-24 z-10 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-[#f8faff] py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-1 gap-3 w-full">
          <select
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-[#f8faff] px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none transition-colors hover:bg-white"
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
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-[#f8faff] px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none transition-colors hover:bg-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-[#f8faff] px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none transition-colors hover:bg-white"
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
            className="rounded-xl bg-[#f8faff] p-2.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          >
            <FilterX size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-center rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center text-rose-700">
           <Search size={32} className="mb-2 opacity-50" />
           <p className="font-bold">{error}</p>
           <button onClick={refresh} className="mt-4 font-semibold text-teal-800 hover:underline">Try again</button>
        </div>
      )}

      {!error && (
        filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm animate-in fade-in zoom-in duration-700">
            <div className="relative mb-8 rounded-full bg-[#f8faff] p-10">
               <Users className="h-16 w-16 text-slate-200 relative z-10" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-[#071b3a]">Pipeline is empty</h3>
            <p className="mx-auto mt-3 max-w-sm font-medium leading-relaxed text-slate-500">
              {candidates.length === 0 
                ? "You haven't added any candidates yet. Start building your team by adding an applicant." 
                : "No candidates match your current filters. Try broadening your criteria."}
            </p>
            {candidates.length === 0 && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-10 flex items-center gap-3 rounded-xl bg-[#071b3a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b2a55]"
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
