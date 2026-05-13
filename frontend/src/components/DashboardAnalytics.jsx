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
    { name: 'Total Candidates', value: stats.total_candidates, icon: <Users className="text-indigo-600" />, color: 'bg-indigo-50' },
    { name: 'Active Now', value: stats.active_assessments, icon: <Activity className="text-emerald-600" />, color: 'bg-emerald-50' },
    { name: 'Completed', value: stats.completed_assessments, icon: <BarChart3 className="text-blue-600" />, color: 'bg-blue-50' },
    { name: 'Shortlisted', value: stats.shortlisted, icon: <CheckCircle className="text-teal-600" />, color: 'bg-teal-50' },
    { name: 'Rejected', value: stats.rejected, icon: <XCircle className="text-slate-600" />, color: 'bg-slate-50' },
    { name: 'High Risk', value: stats.high_risk, icon: <ShieldAlert className="text-rose-600" />, color: 'bg-rose-50' },
  ];

  if (loading) {
     return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
       {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100"></div>)}
     </div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.name} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
