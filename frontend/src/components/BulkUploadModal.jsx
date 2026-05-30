import React, { useState } from 'react';
import { X, Upload, FileJson, AlertCircle, CheckCircle, Loader2, Send } from 'lucide-react';
import { bulkCreateCandidates } from '../services/api';
import Toast from './ui/Toast';

export default function BulkUploadModal({ isOpen, onClose, onRefresh }) {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const exampleJson = [
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "Backend Engineer",
      "experience_level": "Senior",
      "assessment_type": "Live Coding"
    },
    {
      "name": "Bob Johnson",
      "email": "bob.j@example.com",
      "role": "Product Manager",
      "experience_level": "Mid",
      "assessment_type": "Design Challenge"
    }
  ];

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const candidates = JSON.parse(jsonInput);
      if (!Array.isArray(candidates)) {
        throw new Error("Input must be a JSON array of candidate objects.");
      }
      
      await bulkCreateCandidates(candidates);
      setToast({ message: `Successfully uploaded ${candidates.length} candidates!`, type: "success" });
      
      setTimeout(() => {
        onRefresh();
        onClose();
        setJsonInput('');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message === "Input must be a JSON array of candidate objects." 
        ? err.message 
        : "Invalid JSON format or server error. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-600/25 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-teal-700 p-3 rounded-2xl text-white shadow-lg shadow-teal-100">
              <FileJson size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Bulk Upload</h2>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-0.5">JSON Array Import</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleBulkUpload} className="p-10 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2.5 ml-1">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                 Candidate JSON Array
               </label>
               <button 
                type="button"
                onClick={() => setJsonInput(JSON.stringify(exampleJson, null, 2))}
                className="text-[10px] font-medium text-teal-700 hover:underline uppercase tracking-wider"
               >
                 Paste Example
               </button>
            </div>
            <textarea
              required
              rows={12}
              placeholder='[ { "name": "...", "email": "...", ... } ]'
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-mono text-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-700 outline-none transition-all placeholder:text-slate-300"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          <div className="bg-teal-50/50 p-6 rounded-3xl border border-teal-100/50 flex items-start gap-4">
             <div className="p-2 bg-white rounded-xl text-teal-700 shadow-sm animate-pulse">
                <CheckCircle size={16} />
             </div>
             <p className="text-xs text-slate-600 leading-relaxed font-medium">
               All candidates will be added in <b>"Not Attended"</b> state. Ensure your JSON follows the required schema: <b>name, email, role, experience_level, assessment_type</b>.
             </p>
          </div>

          <div className="pt-4 flex gap-4">
             <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4.5 border border-slate-200 text-slate-600 font-semibold rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-[0.2em]"
             >
               Cancel
             </button>
             <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4.5 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em]"
             >
               {loading ? (
                 <><Loader2 className="animate-spin" size={18} /> Processing...</>
               ) : (
                 <>Upload Candidates <Upload size={18} /></>
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
