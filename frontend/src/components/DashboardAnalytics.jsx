import React, { useMemo } from 'react';
import { Users, Activity, CheckCircle, XCircle, ShieldAlert, BarChart3 } from 'lucide-react';

export default function DashboardAnalytics({ candidates = [], loading = false }) {
  const stats = useMemo(() => {
    return {
      total_candidates: candidates.length,
      active_assessments: candidates.filter(c => c.status === 'Attending').length,
      completed_assessments: candidates.filter(c => c.status === 'Evaluated' || c.status === 'Shortlisted' || c.status === 'Rejected').length,
      shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
      rejected: candidates.filter(c => c.status === 'Rejected').length,
      high_risk: candidates.filter(c => c.plagiarism_risk_level === 'High').length
    };
  }, [candidates]);

  const cards = [
    { name: 'Candidates', value: stats.total_candidates, icon: <Users className="text-teal-800" />, color: 'bg-teal-50' },
    { name: 'Active tasks', value: stats.active_assessments, icon: <Activity className="text-[#071b3a]" />, color: 'bg-[#f8faff]' },
    { name: 'Proof packets', value: stats.completed_assessments, icon: <BarChart3 className="text-[#071b3a]" />, color: 'bg-[#f8faff]' },
    { name: 'Shortlisted', value: stats.shortlisted, icon: <CheckCircle className="text-teal-800" />, color: 'bg-teal-50' },
    { name: 'Rejected', value: stats.rejected, icon: <XCircle className="text-slate-600" />, color: 'bg-slate-50' },
    { name: 'Risk flags', value: stats.high_risk, icon: <ShieldAlert className="text-amber-700" />, color: 'bg-amber-50' },
  ];

  if (loading) {
     return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
       {[...Array(6)].map((_, i) => <div key={i} className="h-24 rounded-2xl border border-slate-200 bg-white"></div>)}
     </div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.name} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-700/40">
          <div className="flex justify-between items-start mb-2">
            <div className={`rounded-xl p-2 ${card.color}`}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#071b3a]">{card.value}</p>
            <p className="text-xs font-medium text-slate-500">{card.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
