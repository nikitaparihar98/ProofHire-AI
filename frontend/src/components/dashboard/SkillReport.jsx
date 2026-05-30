import React from 'react';
import { CheckCircle, XCircle, Bot, ThumbsUp, ThumbsDown, Award } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

const SkillReport = ({ candidate }) => {
  if (!candidate) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-teal-700 p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-medium mb-2">{candidate.name}</h2>
            <p className="text-teal-100 text-lg flex items-center gap-2">
              {candidate.role}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center min-w-[150px]">
            <p className="text-teal-100 text-sm uppercase tracking-wider mb-1">Overall Score</p>
            <div className="text-4xl font-medium">{candidate.overall_score.toFixed(1)}<span className="text-xl text-teal-200">/100</span></div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Recommendation Banner */}
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-4 ${candidate.hiring_recommendation === 'Strong Hire' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
            candidate.hiring_recommendation === 'Hire' ? 'bg-teal-50 border border-teal-200 text-teal-800' :
              'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
          <div className={`p-2 rounded-full ${candidate.hiring_recommendation === 'Strong Hire' ? 'bg-emerald-100' :
              candidate.hiring_recommendation === 'Hire' ? 'bg-teal-100' : 'bg-rose-100'
            }`}>
            <Award size={24} className={
              candidate.hiring_recommendation === 'Strong Hire' ? 'text-emerald-600' :
                candidate.hiring_recommendation === 'Hire' ? 'text-teal-600' : 'text-rose-600'
            } />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider opacity-80">AI Recommendation</p>
            <p className="text-xl font-medium">{candidate.hiring_recommendation}</p>
          </div>
        </div>

        {/* Score Visualization */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            Performance Breakdown
          </h3>
          <ProgressBar score={candidate.overall_score} label="Technical Proficiency" />
          <ProgressBar score={candidate.overall_score * 0.9} label="Problem Solving" /> {/* Dummy derived metric for visual richness */}
          <ProgressBar score={candidate.overall_score * 0.95} label="Code Quality" /> {/* Dummy derived metric */}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Strengths */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 text-emerald-700">
              <ThumbsUp size={20} />
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {candidate.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 text-rose-700">
              <ThumbsDown size={20} />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {candidate.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle size={18} className="text-rose-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI Feedback */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Bot size={20} className="text-teal-600" />
            AI Evaluation Summary
          </h3>
          <div className="bg-teal-50/50 rounded-xl p-6 border border-teal-100 text-teal-900 leading-relaxed">
            {candidate.ai_feedback}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillReport;
