import React, { useEffect, useState } from 'react';
import { getCandidates, getAllTasks, assignTaskToCandidate, generateAiTask, getApiErrorMessage } from '../services/api';
import { 
  Loader2, 
  Users, 
  ClipboardList, 
  Sparkles, 
  Send, 
  Search, 
  Filter, 
  Clock, 
  Zap, 
  CheckCircle2,
  FileCode,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function AssignTasks() {
  const [candidates, setCandidates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Form states
  const [taskSource, setTaskSource] = useState('prebuilt'); // 'prebuilt' or 'ai'
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState(60);
  const [customTitle, setCustomTitle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  // Load candidates and tasks on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [candidatesData, tasksData] = await Promise.all([
          getCandidates(),
          getAllTasks()
        ]);
        setCandidates(candidatesData);
        setTasks(tasksData);
        
        // Select first candidate by default if available
        if (candidatesData.length > 0) {
          setSelectedCandidate(candidatesData[0]);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load page data'));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Update form inputs when selected candidate changes
  useEffect(() => {
    if (selectedCandidate) {
      // Find a matching prebuilt task for this candidate's role
      const matchingTask = tasks.find(t => t.role.toLowerCase() === selectedCandidate.role.toLowerCase());
      if (matchingTask) {
        setSelectedTaskId(matchingTask.id);
      } else if (tasks.length > 0) {
        setSelectedTaskId(tasks[0].id);
      }
      // Reset AI states
      setCustomTitle('');
      setCustomPrompt('');
      setSuccessMsg('');
      setError('');
    }
  }, [selectedCandidate, tasks]);

  const handleGenerateAiTask = async () => {
    if (!selectedCandidate) return;
    setGeneratingAi(true);
    setError('');
    setSuccessMsg('');
    try {
      const result = await generateAiTask({
        role: selectedCandidate.role,
        difficulty: difficulty
      });
      setCustomTitle(result.title || `${selectedCandidate.role} AI Assessment`);
      setCustomPrompt(result.prompt || '');
    } catch (err) {
      setError(getApiErrorMessage(err, 'AI generation failed'));
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    setAssigning(true);
    setError('');
    setSuccessMsg('');
    
    const payload = {
      difficulty,
      duration: Number(duration),
    };

    if (taskSource === 'prebuilt') {
      if (!selectedTaskId) {
        setError('Please select a prebuilt task.');
        setAssigning(false);
        return;
      }
      payload.task_id = selectedTaskId;
    } else {
      if (!(customTitle || "").trim() || !(customPrompt || "").trim()) {
        setError('Please generate or enter a custom AI title and prompt.');
        setAssigning(false);
        return;
      }
      payload.task_id = 'custom';
      payload.custom_title = customTitle;
      payload.custom_prompt = customPrompt;
    }

    try {
      await assignTaskToCandidate(selectedCandidate.id, payload);
      setSuccessMsg(`Task successfully assigned to ${selectedCandidate.name}!`);
      
      // Update candidate status locally
      setCandidates(prev => prev.map(c => 
        c.id === selectedCandidate.id ? { ...c, status: 'Assigned' } : c
      ));
      setSelectedCandidate(prev => prev ? { ...prev, status: 'Assigned' } : null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to assign task'));
    } finally {
      setAssigning(false);
    }
  };

  // Get unique roles from candidates for filter
  const uniqueRoles = ['All', ...Array.from(new Set(candidates.map(c => c.role)))];

  // Filter candidates list
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesRole = roleFilter === 'All' || c.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4 sm:px-6">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assign Assessment Tasks</h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">Assign standard or custom AI-generated technical challenges to candidates in your pipeline.</p>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Candidates List Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 mb-4 flex items-center gap-2">
              <Users className="text-indigo-600" size={20} />
              Candidates ({filteredCandidates.length})
            </h2>
            
            {/* Filters */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Search name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Role Filter */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                {/* Status Filter */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Not Attended">Not Attended</option>
                    <option value="Assigned">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="Evaluated">Evaluated</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map(candidate => {
                  const isSelected = selectedCandidate?.id === candidate.id;
                  return (
                    <button
                      key={candidate.id}
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setSuccessMsg('');
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm shadow-indigo-50' 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-900 truncate">{candidate.name}</p>
                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{candidate.role}</p>
                      </div>
                      
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${
                        candidate.status === 'Evaluated' || candidate.status === 'Shortlisted'
                        ? 'bg-emerald-50 text-emerald-700'
                        : candidate.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700'
                        : candidate.status === 'Assigned' || candidate.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                      }`}>
                        {candidate.status === 'IN_PROGRESS' ? 'In Progress' : candidate.status}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-bold">No candidates match filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Panel Column */}
        <div className="lg:col-span-7">
          {selectedCandidate ? (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              
              {/* Selected Candidate Header */}
              <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">Assigning Task For</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedCandidate.name}</h2>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedCandidate.role} • {selectedCandidate.email}</p>
                  </div>
                  
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                    selectedCandidate.status === 'Not Attended' 
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-blue-50 text-blue-700'
                  }`}>
                    {selectedCandidate.status === 'Not Attended' ? 'No Task Assigned' : 'Task Already Assigned'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleAssignTask} className="space-y-6">
                
                {/* Task Source Tabs */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2.5">Task Setup Method</label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setTaskSource('prebuilt')}
                      className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        taskSource === 'prebuilt'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <ClipboardList size={14} /> Prebuilt Tasks
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskSource('ai')}
                      className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        taskSource === 'ai'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-850'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <Sparkles size={14} /> AI-Generated Task
                      </span>
                    </button>
                  </div>
                </div>

                {/* Prebuilt Task Selector */}
                {taskSource === 'prebuilt' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Select Prebuilt Task</label>
                    <select
                      value={selectedTaskId}
                      onChange={(e) => setSelectedTaskId(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="" disabled>-- Choose a Task --</option>
                      {tasks.map(task => (
                        <option key={task.id} value={task.id}>
                          [{task.role}] {task.title} ({task.time_limit_minutes}m)
                        </option>
                      ))}
                    </select>

                    {/* Preview details of chosen task */}
                    {selectedTaskId && (() => {
                      const selectedTask = tasks.find(t => t.id === selectedTaskId);
                      if (!selectedTask) return null;
                      return (
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-3">
                          <h4 className="font-bold text-slate-900">{selectedTask.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedTask.prompt}</p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {selectedTask.evaluation_focus.map(item => (
                              <span key={item} className="text-[10px] font-bold bg-white text-slate-600 border border-slate-100 px-2.5 py-1 rounded-full">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* AI-Generated Task Form */}
                {taskSource === 'ai' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">Generate Technical Challenge</label>
                      <button
                        type="button"
                        onClick={handleGenerateAiTask}
                        disabled={generatingAi}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition"
                      >
                        {generatingAi ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} /> Generate Task
                          </>
                        )}
                      </button>
                    </div>

                    {customTitle || customPrompt ? (
                      <div className="space-y-3 p-1.5 border border-slate-100 rounded-3xl bg-slate-50/50">
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="Task Title"
                          className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none"
                        />
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="AI Prompt Instructions..."
                          rows={6}
                          className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none leading-relaxed"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center bg-slate-50">
                        <Sparkles className="mx-auto h-8 w-8 text-slate-300 mb-2.5 animate-pulse" />
                        <p className="text-xs font-bold text-slate-500">Click "Generate Task" to prompt OpenAI to build a unique role-specific technical assessment.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Shared controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Difficulty</label>
                    <div className="flex gap-2">
                      {['Easy', 'Medium', 'Hard'].map(level => {
                        const active = difficulty === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setDifficulty(level)}
                            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold tracking-wider transition ${
                              active
                              ? 'border-indigo-600 bg-indigo-50/30 text-indigo-700'
                              : 'border-slate-200 hover:border-slate-350 text-slate-600 bg-white'
                            }`}
                          >
                            {level}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Duration (minutes)</label>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-400" />
                      <input
                        type="number"
                        min={10}
                        max={240}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="border-t border-slate-100 pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={assigning}
                    className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    {assigning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Assigning...
                      </>
                    ) : (
                      <>
                        <Send size={14} /> Assign Task
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 text-center shadow-sm h-full flex flex-col items-center justify-center">
              <ClipboardList className="h-16 w-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-900">No Candidate Selected</h3>
              <p className="text-slate-500 font-medium text-sm mt-2 max-w-sm">Select a candidate from the left panel to assign them a customized coding challenge.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
