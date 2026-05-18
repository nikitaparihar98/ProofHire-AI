import React from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

export default function AuthenticityBadge({ riskLevel }) {
  if (!riskLevel) return null;

  const level = riskLevel.toLowerCase();

  if (level === 'high') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
        <ShieldAlert className="w-3.5 h-3.5" />
        High Risk
      </div>
    );
  }
  
  if (level === 'medium') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
        <Shield className="w-3.5 h-3.5" />
        Medium Risk
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
      <ShieldCheck className="w-3.5 h-3.5" />
      Authentic
    </div>
  );
}
