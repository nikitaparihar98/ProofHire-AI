import React from 'react';
import { Link } from 'react-router-dom';

export default function CandidateProfile() {
  return (
    <>
      
{/* SideNavBar Anchor */}
<aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-lg px-md space-y-base z-40">
<div className="px-sm mb-xl">
<h1 className="text-headline-md font-headline-md font-bold text-primary">Recruit AI</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant">Candidate Portal</p>
</div>
<nav className="flex-1 space-y-xs">
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group" to="/candidate-dashboard">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-label-md text-label-md">Dashboard</span>
</Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group" to="/assessments-hub">
<span className="material-symbols-outlined">assignment</span>
<span className="font-label-md text-label-md">Assessments</span>
</Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group" to="/tasks-management">
<span className="material-symbols-outlined">checklist</span>
<span className="font-label-md text-label-md">Tasks</span>
</Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group" to="/interview-schedule">
<span className="material-symbols-outlined">video_call</span>
<span className="font-label-md text-label-md">Interviews</span>
</Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all rounded-lg group" to="/account-settings">
<span className="material-symbols-outlined">settings</span>
<span className="font-label-md text-label-md">Settings</span>
</Link>
</nav>
<div className="mt-auto space-y-md">
<button onClick={() => alert('This feature is coming soon!')} className="w-full py-sm px-md flex items-center justify-center gap-sm bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined">help</span>
                Help Center
            </button>
{/* Active Profile Tab (Hierarchy Priority 1: Exact Match) */}
<div className="p-sm bg-secondary-container text-on-secondary-container font-bold rounded-lg flex items-center gap-md scale-[0.98]">
<div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
<img alt="Alex Johnson" className="w-full h-full object-cover" data-alt="A professional headshot of a mid-30s male with a kind, intelligent expression. He is wearing a modern charcoal sweater against a soft-focus office background with warm, cinematic lighting. The visual style is crisp, high-resolution, and corporate-minimalist, adhering to a clean slate and white color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg3EmYhbxiVk31XE-XS9fvLHwcJ12rabykCWWajdplwCeX_4RhPn9X3K0P8IvZdSf6OPOsLp20Y4upbnN3_NqxCh73SfGguRRbzm4nKviI42zs33K9hJa2hYCR6z_yyH-rotf-rKbI_XYx-y2EJXLuaJShnIyyhfNH_MRLJLNPR_4b-LYUGaZsL9gbTxxxPOvLWJD_kYZ0mBJU8pNjiQ-96hDuJmO-FmPSb4ZMjkUUSr6Tn9RoGs-2gTx1gl7EXcPrGaU4yd69ZR4"/>
</div>
<div className="flex flex-col overflow-hidden">
<span className="font-label-md text-label-md truncate">Alex Johnson</span>
<span className="font-label-sm text-label-sm opacity-80 truncate">View Profile</span>
</div>
</div>
</div>
</aside>
{/* Main Content Canvas */}
<main className="ml-[260px] min-h-screen p-margin-desktop max-w-[1440px]">
{/* Top Bar / Header Action */}
<header className="flex justify-between items-start mb-xl">
<div className="flex gap-lg items-center">
<div className="w-24 h-24 rounded-xl border border-outline-variant overflow-hidden bg-white shadow-sm">
<img alt="Alex Johnson" className="w-full h-full object-cover" data-alt="Close up professional portrait of a software engineer named Alex Johnson. He has short hair and a focused look. The background is a clean, minimalist studio setting with cool, daylight lighting. The image style is sharp and modern to fit a high-end corporate recruiting platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPleG_p99D7o5tepYyqCDrGTA81im-cB0JUEgt1AVOOoAbABy8RROl1QNsuSJ6uA4Gq77w04B1T6hhjNOVN8ofwlyzg1joTMocLb3Mh9Si3bH0Gf2Ml4qH47DFqCwmnt47Rv0sCiZCBGFx5pRF5d0bALMF8YGfJsjNz-ytk_iMcyT-nc04y8McSA6gDwr3AIqOUarYzdq_eyYw5yINvFvTXPPIYg8sEmocan0834dfWTCB8VSDoEc6ty6Ec4W2DBPnWFCtnA6Guhk"/>
</div>
<div>
<h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">Alex Johnson</h2>
<p className="font-headline-sm text-headline-sm text-secondary mb-xs">Senior Frontend Engineer</p>
<div className="flex items-center gap-md text-on-surface-variant">
<span className="flex items-center gap-xs font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">location_on</span>
                            San Francisco, CA
                        </span>
<span className="flex items-center gap-xs font-label-md text-label-md">
<span className="material-symbols-outlined text-[18px]">mail</span>
                            alex.johnson@recruitai.dev
                        </span>
</div>
</div>
</div>
<Link to="/account-settings" className="bg-primary text-on-primary px-xl h-12 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-sm">
<span className="material-symbols-outlined">edit</span>
                Edit Profile
            </Link>
</header>
{/* Bento Grid Layout */}
<div className="grid grid-cols-12 gap-lg">
{/* Left Column: About & Experience */}
<div className="col-span-12 lg:col-span-8 space-y-lg">
{/* Summary Card */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl">
<h3 className="font-headline-md text-headline-md text-primary mb-md">About</h3>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                        Accomplished Frontend Engineer with 8+ years of experience building high-performance, scalable web applications. Specialist in React, TypeScript, and modern design systems. Passionate about creating intuitive user experiences and leading cross-functional teams to deliver pixel-perfect products. Previously scaled core components at high-growth SaaS startups.
                    </p>
</section>
{/* Experience Timeline */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl">
<h3 className="font-headline-md text-headline-md text-primary mb-xl">Experience</h3>
<div className="space-y-xl">
{/* Experience Item */}
<div className="flex gap-lg relative">
<div className="flex flex-col items-center">
<div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/10 mt-2"></div>
<div className="w-[2px] h-full bg-outline-variant absolute top-5"></div>
</div>
<div className="pb-base">
<h4 className="font-headline-sm text-headline-sm text-primary">Senior Software Engineer</h4>
<p className="font-label-md text-label-md text-secondary">CloudScale AI • Jan 2021 — Present</p>
<p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                                    Lead the frontend architecture migration to a headless CMS architecture, improving page load speeds by 45%. Mentor junior developers and established code review standards for the 15-person engineering team.
                                </p>
</div>
</div>
{/* Experience Item */}
<div className="flex gap-lg relative">
<div className="flex flex-col items-center">
<div className="w-3 h-3 rounded-full bg-outline-variant mt-2"></div>
<div className="w-[2px] h-full bg-outline-variant absolute top-5"></div>
</div>
<div className="pb-base">
<h4 className="font-headline-sm text-headline-sm text-primary">Frontend Developer</h4>
<p className="font-label-md text-label-md text-on-surface-variant">Nexus Dynamics • Mar 2018 — Dec 2020</p>
<p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                                    Developed and maintained 30+ micro-frontend modules using React and Redux. Reduced bundle sizes by 30% through advanced tree-shaking and dynamic imports.
                                </p>
</div>
</div>
{/* Experience Item */}
<div className="flex gap-lg relative">
<div className="flex flex-col items-center">
<div className="w-3 h-3 rounded-full bg-outline-variant mt-2"></div>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-primary">Junior Web Developer</h4>
<p className="font-label-md text-label-md text-on-surface-variant">Pivot Solutions • Jun 2015 — Feb 2018</p>
<p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                                    Implemented responsive UI components from Figma designs and assisted in the transition from jQuery to Vue.js.
                                </p>
</div>
</div>
</div>
</section>
</div>
{/* Right Column: Skills & Badges */}
<div className="col-span-12 lg:col-span-4 space-y-lg">
{/* Skills Card */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl">
<h3 className="font-headline-md text-headline-md text-primary mb-md">Expertise</h3>
<div className="flex flex-wrap gap-sm">
<span className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">React.js</span>
<span className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">TypeScript</span>
<span className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">Tailwind CSS</span>
<span className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">Node.js</span>
<span className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">Next.js</span>
<span className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">System Design</span>
<span className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">GraphQL</span>
</div>
</section>
{/* Platform Assessment Badges */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl">
<h3 className="font-headline-md text-headline-md text-primary mb-md">Verified Assessments</h3>
<div className="space-y-md">
<div className="flex items-center gap-md p-md bg-secondary-fixed/30 rounded-lg border border-secondary/10">
<span className="material-symbols-outlined text-secondary text-[32px]" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
<div>
<p className="font-label-md text-label-md text-primary">Elite React Specialist</p>
<p className="font-label-sm text-label-sm text-on-secondary-fixed-variant">Top 1% Global Score</p>
</div>
</div>
<div className="flex items-center gap-md p-md bg-tertiary-fixed/30 rounded-lg border border-tertiary/10">
<span className="material-symbols-outlined text-primary text-[32px]" style={{"fontVariationSettings":"'FILL' 1"}}>terminal</span>
<div>
<p className="font-label-md text-label-md text-primary">Algorithmic Mastery</p>
<p className="font-label-sm text-label-sm text-on-tertiary-fixed-variant">Score: 948 / 1000</p>
</div>
</div>
<div className="flex items-center gap-md p-md bg-surface-container-high rounded-lg border border-outline-variant">
<span className="material-symbols-outlined text-on-surface-variant text-[32px]">groups</span>
<div>
<p className="font-label-md text-label-md text-primary">Leadership Core</p>
<p className="font-label-sm text-label-sm text-on-surface-variant">Team Lead Verified</p>
</div>
</div>
</div>
</section>
{/* Education Timeline (Compact) */}
<section className="bg-surface-container-lowest border border-outline-variant p-xl rounded-xl">
<h3 className="font-headline-md text-headline-md text-primary mb-md">Education</h3>
<div className="space-y-lg">
<div className="flex gap-md">
<span className="material-symbols-outlined text-outline">school</span>
<div>
<h4 className="font-label-md text-label-md text-primary">B.S. Computer Science</h4>
<p className="font-label-sm text-label-sm text-on-surface-variant">Stanford University • 2011 — 2015</p>
</div>
</div>
<div className="flex gap-md">
<span className="material-symbols-outlined text-outline">workspace_premium</span>
<div>
<h4 className="font-label-md text-label-md text-primary">Advanced System Architecture</h4>
<p className="font-label-sm text-label-sm text-on-surface-variant">Professional Certification</p>
</div>
</div>
</div>
</section>
</div>
</div>
{/* Footer Shell Integration */}
<footer className="mt-xl border-t border-outline-variant pt-xl flex flex-col md:flex-row justify-between items-center w-full max-w-[1440px]">
<span className="font-body-sm text-body-sm text-on-surface-variant">© 2024 Recruit AI. All rights reserved.</span>
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
