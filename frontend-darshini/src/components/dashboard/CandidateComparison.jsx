<<<<<<< HEAD
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ArrowRightLeft className="text-blue-600" />
          Compare Candidates
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Candidate A</label>
            <select
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedId1}
              onChange={(e) => setSelectedId1(e.target.value)}
            >
              <option value="">Select candidate...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex pb-3 items-center justify-center w-12 flex-shrink-0 text-gray-400">
            VS
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Candidate B</label>
            <select
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle size={18} />
            {error}
=======
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GitCompare, Loader2, AlertCircle, CheckCircle, Trophy, Sparkles, ChevronDown } from "lucide-react";

/** Base for POST /compare (no trailing slash). Default matches RecruitAI-style server. */
const COMPARE_API_BASE =
  import.meta.env.VITE_COMPARE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

/** ProofHire API base for listing candidates (fetch GET). */
const CANDIDATES_LIST_BASE = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

function normalizeRoleSlug(role) {
  const r = String(role || "")
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (r.includes("data")) return "data_analyst";
  if (r.includes("product")) return "product_manager";
  return "software_engineer";
}

// Payload formatting no longer needed for GET request

const ScoreBar = ({ label, score }) => (
  <div className="mt-4">
    <div className="flex justify-between text-xs mb-1.5">
      <span className="font-bold text-slate-600 uppercase tracking-wider">{label}</span>
      <span className="text-slate-800 font-black">{score != null ? `${score}/10` : '—'}</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <div 
        className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${(score || 0) * 10}%` }}
      />
    </div>
  </div>
);

export default function CandidateComparison() {
  const [candidates, setCandidates] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [selectedIdA, setSelectedIdA] = useState("");
  const [selectedIdB, setSelectedIdB] = useState("");

  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      setListError(null);
      try {
        const res = await fetch(`${CANDIDATES_LIST_BASE}/candidates/`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Failed to load candidates (${res.status})`);
        }
        const data = await res.json();
        if (!cancelled) setCandidates(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setListError(e?.message || "Could not load candidates.");
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const candidateA = useMemo(() => candidates.find((c) => String(c.id) === String(selectedIdA)), [candidates, selectedIdA]);
  const candidateB = useMemo(() => candidates.find((c) => String(c.id) === String(selectedIdB)), [candidates, selectedIdB]);

  const runCompare = useCallback(async () => {
    setCompareError(null);
    setResult(null);

    if (!candidateA || !candidateB) {
      setCompareError("Select both Candidate A and Candidate B.");
      return;
    }
    if (String(candidateA.id) === String(candidateB.id)) {
      setCompareError("Choose two different candidates.");
      return;
    }

    setCompareLoading(true);
    try {
      const res = await fetch(`${CANDIDATES_LIST_BASE}/candidates/compare?candidate1_id=${candidateA.id}&candidate2_id=${candidateB.id}`, {
        method: "GET",
        headers: { Accept: "application/json" }
      });
      const text = await res.text();
      let data = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error(data?.detail || data?.message || "Compare failed");
      setResult(data);
    } catch (e) {
      console.error(e);
      setCompareError(e?.message || "Compare request failed.");
    } finally {
      setCompareLoading(false);
    }
  }, [candidateA, candidateB]);

  const winnerId = result?.stronger_candidate_id ? String(result.stronger_candidate_id) : null;
  const idA = candidateA ? String(candidateA.id) : "";
  const idB = candidateB ? String(candidateB.id) : "";
  
  const aWins = winnerId === idA;
  const bWins = winnerId === idB;
  const hasDecision = Boolean(result && winnerId && (aWins || bWins));

  const getCardClasses = (isWinner, isLoser) => {
    if (isWinner) {
      return "border-yellow-400 ring-4 ring-yellow-400/30 shadow-2xl z-10 scale-[1.02] bg-white";
    }
    if (isLoser) {
      return "border-slate-200 opacity-60 grayscale-[50%] scale-95 bg-slate-50";
    }
    return "border-slate-200 shadow-xl bg-white";
  };

  const renderCard = (candidate, isWinner, isLoser, scoreKey, sideBySideKey) => {
    if (!candidate) return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 text-slate-400">
        <span className="text-sm font-bold uppercase tracking-widest">Select Candidate</span>
      </div>
    );

    const apiScore = null; // Use original candidate score since API doesn't return new side_by_side breakdowns
    const techSkill = null;
    const probSolving = null;
    const comms = null;

    const strengths = candidate.strengths || [];
    const weaknesses = candidate.weaknesses || [];

    return (
      <div className={`relative flex flex-col rounded-[2.5rem] p-8 md:p-10 border-2 transition-all duration-700 ease-out ${getCardClasses(isWinner, isLoser)}`}>
        {isWinner && (
          <div className="absolute -top-5 right-6 bg-yellow-400 text-yellow-900 px-5 py-2 rounded-full font-black text-sm shadow-lg flex items-center gap-2 border-2 border-white">
            <CheckCircle size={18} /> RECOMMENDED HIRE
          </div>
        )}
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{candidate.name}</h3>
            <p className="text-slate-500 font-bold mt-1">{candidate.role}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Overall Score</p>
            <div className="text-4xl font-black tabular-nums text-indigo-600 bg-indigo-50 px-4 py-2 rounded-2xl">
              {apiScore != null ? apiScore.toFixed(1) : (candidate.overall_score || "—")}
            </div>
          </div>
        </div>

        <div className="space-y-8 flex-1">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Strengths</h4>
            {strengths.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {strengths.slice(0, 3).map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 shadow-sm">
                    + {s}
                  </span>
                ))}
              </div>
            ) : <p className="text-sm text-slate-400 font-medium">No top strengths recorded.</p>}
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Weaknesses</h4>
            {weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weaknesses.slice(0, 3).map((w, i) => (
                  <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100 shadow-sm">
                    - {w}
                  </span>
                ))}
              </div>
            ) : <p className="text-sm text-slate-400 font-medium">No major weaknesses.</p>}
          </div>

          {(result && result.side_by_side) && (
            <div className="pt-8 border-t border-slate-100">
               <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Detailed Breakdown</h4>
               <ScoreBar label="Technical Skill" score={techSkill} />
               <ScoreBar label="Problem Solving" score={probSolving} />
               <ScoreBar label="Communication" score={comms} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Top Controls Section */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex-1 w-full relative">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Candidate A</label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-3xl border-2 border-slate-100 bg-slate-50 py-4 pl-6 pr-12 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:ring-0 transition-colors"
                value={selectedIdA}
                onChange={(e) => { setSelectedIdA(e.target.value); setResult(null); }}
                disabled={listLoading}
              >
                <option value="">Select Candidate...</option>
                {candidates.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.role})</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center shrink-0 w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow-sm z-10 text-slate-400 font-black italic">
            VS
          </div>

          <div className="flex-1 w-full relative">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Candidate B</label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-3xl border-2 border-slate-100 bg-slate-50 py-4 pl-6 pr-12 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:ring-0 transition-colors"
                value={selectedIdB}
                onChange={(e) => { setSelectedIdB(e.target.value); setResult(null); }}
                disabled={listLoading}
              >
                <option value="">Select Candidate...</option>
                {candidates.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.role})</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={runCompare}
            disabled={compareLoading || !candidateA || !candidateB}
            className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-xl shadow-slate-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {compareLoading ? <Loader2 className="w-6 h-6 animate-spin relative z-10" /> : <Sparkles className="w-6 h-6 relative z-10" />}
            <span className="relative z-10">Run AI Comparison</span>
          </button>
        </div>

        {compareError && (
          <div className="mt-8 flex items-center justify-center gap-3 text-rose-600 bg-rose-50 px-6 py-4 rounded-2xl border border-rose-100 font-medium">
            <AlertCircle size={20} /> {compareError}
>>>>>>> origin/darshini-frontend
          </div>
        )}
      </div>

<<<<<<< HEAD
      {comparisonResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <Trophy size={40} className="text-yellow-100" />
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-widest font-semibold text-yellow-100 mb-1">Recommended Choice</h3>
              <p className="text-xl font-medium leading-relaxed">
                {comparisonResult.reasoning}
              </p>
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`transition-all duration-300 ${comparisonResult.stronger_candidate_id === comparisonResult.candidate_1.id ? 'ring-4 ring-yellow-400 rounded-2xl' : 'opacity-90'}`}>
              <SkillReport candidate={comparisonResult.candidate_1} />
            </div>
            <div className={`transition-all duration-300 ${comparisonResult.stronger_candidate_id === comparisonResult.candidate_2.id ? 'ring-4 ring-yellow-400 rounded-2xl' : 'opacity-90'}`}>
              <SkillReport candidate={comparisonResult.candidate_2} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateComparison;
=======
      {/* Comparison Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-stretch relative">
        {renderCard(candidateA, aWins, hasDecision && bWins, "candidate_a_score", "candidate_a")}
        
        {/* Mobile VS indicator */}
        <div className="md:hidden flex justify-center -my-6 relative z-10">
           <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black italic shadow-lg border-4 border-slate-50">VS</div>
        </div>

        {renderCard(candidateB, bWins, hasDecision && aWins, "candidate_b_score", "candidate_b")}
      </div>

      {/* AI Reasoning Section */}
      {result && result.reasoning && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem] p-10 md:p-14 border border-indigo-100/50 shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl mix-blend-multiply"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-white p-4 rounded-2xl text-indigo-600 shadow-sm border border-indigo-50">
                <Trophy size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Reasoning & Final Verdict</h3>
            </div>
            <p className="text-slate-700 text-lg md:text-xl leading-relaxed whitespace-pre-line font-medium">
              {result.reasoning}
            </p>
          </div>
        </div>
      )}
      
    </div>
  );
}
>>>>>>> origin/darshini-frontend
