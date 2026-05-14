import React from 'react';
import { Link } from 'react-router-dom';

export default function TasksManagement() {
  return (
    <>
      
<aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-lg px-md space-y-base z-50">
<div className="px-sm mb-xl">
<h1 className="text-headline-md font-headline-md font-bold text-primary">Recruit AI</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant">Candidate Portal</p>
</div>
<nav className="flex-grow space-y-xs">
<Link className="flex items-center space-x-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/candidate-dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</Link>
<Link className="flex items-center space-x-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/assessments-hub">
<span className="material-symbols-outlined" data-icon="assignment">assignment</span>
<span>Assessments</span>
</Link>
{/* Active State: Tasks */}
<Link className="flex items-center space-x-md px-md py-sm bg-secondary-container text-on-secondary-container font-bold rounded-lg scale-[0.98] transition-transform duration-150 font-label-md text-label-md" to="/tasks-management">
<span className="material-symbols-outlined" data-icon="checklist">checklist</span>
<span>Tasks</span>
</Link>
<Link className="flex items-center space-x-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/interview-schedule">
<span className="material-symbols-outlined" data-icon="video_call">video_call</span>
<span>Interviews</span>
</Link>
<Link className="flex items-center space-x-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/account-settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</Link>
</nav>
<div className="mt-auto pt-lg border-t border-outline-variant">
<button onClick={() => alert('This feature is coming soon!')} className="w-full flex items-center space-x-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg mb-md">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span>Help Center</span>
</button>
<div className="flex items-center space-x-md px-md py-sm">
<span className="material-symbols-outlined text-[32px]" data-icon="account_circle">account_circle</span>
<span className="font-label-md text-label-md">Alex Johnson</span>
</div>
</div>
</aside>
<main className="ml-[260px] min-h-screen p-margin-desktop max-w-[1440px]">
<header className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
<div>
<h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">Your Tasks</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your application requirements and upcoming action items.</p>
</div>
<div className="flex bg-surface-container p-xs rounded-lg border border-outline-variant">
<button onClick={() => alert('This feature is coming soon!')} className="px-xl py-xs font-label-md text-label-md rounded bg-surface-container-lowest shadow-sm text-primary">All</button>
<button onClick={() => alert('This feature is coming soon!')} className="px-xl py-xs font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Pending</button>
<button onClick={() => alert('This feature is coming soon!')} className="px-xl py-xs font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Completed</button>
</div>
</header>
<section className="grid grid-cols-1 gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant bg-surface-container-low">
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Task Name</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Due Date</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Priority</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
{/* Task 1: Upload Resume */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-lg">
<div className="flex items-center space-x-md">
<div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container" data-icon="upload_file">upload_file</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm text-primary">Upload Resume</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Update your latest professional history.</p>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="font-body-md text-body-md text-on-surface">Oct 24, 2024</span>
</td>
<td className="px-lg py-lg">
<span className="inline-flex items-center px-sm py-xs rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-error mr-xs"></span>
                                    High
                                </span>
</td>
<td className="px-lg py-lg">
<div className="flex items-center space-x-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="radio_button_unchecked">radio_button_unchecked</span>
<span className="font-body-sm text-body-sm">To Do</span>
</div>
</td>
<td className="px-lg py-lg text-right">
<button onClick={() => alert('This feature is coming soon!')} className="bg-primary text-on-primary px-lg py-sm rounded font-label-md text-label-md hover:opacity-90 transition-opacity">Complete</button>
</td>
</tr>
{/* Task 2: Complete Profile */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-lg">
<div className="flex items-center space-x-md">
<div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-fixed" data-icon="person">person</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm text-primary">Complete Profile</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Finalize skills and preferences.</p>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="font-body-md text-body-md text-on-surface">Oct 26, 2024</span>
</td>
<td className="px-lg py-lg">
<span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-outline mr-xs"></span>
                                    Medium
                                </span>
</td>
<td className="px-lg py-lg">
<div className="flex items-center space-x-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="radio_button_unchecked">radio_button_unchecked</span>
<span className="font-body-sm text-body-sm">To Do</span>
</div>
</td>
<td className="px-lg py-lg text-right">
<button onClick={() => alert('This feature is coming soon!')} className="bg-primary text-on-primary px-lg py-sm rounded font-label-md text-label-md hover:opacity-90 transition-opacity">Complete</button>
</td>
</tr>
{/* Task 3: Verify Email */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-lg">
<div className="flex items-center space-x-md">
<div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-on-tertiary-fixed" data-icon="mail">mail</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm text-primary">Verify Email</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Confirm your contact information.</p>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="font-body-md text-body-md text-on-surface">Oct 22, 2024</span>
</td>
<td className="px-lg py-lg">
<span className="inline-flex items-center px-sm py-xs rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-error mr-xs"></span>
                                    High
                                </span>
</td>
<td className="px-lg py-lg">
<div className="flex items-center space-x-xs text-secondary">
<span className="material-symbols-outlined text-[18px]" data-icon="check_circle" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
<span className="font-body-sm text-body-sm font-bold">Done</span>
</div>
</td>
<td className="px-lg py-lg text-right">
<button onClick={() => alert('This feature is coming soon!')} className="text-on-surface-variant px-lg py-sm rounded font-label-md text-label-md border border-outline-variant hover:bg-surface-container transition-colors">Review</button>
</td>
</tr>
{/* Task 4: Submit ID Documents */}
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-lg">
<div className="flex items-center space-x-md">
<div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="id_card">id_card</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm text-primary">Submit ID Documents</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Required for identity verification.</p>
</div>
</div>
</td>
<td className="px-lg py-lg">
<span className="font-body-md text-body-md text-on-surface">Oct 30, 2024</span>
</td>
<td className="px-lg py-lg">
<span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-outline mr-xs"></span>
                                    Low
                                </span>
</td>
<td className="px-lg py-lg">
<div className="flex items-center space-x-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="radio_button_unchecked">radio_button_unchecked</span>
<span className="font-body-sm text-body-sm">To Do</span>
</div>
</td>
<td className="px-lg py-lg text-right">
<button onClick={() => alert('This feature is coming soon!')} className="bg-primary text-on-primary px-lg py-sm rounded font-label-md text-label-md hover:opacity-90 transition-opacity">Complete</button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Bento Grid - Task Summary/Insights */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<span className="material-symbols-outlined text-secondary" data-icon="event_note">event_note</span>
<span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-container px-sm py-xs rounded">Next 7 Days</span>
</div>
<div>
<p className="text-headline-xl font-headline-xl">03</p>
<p className="text-body-sm font-body-sm text-on-surface-variant">Upcoming Deadlines</p>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-40 relative overflow-hidden">
<div className="absolute -right-4 -bottom-4 opacity-5">
<span className="material-symbols-outlined text-[120px]" data-icon="verified">verified</span>
</div>
<div className="flex justify-between items-start">
<span className="material-symbols-outlined text-secondary" data-icon="verified_user">verified_user</span>
<span className="text-label-sm font-label-sm text-on-secondary-fixed-variant bg-secondary-fixed px-sm py-xs rounded">75% Done</span>
</div>
<div>
<p className="text-headline-xl font-headline-xl">12/16</p>
<p className="text-body-sm font-body-sm text-on-surface-variant">Tasks Completed</p>
</div>
</div>
<div className="bg-primary text-on-primary p-lg rounded-xl flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<span className="material-symbols-outlined" data-icon="tips_and_updates">tips_and_updates</span>
</div>
<p className="text-body-sm font-body-sm leading-snug">Completing your profile increases your chances of interview selection by 45%.</p>
<Link className="text-label-md font-label-md underline hover:opacity-80 transition-opacity" to="#">Optimize Profile</Link>
</div>
</div>
</section>
<footer className="w-full py-xl px-margin-desktop flex flex-col md:flex-row justify-between items-center mt-xl border-t border-outline-variant max-w-[1440px] mx-auto">
<p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 Recruit AI. All rights reserved.</p>
<div className="flex space-x-lg mt-md md:mt-0">
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Privacy Policy</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Terms of Service</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Contact Us</Link>
</div>
</footer>
</main>

    </>
  );
}
