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
  Calendar,
  MessageSquare,
  ClipboardList
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/recruiter-dashboard' },
    { name: 'Active Assessments', icon: <Activity size={20} />, path: '/assessments' },
    { name: 'Assign Tasks', icon: <ClipboardList size={20} />, path: '/assign-tasks' },
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
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex h-20 items-center gap-3 px-6">
        <span className="h-3 w-3 rounded-full bg-teal-700" />
        {isOpen && <span className="text-xl font-semibold tracking-tight text-[#071b3a]">ProofHire</span>}
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                isActive 
                ? 'bg-teal-50 text-teal-800 font-semibold' 
                : 'text-slate-500 hover:bg-[#f6f8fb] hover:text-[#071b3a]'
              }`
            }
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {isOpen && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button 
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:border-teal-700 hover:text-teal-800"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
}
