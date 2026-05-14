import React from 'react';
import { Link } from 'react-router-dom';

export default function CandidateDashboard() {
  return (
    <>
      
{/* SideNavBar */}
<aside className="fixed left-0 top-0 h-full w-[260px] bg-surface dark:bg-inverse-surface border-r border-outline-variant dark:border-outline flex flex-col py-lg px-md z-40">
<div className="mb-xl px-sm">
<h1 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">Recruit AI</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Candidate Portal</p>
</div>
<nav className="flex-1 space-y-1">
{/* Active Tab */}
<Link className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container dark:bg-secondary dark:text-on-secondary rounded-xl font-semibold scale-[0.98] transition-transform duration-150" to="/candidate-dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-150" to="/assessments-hub">
<span className="material-symbols-outlined" data-icon="assignment">assignment</span>
<span className="font-label-md text-label-md">Assessments</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-150" to="/tasks-management">
<span className="material-symbols-outlined" data-icon="list_alt">list_alt</span>
<span className="font-label-md text-label-md">Tasks</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-150" to="/interview-schedule">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span className="font-label-md text-label-md">Interviews</span>
</Link>
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-150" to="/account-settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</Link>
</nav>
<div className="mt-auto space-y-4 pt-lg border-t border-outline-variant">
<Link className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:text-on-surface dark:hover:text-inverse-on-surface hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors duration-150" to="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span className="font-label-md text-label-md">Help Center</span>
</Link>
<div className="flex items-center gap-3 px-4 py-2 bg-surface-container-low rounded-xl">
<img alt="Recruit AI Logo" className="w-10 h-10 rounded-full object-cover" data-alt="A professional close-up portrait of a young man with a confident expression, wearing a minimalist grey crew-neck sweater. The lighting is soft and natural, coming from the side to create depth. The background is a blurred, bright office setting with neutral tones and clean lines, embodying a modern corporate aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEAvZbkbyJEg6XS6UXRld8keqwjsZRslVA4--2S_GpuroOBbErCPjuA6pYQEEWH7tY2iX2TcSYx9qsQ3GUSMD2S_iXPt-NptIYqQtAK7vt_-evdUD2B32-a8xl-uTUdsYfqJG4w2SDfPaN4DfpGdREfZhCbY5MYMGWv7v_TtNg_Kk02agOckXYxOoT_DT7XgfGOac_zvRAqASQJzFzuPTby5lS1lZrvBsaesmAnZDxDnHO-NxCsGOy4CgGorvIH-afKLGV8K0iVCU"/>
<div className="flex-1 min-w-0">
<p className="font-label-md text-label-md text-on-surface truncate">Alex Johnson</p>
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">Candidate</p>
</div>
</div>
<Link to="/candidate-profile" className="w-full py-2 px-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity">
                View Profile
            </Link>
</div>
</aside>
{/* Main Content */}
<main className="ml-[260px] flex-1 p-xl max-w-[1440px]">
{/* Header Section */}
<header className="mb-xl">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Welcome back, Alex</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Here's your current application progress and upcoming tasks.</p>
</header>
{/* Top Stat Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
<div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-md">
<span className="material-symbols-outlined text-secondary-container p-2 bg-secondary/10 rounded-lg" data-icon="pending_actions">pending_actions</span>
<span className="text-error font-label-md text-label-md px-2 py-1 bg-error-container rounded-full">High Priority</span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pending Tasks</p>
<h3 className="font-headline-xl text-headline-xl text-on-surface">04</h3>
</div>
<div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-md">
<span className="material-symbols-outlined text-green-600 p-2 bg-green-50 rounded-lg" data-icon="task_alt">task_alt</span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Completed Tasks</p>
<h3 className="font-headline-xl text-headline-xl text-on-surface">12</h3>
</div>
<div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-md">
<span className="material-symbols-outlined text-secondary p-2 bg-secondary/10 rounded-lg" data-icon="analytics">analytics</span>
</div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Average Score</p>
<div className="flex items-baseline gap-1">
<h3 className="font-headline-xl text-headline-xl text-on-surface">88</h3>
<span className="font-label-md text-label-md text-on-surface-variant">/ 100</span>
</div>
</div>
</div>
{/* Middle Grid */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-xl">
{/* Assessment Progress Card */}
<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
<div className="p-lg border-b border-outline-variant flex justify-between items-center">
<h4 className="font-headline-sm text-headline-sm text-on-surface">Assessment Progress</h4>
<span className="font-label-md text-label-md text-secondary bg-secondary-fixed px-3 py-1 rounded-full">3 of 5 Complete</span>
</div>
<div className="p-lg space-y-xl">
<div className="space-y-sm">
<div className="flex justify-between text-on-surface-variant">
<span className="font-body-md text-body-md">Technical Skill Evaluation</span>
<span className="font-label-md text-label-md font-bold text-on-surface">75%</span>
</div>
<div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
<div className="bg-secondary-container h-full w-3/4 rounded-full"></div>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
<div className="p-md bg-surface-container-low rounded-lg border border-outline-variant">
<p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Current Weighted Score</p>
<p className="font-headline-md text-headline-md text-on-surface">92.4 <span className="font-body-sm text-body-sm text-green-600 font-normal">↑ 2.1%</span></p>
</div>
<div className="p-md bg-surface-container-low rounded-lg border border-outline-variant">
<p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Peer Percentile</p>
<p className="font-headline-md text-headline-md text-on-surface">Top 15%</p>
</div>
</div>
</div>
<div className="mt-auto p-lg bg-surface-bright flex justify-end gap-md">
<Link to="/assessments-hub" className="px-xl py-2 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90">Resume Next Module</Link>
</div>
</div>
{/* Upcoming Interviews Card */}
<div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col">
<div className="p-lg border-b border-outline-variant">
<h4 className="font-headline-sm text-headline-sm text-on-surface">Interviews</h4>
</div>
<div className="flex-1 flex flex-col items-center justify-center p-xl text-center">
<div className="mb-md">
<span className="material-symbols-outlined text-[64px] text-outline-variant" data-icon="calendar_month">calendar_month</span>
</div>
<h5 className="font-headline-sm text-headline-sm text-on-surface mb-xs">No interviews scheduled yet</h5>
<p className="font-body-md text-body-md text-on-surface-variant max-w-[200px]">We'll notify you once a recruiter sets a time for your first round.</p>
</div>
<div className="p-lg border-t border-outline-variant">
<Link to="/interview-schedule" className="w-full py-2 border border-outline-variant text-on-surface-variant font-label-md text-label-md rounded-xl hover:bg-surface-container transition-colors">
                        Manage Availability
                    </Link>
</div>
</div>
</div>
{/* Lower Grid */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
{/* Available Tasks List */}
<div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
<div className="p-lg border-b border-outline-variant flex justify-between items-center">
<h4 className="font-headline-sm text-headline-sm text-on-surface">Available Tasks</h4>
<Link className="text-secondary font-label-md text-label-md hover:underline" to="#">View All</Link>
</div>
<div className="overflow-x-auto">
<table className="w-full">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-lg py-3 text-left font-label-md text-label-md text-on-surface-variant">Task Name</th>
<th className="px-lg py-3 text-left font-label-md text-label-md text-on-surface-variant">Duration</th>
<th className="px-lg py-3 text-left font-label-md text-label-md text-on-surface-variant">Difficulty</th>
<th className="px-lg py-3 text-right font-label-md text-label-md text-on-surface-variant">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-4">
<p className="font-label-md text-label-md text-on-surface">Algorithm Logic Quiz</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Required for Backend Role</p>
</td>
<td className="px-lg py-4 font-body-md text-body-md text-on-surface">45 mins</td>
<td className="px-lg py-4">
<span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
<span className="w-2 h-2 rounded-full bg-red-500"></span> Hard
                                    </span>
</td>
<td className="px-lg py-4 text-right">
<Link to="/tasks-management" className="text-secondary font-label-md text-label-md font-bold opacity-0 group-hover:opacity-100 transition-opacity">Start Now</Link>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-4">
<p className="font-label-md text-label-md text-on-surface">Culture Fit Questionnaire</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">General Profile</p>
</td>
<td className="px-lg py-4 font-body-md text-body-md text-on-surface">15 mins</td>
<td className="px-lg py-4">
<span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
<span className="w-2 h-2 rounded-full bg-green-500"></span> Easy
                                    </span>
</td>
<td className="px-lg py-4 text-right">
<Link to="/tasks-management" className="text-secondary font-label-md text-label-md font-bold opacity-0 group-hover:opacity-100 transition-opacity">Start Now</Link>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-4">
<p className="font-label-md text-label-md text-on-surface">React Architecture Challenge</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Optional Bonus</p>
</td>
<td className="px-lg py-4 font-body-md text-body-md text-on-surface">120 mins</td>
<td className="px-lg py-4">
<span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface">
<span className="w-2 h-2 rounded-full bg-yellow-500"></span> Medium
                                    </span>
</td>
<td className="px-lg py-4 text-right">
<Link to="/tasks-management" className="text-secondary font-label-md text-label-md font-bold opacity-0 group-hover:opacity-100 transition-opacity">Start Now</Link>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Tips for Success */}
<div className="lg:col-span-4 bg-secondary-container text-on-secondary-container rounded-xl border border-secondary shadow-lg p-lg">
<div className="flex items-center gap-2 mb-lg">
<span className="material-symbols-outlined" data-icon="lightbulb" style={{"fontVariationSettings":"'FILL' 1"}}>lightbulb</span>
<h4 className="font-headline-sm text-headline-sm">Tips for Success</h4>
</div>
<ul className="space-y-md">
<li className="flex gap-3">
<span className="material-symbols-outlined text-on-secondary shrink-0" data-icon="check_circle" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
<p className="font-body-md text-body-md">Ensure your stable internet connection before starting technical tasks.</p>
</li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-on-secondary shrink-0" data-icon="check_circle" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
<p className="font-body-md text-body-md">Complete the 'Culture Fit' questionnaire to boost your profile ranking by 15%.</p>
</li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-on-secondary shrink-0" data-icon="check_circle" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
<p className="font-body-md text-body-md">Update your preferred working hours in Settings for easier interview scheduling.</p>
</li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-on-secondary shrink-0" data-icon="check_circle" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
<p className="font-body-md text-body-md">Review the 'Interview Prep' guide available in the Help Center.</p>
</li>
</ul>
<div className="mt-lg pt-lg border-t border-on-secondary-container/20">
<div className="flex items-center gap-4">
<div className="bg-secondary-fixed p-3 rounded-xl">
<span className="material-symbols-outlined text-on-secondary-fixed" data-icon="auto_awesome">auto_awesome</span>
</div>
<div>
<p className="font-label-md text-label-md font-bold">AI Insight</p>
<p className="font-body-sm text-body-sm">Your algorithm score is higher than 85% of applicants.</p>
</div>
</div>
</div>
</div>
</div>
</main>
{/* Footer */}
<footer className="fixed bottom-0 left-[260px] right-0 bg-surface-container-lowest dark:bg-surface-container-high border-t border-outline-variant dark:border-outline py-xs z-30">
<div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-xs">
<p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 Recruit AI. All rights reserved.</p>
<div className="flex gap-lg">
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="#">Privacy Policy</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="#">Terms of Service</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="#">Resources</Link>
</div>
</div>
</footer>

    </>
  );
}
