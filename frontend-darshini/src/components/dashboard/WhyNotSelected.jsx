import React, { useState, useEffect, useMemo } from "react";
import { Loader2, AlertCircle, Copy, Check, MessageSquare, Target, Zap, TrendingUp, Sparkles } from "lucide-react";

/** Base for POST /why-not-selected */
const CANDIDATES_LIST_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

const authHeaders = () => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("authToken") || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function candidateToSubmissionPayload(c) {
  const submissionText =
    (typeof c.submission_data?.submission_text === "string" && c.submission_data.submission_text) ||
    (typeof c.ai_feedback === "string" && c.ai_feedback.length >= 10 ? c.ai_feedback : null) ||
    (c.submission_data && Object.keys(c.submission_data).length
      ? JSON.stringify(c.submission_data, null, 2)
      : `Submission placeholder for candidate ${c.id}.`);

  return {
    candidate_id: String(c.id),
    candidate_name: c.name || "Unknown",
    role: String(c.role || "").toLowerCase().replace(/\s+/g, "_") || "software_engineer",
    task_id: String(c.submission_data?.task_id || `task-${c.id}`),
    submission_text: submissionText.padEnd(12, "."),
  };
}

export default function WhyNotSelected() {
  const [candidates, setCandidates] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      try {
        const res = await fetch(`${CANDIDATES_LIST_BASE}/candidates/`, {
          headers: { Accept: "application/json", ...authHeaders() },
        });
        if (!res.ok) throw new Error("Failed to load candidates");
        const data = await res.json();
        // Only keep candidates with score < 6 or (overall_score < 60 assuming 100 scale)
        if (!cancelled) {
          const arr = Array.isArray(data) ? data : [];
          setCandidates(arr.filter(c => {
             const score = c.overall_score;
             // If score is on a 0-10 scale, < 6. If on 0-100 scale, < 60.
             return score != null && (score <= 10 ? score < 6 : score < 60);
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selectedCandidate = useMemo(() => candidates.find((c) => String(c.id) === String(selectedId)), [candidates, selectedId]);

  const generateExplanation = async () => {
    if (!selectedCandidate) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const body = candidateToSubmissionPayload(selectedCandidate);
      const res = await fetch(`${CANDIDATES_LIST_BASE}/candidates/why-not-selected`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let data = text ? JSON.parse(text) : null;
      if (!res.ok) throw new Error(data?.detail || data?.message || "Failed to generate explanation");
      
      // Fallback in case API returns unexpected structure
      setResult({
        explanation: data?.explanation || data?.message || "We carefully reviewed your profile but decided to move forward with other candidates.",
        improvement_areas: Array.isArray(data?.improvement_areas) ? data.improvement_areas : [
           data?.improvement_1 || "Focus on core technical depth.",
           data?.improvement_2 || "Improve problem-solving speed.",
           data?.improvement_3 || "Enhance system design communication."
        ],
        encouragement: data?.encouragement || "Keep building and learning! We would love to stay in touch for future roles."
      });
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to contact API.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result || !selectedCandidate) return;
    const text = `Feedback for ${selectedCandidate.name}\n\n${result.explanation}\n\nAreas for Improvement:\n1. ${result.improvement_areas[0]}\n2. ${result.improvement_areas[1]}\n3. ${result.improvement_areas[2]}\n\n${result.encouragement}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const icons = [Target, Zap, TrendingUp];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
            <MessageSquare size={24} />
          </div>
          <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generate Rejection Feedback</h2>
             <p className="text-slate-500 font-medium">Select a candidate who scored below 6 to generate a compassionate explanation.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Select Candidate</label>
            <select
              className="w-full appearance-none rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 px-6 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:ring-0 transition-colors"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={listLoading || candidates.length === 0}
            >
              <option value="">{listLoading ? "Loading candidates..." : "Select a candidate..."}</option>
              {candidates.map((c) => <option key={c.id} value={c.id}>{c.name} (Score: {c.overall_score})</option>)}
            </select>
          </div>
          <button
            onClick={generateExplanation}
            disabled={loading || !selectedCandidate}
            className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100 text-sm font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-100">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Feedback for {selectedCandidate?.name}</h3>
              <p className="text-slate-500 text-sm font-bold mt-1">AI-generated compassionate response</p>
            </div>
            <button
              onClick={copyToClipboard}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${copied ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>

          <div className="space-y-10">
            <div className="prose prose-slate max-w-none text-slate-700 text-lg leading-relaxed font-medium">
               <p>{result.explanation}</p>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Key Improvement Areas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.improvement_areas.slice(0, 3).map((area, idx) => {
                  const Icon = icons[idx % icons.length];
                  return (
                    <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Icon size={100} />
                      </div>
                      <div className="bg-indigo-100 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 font-black mb-4 shadow-sm relative z-10">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 font-bold leading-snug relative z-10">
                        {area}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100/50 relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-400"></div>
               <p className="text-emerald-800 text-lg font-bold italic leading-relaxed pl-4">
                 "{result.encouragement}"
               </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
