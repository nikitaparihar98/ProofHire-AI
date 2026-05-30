import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  PlusCircle, 
  Activity, 
  Monitor, 
  Users, 
  Clock,
  FilterX,
  Upload
} from 'lucide-react';
import { getActiveSessions, getApiErrorMessage } from '../services/api';
import { Link } from 'react-router-dom';
import useCandidates from '../hooks/useCandidates';
import CandidateCard from '../components/CandidateCard';
import DashboardAnalytics from '../components/DashboardAnalytics';
import CandidateUploadModal from '../components/CandidateUploadModal';
import BulkUploadModal from '../components/BulkUploadModal';

export default function Dashboard() {
  const { candidates, loading: candidatesLoading, error: candidatesError, refresh: refreshCandidates } = useCandidates();
  const [activeSessions, setActiveSessions] = useState([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [activeError, setActiveError] = useState(null);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [recommendationFilter, setRecommendationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('score-desc');

  const fetchActiveData = async () => {
    try {
      const activeData = await getActiveSessions();
      setActiveSessions(activeData || []);
      setActiveError(null);
    } catch (err) {
      console.error("Active Sessions Fetch Error:", err);
      setActiveError(getApiErrorMessage(err, "Failed to fetch live assessment data"));
    } finally {
      setLoadingActive(false);
    }
  };

  useEffect(() => {
    fetchActiveData();
    const interval = setInterval(fetchActiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGlobalRefresh = () => {
    refreshCandidates();
    fetchActiveData();
  };

  // Get unique roles for filter dropdown
  const roles = useMemo(() => {
    const uniqueRoles = new Set(candidates.map(c => c.role));
    return ['All', ...Array.from(uniqueRoles)];
  }, [candidates]);

  // Filter and sort candidates
  const processedCandidates = useMemo(() => {
    let result = [...candidates];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) || 
        c.role.toLowerCase().includes(lowerQuery)
      );
    }

    if (roleFilter !== 'All') result = result.filter(c => c.role === roleFilter);
    if (recommendationFilter !== 'All') result = result.filter(c => c.hiring_recommendation === recommendationFilter);
    if (statusFilter !== 'All') result = result.filter(c => c.status === statusFilter);

    result.sort((a, b) => {
      if (sortBy === 'score-desc') return b.overall_score - a.overall_score;
      if (sortBy === 'score-asc') return a.overall_score - b.overall_score;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [candidates, searchQuery, roleFilter, recommendationFilter, statusFilter, sortBy]);

  const loading = candidatesLoading || (loadingActive && activeSessions.length === 0);
  const error = candidatesError || activeError;

  if (error && !candidates.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen -mt-20 px-6">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
           <div className="p-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
                <Activity className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-[#071b3a]">Connection issue</h2>
              <p className="mb-8 font-medium leading-relaxed text-slate-500">{error}</p>
              <button 
                onClick={handleGlobalRefresh}
                className="w-full rounded-xl bg-[#071b3a] py-4 text-sm font-semibold text-white transition hover:bg-[#0b2a55]"
              >
                Retry connection
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen -mt-20">
        <div className="mb-6 h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-teal-700"></div>
        <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Syncing pipeline data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Recruiter workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#071b3a]">Today’s hiring work</h1>
          <p className="mt-1 text-slate-500">Review task evidence, active assessments, and candidate proof packets.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#071b3a] shadow-sm transition hover:border-teal-700 hover:text-teal-800"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#071b3a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b2a55]"
          >
            <PlusCircle className="w-4 h-4" />
            Add Candidate
          </button>
        </div>
      </div>

      <DashboardAnalytics candidates={candidates} loading={loading} />

      {/* Active Assessments Section */}
      {activeSessions.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-teal-50 p-1.5">
                <Activity className="w-4 h-4 text-teal-800" />
              </div>
              <h2 className="text-lg font-semibold text-[#071b3a]">Live assessments</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map(session => (
              <div key={session.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 border-l-4 border-l-teal-700 bg-white p-6 shadow-sm transition hover:border-teal-700/40">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-[#071b3a]">{session.candidate_name}</h3>
                    <p className="text-xs font-medium text-slate-500">{session.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="rounded bg-teal-50 px-2 py-1 text-[10px] font-semibold uppercase text-teal-800">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor((new Date() - new Date(session.started_at)) / 60000)}m Elapsed
                  </div>
                  <Link 
                    to={`/monitor/${session.id}`}
                    className="flex items-center gap-2 rounded-xl bg-[#071b3a] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0b2a55]"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    Monitor Live
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Candidate Table/Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="rounded-lg bg-teal-50 p-1.5">
              <Users className="w-4 h-4 text-teal-800" />
            </div>
            <h2 className="text-lg font-semibold text-[#071b3a]">Candidate pipeline</h2>
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {processedCandidates.length} candidates in view
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-[#f8faff] py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
              placeholder="Search name, role..."
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
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
              <option value="name-asc">Name A-Z</option>
            </select>

            <button 
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('All');
                setStatusFilter('All');
                setRecommendationFilter('All');
              }}
              className="rounded-xl bg-[#f8faff] p-2.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
              title="Clear Filters"
            >
              <FilterX size={20} />
            </button>
          </div>
        </div>

        {processedCandidates.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {processedCandidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
            <div className="relative mb-8 rounded-full bg-[#f8faff] p-10">
               <Users className="h-16 w-16 text-slate-200 relative z-10" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-[#071b3a]">No candidates found</h3>
            <p className="mx-auto mt-3 max-w-sm font-medium leading-relaxed text-slate-500">
               Try adjusting your filters or search query to find candidates.
            </p>
          </div>
        )}
      </section>

      <CandidateUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onRefresh={handleGlobalRefresh}
      />
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onRefresh={handleGlobalRefresh}
      />
    </div>
  );
}
