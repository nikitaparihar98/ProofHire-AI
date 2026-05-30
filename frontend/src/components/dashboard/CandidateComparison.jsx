import React, { useState, useEffect } from 'react';
import { compareCandidates, getCandidates } from '../../services/api';
import { ArrowRightLeft, Trophy, AlertTriangle } from 'lucide-react';
import SkillReport from './SkillReport';

const CandidateComparison = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedId1, setSelectedId1] = useState('');
  const [selectedId2, setSelectedId2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all candidates to populate the dropdowns
    getCandidates().then(data => setCandidates(data)).catch(err => console.error(err));
  }, []);

  const handleCompare = async () => {
    if (!selectedId1 || !selectedId2) {
      setError("Please select two candidates to compare.");
      return;
    }
    if (selectedId1 === selectedId2) {
      setError("Please select different candidates.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await compareCandidates(selectedId1, selectedId2);
      setComparisonResult(result);
    } catch (err) {
      setError("Error comparing candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-medium text-slate-800 mb-6 flex items-center gap-2">
          <ArrowRightLeft className="text-teal-700" />
          Compare Candidates
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">Candidate A</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={selectedId1}
              onChange={(e) => setSelectedId1(e.target.value)}
            >
              <option value="">Select candidate...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex pb-3 items-center justify-center w-12 flex-shrink-0 text-slate-400">
            VS
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">Candidate B</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={selectedId2}
              onChange={(e) => setSelectedId2(e.target.value)}
            >
              <option value="">Select candidate...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-800 focus:ring-4 focus:ring-teal-100 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}
      </div>

      {comparisonResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Winner Banner */}
          <div className="bg-white border border-teal-100 p-6 rounded-2xl text-slate-700 shadow-sm flex items-center gap-6">
            <div className="bg-teal-50 p-4 rounded-full">
              <Trophy size={40} className="text-teal-700" />
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-widest font-semibold text-teal-700 mb-1">Recommended Choice</h3>
              <p className="text-xl font-medium leading-relaxed">
                {comparisonResult.reasoning}
              </p>
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`transition-all duration-300 ${comparisonResult.stronger_candidate_id === comparisonResult.candidate_1.id ? 'ring-4 ring-teal-100 rounded-2xl' : 'opacity-90'}`}>
              <SkillReport candidate={comparisonResult.candidate_1} />
            </div>
            <div className={`transition-all duration-300 ${comparisonResult.stronger_candidate_id === comparisonResult.candidate_2.id ? 'ring-4 ring-teal-100 rounded-2xl' : 'opacity-90'}`}>
              <SkillReport candidate={comparisonResult.candidate_2} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateComparison;
