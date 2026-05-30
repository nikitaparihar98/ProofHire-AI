import React, { useState } from 'react';
import { X, Calendar, Clock, Video, MapPin, FileText, Loader2 } from 'lucide-react';
import { scheduleInterview } from '../services/api';

export default function ScheduleInterviewModal({ isOpen, onClose, candidate, onScheduled }) {
  const [formData, setFormData] = useState({
    interview_title: 'Technical Interview',
    scheduled_date: '',
    scheduled_time: '',
    mode: 'Online',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const combinedDateTime = `${formData.scheduled_date}T${formData.scheduled_time}`;
      await scheduleInterview({
        candidate_id: candidate.id,
        interview_title: formData.interview_title,
        scheduled_time: combinedDateTime,
        mode: formData.mode,
        notes: formData.notes
      });
      alert("Interview scheduled successfully!");
      if (onScheduled) onScheduled();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to schedule interview. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-600/25 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-medium text-slate-900">Schedule Interview</h2>
            <p className="text-slate-500 text-sm mt-1">Arranging technical evaluation for {candidate?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Interview Title</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-700 transition-all"
                  value={formData.interview_title}
                  onChange={(e) => setFormData({ ...formData, interview_title: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="date"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-700 transition-all"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="time"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-700 transition-all"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Interview Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'Online' })}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all ${
                    formData.mode === 'Online' 
                    ? 'bg-teal-50 border-teal-700 text-teal-800' 
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Video size={18} /> Online
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'Offline' })}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all ${
                    formData.mode === 'Offline' 
                    ? 'bg-teal-50 border-teal-700 text-teal-800' 
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <MapPin size={18} /> In-Person
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Internal Notes</label>
              <textarea
                rows="3"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-700 transition-all resize-none"
                placeholder="Mention specific topics or focus areas..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-medium rounded-2xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-teal-700 text-white font-medium rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
