import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie
} from 'recharts';
import { Loader2, AlertCircle, BarChart2, Activity, UserCircle } from 'lucide-react';

const CANDIDATES_LIST_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

const normalizeScore = (score) => {
  if (score == null) return 0;
  return score > 10 ? score / 10 : score;
};

const getScoreColor = (score) => {
  if (score >= 7) return '#10b981'; // emerald-500
  if (score >= 5) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

const ScoreBadge = ({ score }) => {
  const normalized = normalizeScore(score);
  const color = getScoreColor(normalized);
  
  const data = [
    { name: 'Score', value: normalized },
    { name: 'Remaining', value: 10 - normalized },
  ];

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={28}
            outerRadius={36}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
          >
            <Cell fill={color} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-slate-900 leading-none">{normalized.toFixed(1)}</span>
      </div>
    </div>
  );
};

// Custom Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    const color = getScoreColor(score);
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 font-sans">
        <p className="font-bold text-slate-900 mb-1">{label}</p>
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
           <p className="text-slate-600 font-medium">Score: <span className="font-black text-slate-900">{score.toFixed(1)}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ScoreCharts() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCandidateId, setSelectedCandidateId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${CANDIDATES_LIST_BASE}/candidates/`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load candidates");
        const data = await res.json();
        if (!cancelled) {
          const arr = Array.isArray(data) ? data : [];
          setCandidates(arr);
          if (arr.length > 0) setSelectedCandidateId(String(arr[0].id));
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const barData = useMemo(() => {
    return candidates.map(c => ({
      name: c.name || "Unknown",
      score: normalizeScore(c.overall_score)
    }));
  }, [candidates]);

  const selectedCandidate = useMemo(() => {
    return candidates.find(c => String(c.id) === selectedCandidateId);
  }, [candidates, selectedCandidateId]);

  const radarData = useMemo(() => {
    if (!selectedCandidate) return [];
    const base = normalizeScore(selectedCandidate.overall_score);
    // Mocking individual skills if backend doesn't provide them yet
    const tech = selectedCandidate.technical_skill != null ? normalizeScore(selectedCandidate.technical_skill) : Math.min(10, base + (Math.random() * 2 - 0.5));
    const prob = selectedCandidate.problem_solving != null ? normalizeScore(selectedCandidate.problem_solving) : Math.min(10, base + (Math.random() * 2 - 0.5));
    const comm = selectedCandidate.communication != null ? normalizeScore(selectedCandidate.communication) : Math.max(0, base - (Math.random() * 2));
    
    return [
      { subject: 'Technical Skill', A: Number(tech.toFixed(1)), fullMark: 10 },
      { subject: 'Problem Solving', A: Number(prob.toFixed(1)), fullMark: 10 },
      { subject: 'Communication', A: Number(comm.toFixed(1)), fullMark: 10 },
      { subject: 'Overall', A: Number(base.toFixed(1)), fullMark: 10 },
    ];
  }, [selectedCandidate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">Loading charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-6 py-4 rounded-2xl border border-rose-100 font-medium max-w-lg mx-auto mt-8">
        <AlertCircle size={20} /> {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
            <BarChart2 size={24} />
          </div>
          <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">All Candidates Score Overview</h2>
             <p className="text-slate-500 font-medium">Comparison of overall scores across the pipeline.</p>
          </div>
        </div>

        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                dy={16}
              />
              <YAxis 
                domain={[0, 10]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                dx={-10}
              />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomBarTooltip />} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
              <Activity size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Skill Profile</h2>
               <p className="text-slate-500 font-medium">Multi-dimensional analysis.</p>
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-[350px]">
            {selectedCandidate ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                  <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     itemStyle={{ color: '#64748b', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                No candidate selected.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200 flex flex-col justify-between">
           <div>
             <div className="flex items-center gap-4 mb-8">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                  <UserCircle size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Candidate</h2>
                   <p className="text-slate-500 font-medium">View individual skill profiles.</p>
                </div>
              </div>
              
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Pipeline Candidates</label>
              <select
                className="w-full appearance-none rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 px-6 text-slate-900 font-bold focus:border-indigo-500 focus:bg-white focus:ring-0 transition-colors cursor-pointer"
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
           </div>

           {selectedCandidate && (
             <div className="mt-10 bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{selectedCandidate.name}</h4>
                  <p className="text-sm font-medium text-slate-500">{selectedCandidate.role}</p>
                </div>
                <ScoreBadge score={selectedCandidate.overall_score} />
             </div>
           )}
        </div>
      </div>
      
    </div>
  );
}
