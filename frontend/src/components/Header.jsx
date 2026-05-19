import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings, CreditCard, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
<<<<<<< HEAD

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
=======
import useCandidates from '../hooks/useCandidates';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  const { candidates } = useCandidates();
>>>>>>> origin/darshini-frontend

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
<<<<<<< HEAD
=======
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
>>>>>>> origin/darshini-frontend
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Placeholder for actual logout logic
    alert("Logging out...");
    navigate('/login'); // Assuming there's a login route
  };

<<<<<<< HEAD
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="relative w-96 max-w-full hidden md:block">
=======
  const filteredSearch = searchTerm 
    ? candidates.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (c.role || '').toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="relative w-96 max-w-full hidden md:block" ref={searchRef}>
>>>>>>> origin/darshini-frontend
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          placeholder="Search candidates, reports..."
<<<<<<< HEAD
        />
=======
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
        />
        {isSearchOpen && searchTerm && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
            {filteredSearch.length > 0 ? (
              filteredSearch.map(c => (
                <Link
                  key={c.id}
                  to={`/candidate/${c.id}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchTerm('');
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                    {c.name ? c.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.role}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
>>>>>>> origin/darshini-frontend
      </div>

      <div className="flex items-center gap-6">
        <NotificationCenter />
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-slate-50 rounded-xl transition-all"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">Hiring Manager</p>
<<<<<<< HEAD
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Recruit AI Recruiter</p>
=======
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">ProofHire Recruiter</p>
>>>>>>> origin/darshini-frontend
            </div>
            <div className={`h-10 w-10 rounded-full bg-slate-100 border-2 transition-all overflow-hidden shadow-sm ${isProfileOpen ? 'border-indigo-500' : 'border-white'}`}>
               <img src="https://ui-avatars.com/api/?name=Hiring+Manager&background=6366f1&color=fff" alt="Profile" />
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="px-4 py-2 border-b border-slate-50 mb-2">
                <p className="text-sm font-bold text-slate-900">Darshini Sivakumar</p>
<<<<<<< HEAD
                <p className="text-xs text-slate-500">darshini@recruit.ai</p>
=======
                <p className="text-xs text-slate-500">darshini@proofhire.ai</p>
>>>>>>> origin/darshini-frontend
              </div>
              
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <User size={16} /> My Profile
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings size={16} /> Account Settings
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <Shield size={16} /> Security & Privacy
              </Link>
              
              <div className="h-px bg-slate-50 my-2"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
