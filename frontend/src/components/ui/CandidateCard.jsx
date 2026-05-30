import React from 'react';
import { UserCircle, Briefcase, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateCard = ({ candidate, rank }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 p-2 rounded-full text-teal-600">
            <UserCircle size={28} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900">{candidate.name}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Briefcase size={14} />
              <span>{candidate.role}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-medium text-slate-800">{candidate.overall_score.toFixed(1)}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Score</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Award size={16} className={
          candidate.hiring_recommendation === 'Strong Hire' ? 'text-emerald-600' :
            candidate.hiring_recommendation === 'Hire' ? 'text-teal-600' : 'text-rose-500'
        } />
        <span className={`text-sm font-medium ${candidate.hiring_recommendation === 'Strong Hire' ? 'text-emerald-700 bg-emerald-50' :
            candidate.hiring_recommendation === 'Hire' ? 'text-teal-700 bg-teal-50' : 'text-rose-700 bg-rose-50'
          } px-2 py-1 rounded-md`}>
          {candidate.hiring_recommendation}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
        <span className="text-sm font-medium text-slate-500">Rank #{rank}</span>
        <Link
          to={`/candidate/${candidate.id}`}
          className="text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors"
        >
          View Report &rarr;
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;
