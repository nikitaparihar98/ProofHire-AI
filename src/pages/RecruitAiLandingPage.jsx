import React from 'react';
import { Link } from 'react-router-dom';

export default function RecruitAiLandingPage() {
  return (
    <>
      
{/* TopNavBar */}
<nav className="docked full-width top-0 sticky z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm">
<div className="flex justify-between items-center w-full px-margin-desktop h-16 max-w-[1440px] mx-auto">
<div className="flex items-center gap-xl">
<span className="font-headline-lg text-headline-lg font-bold text-primary">Recruit AI</span>
<div className="hidden md:flex gap-lg">
<Link className="text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md" to="#">About</Link>
</div>
</div>
<div className="flex items-center gap-md">
<Link to="/candidate-dashboard" className="px-md py-xs text-on-surface-variant font-label-md text-label-md hover:opacity-80 transition-opacity">Login</Link>
</div>
</div>
</nav>
<main className="max-w-[1440px] mx-auto px-margin-desktop py-xl">
{/* Hero Section */}
<section className="mb-xl">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center min-h-[614px]">
<div>
<h1 className="font-headline-xl text-headline-xl text-primary mb-md">
                        Intelligence Redefined for the Future of Recruitment.
                    </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-xl">
                        Recruit AI leverages advanced neural processing to bridge the gap between world-class talent and high-growth enterprises. Precision-engineered for efficiency.
                    </p>
<div className="flex gap-md">
<a href="#demo-section" className="bg-secondary-container text-on-secondary-container px-xl py-md rounded-xl font-headline-sm text-headline-sm hover:scale-[0.98] transition-transform">
                            Watch Demo
                        </a>
</div>
</div>
<div className="relative">
<div className="rounded-full overflow-hidden aspect-square bg-slate-200 border border-outline-variant shadow-sm relative z-10">
<img alt="Professional working with AI interface" className="w-full h-full object-cover" data-alt="A professional woman in a sleek, modern corporate office environment interacting with a transparent glass display featuring glowing blue data visualizations and AI network patterns. The lighting is crisp and cool, emphasizing a high-tech, professional SaaS aesthetic. Soft daylight filters through floor-to-ceiling windows in the background, creating a bright and trustworthy atmosphere. The overall style is clean, sophisticated, and focused on executive-level productivity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDulBTcoHCbNpL_yx62ykmnf5Hw9SZifabqGC4qdHu_1QcgjZeyGckdAwVzHhYgQanmyWn5ueKCwnlQnL0ofqRhzWzkMUMV0DxvYn0bLE0LRV0A6E3Uvl7ELSuckfSmQxiJ7LH12g-IOXOjQ2b6rFvZ_skoI5ZvORNl5k066BwTOR8amiClKJx1imOii9Oaj4faPKsWx6kjWS5BmUBrXH4m-0Sgyeayw3yrIyLzchUmB6jB0h3c2t5xCjAcqQm8VMqaa24Qd4zg0sM"/>
</div>
<div className="absolute -bottom-4 -left-4 bg-white p-lg rounded-xl shadow-lg border border-outline-variant z-20 max-w-[240px]">
<div className="flex items-center gap-sm mb-xs">
<span className="material-symbols-outlined text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>check_circle</span>
<span className="font-label-md text-label-md text-on-surface">Candidate Matching</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">98% Accuracy achieved using predictive behavioral analytics.</p>
</div>
</div>
</div>
</section>
{/* Demo & How It Works Section */}
<section id="demo-section" className="py-xl my-xl border-t border-outline-variant">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
<div className="order-2 lg:order-1">
<h2 className="font-headline-lg text-headline-lg text-primary mb-md">How Recruit AI Works</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg">
Our platform seamlessly connects top talent with world-class recruiters through an intelligent, automated pipeline.
</p>
<div className="space-y-md">
<div className="flex items-start gap-sm">
<span className="material-symbols-outlined text-secondary mt-1">person_search</span>
<div>
<h3 className="font-headline-sm text-headline-sm text-primary">For Candidates</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Upload your resume, verify the AI-extracted details, and instantly access a personalized dashboard with matched opportunities and assessments.</p>
</div>
</div>
<div className="flex items-start gap-sm">
<span className="material-symbols-outlined text-secondary mt-1">corporate_fare</span>
<div>
<h3 className="font-headline-sm text-headline-sm text-primary">For Recruiters</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Review AI-ranked candidate profiles, manage interviews, and track assessment progress all from a centralized, high-velocity dashboard.</p>
</div>
</div>
</div>
</div>
<div className="order-1 lg:order-2 bg-slate-100 rounded-xl border border-outline-variant shadow-sm overflow-hidden aspect-video relative flex items-center justify-center">
<video className="w-full h-full object-cover" controls poster="https://lh3.googleusercontent.com/aida-public/AB6AXuDulBTcoHCbNpL_yx62ykmnf5Hw9SZifabqGC4qdHu_1QcgjZeyGckdAwVzHhYgQanmyWn5ueKCwnlQnL0ofqRhzWzkMUMV0DxvYn0bLE0LRV0A6E3Uvl7ELSuckfSmQxiJ7LH12g-IOXOjQ2b6rFvZ_skoI5ZvORNl5k066BwTOR8amiClKJx1imOii9Oaj4faPKsWx6kjWS5BmUBrXH4m-0Sgyeayw3yrIyLzchUmB6jB0h3c2t5xCjAcqQm8VMqaa24Qd4zg0sM">
<source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
Your browser does not support the video tag.
</video>
<div className="absolute top-4 left-4 bg-black/60 text-white px-md py-xs rounded-lg font-label-sm backdrop-blur-md">
Platform Demo
</div>
</div>
</div>
</section>

{/* Bento Grid "What it does" */}
<section className="py-xl">
<div className="text-center mb-xl">
<h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Productive Minimalism</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Engineered for clarity and high-velocity talent pipelines.</p>
</div>
<div className="bento-grid">
{/* Large Card */}
<div className="col-span-12 md:col-span-8 bg-white border border-outline-variant p-xl rounded-xl shadow-sm hover:shadow-md transition-shadow">
<div className="flex flex-col h-full">
<span className="material-symbols-outlined text-secondary mb-md text-3xl">psychology</span>
<h3 className="font-headline-md text-headline-md mb-sm">AI-Driven Assessments</h3>
<p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                            Our proprietary engine evaluates technical proficiency and cultural alignment through automated, non-biased screening tools that save hundreds of human hours.
                        </p>
<div className="mt-auto rounded-lg overflow-hidden border border-outline-variant">
<img alt="Data visualization dashboard" className="w-full h-48 object-cover" data-alt="A clean and highly detailed software dashboard displaying recruitment analytics, with sleek line graphs, circular progress charts, and candidate profile snapshots. The user interface follows a modern corporate aesthetic with a palette of slate greys, crisp whites, and professional blues. The lighting is even and bright, suggesting a workspace during peak productivity hours. The visual style is minimal, data-dense, and professional." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3Q9a5UysQgv66gIaCpL67DbrThURl_gH4gF7JQmR3SQ1JEGQOu-Oep1N6rtEIdQ-9w5amDq-NDBuJGsbQ2mbUtirfTuNZ3dOd-UGN8ks5gvXGUCUYgoryTyjV_lhRMrEv6FA3IDzTao9QCzt-ZbwteQtZ1_PL2OH4vv5DbQhnht5jz60a9IgyUDLJEDZRkqPJg_BT6iruhj-UhaR-SRnzl_cvhhy0SMzbUiAovR4kKdf9EYHB8spQZctnYfL5wCKOw4D53rqioNc"/>
</div>
</div>
</div>
{/* Small Card 1 */}
<div className="col-span-12 md:col-span-4 bg-primary text-on-primary p-xl rounded-xl shadow-sm hover:scale-[1.01] transition-transform">
<span className="material-symbols-outlined text-primary-fixed mb-md text-3xl">bolt</span>
<h3 className="font-headline-md text-headline-md mb-sm">Instant Sync</h3>
<p className="font-body-sm text-body-sm text-on-primary-fixed-variant">
                        Connect with your existing ATS and calendar systems in seconds. Real-time updates across all platforms ensure no candidate is left behind.
                    </p>
</div>
{/* Small Card 2 */}
<div className="col-span-12 md:col-span-4 bg-surface-container-low border border-outline-variant p-xl rounded-xl shadow-sm">
<span className="material-symbols-outlined text-secondary mb-md text-3xl">diversity_3</span>
<h3 className="font-headline-md text-headline-md mb-sm">Collaborative Hiring</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                        Centralized feedback loops for hiring managers and recruiters to align on top talent faster.
                    </p>
</div>
{/* Large Card 2 */}
<div className="col-span-12 md:col-span-8 bg-white border border-outline-variant p-xl rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-lg">
<div className="w-1/2">
<span className="material-symbols-outlined text-secondary mb-md text-3xl">verified_user</span>
<h3 className="font-headline-md text-headline-md mb-sm">Secure &amp; Compliant</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                            Enterprise-grade security with GDPR and SOC2 compliance baked into every interaction. Your data privacy is our highest priority.
                        </p>
</div>
<div className="w-1/2 h-full min-h-[160px] bg-slate-50 rounded-lg border border-outline-variant flex items-center justify-center">
<span className="material-symbols-outlined text-outline-variant text-5xl">shield</span>
</div>
</div>
</div>
</section>
{/* Split Login/Signup Path */}
<section className="py-xl my-xl">
<div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-outline-variant shadow-lg">
{/* Candidate Path */}
<div className="bg-white p-xl flex flex-col items-center text-center border-r border-outline-variant group">
<div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-lg group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors">
<span className="material-symbols-outlined text-4xl">person_search</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-primary mb-md">Are you a Candidate?</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-xl max-w-sm">
                        Find your next career milestone. Create a professional profile and let our AI match you with companies that value your skills.
                    </p>
<div className="flex flex-col w-full max-w-xs gap-sm">
<Link to="/resume-verification" className="bg-secondary-container text-on-secondary-container py-md rounded-xl font-headline-sm text-headline-sm hover:scale-[0.98] transition-transform text-center inline-block w-full">
                            Upload Resume
                        </Link>
</div>
</div>
{/* Recruiter Path */}
<div className="bg-primary text-on-primary p-xl flex flex-col items-center text-center group">
<div className="w-20 h-20 bg-on-primary-fixed-variant rounded-full flex items-center justify-center mb-lg group-hover:bg-white group-hover:text-primary transition-colors">
<span className="material-symbols-outlined text-4xl">corporate_fare</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-white mb-md">Are you a Recruiter?</h2>
<p className="font-body-md text-body-md text-primary-fixed-dim mb-xl max-w-sm">
                        Scale your team with precision. Access the world's most talented pool and automate your screening process today.
                    </p>
<div className="flex flex-col w-full max-w-xs gap-sm">
<Link to="/tasks-management" className="bg-white text-primary py-md rounded-xl font-headline-sm text-headline-sm hover:scale-[0.98] transition-transform text-center inline-block w-full">
                            Start Hiring
                        </Link>
<button onClick={() => alert('This feature is coming soon!')} className="text-primary-fixed font-label-md text-label-md hover:underline">
                            Request Enterprise Demo
                        </button>
</div>
</div>
</div>
</section>
</main>
{/* Footer */}
<footer className="w-full py-xl mt-auto bg-surface-container-lowest border-t border-outline-variant">
<div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-md">
<div className="flex flex-col gap-sm max-w-xs">
<span className="font-headline-sm text-headline-sm font-bold text-primary">Recruit AI</span>
<p className="font-body-sm text-body-sm text-on-surface-variant">
                    Precision engineering for the global talent economy.
                </p>
<span className="font-body-sm text-body-sm text-on-surface-variant mt-md">© 2024 Recruit AI. All rights reserved.</span>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
<div className="flex flex-col gap-sm">
<Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" to="#">Resources</Link>
</div>
<div className="flex flex-col gap-sm">
<span className="font-label-md text-label-md text-primary mb-xs">Company</span>
<Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" to="#">About</Link>
<Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" to="#">Contact Us</Link>
</div>
<div className="flex flex-col gap-sm">
<span className="font-label-md text-label-md text-primary mb-xs">Legal</span>
<Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" to="#">Privacy Policy</Link>
<Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary hover:underline decoration-secondary transition-all" to="#">Terms of Service</Link>
</div>
<div className="flex flex-col gap-sm">
<span className="font-label-md text-label-md text-primary mb-xs">Connect</span>
<div className="flex gap-sm">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary">public</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary">alternate_email</span>
</div>
</div>
</div>
</div>
</footer>

    </>
  );
}
