import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, User, Clock, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getConversations, getCandidateById, getCandidates } from '../services/api';
import CandidateMessages from '../components/CandidateMessages';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const candidateIdParam = searchParams.get('candidateId');

  // New Chat States
  const [allCandidates, setAllCandidates] = useState([]);
  const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);
  const newChatRef = useRef(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      
      // Load all candidates for the "New Chat" selector
      try {
        const candidatesList = await getCandidates();
        setAllCandidates(candidatesList);
      } catch (e) {
        console.error("Failed to fetch all candidates for messaging dropdown", e);
      }
      
      let targetConv = candidateIdParam
        ? data.find(c => String(c.id) === String(candidateIdParam))
        : null;
        
      if (!targetConv && candidateIdParam) {
        try {
          const candidate = await getCandidateById(candidateIdParam);
          if (candidate) {
            targetConv = {
              id: candidate.id,
              name: candidate.name,
              role: candidate.role,
              last_message: "Start the conversation!",
              timestamp: new Date().toISOString()
            };
            data.unshift(targetConv);
          }
        } catch (e) {
          console.error("Failed to fetch candidate details for message start", e);
        }
      }
      
      setConversations(data);
      
      if (targetConv) {
        setSelectedCandidate(targetConv);
      } else if (data.length > 0 && !selectedCandidate) {
        setSelectedCandidate(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (newChatRef.current && !newChatRef.current.contains(event.target)) {
        setShowNewChatDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="text-indigo-600" size={20} /> Messages
            </h2>
            <div className="relative" ref={newChatRef}>
              <button 
                onClick={() => setShowNewChatDropdown(!showNewChatDropdown)}
                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors flex items-center justify-center font-bold text-xs gap-1"
                title="Start a new chat"
              >
                <Plus size={16} /> New Chat
              </button>
              
              {showNewChatDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-60 overflow-y-auto py-2">
                  <div className="px-3 py-1.5 border-b border-slate-50 dark:border-slate-700 mb-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Select candidate</p>
                  </div>
                  {allCandidates.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 italic">No candidates found</div>
                  ) : (
                    allCandidates.map(candidate => (
                      <button
                        key={candidate.id}
                        onClick={() => {
                          // Check if candidate already has a conversation
                          let existing = conversations.find(c => String(c.id) === String(candidate.id));
                          if (!existing) {
                            existing = {
                              id: candidate.id,
                              name: candidate.name,
                              role: candidate.role,
                              last_message: "Start the conversation!",
                              timestamp: new Date().toISOString()
                            };
                            setConversations(prev => [existing, ...prev]);
                          }
                          setSelectedCandidate(existing);
                          setShowNewChatDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 border-b border-slate-50/55 dark:border-slate-700/50 last:border-0"
                      >
                        <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                          {candidate.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-slate-900 dark:text-slate-100">{candidate.name}</p>
                          <p className="truncate text-[10px] text-slate-400 font-medium">{candidate.role}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-slate-100"></div>)}
             </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm italic">
               No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedCandidate(conv)}
                className={`w-full p-4 flex gap-3 items-start transition-all border-b border-slate-50 hover:bg-white ${
                  selectedCandidate?.id === conv.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : ''
                }`}
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                  {conv.name.charAt(0)}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-slate-900 truncate">{conv.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {conv.timestamp ? new Date(conv.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{conv.role}</p>
                  <p className="text-xs text-slate-400 truncate mt-1">{conv.last_message || "No messages yet"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedCandidate ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedCandidate.name}</h3>
                    <p className="text-xs text-slate-500">{selectedCandidate.role}</p>
                  </div>
               </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
               <CandidateMessages candidateId={selectedCandidate.id} onSent={fetchConversations} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
             <div className="p-6 bg-slate-50 rounded-full">
                <MessageSquare size={48} className="text-slate-200" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900">Your Inbox</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm leading-relaxed">
                   Select a candidate from the list to view your conversation history and send new messages.
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
