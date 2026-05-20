import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Calendar,
  MessageSquare
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Active Assessments', icon: <Activity size={20} />, path: '/assessments' },
    { name: 'Candidates', icon: <Users size={20} />, path: '/candidates' },
    { name: 'Compare', icon: <BarChart3 size={20} />, path: '/compare' },
    { name: 'Interviews', icon: <Calendar size={20} />, path: '/interviews' },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/messages' },
    { name: 'Shortlisted', icon: <CheckCircle size={20} />, path: '/shortlisted' },
    { name: 'Rejected', icon: <XCircle size={20} />, path: '/rejected' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <BrainCircuit size={24} />
        </div>
        {isOpen && <span className="text-xl font-bold text-slate-900 tracking-tight">ProofHire AI</span>}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {isOpen && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
}
