import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Loader2, 
  BrainCircuit, 
  AlertCircle, 
  Terminal, 
  CheckCircle2, 
  ArrowLeft, 
  Award, 
  Activity, 
  Cpu, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { getApiErrorMessage, getCandidateDashboard, getAssessment } from '../../services/api';

export default function AIResults() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (assessmentId) {
          const data = await getAssessment(assessmentId);
          setAssessment(data);
        } else {
          // Fall back to dashboard
          const data = await getCandidateDashboard();
          setAssessment({
            id: data.assignment_id,
            status: data.submission_status,
            candidate: data.candidate,
            task: data.assigned_task
          });
        }
        setError('');
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load evaluation results'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  const candidate = assessment?.candidate;
  const isEvaluated = assessment?.status === 'Evaluated' || candidate?.status === 'Evaluated';

  if (!isEvaluated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-indigo-100/50 animate-ping"></div>
          <BrainCircuit size={48} className="relative z-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Results Yet</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          Complete your assigned technical task to receive an AI-powered evaluation of your performance.
        </p>
        <Link 
          to="/candidate/dashboard" 
          className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Norm values between 0 and 100 for bars
  const techScore = candidate?.technical_score || 0;
  const commScore = candidate?.communication_score || 0;
  const psScore = candidate?.problem_solving_score || 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/candidate/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assessment Evaluation</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Detailed breakdown of your AI-assessed performance.</p>
        </div>
        
        <span className="w-fit px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-center">
          <CheckCircle2 size={14} /> Evaluated
        </span>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {/* Hero Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-8 flex flex-col items-center justify-center text-white shadow-xl shadow-indigo-600/10 relative overflow-hidden min-h-[300px]">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BrainCircuit size={140} />
          </div>
          <div className="relative z-10 text-center">
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-3">Overall Score</p>
            <div className="relative inline-flex items-center justify-center">
              {/* Radial background effect */}
              <div className="absolute inset-0 bg-white/5 rounded-full scale-150 blur-sm"></div>
              <h2 className="text-7xl font-black relative z-10">{candidate?.overall_score || 0}<span className="text-2xl text-indigo-300">/100</span></h2>
            </div>
            
            <p className="mt-6 text-sm font-bold text-indigo-100/90 bg-white/10 px-4 py-2 rounded-2xl w-fit mx-auto">
              Recommendation: <span className="text-white font-black">{candidate?.hiring_recommendation || 'Evaluated'}</span>
            </p>
          </div>
        </div>

        {/* Structural Score Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Award className="text-indigo-600" size={20} />
              Performance Metrics
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Evaluation across core development competency areas.</p>
          </div>

          <div className="space-y-6">
            {/* Technical Score */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-2"><Cpu size={16} className="text-indigo-600" /> Technical Competency</span>
                <span>{techScore}/100</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${techScore}%` }}
                ></div>
              </div>
            </div>

            {/* Problem Solving Score */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-2"><Activity size={16} className="text-violet-600" /> Problem Solving</span>
                <span>{psScore}/100</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${psScore}%` }}
                ></div>
              </div>
            </div>

            {/* Communication Score */}
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-2"><MessageSquare size={16} className="text-fuchsia-600" /> Communication & Explanation</span>
                <span>{commScore}/100</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${commScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:border-indigo-100 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </span>
            Key Strengths
          </h3>
          {candidate?.strengths?.length > 0 ? (
            <ul className="space-y-4">
              {candidate.strengths.map((str, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <span className="text-emerald-500 font-black mt-0.5">•</span> {str}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-slate-400 italic font-medium">No strengths listed.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:border-indigo-100 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle size={18} />
            </span>
            Areas for Improvement
          </h3>
          {candidate?.weaknesses?.length > 0 ? (
            <ul className="space-y-4">
              {candidate.weaknesses.map((wk, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <span className="text-amber-500 font-black mt-0.5">•</span> {wk}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-slate-400 italic font-medium">No improvements listed.</p>
          )}
        </div>
      </div>

      {/* Skill Authenticity & Gaps Panel */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 shadow-sm hover:border-indigo-100 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BrainCircuit size={18} />
              </span>
              Resume Claims vs. Coding Proof
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-medium font-sans">AI-driven cross-reference of your resume claims against sandbox execution.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            {/* SVG Radial Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-slate-200 fill-none" strokeWidth="6" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="stroke-indigo-600 fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="6"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * (candidate?.skill_authenticity_score || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-black text-slate-800">{candidate?.skill_authenticity_score || 0}%</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authenticity Match</p>
              <p className="text-sm font-black text-slate-700">
                {(candidate?.skill_authenticity_score || 0) >= 90 ? 'Excellent Match' :
                 (candidate?.skill_authenticity_score || 0) >= 70 ? 'High Authenticity' :
                 (candidate?.skill_authenticity_score || 0) >= 50 ? 'Moderate Gaps' : 'Significant Gaps'}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Claimed Skill vs. Task Reality</h4>
            
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Skill</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Claimed</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Proven</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(candidate?.resume_skills || {}).map(([skill, claimedLvl]) => {
                    const provenLvl = (candidate?.proven_skills || {})[skill] || 'Junior';
                    const levelVal = { 'Junior': 1, 'Intermediate': 2, 'Advanced': 3 };
                    const claimedVal = levelVal[claimedLvl] || 2;
                    const provenVal = levelVal[provenLvl] || 2;

                    let statusBadge = null;
                    if (claimedVal === provenVal) {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                          <CheckCircle2 size={12} /> Verified Match
                        </span>
                      );
                    } else if (claimedVal > provenVal) {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
                          <AlertCircle size={12} /> Overclaimed
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 shadow-sm shadow-emerald-100/50 animate-pulse">
                          <Sparkles size={12} className="text-emerald-500" /> Hidden Talent!
                        </span>
                      );
                    }

                    return (
                      <tr key={skill} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-sm font-bold text-slate-900">{skill}</td>
                        <td className="p-4 text-sm font-medium text-slate-500">{claimedLvl}</td>
                        <td className="p-4 text-sm font-bold text-indigo-600">{provenLvl}</td>
                        <td className="p-4">{statusBadge}</td>
                      </tr>
                    );
                  })}
                  {Object.keys(candidate?.resume_skills || {}).length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-sm text-slate-400 italic">No skills verified yet. Update your resume to cross-reference coding tasks.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Growth Board Panel */}
          <div className="lg:col-span-1 bg-slate-50/50 rounded-2xl border border-slate-100 p-6 flex flex-col">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <Activity size={14} className="text-indigo-600" /> Growth Board
            </h4>
            
            {candidate?.growth_nudges?.length > 0 ? (
              <div className="space-y-4 overflow-y-auto max-h-[320px] pr-1">
                {candidate.growth_nudges.map((nudge, i) => {
                  const isHiddenTalent = nudge.includes('Hidden Talent');
                  return (
                    <div 
                      key={i} 
                      className={`p-3.5 rounded-xl border text-xs font-medium leading-relaxed transition-all duration-300 shadow-sm ${
                        isHiddenTalent 
                          ? 'bg-emerald-50/40 border-emerald-200/60 text-emerald-800' 
                          : 'bg-white border-slate-200/60 text-slate-600'
                      }`}
                    >
                      <p className="font-bold mb-1 flex items-center gap-1">
                        {isHiddenTalent ? (
                          <>
                            <Sparkles size={12} className="text-emerald-500 animate-spin-slow" />
                            Hidden Talent nudge
                          </>
                        ) : (
                          <>
                            <Cpu size={12} className="text-indigo-500" />
                            Growth Nudge
                          </>
                        )}
                      </p>
                      {nudge}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">done_all</span>
                <p className="text-xs text-slate-400 italic">Perfect alignment! No coding skill gaps or recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Detailed Feedback */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-400">
          <Sparkles size={160} />
        </div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Terminal className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">AI Synthesis & Recommendations</h3>
        </div>
        <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base relative z-10 font-medium">
          {candidate?.ai_feedback || "No AI evaluation generated yet."}
        </p>
      </div>
    </div>
  );
}
