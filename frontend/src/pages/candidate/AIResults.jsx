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
        <Loader2 className="h-12 w-12 animate-spin text-teal-700" />
      </div>
    );
  }

  const candidate = assessment?.candidate;
  const isEvaluated = assessment?.status === 'Evaluated' || candidate?.status === 'Evaluated';

  if (!isEvaluated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 text-teal-800">
          <div className="absolute inset-0 rounded-full bg-teal-100/50 animate-ping"></div>
          <BrainCircuit size={48} className="relative z-10" />
        </div>
        <h2 className="mb-3 text-3xl font-semibold tracking-tight text-[#071b3a]">No results yet</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          Complete your assigned technical task to receive an AI-powered evaluation of your performance.
        </p>
        <Link 
          to="/candidate/dashboard" 
          className="mt-8 flex items-center gap-2 rounded-xl bg-[#071b3a] px-6 py-3 font-semibold text-white transition hover:bg-[#0b2a55]"
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
          <Link to="/candidate/dashboard" className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-teal-800">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-[#071b3a]">Assessment evaluation</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Detailed breakdown of your AI-assessed performance.</p>
        </div>
        
        <span className="flex w-fit items-center gap-1.5 self-start rounded-2xl border border-teal-100 bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-teal-800 sm:self-center">
          <CheckCircle2 size={14} /> Evaluated
        </span>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Hero Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-[#071b3a] shadow-sm lg:col-span-1">
          <div className="absolute right-0 top-0 p-8 text-teal-700 opacity-10">
            <BrainCircuit size={140} />
          </div>
          <div className="relative z-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Overall score</p>
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 scale-150 rounded-full bg-teal-50 blur-sm"></div>
              <h2 className="relative z-10 text-7xl font-semibold">{candidate?.overall_score || 0}<span className="text-2xl text-slate-400">/100</span></h2>
            </div>
            
            <p className="mx-auto mt-6 w-fit rounded-2xl bg-[#f8faff] px-4 py-2 text-sm font-semibold text-slate-600">
              Recommendation: <span className="font-semibold text-[#071b3a]">{candidate?.hiring_recommendation || 'Evaluated'}</span>
            </p>
          </div>
        </div>

        {/* Structural Score Breakdown */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">
          <div>
            <h3 className="mb-1 flex items-center gap-2 text-xl font-semibold text-[#071b3a]">
              <Award className="text-teal-800" size={20} />
              Performance metrics
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">Evaluation across core development competency areas.</p>
          </div>

          <div className="space-y-6">
            {/* Technical Score */}
            <div>
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2"><Cpu size={16} className="text-teal-800" /> Technical competency</span>
                <span>{techScore}/100</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-teal-700 transition-all duration-1000"
                  style={{ width: `${techScore}%` }}
                ></div>
              </div>
            </div>

            {/* Problem Solving Score */}
            <div>
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2"><Activity size={16} className="text-[#071b3a]" /> Problem solving</span>
                <span>{psScore}/100</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#071b3a] transition-all duration-1000"
                  style={{ width: `${psScore}%` }}
                ></div>
              </div>
            </div>

            {/* Communication Score */}
            <div>
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2"><MessageSquare size={16} className="text-amber-700" /> Communication & explanation</span>
                <span>{commScore}/100</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-amber-600 transition-all duration-1000"
                  style={{ width: `${commScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors hover:border-teal-700/40">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#071b3a]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              <CheckCircle2 size={18} />
            </span>
            Key Strengths
          </h3>
          {candidate?.strengths?.length > 0 ? (
            <ul className="space-y-4">
              {candidate.strengths.map((str, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <span className="mt-0.5 font-semibold text-teal-700">•</span> {str}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-slate-400 italic font-medium">No strengths listed.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors hover:border-teal-700/40">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#071b3a]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <AlertCircle size={18} />
            </span>
            Areas for Improvement
          </h3>
          {candidate?.weaknesses?.length > 0 ? (
            <ul className="space-y-4">
              {candidate.weaknesses.map((wk, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600 font-medium">
                  <span className="mt-0.5 font-semibold text-amber-600">•</span> {wk}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-slate-400 italic font-medium">No improvements listed.</p>
          )}
        </div>
      </div>

      {/* Skill Authenticity & Gaps Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors hover:border-teal-700/40 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6 mb-8">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold text-[#071b3a]">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                <BrainCircuit size={18} />
              </span>
              Resume Claims vs. Coding Proof
            </h3>
            <p className="mt-1 font-sans text-sm font-medium text-slate-500">Cross-reference of your resume claims against task evidence.</p>
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
                  className="fill-none stroke-teal-700 transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 - (175.9 * (candidate?.skill_authenticity_score || 0)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-semibold text-[#071b3a]">{candidate?.skill_authenticity_score || 0}%</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Authenticity match</p>
              <p className="text-sm font-semibold text-slate-700">
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
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Skill</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Claimed</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Proven</th>
                    <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Analysis</th>
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
                        <span className="inline-flex items-center gap-1 rounded-lg border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                          <CheckCircle2 size={12} /> Verified Match
                        </span>
                      );
                    } else if (claimedVal > provenVal) {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <AlertCircle size={12} /> Overclaimed
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 rounded-lg border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 shadow-sm">
                          <Sparkles size={12} className="text-teal-700" /> Hidden Talent!
                        </span>
                      );
                    }

                    return (
                      <tr key={skill} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-sm font-semibold text-[#071b3a]">{skill}</td>
                        <td className="p-4 text-sm font-medium text-slate-500">{claimedLvl}</td>
                        <td className="p-4 text-sm font-semibold text-teal-800">{provenLvl}</td>
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
          <div className="flex flex-col rounded-2xl border border-slate-100 bg-[#f8faff] p-6 lg:col-span-1">
            <h4 className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Activity size={14} className="text-teal-800" /> Growth board
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
                          ? 'bg-teal-50 border-teal-100 text-teal-800'
                          : 'bg-white border-slate-200/60 text-slate-600'
                      }`}
                    >
                      <p className="font-bold mb-1 flex items-center gap-1">
                        {isHiddenTalent ? (
                          <>
                            <Sparkles size={12} className="text-teal-700" />
                            Hidden Talent nudge
                          </>
                        ) : (
                          <>
                            <Cpu size={12} className="text-teal-800" />
                            Growth nudge
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
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="absolute right-0 top-0 p-8 text-teal-700 opacity-5">
          <Sparkles size={160} />
        </div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Terminal className="h-6 w-6 text-teal-800" />
          <h3 className="text-xl font-semibold text-[#071b3a]">Evaluation summary and recommendations</h3>
        </div>
        <p className="relative z-10 whitespace-pre-line text-base font-medium leading-relaxed text-slate-600">
          {candidate?.ai_feedback || "No AI evaluation generated yet."}
        </p>
      </div>
    </div>
  );
}
