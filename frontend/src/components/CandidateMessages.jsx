import React, { useEffect, useRef, useState } from 'react';
import { Bot, RefreshCw, Send, User } from 'lucide-react';
import { getApiErrorMessage, getMessages, sendMessage } from '../services/api';

export default function CandidateMessages({
  candidateId,
  recruiterId = 'REC-001',
  senderType = 'recruiter',
  senderId = 'REC-001',
  onSent,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!candidateId) return;

    try {
      setLoading(true);
      const data = await getMessages(candidateId, recruiterId);
      setMessages(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError(getApiErrorMessage(err, 'Failed to load messages'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [candidateId, recruiterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');

    try {
      await sendMessage({
        candidate_id: Number(candidateId),
        recruiter_id: recruiterId,
        sender_type: senderType,
        sender_id: senderId,
        content: newMessage.trim(),
      });
      setNewMessage('');
      await fetchMessages();
      onSent?.();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(getApiErrorMessage(err, 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {loading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Loading messages...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-10">
            <div className="p-4 bg-white rounded-full shadow-sm">
              <Send className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-sm text-slate-400 font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_type === senderType;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[75%] space-y-1">
                  <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                    isMine
                      ? 'bg-[#071b3a] text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400 ${
                    isMine ? 'justify-end' : 'justify-start'
                  }`}>
                    {msg.sender_type === 'recruiter' ? <Bot size={10} /> : <User size={10} />}
                    {msg.sender_type} - {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-100 bg-white p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Type your message..."
          className="flex-grow rounded-xl border border-slate-200 bg-[#f8faff] px-4 py-3 text-sm outline-none transition-all focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="rounded-xl bg-[#071b3a] p-3 text-white transition-all hover:bg-[#0b2a55] disabled:opacity-50"
        >
          {sending ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}
