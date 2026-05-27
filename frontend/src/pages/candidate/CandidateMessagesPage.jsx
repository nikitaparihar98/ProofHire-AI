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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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

      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden flex">
        {candidateId ? (
          <>
            {/* Inbox Sidebar */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/10 shrink-0">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Active Chats</h3>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mt-1">Your Recruiter Channels</p>
                </div>
                <div className="relative" ref={selectorRef}>
                  <button 
                    onClick={() => setShowSelector(!showSelector)}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-sm focus:outline-none"
                  >
                    + New Chat
                  </button>

                  {showSelector && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 animate-in zoom-in-95 duration-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-2 border-b border-slate-50">Select Recruiter Team</p>
                      <div className="max-h-48 overflow-y-auto mt-1 custom-scrollbar">
                        {recruiters.length === 0 ? (
                          <p className="p-3 text-xs text-slate-400 font-bold text-center">No recruiters available.</p>
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
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all flex flex-col"
                            >
                              <span className="text-xs font-bold text-slate-800">{rec.name}</span>
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
                            ? 'bg-indigo-50 border border-indigo-100/50 shadow-sm' 
                            : 'hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm text-slate-900 truncate pr-2">{convo.name}</h4>
                        </div>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">{convo.role}</p>
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
                  <h3 className="font-bold text-slate-900 text-base">
                    {conversations.find(c => c.role === activeRecruiterId)?.name || 'ProofHire Recruiting Team'}
                  </h3>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
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
              <p className="text-slate-500 font-bold">Please complete your profile to enable messaging.</p>
           </div>
        )}
      </div>
    </div>
  );
}
