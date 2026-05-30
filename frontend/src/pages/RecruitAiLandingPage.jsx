import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ChevronRight, ClipboardCheck, FileSearch, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const recruitersPath = '/recruiter-signup';
const candidatePath = '/login';

function destinationFor(user, fallback) {
  if (!user) return fallback;
  return user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter-dashboard';
}

const evidenceRows = [
  {
    title: 'Task score',
    meta: 'React component, API handling, edge cases',
    score: '82',
    label: 'Ready for review',
    color: 'bg-teal-50 text-teal-800',
    marker: 'bg-teal-700',
  },
  {
    title: 'Authenticity check',
    meta: 'Paste activity, tab switches, timing signals',
    score: 'Low',
    label: 'Risk',
    color: 'bg-sky-50 text-sky-900',
    marker: 'bg-[#082653]',
  },
  {
    title: 'Feedback generated',
    meta: 'Strengths, gaps, and interview follow-ups',
    score: '3',
    label: 'Notes',
    color: 'bg-amber-100/80 text-amber-900',
    marker: 'bg-amber-700',
  },
];

const reasons = [
  {
    icon: FileSearch,
    title: 'Skill over resume',
    copy: 'AI evaluates actual task performance first. Credentials and keywords come second.',
    accent: 'border-l-teal-700 text-teal-700',
  },
  {
    icon: ClipboardCheck,
    title: 'Explainable rejection',
    copy: 'Zero silent rejections. Precise, actionable feedback that candidates and managers trust.',
    accent: 'border-l-[#082653] text-[#082653]',
  },
  {
    icon: Sparkles,
    title: 'Hidden talent mode',
    copy: 'Bypass pedigree bias. Auto-flag and surface strong performers from non-traditional backgrounds.',
    accent: 'border-l-amber-700 text-amber-700',
  },
];

const steps = [
  'Upload resume context',
  'Assign a role-based task',
  'Evaluate the submitted work',
  'Review score, proof, and gaps',
];

const prototypeSignals = [
  {
    value: 'Resume',
    label: 'Context extraction',
  },
  {
    value: 'Task',
    label: 'Role-based assessment',
  },
  {
    value: 'Proof',
    label: 'Authenticity signals',
  },
  {
    value: 'Report',
    label: 'Explainable feedback',
  },
];

export default function RecruitAiLandingPage() {
  const { user } = useAuth();
  const dashboardPath = destinationFor(user, '/login');
  const startHiringPath = destinationFor(user, recruitersPath);
  const assessmentPath = destinationFor(user, candidatePath);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    window.localStorage?.setItem('theme', 'light');
  }, []);

  return (
    <div className="proofhire-landing min-h-screen bg-white text-[#071b3a] antialiased">
      <style>{`
        html.dark .proofhire-landing,
        html.dark .proofhire-landing h1,
        html.dark .proofhire-landing h2,
        html.dark .proofhire-landing h3 {
          color: #071b3a !important;
        }

        html.dark .proofhire-landing .landing-muted {
          color: #64748b !important;
        }

        html.dark .proofhire-landing .landing-surface {
          background: #ffffff !important;
          color: #071b3a !important;
        }

        html.dark .proofhire-landing .landing-soft {
          background: #f6f8fb !important;
        }

        html.dark .proofhire-landing .landing-card {
          background: #f8faff !important;
          color: #071b3a !important;
        }

        html.dark .proofhire-landing .landing-navy {
          background: #071b3a !important;
          color: #ffffff !important;
        }

        html.dark .proofhire-landing .landing-navy h2,
        html.dark .proofhire-landing .landing-navy h3 {
          color: #ffffff !important;
        }
      `}</style>
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#071b3a]">
            <span className="h-3 w-3 rounded-full bg-teal-700" />
            ProofHire
          </Link>

          <div className="hidden items-center gap-10 text-base font-medium text-slate-500 md:flex">
            <a href="#home" className="text-[#071b3a]">Home</a>
            <a href="#how-it-works" className="hover:text-[#071b3a]">How it works</a>
            <a href="#proof" className="hover:text-[#071b3a]">Proof</a>
            <a href="#about" className="hover:text-[#071b3a]">About</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/login"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#071b3a] transition hover:border-teal-700 hover:text-teal-800"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#071b3a] transition hover:border-teal-700 hover:text-teal-800 sm:inline-flex"
                >
                  Sign in
                </Link>
                
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="landing-soft border-b border-slate-200 bg-[#f6f8fb]">
          <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-20 md:px-8 lg:grid-cols-[1fr_0.95fr] lg:py-24">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-md bg-teal-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-teal-800">
                <CheckSquare className="h-4 w-4" />
                Proof-based hiring
              </div>

              <h1 className="text-5xl font-normal leading-[1.08] tracking-tight text-[#071b3a] md:text-7xl">
                Hire on proof.
                <span className="block text-teal-700">Not on paper.</span>
              </h1>

              <p className="landing-muted mt-8 max-w-xl text-xl leading-9 text-slate-600">
                Every other ATS tells you who applied. ProofHire shows who can actually do the job, with evaluated tasks, authenticity checks, and clear hiring signals.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to={startHiringPath}
                  className="inline-flex items-center justify-center rounded-xl bg-[#071b3a] px-7 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#0b2a55]"
                >
                  Start hiring free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                
              </div>
            </div>

            <div className="landing-surface rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="flex items-start gap-4">
                  <CheckSquare className="mt-1 h-6 w-6 text-slate-500" />
                  <div>
                    <h2 className="text-xl font-semibold leading-tight text-slate-950">
                      Candidate proof packet
                    </h2>
                    <p className="landing-muted mt-1 text-sm text-slate-500">Demo assessment · Frontend Engineer</p>
                  </div>
                </div>
                <span className="rounded-lg bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">Prototype</span>
              </div>

              <div className="divide-y divide-slate-100">
                {evidenceRows.map((item) => (
                  <div key={item.title} className="grid grid-cols-[48px_1fr_auto] items-center gap-4 py-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.marker} text-sm font-bold text-white`}>
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-semibold text-slate-950">{item.title}</h3>
                      <p className="landing-muted mt-1 text-base leading-5 text-slate-500">{item.meta}</p>
                    </div>
                    <div className={`rounded-lg px-5 py-2 text-base font-semibold ${item.color}`}>
                      {item.score} — {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 rounded-xl border border-slate-200 bg-[#f8faff] p-4">
                <p className="text-sm font-semibold text-[#071b3a]">Suggested interview follow-up</p>
                <p className="landing-muted mt-2 text-sm leading-6 text-slate-600">
                  Ask the candidate to explain their state management choice and one edge case they would improve with more time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Why ProofHire</p>
            <h2 className="mt-5 max-w-4xl text-3xl font-normal tracking-tight text-[#071b3a] md:text-5xl">
              Built for recruiters who need signal, not noise
            </h2>

            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {reasons.map(({ icon: Icon, title, copy, accent }) => (
                <article key={title} className={`landing-card rounded-xl border border-slate-200 bg-[#f8faff] p-8 shadow-sm ${accent} border-l-4`}>
                  <Icon className="h-7 w-7" />
                  <h3 className="mt-8 text-2xl font-semibold text-slate-950">{title}</h3>
                  <p className="landing-muted mt-4 text-lg leading-8 text-slate-600">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-soft border-b border-slate-200 bg-[#f6f8fb]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-16 text-center md:grid-cols-4 md:px-8">
            {prototypeSignals.map((signal, index) => (
              <div key={signal.value} className={index === 0 ? '' : 'border-slate-200 md:border-l'}>
                <div className="text-3xl font-semibold tracking-tight text-[#071b3a] md:text-4xl">{signal.value}</div>
                <p className="landing-muted mt-3 text-base text-slate-500">{signal.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-[0.85fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">How it works</p>
              <h2 className="mt-5 text-3xl font-normal tracking-tight text-[#071b3a] md:text-5xl">
                A hiring flow candidates can understand.
              </h2>
              <p className="landing-muted mt-6 text-lg leading-8 text-slate-600">
                ProofHire keeps the process direct: give candidates a relevant task, verify the work, then show recruiters the evidence behind each recommendation.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step, index) => (
                <div key={step} className="landing-card flex items-center gap-5 rounded-xl border border-slate-200 bg-[#f8faff] p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-sm font-semibold text-teal-800 shadow-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lg font-semibold text-slate-950">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="landing-navy bg-[#071b3a] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <div className="flex items-center gap-3 text-xl font-semibold">
                <ShieldCheck className="h-6 w-6 text-teal-300" />
                Make every hiring decision easier to explain.
              </div>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                ProofHire helps teams replace resume guesswork with task evidence, authenticity signals, and feedback candidates can actually use.
              </p>
            </div>
            <Link
              to={startHiringPath}
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 text-base font-semibold text-[#071b3a] transition hover:bg-teal-50"
            >
              Start hiring
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
