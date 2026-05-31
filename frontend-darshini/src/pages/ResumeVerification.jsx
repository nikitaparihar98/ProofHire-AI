import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadResumeSkills } from '../services/api';

const getExtractedSkillsForRole = (role) => {
  const roleLower = String(role || '').toLowerCase();
  if (roleLower.includes('backend') || roleLower.includes('data') || roleLower.includes('python')) {
    return { SQL: 'Advanced', FastAPI: 'Intermediate', Python: 'Advanced' };
  }
  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('ui')) {
    return { React: 'Advanced', CSS: 'Intermediate', JavaScript: 'Advanced' };
  }
  return { 'Problem Solving': 'Advanced', 'System Design': 'Intermediate', Communication: 'Advanced' };
};

const buildLocalResumeComparison = (resumeSkills) => {
  const provenSkills = Object.fromEntries(Object.keys(resumeSkills).map((skill) => [skill, 'Not proven yet']));
  return {
    resume_skills: resumeSkills,
    proven_skills: provenSkills,
    skill_authenticity_score: 0,
    authenticity_gaps: Object.entries(resumeSkills).map(
      ([skill, level]) => `${skill}: claimed ${level}, waiting for assessment evidence`
    ),
    growth_nudges: ['Complete the assigned coding assessment to turn resume claims into proof signals.'],
  };
};

export default function ResumeVerification() {
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState({});
  const [targetRole, setTargetRole] = useState('Senior Frontend Engineer');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();
    setStep(2);
    // Simulate AI parsing
    setTimeout(() => {
      setSkills(getExtractedSkillsForRole(targetRole));
      setStep(3);
    }, 2000);
  };

  const handleConfirm = async () => {
    setSaving(true);
    const fallback = buildLocalResumeComparison(skills);
    try {
      const savedCandidate = await uploadResumeSkills({ resume_skills: skills });
      localStorage.setItem('resumeVerificationResult', JSON.stringify(savedCandidate || fallback));
    } catch (err) {
      localStorage.setItem('resumeVerificationResult', JSON.stringify(fallback));
    } finally {
      setSaving(false);
      navigate('/candidate-profile');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-xl px-margin-mobile">
      <nav className="w-full max-w-[1440px] mb-xl">
        <Link to="/" className="font-headline-lg text-headline-lg font-bold text-primary">
          Recruit AI
        </Link>
      </nav>

      <main className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
        {step === 1 && (
          <div className="bg-white p-xl rounded-xl shadow-sm border border-outline-variant w-full text-center">
            <span className="material-symbols-outlined text-6xl text-secondary mb-md">upload_file</span>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Upload Your Resume</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
              Let our AI analyze your experience and instantly match you with the right roles.
            </p>
            
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer mb-lg" onClick={handleUpload}>
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-sm">cloud_upload</span>
              <p className="font-label-md text-label-md text-primary">Click to browse or drag and drop</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">PDF, DOCX up to 5MB</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-xl rounded-xl shadow-sm border border-outline-variant w-full text-center flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-lg"></div>
            <h1 className="font-headline-md text-headline-md text-primary mb-sm">AI is Analyzing Your Profile...</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Extracting skills, experience, and finding the best fitting roles.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-xl rounded-xl shadow-lg border border-outline-variant w-full">
            <div className="flex items-center gap-md mb-xl pb-md border-b border-outline-variant">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
              <div>
                <h1 className="font-headline-md text-headline-md text-primary">Analysis Complete</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Please verify your extracted details and target role.</p>
              </div>
            </div>

            <div className="space-y-lg mb-xl">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Full Name</label>
                <input type="text" defaultValue="Alex Johnson" className="w-full p-md border border-outline-variant rounded-lg font-body-md bg-surface-container-lowest" />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Primary Skills</label>
                <div className="flex gap-sm flex-wrap">
                  {Object.keys(skills).map((skill) => (
                    <span key={skill} className="px-md py-xs bg-surface-container-low text-on-surface-variant font-label-md text-label-md rounded-full border border-outline-variant">
                      {skill}: {skills[skill]}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Suggested Target Role</label>
                <select
                  value={targetRole}
                  onChange={(event) => {
                    setTargetRole(event.target.value);
                    setSkills(getExtractedSkillsForRole(event.target.value));
                  }}
                  className="w-full p-md border border-secondary rounded-lg font-body-md bg-surface-container-lowest text-primary shadow-sm outline-none ring-2 ring-secondary/20"
                >
                  <option>Senior Frontend Engineer</option>
                  <option>Backend Engineer</option>
                  <option>Fullstack Developer</option>
                  <option>UI/UX Engineer</option>
                </select>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-sm">Proof comparison preview</label>
                <div className="space-y-xs">
                  {Object.entries(skills).map(([skill, level]) => (
                    <div key={skill} className="grid grid-cols-3 gap-sm font-body-sm text-body-sm">
                      <span className="font-bold text-primary">{skill}</span>
                      <span className="text-on-surface-variant">Resume: {level}</span>
                      <span className="text-on-surface-variant">Proof: pending</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button disabled={saving} onClick={handleConfirm} className="w-full bg-primary text-on-primary py-md rounded-xl font-headline-sm text-headline-sm hover:opacity-90 transition-opacity disabled:opacity-60">
              {saving ? 'Saving Resume Context...' : 'Confirm & View Skill Match'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
