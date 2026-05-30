import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckSquare, ChevronRight, ShieldCheck } from 'lucide-react';

export default function CandidateCard({ candidate }) {
  const name = candidate?.name || "Unknown Candidate";
  const role = candidate?.role || "Position Not Specified";
  const status = candidate?.status || "Not Attended";
  const overallScore = candidate?.overall_score || 0;
  const recommendation = candidate?.hiring_recommendation || "Pending";
  const riskLevel = candidate?.plagiarism_risk_level || "Unknown";
  const id = candidate?.id;
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'C';

  const riskClasses = {
    Low: 'bg-teal-50 text-teal-800 border-teal-100',
    Medium: 'bg-amber-50 text-amber-800 border-amber-100',
    High: 'bg-rose-50 text-rose-700 border-rose-100',
    Unknown: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const recommendationText = recommendation === 'Pending' ? 'Needs review' : recommendation;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-700/40 hover:shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-[#071b3a]">{name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Briefcase size={14} /> {role}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-[#f8faff] px-3 py-2 text-right">
          <p className="text-lg font-semibold leading-none text-[#071b3a]">{overallScore || '--'}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Task score</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-[#f8faff] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <CheckSquare size={14} />
            Stage
          </div>
          <p className="mt-2 text-sm font-semibold text-[#071b3a]">{status}</p>
        </div>
        <div className={`rounded-xl border p-3 ${riskClasses[riskLevel] || riskClasses.Unknown}`}>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <ShieldCheck size={14} />
            Authenticity
          </div>
          <p className="mt-2 text-sm font-semibold">{riskLevel}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-sm font-medium text-slate-500">{recommendationText}</p>
        <Link
          to={`/candidate/${id}`}
          className="inline-flex items-center gap-1 rounded-lg bg-[#071b3a] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b2a55]"
        >
          Review proof
          <ChevronRight size={14} />
        </Link>
      </div>
    </article>
  );
}
