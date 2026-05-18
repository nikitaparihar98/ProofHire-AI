import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, User, Clock } from 'lucide-react';
import { getConversations } from '../services/api';
import CandidateMessages from '../components/CandidateMessages';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedCandidate) {
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

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={20} /> Messages
          </h2>
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
            <div className="flex-1">
               <CandidateMessages candidateId={selectedCandidate.id} />
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
