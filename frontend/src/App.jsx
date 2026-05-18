import { Routes, Route, Link } from 'react-router-dom'
import AccountSettings from './pages/AccountSettings'
import AssessmentsHub from './pages/AssessmentsHub'
import CandidateDashboard from './pages/CandidateDashboard'
import CandidateProfile from './pages/CandidateProfile'
import InterviewSchedule from './pages/InterviewSchedule'
import RecruitAiLandingPage from './pages/RecruitAiLandingPage'
import ResumeVerification from './pages/ResumeVerification'
import TasksManagement from './pages/TasksManagement'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RecruiterSignupPage from './pages/RecruiterSignupPage'
import Assessments from './pages/Assessments'
import Candidates from './pages/Candidates'
import Shortlisted from './pages/Shortlisted'
import Rejected from './pages/Rejected'
import Settings from './pages/Settings'
import CandidateDetails from './pages/CandidateDetails'
import CompareCandidates from './pages/CompareCandidates'
import Interviews from './pages/Interviews'
import Messages from './pages/Messages'
import LiveMonitoring from './pages/LiveMonitoring'

export default function App() {
  return (
    <div className="font-body-md text-on-surface flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<RecruitAiLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recruiter-signup" element={<RecruiterSignupPage />} />
        <Route path="/recruiter-dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/assessments" element={<Layout><Assessments /></Layout>} />
        <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
        <Route path="/shortlisted" element={<Layout><Shortlisted /></Layout>} />
        <Route path="/rejected" element={<Layout><Rejected /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/candidate/:id" element={<Layout><CandidateDetails /></Layout>} />
        <Route path="/compare" element={<Layout><CompareCandidates /></Layout>} />
        <Route path="/interviews" element={<Layout><Interviews /></Layout>} />
        <Route path="/messages" element={<Layout><Messages /></Layout>} />
        <Route path="/monitor/:sessionId" element={<Layout><LiveMonitoring /></Layout>} />
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
