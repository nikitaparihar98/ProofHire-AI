import React from 'react';
import { Link } from 'react-router-dom';

export default function AssessmentsHub() {
  return (
    <>
      
{/* SideNavBar */}
<aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest dark:bg-surface-container-low border-r border-outline-variant dark:border-outline flex flex-col h-full py-lg px-md space-y-base z-40">
<div className="mb-xl px-xs">
<h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-on-primary-fixed">Recruit AI</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant">Candidate Portal</p>
</div>
<nav className="flex-1 space-y-xs">
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all font-label-md text-label-md" to="/candidate-dashboard">
<span className="material-symbols-outlined">dashboard</span>
                Dashboard
            </Link>
<Link className="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container font-bold rounded-lg scale-[0.98] transition-transform duration-150 font-label-md text-label-md" to="/assessments-hub">
<span className="material-symbols-outlined" style={{"fontVariationSettings":"'FILL' 1"}}>assignment</span>
                Assessments
            </Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all font-label-md text-label-md" to="/tasks-management">
<span className="material-symbols-outlined">checklist</span>
                Tasks
            </Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all font-label-md text-label-md" to="/interview-schedule">
<span className="material-symbols-outlined">video_call</span>
                Interviews
            </Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant dark:text-on-secondary-fixed-variant hover:bg-surface-container-high transition-all font-label-md text-label-md" to="/account-settings">
<span className="material-symbols-outlined">settings</span>
                Settings
            </Link>
</nav>
<div className="pt-base border-t border-outline-variant mt-auto">
<button onClick={() => alert('This feature is coming soon!')} className="w-full text-left flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md">
<span className="material-symbols-outlined">help_outline</span>
                Help Center
            </button>
<div className="flex items-center gap-md px-md py-md mt-sm">
<span className="material-symbols-outlined text-[32px]">account_circle</span>
<div className="overflow-hidden">
<p className="font-label-md text-label-md truncate">Alex Johnson</p>
</div>
</div>
</div>
</aside>
{/* Main Content */}
<main className="ml-[260px] p-margin-desktop max-w-[1440px]">
{/* Header */}
<header className="mb-xl">
<h2 className="font-headline-xl text-headline-xl text-primary mb-xs">Assessments</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Demonstrate your skills through our structured evaluation process. Track your progress, complete pending quizzes, and review your performance metrics.
            </p>
</header>
{/* Stats Row */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex items-center gap-lg">
<div className="h-12 w-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
<span className="material-symbols-outlined">analytics</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Assessments</p>
<p className="font-headline-lg text-headline-lg">12</p>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex items-center gap-lg">
<div className="h-12 w-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
<span className="material-symbols-outlined">check_circle</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Completed</p>
<p className="font-headline-lg text-headline-lg text-secondary">08</p>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex items-center gap-lg">
<div className="h-12 w-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
<span className="material-symbols-outlined">pending</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">In Progress</p>
<p className="font-headline-lg text-headline-lg">04</p>
</div>
</div>
</section>
{/* Assessment Grid */}
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
{/* Assessment Card 1 */}
<div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
<div className="p-lg flex-1">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Completed</span>
</div>
<p className="font-headline-sm text-headline-sm text-secondary">92%</p>
</div>
<h3 className="font-headline-md text-headline-md mb-xs">Technical Skill Evaluation</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Advanced React and System Design patterns assessment for Senior Engineer roles.</p>
<div className="flex items-center gap-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">schedule</span>
<span className="font-label-sm text-label-sm">Completed on Oct 12, 2023</span>
</div>
</div>
<div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex justify-end">
<button onClick={() => alert('This feature is coming soon!')} className="px-md py-sm bg-white border border-outline text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-colors">View Results</button>
</div>
</div>
{/* Assessment Card 2 */}
<div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
<div className="p-lg flex-1">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-yellow-500"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant">In Progress</span>
</div>
<span className="font-label-sm text-label-sm bg-surface-container p-1 rounded">4/10 Questions</span>
</div>
<h3 className="font-headline-md text-headline-md mb-xs">Algorithm Logic Quiz</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-md">A timed test covering Big O notation, data structures, and optimization logic.</p>
<div className="w-full bg-surface-container h-1 rounded-full mb-md">
<div className="bg-secondary h-1 rounded-full w-[40%]"></div>
</div>
</div>
<div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex justify-end">
<button onClick={() => alert('This feature is coming soon!')} className="px-md py-sm bg-secondary text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity">Resume</button>
</div>
</div>
{/* Assessment Card 3 */}
<div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
<div className="p-lg flex-1">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Not Started</span>
</div>
</div>
<h3 className="font-headline-md text-headline-md mb-xs">Culture Fit Questionnaire</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-md">A non-technical assessment to understand your workplace values and collaboration style.</p>
<div className="flex items-center gap-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">timer</span>
<span className="font-label-sm text-label-sm">Est: 15 mins</span>
</div>
</div>
<div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex justify-end">
<button onClick={() => alert('This feature is coming soon!')} className="px-md py-sm bg-primary text-white font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity">Start Assessment</button>
</div>
</div>
{/* Assessment Card 4 (Locked) */}
<div className="bg-surface-container-low border border-outline-variant opacity-70 rounded-xl flex flex-col overflow-hidden">
<div className="p-lg flex-1">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px] text-outline">lock</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Locked</span>
</div>
</div>
<h3 className="font-headline-md text-headline-md mb-xs">Security Architecture Case</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Unlock by completing the Technical Skill Evaluation with a score above 80%.</p>
</div>
<div className="px-lg py-md bg-surface-container-high border-t border-outline-variant flex justify-end">
<button onClick={() => alert('This feature is coming soon!')} className="px-md py-sm bg-outline text-white font-label-md text-label-md rounded-lg cursor-not-allowed" disabled="">Locked</button>
</div>
</div>
{/* Assessment Card 5 */}
<div className="bg-white border border-outline-variant rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
<div className="p-lg flex-1">
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Completed</span>
</div>
<p className="font-headline-sm text-headline-sm text-secondary">85%</p>
</div>
<h3 className="font-headline-md text-headline-md mb-xs">Frontend Performance Audit</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-md">Practical exercise focusing on Core Web Vitals and asset optimization techniques.</p>
</div>
<div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex justify-end">
<button onClick={() => alert('This feature is coming soon!')} className="px-md py-sm bg-white border border-outline text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-colors">View Results</button>
</div>
</div>
{/* Promotion Card / CTA */}
<div className="relative bg-primary-container text-on-primary-container rounded-xl flex flex-col overflow-hidden">
<div className="absolute top-0 right-0 p-lg opacity-20">
<span className="material-symbols-outlined text-[120px]" style={{"fontVariationSettings":"'FILL' 1"}}>psychology</span>
</div>
<div className="p-lg flex-1 relative z-10">
<h3 className="font-headline-md text-headline-md mb-md text-on-primary">Practice Assessments</h3>
<p className="font-body-sm text-body-sm text-on-primary-container mb-lg">Access our sandbox environment to sharpen your skills before taking the official evaluation.</p>
<button onClick={() => alert('This feature is coming soon!')} className="flex items-center gap-sm font-label-md text-label-md text-secondary-fixed hover:underline">
                        Explore sandbox
                        <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</section>
{/* Footer */}
<footer className="w-full py-xl mt-xl flex flex-col md:flex-row justify-between items-center border-t border-outline-variant">
<p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 Recruit AI. All rights reserved.</p>
<div className="flex gap-lg mt-md md:mt-0">
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Privacy Policy</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Terms of Service</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Contact Us</Link>
</div>
</footer>
</main>

    </>
  );
}
