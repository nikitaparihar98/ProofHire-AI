import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import CandidateDetails from './pages/CandidateDetails';
import CompareCandidates from './pages/CompareCandidates';
import CandidateTest from './pages/CandidateTest';
import LiveMonitoring from './pages/LiveMonitoring';
import Assessments from './pages/Assessments';
import Candidates from './pages/Candidates';
import Shortlisted from './pages/Shortlisted';
import Rejected from './pages/Rejected';
import Settings from './pages/Settings';
import Interviews from './pages/Interviews';
import Messages from './pages/Messages';
import Layout from './components/Layout';

// Role-aware route wrapper
const RoleRoute = ({ children, role, redirectTo = "/" }) => {
  const { userRole, setUserRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Basic heuristic for MVP: if path starts with /assessment, you are a candidate
    if (location.pathname.startsWith('/assessment')) {
      setUserRole('candidate');
    } else {
      setUserRole('recruiter');
    }
  }, [location.pathname, setUserRole]);

  if (userRole !== role) {
    // In a real app, we'd check permissions. For now, we just sync role to path.
    return children; 
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Candidate Routes (No Recruiter Sidebar/Header) */}
      <Route path="/assessment" element={<CandidateTest />} />
      <Route path="/assessment/:sessionId" element={<CandidateTest />} />
      
      {/* Recruiter Routes (With Layout/Sidebar) */}
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
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

      {/* Fallback */}
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