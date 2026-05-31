import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ArrowRight, Sparkles, Gem, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const CANDIDATES_LIST_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

const authHeaders = () => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("authToken") || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ScoreRing = ({ score }) => {
  const normalized = score != null ? (score > 10 ? score / 10 : score) : 0;
  const percentage = (normalized / 10) * 100;
  const circumference = 2 * Math.PI * 26; // r=26
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
        <circle cx="32" cy="32" r="26" fill="white" stroke="#f1f5f9" strokeWidth="6" />
        <circle 
          cx="32" cy="32" r="26" 
          fill="none" 
          stroke="url(#purpleGradient)" 
          strokeWidth="6" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
          className="transition-all duration-1500 ease-out" 
        />
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-slate-800 text-lg leading-none">{normalized.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default function HiddenTalents() {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTalents = async () => {
      try {
        const res = await fetch(`${CANDIDATES_LIST_BASE}/candidates/hidden-talents`, {
          headers: { Accept: "application/json", ...authHeaders() },
        });
        if (!res.ok) throw new Error("Failed to fetch hidden talents");
        const data = await res.json();
        if (!cancelled) {
          setTalents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTalents();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-full mb-2 shadow-inner">
           <Gem size={40} className="text-purple-600" fill="currentColor" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500">Hidden Talents</span> Detected
        </h2>
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          Strong performers with non-traditional backgrounds who might be overlooked by standard screening.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white/50 rounded-[3rem] border border-slate-100 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          <p className="text-purple-900 font-bold tracking-wide">Scanning pipeline for hidden gems...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center gap-3 text-rose-600 bg-rose-50 px-8 py-6 rounded-[2rem] border border-rose-100 font-bold max-w-2xl mx-auto shadow-sm">
          <AlertCircle size={24} /> 
          <p>{error}</p>
        </div>
      ) : talents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-4 border-slate-100">
            <Gem size={40} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-400">No hidden talents detected yet</h3>
          <p className="text-slate-500 font-medium">We'll keep analyzing new candidates as they apply.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-10">
          {talents.map((candidate) => (
            <div key={candidate.id} className="relative group">
              {/* Animated Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 rounded-[3rem] blur-md opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-pulse"></div>
              
              {/* Card Content */}
              <div className="relative h-full bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100/50 shadow-xl flex flex-col justify-between overflow-hidden">
                
                {/* Background decorative flair */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="pr-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-md mb-4 shadow-purple-500/30">
                        <Sparkles size={14} /> Hidden Talent
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2 group-hover:text-purple-900 transition-colors">
                        {candidate.name}
                      </h3>
                      <p className="text-slate-500 font-bold text-sm md:text-base">
                        {candidate.role || "Candidate"}
                      </p>
                    </div>
                    <ScoreBadge score={candidate.overall_score} />
                  </div>

                  <div className="bg-purple-50/80 rounded-2xl p-6 border border-purple-100/50 mb-8 relative">
                    <div className="absolute top-0 left-6 -mt-3 bg-white px-2 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                      AI Discovery
                    </div>
                    <p className="text-purple-900 font-medium leading-relaxed italic relative z-10">
                      "{candidate.hidden_talent_reason || "Demonstrates exceptional problem-solving capabilities despite lacking standard industry prerequisites."}"
                    </p>
                  </div>

                  {candidate.strengths && candidate.strengths.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Award size={14} /> Key Strengths
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.strengths.slice(0, 4).map((s, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                            <Star size={12} className="text-amber-400" fill="currentColor" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link 
                  to={`/candidate/${candidate.id}`}
                  className="mt-4 w-full group/btn relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/25"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    View Full Report <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Temporary alias for ScoreRing so it can be used inside the component without redefining
const ScoreBadge = ScoreRing;
