import React from 'react';
import { Link } from 'react-router-dom';

export default function InterviewSchedule() {
  return (
    <>
      
<aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-lg px-md space-y-base z-50">
<div className="flex items-center px-sm mb-xl">
<span className="text-headline-md font-headline-md font-bold text-primary mr-base">Recruit AI</span>
</div>
<nav className="flex-1 space-y-xs">
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/candidate-dashboard">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                Dashboard
            </Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/assessments-hub">
<span className="material-symbols-outlined" data-icon="assignment">assignment</span>
                Assessments
            </Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/tasks-management">
<span className="material-symbols-outlined" data-icon="checklist">checklist</span>
                Tasks
            </Link>
<Link className="flex items-center gap-md px-md py-sm bg-secondary-container text-on-secondary-container font-bold rounded-lg scale-[0.98] transition-transform duration-150 font-label-md text-label-md" to="/interview-schedule">
<span className="material-symbols-outlined" data-icon="video_call" style={{"fontVariationSettings":"'FILL' 1"}}>video_call</span>
                Interviews
            </Link>
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="/account-settings">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
                Settings
            </Link>
</nav>
<div className="pt-base border-t border-outline-variant">
<Link className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-high transition-all font-label-md text-label-md rounded-lg" to="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
                Help Center
            </Link>
<div className="flex items-center gap-md px-md py-lg mt-base">
<div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-label-sm">
                    AJ
                </div>
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface">Alex Johnson</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Candidate Portal</span>
</div>
</div>
</div>
</aside>
<main className="ml-[260px] min-h-screen p-margin-desktop max-w-[1440px]">
<header className="mb-xl flex justify-between items-end">
<div>
<h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">Interviews</h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your meeting schedule and review past performance.</p>
</div>
<div className="flex gap-sm">
<button onClick={() => alert('This feature is coming soon!')} className="bg-surface-container-low border border-outline-variant px-lg py-sm rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    View Calendar
                </button>
</div>
</header>
<section className="mb-xl">
<div className="flex items-center gap-sm mb-lg">
<h2 className="font-headline-lg text-headline-lg text-primary">Upcoming Interviews</h2>
<span className="px-base py-xs bg-secondary-fixed text-on-secondary-fixed rounded-full font-label-sm text-label-sm">2 Scheduled</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl hover:shadow-[0px_4px_12px_rgba(15,23,42,0.05)] transition-all flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-md">
<img alt="Interviewer" className="w-12 h-12 rounded-full object-cover" data-alt="A professional headshot of a female tech recruiter with a warm, confident expression. She is in a brightly lit, modern office environment with blurred glass partitions in the background. The aesthetic is clean, corporate, and sophisticated, using a high-key lighting style that aligns with a light-mode UI design. The color palette is dominated by professional whites and soft grays." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg2wv1oIow6MDDffA2cx7dKFCbVgIng8vkUS2WbSOZyPoHhZ2Lw96KNbZJm7FwebNN-OQaZXBF1P4muVUi9fAuhufe6NSvN8wH7bBHuD3vf7xEoOxsBCVZyqu5IeTFbYo6wlSzEdoNG7LnI7QIf2O9V0vLS5Ww6dMZfBAxo6XYiX4YidpMLCJFiccPedrGwH87ctp28KSNZ61jeTx2cvW-6SDBvVZMCWdtOue8ApJIscAnCC_Vhnf1eUeq2FEvsMSU4Q-R_T1B-kM"/>
<div>
<h3 className="font-headline-sm text-headline-sm text-primary">Sarah Mitchell</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Senior Engineering Lead • Tech Core</p>
</div>
</div>
<span className="px-base py-xs bg-surface-container-high text-on-surface-variant rounded font-label-sm text-label-sm">Video Call</span>
</div>
<div className="space-y-base mb-lg">
<div className="flex items-center gap-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="work">work</span>
<span className="font-body-md text-body-md">Senior Frontend Developer</span>
</div>
<div className="flex items-center gap-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="calendar_today">calendar_today</span>
<span className="font-body-md text-body-md">Thursday, Oct 24 • 10:30 AM - 11:30 AM</span>
</div>
</div>
</div>
<Link className="w-full bg-secondary text-on-secondary py-md rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm hover:opacity-90 transition-opacity" to="#">
<span className="material-symbols-outlined text-[20px]" data-icon="videocam">videocam</span>
                        Join Meeting
                    </Link>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl hover:shadow-[0px_4px_12px_rgba(15,23,42,0.05)] transition-all flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-md">
<div className="flex items-center gap-md">
<img alt="Interviewer" className="w-12 h-12 rounded-full object-cover" data-alt="A sharp, professional portrait of a male hiring manager in a tailored suit. He is standing against a minimalist, architectural background with clean lines and soft daylight. The image has a premium, executive-grade quality with a focus on reliability and professionalism. The lighting is soft and even, perfect for a high-end corporate SaaS platform interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuApIE49S8DN32YWddqQkT-4YFraYeyP6t-6km3bovBFdITCp1KoVTIu4SkFPZJBhPZl7lDZHkq2LtwPHw6R0Lc8PPujHO3YE30Nqq12eq6P1JcKKNQ1lOIZ2U_zOEbzHc7oKfirBBDTrWK4uk0BjxG8-yE77y-3Z78KAhXt1OFs-l2XNsj_lhPYuyVVy60M7vekhvEecvFZfIHCpBn6_Z80Ohkl5aoOCW8xuQT4Xxlun585NUQoYud2tZomJNKptgOxCZbvNwb6kMs"/>
<div>
<h3 className="font-headline-sm text-headline-sm text-primary">David Chen</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Product Recruitment • Global Talent</p>
</div>
</div>
<span className="px-base py-xs bg-surface-container-high text-on-surface-variant rounded font-label-sm text-label-sm">System Design</span>
</div>
<div className="space-y-base mb-lg">
<div className="flex items-center gap-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="work">work</span>
<span className="font-body-md text-body-md">Senior Frontend Developer</span>
</div>
<div className="flex items-center gap-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="calendar_today">calendar_today</span>
<span className="font-body-md text-body-md">Friday, Oct 25 • 02:00 PM - 03:00 PM</span>
</div>
</div>
</div>
<button onClick={() => alert('This feature is coming soon!')} className="w-full bg-surface-container-high text-outline py-md rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm cursor-not-allowed" disabled="">
<span className="material-symbols-outlined text-[20px]" data-icon="videocam">videocam</span>
                        Join Link Active in 24h
                    </button>
</div>
</div>
</section>
<section className="mb-xl">
<h2 className="font-headline-lg text-headline-lg text-primary mb-lg">Past Interviews</h2>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
<table className="w-full text-left">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Interviewer</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Role</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Date</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Outcome</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant">Feedback</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center text-label-sm font-bold">MK</div>
<span className="font-body-md text-body-md text-primary">Marcus King</span>
</div>
</td>
<td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">Initial Screening</td>
<td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">Oct 12, 2024</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-body-sm text-body-sm text-on-surface">Passed</span>
</div>
</td>
<td className="px-lg py-md">
<button onClick={() => alert('This feature is coming soon!')} className="text-secondary font-label-md text-label-md hover:underline">View Summary</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-surface-container-highest text-outline flex items-center justify-center text-label-sm font-bold">HR</div>
<span className="font-body-md text-body-md text-primary">HR Connect</span>
</div>
</td>
<td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">Cultural Fit</td>
<td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">Oct 08, 2024</td>
<td className="px-lg py-md">
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-body-sm text-body-sm text-on-surface">Passed</span>
</div>
</td>
<td className="px-lg py-md">
<button onClick={() => alert('This feature is coming soon!')} className="text-secondary font-label-md text-label-md hover:underline">View Summary</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<section className="mb-xl">
<div className="bg-surface-container-low rounded-xl p-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center">
<div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-md">
<span className="material-symbols-outlined text-outline text-[32px]" data-icon="event_busy">event_busy</span>
</div>
<h3 className="font-headline-md text-headline-md text-primary mb-xs">No more interviews scheduled</h3>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md">Once you are moved to the next stage by a recruiter, your new interview details will appear here.</p>
<button onClick={() => alert('This feature is coming soon!')} className="mt-lg px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
                    Check Application Status
                </button>
</div>
</section>
<footer className="w-full py-xl border-t border-outline-variant flex flex-col md:flex-row justify-between items-center mt-xl">
<p className="font-label-sm text-label-sm text-on-surface-variant mb-md md:mb-0">© 2024 Recruit AI. All rights reserved.</p>
<div className="flex gap-lg">
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Privacy Policy</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Terms of Service</Link>
<Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" to="#">Contact Us</Link>
</div>
</footer>
</main>

    </>
  );
}
