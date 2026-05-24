import React, { useEffect, useState } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { getApiErrorMessage, getCandidateDashboard } from '../../services/api';
import CandidateMessages from '../../components/CandidateMessages';
import { useAuth } from '../../context/AuthContext';

export default function CandidateMessagesPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCandidateDashboard()
      .then((data) => {
        setDashboard(data);
        setError('');
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to load messages info')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const candidateId = dashboard?.candidate?.id;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6 shrink-0">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <MessageSquare className="text-indigo-600" /> Messages
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Chat directly with the recruiting team.</p>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700 mb-6 shrink-0">
          {error}
        </div>
      )}

      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
        {candidateId ? (
          <CandidateMessages 
            candidateId={candidateId} 
            senderType="candidate" 
            senderId={user?.email || 'CAN-001'} 
          />
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <MessageSquare size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-500 font-bold">Please complete your profile to enable messaging.</p>
           </div>
        )}
      </div>
    </div>
  );
}
