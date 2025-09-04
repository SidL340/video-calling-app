import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VideoCall from './components/VideoCall';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [callState, setCallState] = useState({
    inCall: false,
    calling: false,
    incomingCall: null,
    remoteUser: null
  });

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('videoCallUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('videoCallUser', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('videoCallUser');
    setCurrentView('login');
    setCallState({
      inCall: false,
      calling: false,
      incomingCall: null,
      remoteUser: null
    });
  };

  const handleCall = (targetUser) => {
    setCallState({
      ...callState,
      calling: true,
      remoteUser: targetUser
    });
    setCurrentView('call');
  };

  const handleCallEnd = () => {
    setCallState({
      inCall: false,
      calling: false,
      incomingCall: null,
      remoteUser: null
    });
    setCurrentView('dashboard');
  };

  const handleIncomingCall = (callData) => {
    setCallState({
      ...callState,
      incomingCall: callData
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onCall={handleCall}
            onIncomingCall={handleIncomingCall}
            callState={callState}
          />
        );
      case 'call':
        return (
          <VideoCall
            user={user}
            callState={callState}
            onCallEnd={handleCallEnd}
            setCallState={setCallState}
          />
        );
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Calling App</h1>
        {user && (
          <div className="user-info">
            Welcome, {user.username}
          </div>
        )}
      </header>
      <main className="App-main">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;
