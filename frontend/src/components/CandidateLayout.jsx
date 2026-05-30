import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Video, 
  BrainCircuit,
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getStoredAvatar = (email = '') => {
  try {
    return window.localStorage?.getItem('avatar_' + email.trim().toLowerCase()) || '';
  } catch {
    return '';
  }
};

export default function CandidateLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState(() => {
    return getStoredAvatar(user?.email || '');
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      window.localStorage?.setItem('theme', 'light');
    } catch {
      // Rendering should not depend on localStorage.
    }
  }, []);

  useEffect(() => {
    const syncAvatar = () => {
      setAvatar(getStoredAvatar(user?.email || ''));
    };
    
    window.addEventListener('candidate-avatar-updated', syncAvatar);
    window.addEventListener('storage', syncAvatar);
    return () => {
      window.removeEventListener('candidate-avatar-updated', syncAvatar);
      window.removeEventListener('storage', syncAvatar);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/candidate/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Verify Resume', path: '/resume-verification', icon: <UploadCloud size={20} /> },
    { name: 'My Tasks', path: '/candidate/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Assessments', path: '/candidate/assessments', icon: <FileText size={20} /> },
    { name: 'Interviews', path: '/candidate/interviews', icon: <Video size={20} /> },
    { name: 'AI Results', path: '/candidate/results', icon: <BrainCircuit size={20} /> },
    { name: 'Messages', path: '/candidate/messages', icon: <MessageSquare size={20} /> },
    { name: 'Profile', path: '/candidate/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="proofhire-candidate flex h-screen overflow-hidden bg-[#f6f8fb] font-sans text-[#071b3a]">
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-teal-700" />
          <span className="text-lg font-semibold text-[#071b3a]">ProofHire</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-lg p-2 text-slate-500 hover:bg-[#f8faff]">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 mt-16' : '-translate-x-full lg:translate-x-0 lg:mt-0'}
      `}>
        {/* Brand */}
        <div className="hidden h-20 items-center border-b border-slate-100 px-8 lg:flex">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-teal-700" />
            <div>
              <span className="block text-xl font-semibold leading-tight text-[#071b3a]">ProofHire</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-teal-800">Candidate workspace</span>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-teal-100 bg-teal-50 text-lg font-semibold uppercase text-teal-800">
              {avatar ? (
                <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                user?.name?.[0] || 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-semibold text-[#071b3a]">{user?.name || 'Candidate'}</h3>
              <p className="text-xs text-slate-500 truncate">{user?.role || 'Applicant'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-500 hover:bg-[#f8faff] hover:text-[#071b3a]'}
                `}
              >
                <div className={`${isActive ? 'text-teal-800' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link 
            to="/candidate/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              location.pathname === '/candidate/settings'
                ? 'bg-teal-50 text-teal-800'
                : 'text-slate-500 hover:bg-[#f8faff] hover:text-[#071b3a]'
            }`}
          >
            <Settings size={20} className={location.pathname === '/candidate/settings' ? 'text-teal-800' : 'text-slate-400'} />
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-500 transition-all hover:bg-rose-50"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="custom-scrollbar relative h-full flex-1 overflow-y-auto bg-[#f6f8fb] p-4 pt-20 lg:p-8 lg:pt-8">
        <div className="mx-auto flex h-full max-w-6xl flex-col">
           {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-[#071b3a]/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
