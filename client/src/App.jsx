// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import UserList from './components/UserList';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import { SocketContextProvider } from './context/SocketContext';
import ChatPage from './components/ChatPage';
import AboutPage from './components/AboutPage';
import './App.css';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  if (!token) {
    React.useEffect(() => { navigate('/login', { replace: true }); }, [navigate]);
    return null;
  }
  return (
    <Outlet />
  );
};

const PublicLayout = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  if (token) {
    React.useEffect(() => { navigate('/dashboard', { replace: true }); }, [navigate]);
    return null;
  }
  return <Outlet />;
};


function AppContent() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const mainContent = (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Navbar isAuthenticated={!!token} logout={handleLogout} />
      <main className="flex-grow">
        <Routes>
          <Route path="/about" element={<AboutPage />} />

          <Route element={<PublicLayout />}>
            <Route path="/login" element={<AuthForm isLogin />} />
            <Route path="/register" element={<AuthForm isLogin={false} />} />
            <Route path="/" element={<AuthForm isLogin />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:userId" element={<UserProfile />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );

  // If the user is authenticated, wrap the entire content in the SocketContextProvider
  // Otherwise, render it without the provider.
  return token ? <SocketContextProvider>{mainContent}</SocketContextProvider> : mainContent;
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}