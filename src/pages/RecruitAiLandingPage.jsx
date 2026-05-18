import React from 'react';
import { Link } from 'react-router-dom';

export default function RecruitAiLandingPage() {
  return (
    <div className="font-body-md text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-margin-desktop h-20 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-xl">
            <span className="font-headline-lg text-headline-sm md:text-headline-sm font-black text-primary tracking-tighter">RECRUIT AI</span>
            <div className="hidden md:flex gap-lg">
              <Link className="text-secondary font-bold border-b-2 border-secondary pb-1 font-label-md text-label-md" to="#">About</Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <Link to="/login" className="px-md py-xs text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">Login</Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-[1440px] mx-auto pt-20">
        {/* Immersive Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-gradient px-margin-desktop py-xl">
          <div className="absolute inset-0 hero-pattern pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-center relative z-10 w-full">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-secondary/20 text-secondary rounded-full text-label-sm font-bold mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                THE FUTURE OF HUMAN CAPITAL
              </div>
              <h1 className="font-headline-xl text-primary mb-xl">
                Intelligence <span className="text-secondary">Redefined</span> for Modern Teams.
              </h1>
              <p className="font-body-lg text-on-surface-variant mb-xl max-w-xl leading-relaxed">
                Recruit AI leverages advanced neural processing to bridge the gap between world-class talent and high-growth enterprises. Precision-engineered for efficiency, speed, and undeniable scale.
              </p>
              {/* New Storytelling Snippet to fill gap */}
              <div className="flex items-start gap-md pt-8 border-t border-outline-variant/30">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 text-white">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-primary mb-1">Algorithmic Empathy</h4>
                  <p className="text-body-sm text-on-surface-variant max-w-sm">We don't just match keywords. We analyze career trajectories and cultural resonance to find the perfect fit.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative mt-16 lg:mt-0">
              <div className="relative w-full aspect-square md:aspect-video lg:aspect-square">
                {/* Platform Preview Mockup */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-[3rem] border border-white/50 backdrop-blur-sm overflow-hidden shadow-2xl animate-float">
                  <img alt="Recruit AI Platform Interface" className="w-full h-full object-cover opacity-90 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDulBTcoHCbNpL_yx62ykmnf5Hw9SZifabqGC4qdHu_1QcgjZeyGckdAwVzHhYgQanmyWn5ueKCwnlQnL0ofqRhzWzkMUMV0DxvYn0bLE0LRV0A6E3Uvl7ELSuckfSmQxiJ7LH12g-IOXOjQ2b6rFvZ_skoI5ZvORNl5k066BwTOR8amiClKJx1imOii9Oaj4faPKsWx6kjWS5BmUBrXH4m-0Sgyeayw3yrIyLzchUmB6jB0h3c2t5xCjAcqQm8VMqaa24Qd4zg0sM"/>
                  {/* Internal Floating Elements */}
                  <div className="absolute top-12 left-12 glass p-6 rounded-2xl shadow-xl max-w-[200px] border border-white/40">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Live Analysis</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full mb-2 overflow-hidden">
                      <div className="h-full bg-secondary w-3/4"></div>
                    </div>
                    <p className="text-[11px] font-medium text-on-surface">Match Affinity: 89%</p>
                  </div>
                </div>
                {/* Secondary Overlapping Card */}
                <div className="absolute -bottom-8 -left-8 md:-left-12 glass p-8 rounded-[2rem] shadow-2xl border border-white/60 z-20 max-w-[320px] transition-transform hover:scale-105 duration-500">
                  <div className="flex items-center gap-md mb-md">
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                      <span className="material-symbols-outlined text-white text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                    </div>
                    <div>
                      <div className="font-headline-sm text-primary">Candidate Match</div>
                      <div className="text-[11px] text-secondary font-black uppercase tracking-widest">Enterprise Precision</div>
                    </div>
                  </div>
                  <p className="font-body-sm text-on-surface-variant leading-relaxed">Our predictive behavioral analytics identifies potential stars before the market even notices them.</p>
                </div>
                {/* Abstract Decorative Blobs */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Storytelling Section */}
        <section className="py-32 px-margin-desktop bg-white border-y border-outline-variant/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-lowest/50 skew-x-12 transform origin-top-right"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-secondary font-black tracking-[0.2em] text-label-md mb-4 block uppercase">Our Mission</span>
            <h2 className="font-headline-lg text-primary mb-8">Building the connective tissue of the global workforce.</h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-12">
              Recruit AI was born from a simple observation: the brightest minds and the most impactful projects are often ships passing in the night. We use artificial intelligence not to replace human judgment, but to supercharge it, ensuring that every hire is a milestone in human potential.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl text-left">
              <div className="p-6 rounded-2xl border border-outline-variant/30 hover:border-secondary transition-colors">
                <span className="material-symbols-outlined text-secondary mb-2">visibility</span>
                <h4 className="font-headline-sm mb-1">Clarity</h4>
                <p className="text-body-sm text-on-surface-variant">Zero noise, only relevant candidates.</p>
              </div>
              <div className="p-6 rounded-2xl border border-outline-variant/30 hover:border-secondary transition-colors">
                <span className="material-symbols-outlined text-secondary mb-2">speed</span>
                <h4 className="font-headline-sm mb-1">Velocity</h4>
                <p className="text-body-sm text-on-surface-variant">Hire in days, not months.</p>
              </div>
              <div className="p-6 rounded-2xl border border-outline-variant/30 hover:border-secondary transition-colors">
                <span className="material-symbols-outlined text-secondary mb-2">balance</span>
                <h4 className="font-headline-sm mb-1">Equity</h4>
                <p className="text-body-sm text-on-surface-variant">Bias-free matching algorithms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-32 px-margin-desktop bg-surface-container-lowest">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="text-secondary font-black tracking-[0.2em] text-label-md mb-2 block uppercase">Platform Architecture</span>
            <h2 className="font-headline-lg text-primary mb-md">Productive Minimalism.</h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">An ecosystem designed for focus. We’ve removed every unnecessary click so you can focus on what matters: the people.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Large Feature Card */}
            <div className="md:col-span-8 group bg-white border border-outline-variant/30 rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl hover:border-secondary/20 transition-all duration-500 overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-xl items-center">
                <div className="lg:w-1/2">
                  <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-3xl flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                    <span className="material-symbols-outlined text-4xl">psychology</span>
                  </div>
                  <h3 className="font-headline-lg text-headline-md mb-4">Neural Assessment Engine</h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
                    Go beyond the resume. Our proprietary engine evaluates cognitive traits, technical depth, and cultural alignment through nuanced, AI-facilitated interactions.
                  </p>
                </div>
                <div className="lg:w-1/2 relative">
                  <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/50 shadow-inner group-hover:scale-105 transition-transform duration-700">
                    <img alt="Data visualization dashboard" className="w-full h-auto rounded-xl shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3Q9a5UysQgv66gIaCpL67DbrThURl_gH4gF7JQmR3SQ1JEGQOu-Oep1N6rtEIdQ-9w5amDq-NDBuJGsbQ2mbUtirfTuNZ3dOd-UGN8ks5gvXGUCUYgoryTyjV_lhRMrEv6FA3IDzTao9QCzt-ZbwteQtZ1_PL2OH4vv5DbQhnht5jz60a9IgyUDLJEDZRkqPJg_BT6iruhj-UhaR-SRnzl_cvhhy0SMzbUiAovR4kKdf9EYHB8spQZctnYfL5wCKOw4D53rqioNc"/>
                  </div>
                </div>
              </div>
            </div>
            {/* Vertical Card */}
            <div className="md:col-span-4 bg-tertiary-container text-on-tertiary p-10 rounded-[2.5rem] shadow-xl hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden flex flex-col group">
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary transition-colors duration-500">
                  <span className="material-symbols-outlined text-white text-3xl">bolt</span>
                </div>
                <h3 className="font-headline-lg text-headline-md mb-4 text-white">Instant Sync</h3>
                <p className="font-body-md text-white/80 leading-relaxed mb-8">
                  Integration isn't a chore; it's a foundation. Sync with your entire HR stack in under 60 seconds with our native connector library.
                </p>
                <div className="mt-auto pt-8 border-t border-white/10">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-tertiary-container bg-surface-container flex items-center justify-center"><span className="material-symbols-outlined text-xs">link</span></div>
                    <div className="w-10 h-10 rounded-full border-2 border-tertiary-container bg-surface-container flex items-center justify-center"><span className="material-symbols-outlined text-xs">calendar_month</span></div>
                    <div className="w-10 h-10 rounded-full border-2 border-tertiary-container bg-surface-container flex items-center justify-center"><span className="material-symbols-outlined text-xs">mail</span></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            {/* Collaborative Card */}
            <div className="md:col-span-5 bg-white border border-outline-variant/30 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="w-16 h-16 bg-secondary-container/10 text-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all">
                <span className="material-symbols-outlined text-3xl">diversity_3</span>
              </div>
              <h3 className="font-headline-md mb-4">Unified Dialogue</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Hiring is a team sport. Our shared workspace eliminates email chains and silos, bringing recruiters and managers into one seamless, real-time feedback loop.
              </p>
            </div>
            {/* Security Card */}
            <div className="md:col-span-7 bg-surface-container-low border border-outline-variant/30 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 hover:shadow-xl transition-all duration-500 group">
              <div className="flex-1">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <h3 className="font-headline-md mb-4">Fortified Security</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  GDPR, SOC2 Type II, and CCPA compliant. We don't just protect data; we treat privacy as a fundamental human right built into every line of code.
                </p>
              </div>
              <div className="hidden md:flex w-1/3 aspect-square bg-white rounded-3xl border border-outline-variant/30 items-center justify-center shadow-inner relative overflow-hidden">
                <span className="material-symbols-outlined text-primary/10 text-9xl absolute -bottom-10 -right-10 rotate-12">shield</span>
                <span className="material-symbols-outlined text-primary text-5xl relative z-10">lock</span>
              </div>
            </div>
          </div>
        </section>

        {/* Split Path Section (The Portals) */}
        <section className="py-32 px-margin-desktop overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1200px] mx-auto">
            {/* Candidate Path */}
            <div className="group relative bg-white p-12 rounded-[3rem] border border-outline-variant/50 shadow-2xl flex flex-col items-center text-center overflow-hidden transition-all duration-700 hover:border-secondary">
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-28 h-28 bg-surface-container rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all group-hover:rotate-[10deg] shadow-lg">
                  <span className="material-symbols-outlined text-6xl">person_search</span>
                </div>
                <h2 className="font-headline-lg text-primary mb-6">Are you a Candidate?</h2>
                <p className="font-body-md text-on-surface-variant mb-10 max-w-sm mx-auto leading-relaxed">
                  Stop applying blindly. Create an intelligent profile and let the best roles in the industry find you based on your true potential.
                </p>
                <div className="w-full max-w-xs space-y-6">
                  <Link to="/resume-verification" className="w-full bg-secondary text-white py-5 rounded-2xl font-headline-sm hover:shadow-2xl hover:shadow-secondary/30 hover:scale-[1.03] active:scale-95 transition-all block text-center flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">upload</span> Upload Resume
                  </Link>
                </div>
              </div>
            </div>
            {/* Recruiter Path */}
            <div className="group relative bg-primary text-on-primary p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center overflow-hidden transition-all duration-700 hover:bg-black">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-28 h-28 bg-white/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-primary transition-all group-hover:rotate-[-10deg] shadow-lg">
                  <span className="material-symbols-outlined text-6xl">corporate_fare</span>
                </div>
                <h2 className="font-headline-lg text-white mb-6">Are you a Recruiter?</h2>
                <p className="font-body-md text-primary-fixed-dim mb-10 max-w-sm mx-auto leading-relaxed">
                  Access the global elite. Automate your top-of-funnel and spend your energy where it matters: closing world-class hires.
                </p>
                <div className="w-full max-w-xs space-y-6">
                  <Link to="/login" className="w-full bg-white text-primary py-5 rounded-2xl font-headline-sm hover:shadow-2xl hover:shadow-white/20 hover:scale-[1.03] active:scale-95 transition-all block text-center">
                    Start Hiring
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full pt-24 pb-12 bg-white border-t border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start gap-xl pb-20">
            <div className="flex flex-col gap-md max-w-xs">
              <span className="font-headline-sm text-headline-sm font-black text-primary tracking-tighter">RECRUIT AI</span>
              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                Precision engineering for the global talent economy. We believe in a world where the right talent always finds the right opportunity.
              </p>
              <div className="flex gap-md mt-6">
                <Link className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1" to="#">
                  <span className="material-symbols-outlined text-[20px]">public</span>
                </Link>
                <Link className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center hover:bg-secondary hover:text-white transition-all transform hover:-translate-y-1" to="#">
                  <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-xl md:gap-32 w-full md:w-auto">
              <div className="flex flex-col gap-4">
                <span className="font-label-md text-primary font-black mb-2 uppercase tracking-widest text-[10px]">Product</span>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">Assessment AI</Link>
                <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">ATS Connect</Link>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">Enterprise</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-label-md text-primary font-black mb-2 uppercase tracking-widest text-[10px]">Resources</span>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">Intelligence Hub</Link>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">Guides</Link>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">API Docs</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="font-label-md text-primary font-black mb-2 uppercase tracking-widest text-[10px]">Legal</span>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">Privacy</Link>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">Ethics Policy</Link>
                <Link className="font-body-sm text-on-surface-variant hover:text-secondary transition-all" to="#">Terms</Link>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-md">
            <span className="font-body-sm text-on-surface-variant/50">© 2024 Recruit AI Inc. Built for the future of work.</span>
            <div className="flex gap-lg">
              <Link className="text-[11px] font-bold text-on-surface-variant/60 hover:text-primary transition-colors uppercase tracking-widest" to="#">System Normal</Link>
              <Link className="text-[11px] font-bold text-on-surface-variant/60 hover:text-primary transition-colors uppercase tracking-widest" to="#">Security Certs</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
