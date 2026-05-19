import React from 'react';
import { Link } from 'react-router-dom';

export default function AccountSettings() {
  return (
    <>
      
{/* SideNavBar (Authority: JSON) */}
<nav className="bg-surface-container-lowest dark:bg-surface-container-low fixed left-0 top-0 h-full w-[260px] border-r border-outline-variant dark:border-outline flex flex-col py-lg px-md space-y-base z-40">
<div className="mb-xl px-xs">
<h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-on-primary-fixed">Recruit AI</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant">Candidate Portal</p>
</div>
<div className="flex-1 space-y-xs">
<Link className="flex items-center gap-md p-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all rounded-lg" to="/candidate-dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-md p-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all rounded-lg" to="/assessments-hub">
<span className="material-symbols-outlined" data-icon="assignment">assignment</span>
<span className="font-label-md text-label-md">Assessments</span>
</Link>
<Link className="flex items-center gap-md p-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all rounded-lg" to="/tasks-management">
<span className="material-symbols-outlined" data-icon="checklist">checklist</span>
<span className="font-label-md text-label-md">Tasks</span>
</Link>
<Link className="flex items-center gap-md p-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all rounded-lg" to="/interview-schedule">
<span className="material-symbols-outlined" data-icon="video_call">video_call</span>
<span className="font-label-md text-label-md">Interviews</span>
</Link>
<Link className="flex items-center gap-md p-sm bg-secondary-container text-on-secondary-container font-bold rounded-lg scale-[0.98] transition-transform duration-150" to="/account-settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</Link>
</div>
<div className="pt-lg border-t border-outline-variant mt-auto">
<Link className="flex items-center gap-md p-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all" to="#">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
<div className="flex flex-col">
<span className="font-label-md text-label-md">Alex Johnson</span>
<span className="font-body-sm text-body-sm opacity-70">View Profile</span>
</div>
</Link>
<Link className="mt-base flex items-center justify-center gap-xs p-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity" to="#">
<span className="material-symbols-outlined text-[18px]" data-icon="help">help</span>
                Help Center
            </Link>
</div>
</nav>
{/* Main Content Canvas */}
<main className="ml-[260px] flex-1 flex flex-col min-h-screen">
{/* Header Section */}
<header className="h-16 px-margin-desktop flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-30 border-b border-outline-variant">
<h2 className="font-headline-md text-headline-md">Settings</h2>
<div className="flex items-center gap-md">
<span className="font-label-md text-label-md text-on-surface-variant">Last activity: 2 hours ago</span>
</div>
</header>
<div className="p-margin-desktop max-w-[1180px]">
<div className="grid grid-cols-12 gap-lg">
{/* Vertical Tab Navigation */}
<aside className="col-span-12 md:col-span-3 space-y-xs">
<button onClick={() => alert('This feature is coming soon!')} className="w-full flex items-center gap-sm p-md bg-surface-container-high text-on-surface border-l-4 border-secondary font-label-md text-label-md transition-all text-left">
<span className="material-symbols-outlined" data-icon="person">person</span>
                        Account
                    </button>
<button onClick={() => alert('This feature is coming soon!')} className="w-full flex items-center gap-sm p-md text-on-surface-variant hover:bg-surface-container transition-all font-label-md text-label-md text-left">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                        Notifications
                    </button>
<button onClick={() => alert('This feature is coming soon!')} className="w-full flex items-center gap-sm p-md text-on-surface-variant hover:bg-surface-container transition-all font-label-md text-label-md text-left">
<span className="material-symbols-outlined" data-icon="security">security</span>
                        Privacy
                    </button>
<button onClick={() => alert('This feature is coming soon!')} className="w-full flex items-center gap-sm p-md text-on-surface-variant hover:bg-surface-container transition-all font-label-md text-label-md text-left">
<span className="material-symbols-outlined" data-icon="lock">lock</span>
                        Password
                    </button>
</aside>
{/* Settings Forms Content */}
<div className="col-span-12 md:col-span-9 space-y-lg">
{/* Account Section */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-lg">
<div className="mb-lg">
<h3 className="font-headline-sm text-headline-sm mb-xs">Account Information</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Update your account details and contact information.</p>
</div>
<div className="space-y-md">
<div className="flex flex-col md:flex-row gap-lg">
<div className="flex-1 space-y-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Full Name</label>
<input className="w-full p-sm border border-outline-variant rounded bg-white font-body-md text-body-md" type="text" value="Alex Johnson"/>
</div>
<div className="flex-1 space-y-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Preferred Name</label>
<input className="w-full p-sm border border-outline-variant rounded bg-white font-body-md text-body-md" placeholder="Alex" type="text"/>
</div>
</div>
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Email Address</label>
<input className="w-full p-sm border border-outline-variant rounded bg-white font-body-md text-body-md" type="email" value="alex.johnson@example.com"/>
</div>
<div className="pt-md flex justify-end">
<button onClick={() => alert('This feature is coming soon!')} className="px-xl py-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
</div>
</div>
</section>
{/* Notifications Section */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-lg">
<div className="mb-lg">
<h3 className="font-headline-sm text-headline-sm mb-xs">Notification Preferences</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Choose how and when you want to be notified about recruitment updates.</p>
</div>
<div className="space-y-base">
{/* Notification Row */}
<div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors rounded">
<div className="flex items-center gap-md">
<div className="p-sm bg-surface-container-high rounded-full">
<span className="material-symbols-outlined text-secondary" data-icon="mail">mail</span>
</div>
<div>
<h4 className="font-label-md text-label-md">Email Notifications</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Daily summary of assessments and interview invites.</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
</label>
</div>
{/* Notification Row */}
<div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors rounded">
<div className="flex items-center gap-md">
<div className="p-sm bg-surface-container-high rounded-full">
<span className="material-symbols-outlined text-secondary" data-icon="notifications_active">notifications_active</span>
</div>
<div>
<h4 className="font-label-md text-label-md">Push Notifications</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Real-time alerts for application status changes.</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
</label>
</div>
{/* Notification Row */}
<div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors rounded">
<div className="flex items-center gap-md">
<div className="p-sm bg-surface-container-high rounded-full">
<span className="material-symbols-outlined text-secondary" data-icon="sms">sms</span>
</div>
<div>
<h4 className="font-label-md text-label-md">SMS Updates</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Reminders for scheduled interviews (standard rates apply).</p>
</div>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
</label>
</div>
</div>
</section>
{/* Change Password Section */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-lg">
<div className="mb-lg">
<h3 className="font-headline-sm text-headline-sm mb-xs">Security &amp; Password</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Ensure your account remains secure with a strong password.</p>
</div>
<div className="space-y-md">
<div className="space-y-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Current Password</label>
<input className="w-full p-sm border border-outline-variant rounded bg-white font-body-md text-body-md" type="password"/>
</div>
<div className="flex flex-col md:flex-row gap-lg">
<div className="flex-1 space-y-xs">
<label className="font-label-md text-label-md text-on-surface-variant">New Password</label>
<input className="w-full p-sm border border-outline-variant rounded bg-white font-body-md text-body-md" type="password"/>
</div>
<div className="flex-1 space-y-xs">
<label className="font-label-md text-label-md text-on-surface-variant">Confirm New Password</label>
<input className="w-full p-sm border border-outline-variant rounded bg-white font-body-md text-body-md" type="password"/>
</div>
</div>
<div className="p-md bg-surface-container-low rounded flex items-start gap-md">
<span className="material-symbols-outlined text-secondary" data-icon="info">info</span>
<div className="font-body-sm text-body-sm text-on-surface-variant">
                                    Password must be at least 12 characters and contain a mix of uppercase letters, numbers, and symbols.
                                </div>
</div>
<div className="pt-md flex justify-end">
<button onClick={() => alert('This feature is coming soon!')} className="px-xl py-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity">Update Password</button>
</div>
</div>
</section>
</div>
</div>
</div>
{/* Footer (Authority: JSON) */}
<footer className="w-full py-xl px-margin-desktop flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant dark:border-outline mt-auto">
<p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline mb-md md:mb-0">© 2024 Recruit AI. All rights reserved.</p>
<div className="flex gap-lg">
<Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline hover:text-secondary transition-colors" to="#">Privacy Policy</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline hover:text-secondary transition-colors" to="#">Terms of Service</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline hover:text-secondary transition-colors" to="#">Contact Us</Link>
</div>
</footer>
</main>

    </>
  );
}
