import React from "react";
import { ArrowLeft, GitCompare } from "lucide-react";
import { Link } from "react-router-dom";
import CandidateComparison from "../components/dashboard/CandidateComparison";

export default function CompareCandidatesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <header className="flex flex-wrap items-start gap-3">
        <div className="rounded-lg bg-indigo-100 p-2">
          <GitCompare className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compare candidates</h1>
          <p className="text-sm text-slate-500">
            AI comparison uses{" "}
            <code className="rounded bg-slate-100 px-1 text-xs">POST /compare</code> on
            your RecruitAI API (see env hints inside the form).
          </p>
        </div>
      </header>

      <CandidateComparison />
    </div>
  );
}
