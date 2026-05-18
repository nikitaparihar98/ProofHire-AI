import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import axios from 'axios';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const res = await axios.get(`${API_URL}/notifications/`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => n.is_read === 0).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await axios.post(`${API_URL}/notifications/read/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      await axios.post(`${API_URL}/notifications/clear-all`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-amber-500" size={16} />;
      case 'critical': return <AlertTriangle className="text-rose-500" size={16} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={16} />;
      default: return <Info className="text-indigo-500" size={16} />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-20 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900">Notifications</h3>
              <button 
                onClick={clearAll}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 border-b border-slate-50 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${notif.is_read === 0 ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
