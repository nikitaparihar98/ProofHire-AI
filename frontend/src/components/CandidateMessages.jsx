import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Clock, RefreshCw } from 'lucide-react';
import { sendMessage, getMessages } from '../services/api';

export default function CandidateMessages({ candidateId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(candidateId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, [candidateId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await sendMessage({
        candidate_id: candidateId,
        sender_type: 'recruiter',
        sender_id: 'REC-001',
        content: newMessage
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 tracking-tight">Candidate Conversation</h3>
        </div>
        <button 
          onClick={fetchMessages}
          className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
          title="Refresh messages"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
             <div className="p-4 bg-white rounded-full shadow-sm">
                <Send className="w-8 h-8 text-slate-200" />
             </div>
             <p className="text-sm text-slate-400 font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender_type === 'recruiter' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] space-y-1`}>
                <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                  msg.sender_type === 'recruiter' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <div className={`flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase ${
                  msg.sender_type === 'recruiter' ? 'justify-end' : 'justify-start'
                }`}>
                  {msg.sender_type === 'recruiter' ? <Bot size={10} /> : <User size={10} />}
                  {msg.sender_type} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
