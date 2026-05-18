import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  PlusCircle, 
  Activity, 
  Play, 
  Monitor, 
  Users, 
  Clock,
  FilterX,
  Upload
} from 'lucide-react';
import { getActiveSessions, getHealth } from '../services/api';
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
      setActiveError("Failed to fetch live assessment data.");
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
        <div className="w-full max-w-lg bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
           <div className="p-10 text-center">
              <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">System Error</h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={handleGlobalRefresh}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase text-xs tracking-widest"
              >
                Retry Connection
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen -mt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em] animate-pulse">Syncing Pipeline Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
          <p className="text-slate-500 mt-1">Single source of truth for your hiring pipeline.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
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
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Live Assessments</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map(session => (
              <div key={session.id} className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm border-l-4 border-l-emerald-500 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{session.candidate_name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{session.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.floor((new Date() - new Date(session.started_at)) / 60000)}m Elapsed
                  </div>
                  <Link 
                    to={`/monitor/${session.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
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
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Candidate Pipeline</h2>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {processedCandidates.length} candidates in view
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-100 bg-slate-50/50 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              placeholder="Search name, role..."
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
              className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-50 transition-all"
              title="Clear Filters"
            >
              <FilterX size={20} />
            </button>
          </div>
        </div>

        {processedCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedCandidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="bg-slate-50 p-10 rounded-full mb-8 relative">
               <Users className="h-16 w-16 text-slate-200 relative z-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No candidates found</h3>
            <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
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
