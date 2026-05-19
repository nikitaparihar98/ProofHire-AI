import React, { useState } from 'react';
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
  Smartphone
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Darshini Sivakumar',
<<<<<<< HEAD
    email: 'darshini@recruit.ai',
    role: 'Senior Hiring Manager',
    company: 'Recruit AI'
=======
    email: 'darshini@proofhire.ai',
    role: 'Senior Hiring Manager',
    company: 'ProofHire AI'
>>>>>>> origin/darshini-frontend
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    browserAlerts: true,
    malpracticeAlerts: true,
    weeklyReport: false
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Configure your workspace and recruiter preferences.</p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 animate-in slide-in-from-right-4">
            <CheckCircle2 size={16} /> Changes saved successfully!
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-6 mb-8">
                   <div className="relative group">
                      <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden">
                        <img src={`https://ui-avatars.com/api/?name=${profileData.name}&background=6366f1&color=fff`} alt="Profile" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-slate-100 text-slate-500 hover:text-indigo-600 transition-colors">
                        <Smartphone size={14} />
                      </button>
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-900">{profileData.name}</h3>
                      <p className="text-sm text-slate-500">{profileData.role}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                    <input 
                      type="text" 
                      value={profileData.role}
                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Company</label>
                    <input 
                      type="text" 
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'emailAlerts', label: 'Email Alerts', sub: 'Receive daily candidate summaries', icon: <Mail size={18} /> },
                    { id: 'browserAlerts', label: 'Browser Notifications', sub: 'Instant alerts for test starts', icon: <Globe size={18} /> },
                    { id: 'malpracticeAlerts', label: 'Malpractice Warnings', sub: 'Critical security event alerts', icon: <Shield size={18} /> },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm">
                          {pref.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{pref.label}</p>
                          <p className="text-xs text-slate-500">{pref.sub}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [pref.id]: !notifications[pref.id]})}
                        className={`w-12 h-6 rounded-full transition-all relative ${notifications[pref.id] ? 'bg-indigo-600' : 'bg-slate-300'}`}
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
                <h3 className="text-lg font-bold text-slate-900 mb-4">Theme & Display</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${!isDarkMode ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50'}`}
                  >
                    <Sun size={24} className={!isDarkMode ? 'text-indigo-600' : 'text-slate-400'} />
                    <p className="mt-4 font-bold text-slate-900">Light Mode</p>
                    <p className="text-xs text-slate-500 mt-1">Modern clean interface</p>
                  </button>
                  <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${isDarkMode ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50'}`}
                  >
                    <Moon size={24} className={isDarkMode ? 'text-indigo-600' : 'text-slate-400'} />
                    <p className="mt-4 font-bold text-slate-900">Dark Mode</p>
                    <p className="text-xs text-slate-500 mt-1">Easy on the eyes (Coming Soon)</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <Shield size={80} className="absolute -bottom-4 -right-4 opacity-10" />
                    <h3 className="text-lg font-bold mb-2">Account Security</h3>
<<<<<<< HEAD
                    <p className="text-sm text-slate-400 max-w-md">Manage your password, 2FA, and active sessions for the Recruit AI recruiter dashboard.</p>
=======
                    <p className="text-sm text-slate-400 max-w-md">Manage your password, 2FA, and active sessions for the ProofHire AI recruiter dashboard.</p>
>>>>>>> origin/darshini-frontend
                    <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
                      Update Password
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                   <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Database className="text-slate-300" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900">ATS Integrations</h3>
                   <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Connect with Greenhouse, Lever, or Workday to sync candidates automatically.</p>
                   <button className="mt-6 text-indigo-600 font-bold hover:underline">Request early access</button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
             <button className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
             <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
             >
                {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
