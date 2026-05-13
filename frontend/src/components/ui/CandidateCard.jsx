import React from 'react';
import { UserCircle, Briefcase, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateCard = ({ candidate, rank }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-full text-blue-600">
            <UserCircle size={28} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{candidate.name}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Briefcase size={14} />
              <span>{candidate.role}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-gray-800">{candidate.overall_score.toFixed(1)}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Score</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Award size={16} className={
          candidate.hiring_recommendation === 'Strong Hire' ? 'text-green-600' :
            candidate.hiring_recommendation === 'Hire' ? 'text-blue-600' : 'text-red-500'
        } />
        <span className={`text-sm font-medium ${candidate.hiring_recommendation === 'Strong Hire' ? 'text-green-700 bg-green-50' :
            candidate.hiring_recommendation === 'Hire' ? 'text-blue-700 bg-blue-50' : 'text-red-700 bg-red-50'
          } px-2 py-1 rounded-md`}>
          {candidate.hiring_recommendation}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-500">Rank #{rank}</span>
        <Link
          to={`/candidate/${candidate.id}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Report &rarr;
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;
