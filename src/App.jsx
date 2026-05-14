import { Routes, Route, Link } from 'react-router-dom'
import AccountSettings from './pages/AccountSettings'
import AssessmentsHub from './pages/AssessmentsHub'
import CandidateDashboard from './pages/CandidateDashboard'
import CandidateProfile from './pages/CandidateProfile'
import InterviewSchedule from './pages/InterviewSchedule'
import RecruitAiLandingPage from './pages/RecruitAiLandingPage'
import ResumeVerification from './pages/ResumeVerification'
import TasksManagement from './pages/TasksManagement'

export default function App() {
  return (
    <div className="font-body-md text-on-surface flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<RecruitAiLandingPage />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/assessments-hub" element={<AssessmentsHub />} />
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate-profile" element={<CandidateProfile />} />
        <Route path="/resume-verification" element={<ResumeVerification />} />
        <Route path="/interview-schedule" element={<InterviewSchedule />} />
        <Route path="/tasks-management" element={<TasksManagement />} />
      </Routes>
    </div>
  )
}
