import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Briefcase } from 'lucide-react';

import ScoreBadge from './ScoreBadge';
import ProgressBar from './ProgressBar';
import AuthenticityBadge from './AuthenticityBadge';

export default function CandidateCard({ candidate }) {
  const name = candidate?.name || "Unknown Candidate";
  const role = candidate?.role || "Position Not Specified";
  const status = candidate?.status || "Not Attended";
  const overallScore = candidate?.overall_score || 0;
  const recommendation = candidate?.hiring_recommendation || "Pending";
  const riskLevel = candidate?.plagiarism_risk_level || "Unknown";
  const id = candidate?.id;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Briefcase size={14} /> {role}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <ScoreBadge recommendation={recommendation} score={overallScore} />
          <AuthenticityBadge riskLevel={riskLevel} />
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-500">
        Status: <span className="font-semibold">{status}</span>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/candidate/${id}`}
          className="px-3 py-2 bg-slate-100 rounded-lg text-sm"
        >
          View Profile
        </Link>
      </div>

    </div>
  );
}