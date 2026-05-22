import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, Settings, CreditCard, Shield, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import { getCandidates } from '../services/api';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Recruiter Profile state
  const [profileUser, setProfileUser] = useState({
    name: 'Anusha Agarwal',
    email: 'anusha@hindustanelectronics.com',
    company: 'Hindustan Electronics',
    role: 'Recruiter',
    avatar: ''
  });

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.email) {
            const emailKey = parsed.email.trim().toLowerCase();
            const storedAvatar = localStorage.getItem('avatar_' + emailKey);
            if (storedAvatar && parsed.avatar !== storedAvatar) {
              parsed.avatar = storedAvatar;
              localStorage.setItem('user', JSON.stringify(parsed));
            }
          }
          setProfileUser(parsed);
        } else {
          const email = 'anusha@hindustanelectronics.com';
          const storedAvatar = localStorage.getItem('avatar_' + email.toLowerCase()) || '';
          const defaultUser = {
            name: 'Anusha Agarwal',
            email: email,
            company: 'Hindustan Electronics',
            role: 'Recruiter',
            avatar: storedAvatar
          };
          localStorage.setItem('user', JSON.stringify(defaultUser));
          setProfileUser(defaultUser);
        }
      } catch (e) {
        console.error("Failed to read user from localStorage", e);
      }
    };

    loadUser();

    window.addEventListener('storage', loadUser);
    window.addEventListener('user-profile-updated', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('user-profile-updated', loadUser);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchFocus = async () => {
    setShowSearchDropdown(true);
    if (candidates.length === 0) {
      setSearchLoading(true);
      try {
        const data = await getCandidates();
        setCandidates(data);
      } catch (err) {
        console.error("Failed to load candidates for search:", err);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = candidates.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.role.toLowerCase().includes(query) ||
      (c.email && c.email.toLowerCase().includes(query))
    );
    setFilteredResults(filtered);
  }, [searchQuery, candidates]);

  const handleLogout = () => {
    alert("Logging out...");
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="relative w-96 max-w-full hidden md:block" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          placeholder="Search candidates, reports..."
        />

        {showSearchDropdown && (searchQuery.trim() || searchLoading) && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto py-2">
            {searchLoading ? (
              <div className="flex items-center justify-center p-6 text-sm text-slate-400 gap-2">
                <Loader className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Loading candidates...</span>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-400 font-medium">
                No matching candidates or reports
              </div>
            ) : (
              filteredResults.map(candidate => (
                <div
                  key={candidate.id}
                  onClick={() => {
                    navigate(`/candidate/${candidate.id}`);
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-0 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{candidate.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{candidate.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{candidate.status}</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{candidate.overall_score}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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
              <p className="text-sm font-bold text-slate-900 leading-none">{profileUser.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{profileUser.company} {profileUser.role}</p>
            </div>
            <div className={`h-10 w-10 rounded-full bg-slate-100 border-2 transition-all overflow-hidden shadow-sm flex items-center justify-center ${isProfileOpen ? 'border-indigo-500' : 'border-white'}`}>
               {profileUser.avatar ? (
                 <img src={profileUser.avatar} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=6366f1&color=fff`} alt="Profile" />
               )}
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="px-4 py-2 border-b border-slate-50 mb-2">
                <p className="text-sm font-bold text-slate-900">{profileUser.name}</p>
                <p className="text-xs text-slate-500">{profileUser.email}</p>
              </div>
              
              <Link 
                to="/settings?tab=profile" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <User size={16} /> My Profile
              </Link>
              <Link 
                to="/settings?tab=appearance" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings size={16} /> Appearance & Display
              </Link>
              <Link 
                to="/settings?tab=security" 
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
