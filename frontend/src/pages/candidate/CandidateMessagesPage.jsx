import React, { useEffect, useState, useRef } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { getApiErrorMessage, getCandidateDashboard, getCandidateConversations, getRecruiters } from '../../services/api';
import CandidateMessages from '../../components/CandidateMessages';
import { useAuth } from '../../context/AuthContext';

export default function CandidateMessagesPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeRecruiterId, setActiveRecruiterId] = useState('REC-001');
  const [recruiters, setRecruiters] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const selectorRef = useRef(null);

  useEffect(() => {
    getCandidateDashboard()
      .then((data) => {
        setDashboard(data);
        setError('');
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Failed to load messages info')))
      .finally(() => setLoading(false));

    getRecruiters()
      .then((data) => setRecruiters(data))
      .catch((err) => console.error("Failed to load recruiter listings", err));
  }, []);

  const candidateId = dashboard?.candidate?.id;

  const fetchConversations = () => {
    if (!candidateId) return;
    getCandidateConversations(candidateId)
      .then((data) => {
        setConversations(data);
        if (data.length > 0 && !activeRecruiterId) {
          setActiveRecruiterId(data[0].role);
        }
      })
      .catch((err) => console.error("Failed to load recruiter threads", err));
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [candidateId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6 shrink-0">
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-[#071b3a]">
          <MessageSquare className="text-teal-800" /> Messages
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Chat directly with the recruiting team.</p>
      </header>

      {error && (
        <div className="mb-6 shrink-0 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {candidateId ? (
          <>
            {/* Inbox Sidebar */}
            <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-[#f8faff]">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-semibold text-[#071b3a]">Active chats</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Your recruiter channels</p>
                </div>
                <div className="relative" ref={selectorRef}>
                  <button 
                    onClick={() => setShowSelector(!showSelector)}
                    className="flex items-center gap-1 rounded-xl bg-[#071b3a] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#0b2a55] focus:outline-none"
                  >
                    + New Chat
                  </button>

                  {showSelector && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in zoom-in-95 duration-100">
                      <p className="border-b border-slate-50 p-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Select recruiter team</p>
                      <div className="max-h-48 overflow-y-auto mt-1 custom-scrollbar">
                        {recruiters.length === 0 ? (
                          <p className="p-3 text-center text-xs font-semibold text-slate-400">No recruiters available.</p>
                        ) : (
                          recruiters.map((rec) => (
                            <button
                              key={rec.email}
                              onClick={() => {
                                setActiveRecruiterId(rec.email);
                                setShowSelector(false);
                                if (!conversations.some(c => c.role === rec.email)) {
                                  setConversations(prev => [
                                    {
                                      id: candidateId,
                                      name: `${rec.name} (${rec.email.split('@')[1].split('.')[0].toUpperCase()})`,
                                      role: rec.email,
                                      last_message: "Start a new conversation!"
                                    },
                                    ...prev
                                  ]);
                                }
                              }}
                              className="flex w-full flex-col rounded-xl p-2.5 text-left transition-all hover:bg-[#f8faff]"
                            >
                              <span className="text-xs font-semibold text-[#071b3a]">{rec.name}</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 truncate">{rec.email}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs font-medium">
                    No active chat channels.
                  </div>
                ) : (
                  conversations.map((convo) => {
                    const isActive = convo.role === activeRecruiterId;
                    return (
                      <button
                        key={convo.role}
                        onClick={() => setActiveRecruiterId(convo.role)}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex flex-col ${
                          isActive 
                            ? 'border border-teal-100 bg-teal-50 shadow-sm'
                            : 'border border-transparent hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="truncate pr-2 text-sm font-semibold text-[#071b3a]">{convo.name}</h4>
                        </div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-teal-800">{convo.role}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{convo.last_message}</p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 flex flex-col">
              <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-semibold text-[#071b3a]">
                    {conversations.find(c => c.role === activeRecruiterId)?.name || 'ProofHire Recruiting Team'}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-teal-800">
                    Channel ID: {activeRecruiterId}
                  </p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <CandidateMessages 
                  candidateId={candidateId} 
                  recruiterId={activeRecruiterId}
                  senderType="candidate" 
                  senderId={user?.email || 'CAN-001'} 
                />
              </div>
            </div>
          </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <MessageSquare size={48} className="text-slate-200 mb-4" />
              <p className="font-semibold text-slate-500">Please complete your profile to enable messaging.</p>
           </div>
        )}
      </div>
    </div>
  );
}
