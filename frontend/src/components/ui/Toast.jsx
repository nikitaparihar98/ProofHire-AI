import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    info: <Info className="text-teal-500" size={20} />,
    warning: <AlertTriangle className="text-amber-500" size={20} />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-rose-50 border-rose-100',
    info: 'bg-teal-50 border-teal-100',
    warning: 'bg-amber-50 border-amber-100'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-10 duration-300 ${bgColors[type]}`}>
      {icons[type]}
      <p className="text-sm font-medium text-slate-800">{message}</p>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  );
}
