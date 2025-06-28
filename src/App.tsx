// src/App.tsx
import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ProfessorDashboard from './components/ProfessorDashboard';
import StudentGame from './components/StudentGame';
import RegisterForm from './components/RegisterForm';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('currentUserRole');
    if (userRole) {
      setLoggedIn(true);
      setIsProfessor(userRole === 'professor');
    }
    setLoadingAuth(false);
  }, []);

  const handleLoginSuccess = (professor: boolean) => {
    setLoggedIn(true);
    setIsProfessor(professor);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('currentUser');
    setLoggedIn(false);
    setIsProfessor(false);
    setShowRegister(false);
  };

  if (loadingAuth) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>Carregando...</div>;
  }

  if (!loggedIn) {
    return showRegister ? (
      <RegisterForm
        onRegisterSuccess={() => setShowRegister(false)}
        onGoToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="App">
      {isProfessor ? (
        <ProfessorDashboard onLogout={handleLogout} />
      ) : (
        <StudentGame onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;