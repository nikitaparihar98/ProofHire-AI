import React, { useState, useEffect } from 'react';
import { ArrowLeft, GitCompare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCandidates, compareCandidates } from '../services/api';
import CandidateCard from '../components/CandidateCard';
import ProgressBar from '../components/ProgressBar';
import StrengthWeaknessSection from '../components/StrengthWeaknessSection';
import ScoreBadge from '../components/ScoreBadge';
import AuthenticityBadge from '../components/AuthenticityBadge';

export default function CompareCandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');
  
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all candidates for the dropdowns
<<<<<<< HEAD
    getCandidates().then(data => {
      setCandidates(Array.isArray(data) && data.length > 0 ? data : getMockCandidates());
    }).catch(err => {
      console.warn("Backend not connected, using mock candidates.");
      setCandidates(getMockCandidates());
    });
  }, []);

  const getMockCandidates = () => [
    { id: '1', name: "Alice Johnson", role: "Frontend Engineer", overall_score: 95 },
    { id: '2', name: "Bob Smith", role: "Backend Developer", overall_score: 88 }
  ];

=======
    getCandidates().then(setCandidates).catch(err => console.error(err));
  }, []);

>>>>>>> origin/geshna-backend
  const handleCompare = async () => {
    if (!selected1 || !selected2) {
      setError("Please select two candidates to compare.");
      return;
    }
    if (selected1 === selected2) {
      setError("Please select two different candidates.");
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      const data = await compareCandidates(selected1, selected2);
      setComparisonResult(data);
    } catch (err) {
<<<<<<< HEAD
      console.warn("Backend not connected, using mock comparison result.");
      // Dummy comparison result for UI preview
      const c1 = candidates.find(c => c.id === selected1) || candidates[0];
      const c2 = candidates.find(c => c.id === selected2) || candidates[1];
      
      setComparisonResult({
        reasoning: `Based on the AI analysis, ${c1.name} shows stronger technical alignment for the required role compared to ${c2.name}.`,
        stronger_candidate_id: c1.id,
        candidate_1: {
          id: c1.id,
          name: c1.name,
          role: c1.role,
          overall_score: c1.overall_score || 95,
          hiring_recommendation: "Strong Hire",
          strengths: ["Excellent React knowledge", "Strong problem solving"],
          weaknesses: ["Less experience with CI/CD"],
          plagiarism_risk_level: "Low",
          originality_score: 98,
          ai_generated_suspicion: 2,
          malpractice_flags: []
        },
        candidate_2: {
          id: c2.id,
          name: c2.name,
          role: c2.role,
          overall_score: c2.overall_score || 88,
          hiring_recommendation: "Hire",
          strengths: ["Solid understanding of APIs", "Good team player"],
          weaknesses: ["Needs improvement in advanced CSS"],
          plagiarism_risk_level: "Medium",
          originality_score: 85,
          ai_generated_suspicion: 15,
          malpractice_flags: []
        }
      });
=======
      setError("Failed to run comparison. Ensure backend is running.");
      console.error(err);
>>>>>>> origin/geshna-backend
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <GitCompare className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Compare Candidates</h1>
            <p className="text-slate-500 text-sm">Select two candidates to run an AI-powered side-by-side comparison.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center gap-2">
             <AlertCircle className="w-5 h-5" />
             {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Candidate 1</label>
            <select
              className="block w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 shadow-sm"
              value={selected1}
              onChange={(e) => setSelected1(e.target.value)}
            >
              <option value="">Select Candidate A...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role} - {c.overall_score})</option>
              ))}
            </select>
          </div>
          
          <div className="hidden md:flex text-slate-400 font-bold px-2 py-2.5">VS</div>

          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Candidate 2</label>
            <select
              className="block w-full py-2.5 px-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-900 shadow-sm"
              value={selected2}
              onChange={(e) => setSelected2(e.target.value)}
            >
              <option value="">Select Candidate B...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.role} - {c.overall_score})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex-shrink-0"
          >
            {loading ? "Comparing..." : "Run Comparison"}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {comparisonResult && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* AI Decision Box */}
          <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-lg border border-indigo-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <GitCompare className="w-32 h-32" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-xl text-indigo-200 font-medium mb-2">AI Recommendation</h2>
              <p className="text-lg leading-relaxed">
                {comparisonResult.reasoning}
              </p>
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Candidate 1 Column */}
            <div className={`space-y-6 p-6 rounded-2xl border-2 transition-colors ${comparisonResult.stronger_candidate_id === comparisonResult.candidate_1.id ? 'border-emerald-500 bg-emerald-50/30 shadow-emerald-100/50 shadow-lg' : 'border-slate-200 bg-white'}`}>
               {comparisonResult.stronger_candidate_id === comparisonResult.candidate_1.id && (
                  <div className="bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-block mb-2">Stronger Match</div>
               )}
               <div className="pb-4 border-b border-slate-100 flex justify-between items-start">
                 <div>
                   <h3 className="text-2xl font-bold text-slate-900">{comparisonResult.candidate_1.name}</h3>
                   <p className="text-slate-500">{comparisonResult.candidate_1.role}</p>
                 </div>
                 <ScoreBadge recommendation={comparisonResult.candidate_1.hiring_recommendation} score={comparisonResult.candidate_1.overall_score} />
               </div>
               
               <ProgressBar score={comparisonResult.candidate_1.overall_score} label="Overall Score" />
               
               <StrengthWeaknessSection 
                  strengths={comparisonResult.candidate_1.strengths} 
                  weaknesses={comparisonResult.candidate_1.weaknesses} 
                />

               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mt-4">
                 <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="font-semibold text-slate-700 text-sm">Authenticity Risk</span>
                    <AuthenticityBadge riskLevel={comparisonResult.candidate_1.plagiarism_risk_level} />
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Originality</span>
                   <span className="font-medium text-slate-900">{comparisonResult.candidate_1.originality_score}%</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">AI Suspicion</span>
                   <span className="font-medium text-slate-900">{comparisonResult.candidate_1.ai_generated_suspicion}%</span>
                 </div>
                 {comparisonResult.candidate_1.malpractice_flags?.length > 0 && (
                   <div className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded">
                     {comparisonResult.candidate_1.malpractice_flags.length} Flag(s) Detected
                   </div>
                 )}
               </div>
               
               <Link to={`/candidate/${comparisonResult.candidate_1.id}`} className="block text-center w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors mt-4">
                  View Full Report
               </Link>
            </div>

            {/* Candidate 2 Column */}
            <div className={`space-y-6 p-6 rounded-2xl border-2 transition-colors ${comparisonResult.stronger_candidate_id === comparisonResult.candidate_2.id ? 'border-emerald-500 bg-emerald-50/30 shadow-emerald-100/50 shadow-lg' : 'border-slate-200 bg-white'}`}>
               {comparisonResult.stronger_candidate_id === comparisonResult.candidate_2.id && (
                  <div className="bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-block mb-2">Stronger Match</div>
               )}
               <div className="pb-4 border-b border-slate-100 flex justify-between items-start">
                 <div>
                   <h3 className="text-2xl font-bold text-slate-900">{comparisonResult.candidate_2.name}</h3>
                   <p className="text-slate-500">{comparisonResult.candidate_2.role}</p>
                 </div>
                 <ScoreBadge recommendation={comparisonResult.candidate_2.hiring_recommendation} score={comparisonResult.candidate_2.overall_score} />
               </div>
               
               <ProgressBar score={comparisonResult.candidate_2.overall_score} label="Overall Score" />
               
               <StrengthWeaknessSection 
                  strengths={comparisonResult.candidate_2.strengths} 
                  weaknesses={comparisonResult.candidate_2.weaknesses} 
                />

               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 mt-4">
                 <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="font-semibold text-slate-700 text-sm">Authenticity Risk</span>
                    <AuthenticityBadge riskLevel={comparisonResult.candidate_2.plagiarism_risk_level} />
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Originality</span>
                   <span className="font-medium text-slate-900">{comparisonResult.candidate_2.originality_score}%</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">AI Suspicion</span>
                   <span className="font-medium text-slate-900">{comparisonResult.candidate_2.ai_generated_suspicion}%</span>
                 </div>
                 {comparisonResult.candidate_2.malpractice_flags?.length > 0 && (
                   <div className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded">
                     {comparisonResult.candidate_2.malpractice_flags.length} Flag(s) Detected
                   </div>
                 )}
               </div>

               <Link to={`/candidate/${comparisonResult.candidate_2.id}`} className="block text-center w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors mt-4">
                  View Full Report
               </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
