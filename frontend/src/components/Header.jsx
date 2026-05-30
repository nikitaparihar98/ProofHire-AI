import React, { useState, useRef, useEffect } from 'react';
import { Search, User, LogOut, Settings, Shield, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import { getCandidates } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur">
      <div className="relative w-96 max-w-full hidden md:block" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          className="block w-full rounded-xl border border-slate-200 bg-[#f8faff] py-2.5 pl-10 pr-3 text-sm font-medium text-slate-950 transition-all placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
          placeholder="Search candidates or proof packets..."
        />

        {showSearchDropdown && (searchQuery.trim() || searchLoading) && (
          <div className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
            {searchLoading ? (
              <div className="flex items-center justify-center p-6 text-sm text-secondary gap-2">
                <Loader className="w-4 h-4 animate-spin text-teal-700" />
                <span>Loading candidates...</span>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-secondary font-medium">
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
                  className="flex cursor-pointer items-center justify-between border-b border-slate-50 px-4 py-3 transition-colors last:border-0 hover:bg-[#f8faff]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-800">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#071b3a]">{candidate.name}</p>
                      <p className="text-[11px] text-secondary font-medium">{candidate.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{candidate.status}</span>
                    <span className="text-xs font-semibold text-teal-800">{candidate.overall_score}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        <NotificationCenter />
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="group flex cursor-pointer items-center gap-3 rounded-xl p-1 transition-all hover:bg-[#f8faff]"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none text-[#071b3a]">{profileUser.name}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{profileUser.company} {profileUser.role}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 bg-slate-100 shadow-sm transition-all ${isProfileOpen ? 'border-teal-700' : 'border-white'}`}>
               {profileUser.avatar ? (
                 <img src={profileUser.avatar} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=0f766e&color=fff`} alt="Profile" />
               )}
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 z-50 mt-3 w-64 animate-in rounded-2xl border border-slate-200 bg-white py-3 shadow-[0_18px_60px_rgba(15,23,42,0.12)] duration-200 fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-50 mb-2">
                <p className="text-sm font-semibold text-[#071b3a]">{profileUser.name}</p>
                <p className="text-xs text-slate-500">{profileUser.email}</p>
              </div>
              
              <Link 
                to="/settings?tab=profile" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800"
                onClick={() => setIsProfileOpen(false)}
              >
                <User size={16} /> My Profile
              </Link>
              <Link 
                to="/settings?tab=appearance" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings size={16} /> Appearance & Display
              </Link>
              <Link 
                to="/settings?tab=security" 
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800"
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
