import React, { useState, useRef } from 'react';
import { X, UserPlus, Upload, Briefcase, Mail, Send, Award, FileText, Loader2 } from 'lucide-react';
import { createCandidate } from '../services/api';
import Toast from './ui/Toast';

export default function CandidateUploadModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Frontend Developer',
    experience_level: 'Junior',
    assessment_type: 'Technical Assignment',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCandidate({
        ...formData,
        resume_url: selectedFile ? `/uploads/resumes/${selectedFile.name}` : null,
        status: "Not Attended"
      });
      setToast({ message: "Candidate added successfully!", type: "success" });
      setTimeout(() => {
        onRefresh();
        onClose();
        // Reset form
        setFormData({
            name: '',
            email: '',
            role: 'Frontend Developer',
            experience_level: 'Junior',
            assessment_type: 'Technical Assignment',
        });
        setSelectedFile(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to add candidate. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Candidate</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Applicant Tracking System</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    required
                    type="email"
                    placeholder="john.doe@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                  Experience Level
                </label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.experience_level}
                    onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                  >
                    <option value="Junior">Junior (0-2 years)</option>
                    <option value="Mid">Mid-Level (3-5 years)</option>
                    <option value="Senior">Senior (5+ years)</option>
                    <option value="Lead">Lead / Architect</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                  Assigned Role
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                  Assessment Type
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <select
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.assessment_type}
                    onChange={(e) => setFormData({...formData, assessment_type: e.target.value})}
                  >
                    <option value="Technical Assignment">Technical Assignment</option>
                    <option value="Live Coding">Live Coding</option>
                    <option value="Behavioral Quiz">Behavioral Quiz</option>
                    <option value="Design Challenge">Design Challenge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">
                  Resume (Optional)
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group"
                >
                  <Upload size={20} className="mb-2 group-hover:text-indigo-500 transition-colors" />
                  {selectedFile ? (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-bold text-indigo-600 truncate max-w-[150px]">{selectedFile.name}</span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-rose-500 hover:text-rose-700 p-0.5 rounded transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider">Click to upload PDF</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-6 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30 flex items-start gap-4">
             <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm animate-pulse">
                <Send size={16} />
             </div>
             <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
               Candidate will be added to the <b>Not Attended</b> pipeline stage. You can then launch or send the assessment invitation from the dashboard.
             </p>
          </div>

          <div className="pt-4 flex gap-4">
             <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4.5 border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-[0.2em]"
             >
               Cancel
             </button>
             <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
             >
               {loading ? (
                 <><Loader2 className="animate-spin" size={18} /> Processing...</>
               ) : (
                 <>Add Candidate <Send size={18} /></>
               )}
             </button>
          </div>
        </form>
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
