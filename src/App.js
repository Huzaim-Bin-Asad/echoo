import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Landing from "./pages/landing";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import Echoo from "./pages/Echoos";
import Add from './pages/Add';
import NewContact from './pages/NewContact';
import NewGroup from './pages/NewGroup';
import QRquickLink from './pages/QRquickLink';
import Call from './pages/call';
import StatusPage from './pages/StatusPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import useTokenChecker from './hooks/useTokenChecker';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { AuthModal } = useTokenChecker(location.pathname);

  const handleLogin = () => {
    navigate('/login'); // Redirect to login page
  };

  const handleSignup = () => {
    navigate('/signup'); // Redirect to signup page
  };

  return (
    <div>
      <AuthModal handleLogin={handleLogin} handleSignup={handleSignup} />
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/echoo" element={<Echoo />} />
        <Route path="/add" element={<Add />} />
        <Route path="/new-contact" element={<NewContact />} />
        <Route path="/new-group" element={<NewGroup />} />
        <Route path="/qr-quicklink" element={<QRquickLink />} />
        <Route path="/call" element={<Call />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;