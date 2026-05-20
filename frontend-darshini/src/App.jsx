import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import AccountSettings from './pages/AccountSettings';
import AssessmentsHub from './pages/AssessmentsHub';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import InterviewSchedule from './pages/InterviewSchedule';
import RecruitAiLandingPage from './pages/RecruitAiLandingPage';
import ResumeVerification from './pages/ResumeVerification';
import TasksManagement from './pages/TasksManagement';

import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RecruiterSignupPage from './pages/RecruiterSignupPage';
import Assessments from './pages/Assessments';
import Candidates from './pages/Candidates';
import Shortlisted from './pages/Shortlisted';
import Rejected from './pages/Rejected';
import Settings from './pages/Settings';
import CandidateDetails from './pages/CandidateDetails';
import CompareCandidates from './pages/CompareCandidates';
import Interviews from './pages/Interviews';
import Messages from './pages/Messages';
import LiveMonitoring from './pages/LiveMonitoring';
import CandidateTest from './pages/CandidateTest';

const RoleRoute = ({ children, role }) => {
  const { userRole, setUserRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/assessment')) {
      setUserRole('candidate');
    } else {
      setUserRole('recruiter');
    }
  }, [location.pathname, setUserRole]);

  return children;
};

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
      <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
      <Route path="/candidate-profile" element={<CandidateProfile />} />
      <Route path="/resume-verification" element={<ResumeVerification />} />
      <Route path="/interview-schedule" element={<InterviewSchedule />} />

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

      {/* Misc */}
      <Route path="/account-settings" element={<AccountSettings />} />
      <Route path="/assessments-hub" element={<AssessmentsHub />} />
      <Route path="/tasks-management" element={<TasksManagement />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;