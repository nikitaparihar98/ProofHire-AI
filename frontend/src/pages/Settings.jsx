import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    { id: 'appearance', label: 'Appearance', icon: <Sun size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Database size={18} /> },
  ];

  return (
    <div className="max-w-5xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your workspace and recruiter preferences.</p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Changes saved successfully!
          </div>
        )}
        {securitySuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Password reset link sent!
          </div>
        )}
        {integrationSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 animate-in slide-in-from-right-4">
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 dark:hover:text-white hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-6 mb-8">
                   <div className="relative group">
                      <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-950 shadow-lg overflow-hidden flex items-center justify-center">
                         {profileData.avatar ? (
                           <img src={profileData.avatar} alt="Profile" className="h-full w-full object-cover" />
                         ) : (
                           <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=6366f1&color=fff`} alt="Profile" />
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
                        className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        <Camera size={14} />
                      </label>
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profileData.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{profileData.role}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Job Title</label>
                    <input 
                      type="text" 
                      value={profileData.role}
                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Company</label>
                    <input 
                      type="text" 
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'emailAlerts', label: 'Email Alerts', sub: 'Receive daily candidate summaries', icon: <Mail size={18} /> },
                    { id: 'browserAlerts', label: 'Browser Notifications', sub: 'Instant alerts for test starts', icon: <Globe size={18} /> },
                    { id: 'malpracticeAlerts', label: 'Malpractice Warnings', sub: 'Critical security event alerts', icon: <Shield size={18} /> },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white dark:bg-slate-900 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                          {pref.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{pref.label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{pref.sub}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [pref.id]: !notifications[pref.id]})}
                        className={`w-12 h-6 rounded-full transition-all relative ${notifications[pref.id] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications[pref.id] ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Theme & Display</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleThemeChange(false)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      !isDarkMode ? 'theme-card-active' : 'theme-card-inactive'
                    }`}
                  >
                    <Sun size={24} className={!isDarkMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                    <p className="mt-4 font-bold text-slate-900 dark:text-white">Light Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modern clean interface</p>
                  </button>
                  <button 
                    onClick={() => handleThemeChange(true)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      isDarkMode ? 'theme-card-active' : 'theme-card-inactive'
                    }`}
                  >
                    <Moon size={24} className={isDarkMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'} />
                    <p className="mt-4 font-bold text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Easy on the eyes</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <Shield size={80} className="absolute -bottom-4 -right-4 opacity-10" />
                    <h3 className="text-lg font-bold mb-2">Account Security</h3>
                    <p className="text-sm text-slate-400 max-w-md">Manage your password, 2FA, and active sessions for the ProofHire AI recruiter dashboard.</p>
                    {securitySuccess ? (
                      <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-950/40 p-3 rounded-xl border border-emerald-800 max-w-md animate-in zoom-in-95">
                        <CheckCircle2 size={16} /> Password reset link has been sent to your email!
                      </div>
                    ) : (
                      <button 
                        onClick={handleUpdatePassword}
                        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                      >
                        Update Password
                      </button>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Database className="text-slate-300 dark:text-slate-600" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">ATS Integrations</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">Connect with Greenhouse, Lever, or Workday to sync candidates automatically.</p>
                   {integrationSuccess ? (
                     <div className="mt-6 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 max-w-xs mx-auto flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                       <CheckCircle2 size={16} /> Request Received!
                     </div>
                   ) : (
                     <button 
                       onClick={handleRequestAccess}
                       className="mt-6 text-indigo-600 font-bold hover:underline"
                     >
                       Request early access
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
             <button className="px-6 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Cancel</button>
             <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50"
             >
                {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
