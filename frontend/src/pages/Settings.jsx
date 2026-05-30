import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Moon, 
  Sun, 
  Lock, 
  Save,
  CheckCircle2,
  Globe,
  Mail,
  Smartphone,
  Camera
} from 'lucide-react';

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'profile';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [integrationSuccess, setIntegrationSuccess] = useState(false);

  const handleThemeChange = (dark) => {
    setIsDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleUpdatePassword = () => {
    setSecuritySuccess(true);
    setTimeout(() => setSecuritySuccess(false), 5000);
  };

  const handleRequestAccess = () => {
    setIntegrationSuccess(true);
    setTimeout(() => setIntegrationSuccess(false), 5000);
  };

  const [profileData, setProfileData] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const email = parsed.email || 'anusha@hindustanelectronics.com';
        const storedAvatar = localStorage.getItem('avatar_' + email.trim().toLowerCase()) || parsed.avatar || '';
        return {
          name: parsed.name || 'Anusha Agarwal',
          email: email,
          role: parsed.role || 'Recruiter',
          company: parsed.company || 'Hindustan Electronics',
          avatar: storedAvatar
        };
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
    return {
      name: 'Anusha Agarwal',
      email: 'anusha@hindustanelectronics.com',
      role: 'Recruiter',
      company: 'Hindustan Electronics',
      avatar: localStorage.getItem('avatar_anusha@hindustanelectronics.com') || ''
    };
  });

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const email = parsed.email || 'anusha@hindustanelectronics.com';
          const storedAvatar = localStorage.getItem('avatar_' + email.trim().toLowerCase()) || parsed.avatar || '';
          setProfileData({
            name: parsed.name || 'Anusha Agarwal',
            email: email,
            role: parsed.role || 'Recruiter',
            company: parsed.company || 'Hindustan Electronics',
            avatar: storedAvatar
          });
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

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    browserAlerts: true,
    malpracticeAlerts: true,
    weeklyReport: false
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        const emailKey = profileData.email.trim().toLowerCase();
        const updatedUser = {
          ...profileData,
          email: profileData.email.trim()
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('recruiter_' + emailKey, JSON.stringify(updatedUser));
        
        if (profileData.avatar) {
          localStorage.setItem('avatar_' + emailKey, profileData.avatar);
        } else {
          localStorage.removeItem('avatar_' + emailKey);
        }
        
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('user-profile-updated'));
      } catch (e) {
        console.error("Failed to save user to localStorage", e);
      }
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };



  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    ...(user?.role === 'recruiter' || profileData.role === 'recruiter'
      ? [{ id: 'integrations', label: 'Integrations', icon: <Database size={18} /> }]
      : []),
  ];

  return (
    <div className="max-w-5xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-800">Workspace settings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#071b3a]">Platform settings</h1>
          <p className="mt-1 text-slate-500">
            {user?.role === 'candidate' 
              ? 'Configure your profile and candidate preferences.' 
              : 'Configure your workspace and recruiter preferences.'}
          </p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Changes saved successfully!
          </div>
        )}
        {securitySuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Password reset link sent!
          </div>
        )}
        {integrationSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Early access requested!
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.id 
                ? 'bg-teal-50 text-teal-800'
                : 'text-slate-500 hover:bg-white hover:text-[#071b3a]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="min-h-[500px] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-6 mb-8">
                   <div className="relative group">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-teal-50 shadow-lg">
                         {profileData.avatar ? (
                           <img src={profileData.avatar} alt="Profile" className="h-full w-full object-cover" />
                         ) : (
                           <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=0f766e&color=fff`} alt="Profile" />
                         )}
                      </div>
                      <input 
                        type="file" 
                        id="avatar-input" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange} 
                      />
                      <label 
                        htmlFor="avatar-input" 
                        className="absolute bottom-0 right-0 cursor-pointer rounded-full border border-slate-100 bg-white p-1.5 text-slate-500 shadow-md transition-colors hover:text-teal-800"
                      >
                        <Camera size={14} />
                      </label>
                   </div>
                   <div>
                      <h3 className="text-xl font-semibold text-[#071b3a]">{profileData.name}</h3>
                      <p className="text-sm text-slate-500">{profileData.role}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-[#f8faff] px-4 py-2.5 text-sm text-[#071b3a] outline-none transition-all focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Work Email</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-[#f8faff] px-4 py-2.5 text-sm text-[#071b3a] outline-none transition-all focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Job Title</label>
                    <input 
                      type="text" 
                      value={profileData.role}
                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-[#f8faff] px-4 py-2.5 text-sm text-[#071b3a] outline-none transition-all focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Company</label>
                    <input 
                      type="text" 
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-[#f8faff] px-4 py-2.5 text-sm text-[#071b3a] outline-none transition-all focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="mb-4 text-lg font-semibold text-[#071b3a]">Notification preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'emailAlerts', label: 'Email Alerts', sub: 'Receive daily candidate summaries', icon: <Mail size={18} /> },
                    { id: 'browserAlerts', label: 'Browser Notifications', sub: 'Instant alerts for test starts', icon: <Globe size={18} /> },
                    { id: 'malpracticeAlerts', label: 'Malpractice Warnings', sub: 'Critical security event alerts', icon: <Shield size={18} /> },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#f8faff] p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white p-2 text-teal-800 shadow-sm">
                          {pref.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#071b3a]">{pref.label}</p>
                          <p className="text-xs text-slate-500">{pref.sub}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [pref.id]: !notifications[pref.id]})}
                        className={`relative h-6 w-12 rounded-full transition-all ${notifications[pref.id] ? 'bg-teal-700' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[pref.id] ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#f8faff] p-6 text-[#071b3a] shadow-sm">
                    <Shield size={80} className="absolute -bottom-4 -right-4 opacity-10" />
                    <h3 className="mb-2 text-lg font-semibold">Account security</h3>
                    <p className="max-w-md text-sm text-slate-500">Manage your password, 2FA, and active sessions for your ProofHire workspace.</p>
                    {securitySuccess ? (
                      <div className="mt-6 flex max-w-md items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 p-3 text-sm font-semibold text-teal-800 animate-in zoom-in-95">
                        <CheckCircle2 size={16} /> Password reset link has been sent to your email!
                      </div>
                    ) : (
                      <button 
                        onClick={handleUpdatePassword}
                        className="mt-6 rounded-lg bg-[#071b3a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b2a55]"
                      >
                        Update Password
                      </button>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8faff] p-4">
                      <Database className="text-slate-300" />
                   </div>
                   <h3 className="text-lg font-semibold text-[#071b3a]">ATS integrations</h3>
                   <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">Connect with Greenhouse, Lever, or Workday to sync candidates automatically.</p>
                   {integrationSuccess ? (
                     <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-1.5 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 animate-in zoom-in-95">
                       <CheckCircle2 size={16} /> Request Received!
                     </div>
                   ) : (
                     <button 
                       onClick={handleRequestAccess}
                       className="mt-6 font-semibold text-teal-800 hover:underline"
                     >
                       Request early access
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-[#f8faff] p-6">
             <button className="px-6 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
             <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-[#071b3a] px-8 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0b2a55] disabled:opacity-50"
             >
                {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
