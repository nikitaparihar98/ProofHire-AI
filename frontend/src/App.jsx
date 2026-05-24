import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import AccountSettings from './pages/AccountSettings'
import AssessmentsHub from './pages/AssessmentsHub'
import CandidateDashboard from './pages/CandidateDashboard'
import CandidateProfile from './pages/CandidateProfile'
import InterviewSchedule from './pages/InterviewSchedule'
import RecruitAiLandingPage from './pages/RecruitAiLandingPage'
import ResumeVerification from './pages/ResumeVerification'
import TasksManagement from './pages/TasksManagement'
import Dashboard from './pages/Dashboard'
import CandidateLayout from './components/CandidateLayout'
import CandidateAssessmentPage from './pages/candidate/CandidateAssessmentPage';
import ProtectedRoute from './components/ProtectedRoute';
import CandidateOverview from './pages/candidate/CandidateOverview'
import AIResults from './pages/candidate/AIResults'
import CandidateMessagesPage from './pages/candidate/CandidateMessagesPage'
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
import CandidateTest from './pages/CandidateTest'
import AssignTasks from './pages/AssignTasks'


function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<RecruitAiLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recruiter-signup" element={<RecruiterSignupPage />} />

      {/* Candidate */}
      <Route path="/assessment" element={<CandidateTest />} />
      <Route path="/assessment/:sessionId" element={<CandidateTest />} />
      <Route path="/resume-verification" element={<ResumeVerification />} />

      {/* Modern Modular Candidate Portal */}
      <Route path="/candidate/dashboard" element={<ProtectedRoute role="candidate"><CandidateLayout><CandidateOverview /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/tasks" element={<ProtectedRoute role="candidate"><CandidateLayout><TasksManagement /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/assessments" element={<ProtectedRoute role="candidate"><CandidateLayout><AssessmentsHub /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/assessments/:assessmentId" element={<ProtectedRoute role="candidate"><CandidateLayout><CandidateAssessmentPage /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/interviews" element={<ProtectedRoute role="candidate"><CandidateLayout><InterviewSchedule /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/results" element={<ProtectedRoute role="candidate"><CandidateLayout><AIResults /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/results/:assessmentId" element={<ProtectedRoute role="candidate"><CandidateLayout><AIResults /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/messages" element={<ProtectedRoute role="candidate"><CandidateLayout><CandidateMessagesPage /></CandidateLayout></ProtectedRoute>} />
      <Route path="/candidate/profile" element={<ProtectedRoute role="candidate"><CandidateLayout><CandidateProfile /></CandidateLayout></ProtectedRoute>} />

      {/* Redirect old legacy routes */}
      <Route path="/candidate-dashboard" element={<Navigate to="/candidate/dashboard" replace />} />
      <Route path="/candidate-profile" element={<Navigate to="/candidate/profile" replace />} />
      <Route path="/account-settings" element={<Navigate to="/candidate/profile" replace />} />
      <Route path="/assessments-hub" element={<Navigate to="/candidate/assessments" replace />} />
      <Route path="/tasks-management" element={<Navigate to="/candidate/tasks" replace />} />
      <Route path="/interview-schedule" element={<Navigate to="/candidate/interviews" replace />} />

      {/* Recruiter */}
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
      <Route path="/assign-tasks" element={<ProtectedRoute role="recruiter"><Layout><AssignTasks /></Layout></ProtectedRoute>} />

      {/* Misc */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;