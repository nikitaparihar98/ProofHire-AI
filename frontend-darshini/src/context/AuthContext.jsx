import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // For MVP, we'll default to 'recruiter' for the main dashboard 
  // and 'candidate' for the assessment routes.
  // In production, this would be determined by a JWT/Session.
  const [userRole, setUserRole] = useState('recruiter'); 

  const loginAsRecruiter = () => setUserRole('recruiter');
  const loginAsCandidate = () => setUserRole('candidate');

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, loginAsRecruiter, loginAsCandidate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
