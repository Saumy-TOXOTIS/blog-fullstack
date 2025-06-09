// client/src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { getImageUrl } from '../utils/imageUrl';

// --- Mobile NavLink Component (No Changes) ---
// NEW, CORRECTED CODE
const MobileNavLink = ({ icon, text, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 p-4 text-lg text-gray-200 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200 group relative overflow-hidden">
    <div className="p-2 bg-gray-900/50 rounded-lg border border-gray-700 group-hover:bg-purple-600/50 group-hover:border-purple-500 transition-colors text-purple-300 group-hover:text-white">{icon}</div>
    <span className="font-semibold tracking-wider">{text}</span>
    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
  </button>
);


function Navbar({ isAuthenticated, logout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { setIsMenuOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const navLinks = [
    { to: '/dashboard', text: 'Home', color: 'purple', icon: <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { to: '/users', text: 'Community', color: 'indigo', icon: <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { to: '/chat', text: 'Chat', color: 'cyan', icon: <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md shadow-2xl shadow-purple-900/30 sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
            <img src={getImageUrl("https://res.cloudinary.com/dkkzhqs6z/image/upload/v1749434518/Blog_qf6yu9.svg")} className="h-12 w-12 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110" alt="App Icon" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Blog <span className="font-extrabold">App</span></h1>
          </div>

          {/* --- THIS IS THE CORRECTED CONTAINER FOR ALL RIGHT-SIDE ITEMS --- */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation Links (hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-2">
              {/* --- ABOUT BUTTON --- */}
              <button onClick={() => navigate('/about')} className="relative group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700 rounded-xl hover:border-teal-500 transition-all duration-300 hover:shadow-teal-900/30 shadow-md">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="h-4 w-4 md:h-5 md:w-5 text-teal-400 group-hover:text-teal-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-medium text-xs md:text-sm bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">About</span>
                <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full"></div>
              </button>

              {isAuthenticated && (
                <>
                  {/* --- HOME BUTTON --- */}
                  <button onClick={() => navigate('/dashboard')} className="relative group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700 rounded-xl hover:border-purple-500 transition-all duration-300 hover:shadow-purple-900/30 shadow-md">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="h-4 w-4 md:h-5 md:w-5 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="font-medium text-xs md:text-sm bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">Home</span>
                    <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full"></div>
                  </button>

                  {/* --- COMMUNITY BUTTON --- */}
                  <button onClick={() => navigate('/users')} className="relative group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700 rounded-xl hover:border-indigo-500 transition-all duration-300 hover:shadow-indigo-900/30 shadow-md">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="h-4 w-4 md:h-5 md:w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="font-medium text-xs md:text-sm bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">Community</span>
                    <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full"></div>
                  </button>

                  {/* --- CHAT BUTTON --- */}
                  <button onClick={() => navigate('/chat')} className="relative group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700 rounded-xl hover:border-cyan-500 transition-all duration-300 hover:shadow-cyan-900/30 shadow-md">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg className="h-4 w-4 md:h-5 md:w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span className="font-medium text-xs md:text-sm bg-gradient-to-r from-cyan-200 to-sky-200 bg-clip-text text-transparent">Chat</span>
                    <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full"></div>
                  </button>

                  {/* --- LOGOUT BUTTON --- */}
                  <button onClick={logout} className="relative group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700 rounded-xl hover:border-red-500 transition-all duration-300 hover:shadow-red-900/30 shadow-md">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-red-400 group-hover:text-red-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="font-medium text-xs md:text-sm bg-gradient-to-r from-red-200 to-orange-200 bg-clip-text text-transparent">Logout</span>
                    <div className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full"></div>
                  </button>
                </>
              )}
            </div>

            {/* Notification Bell (always part of the group, but visibility depends on auth) */}
            {isAuthenticated && <NotificationBell />}

            {/* Mobile Menu Button (hidden on desktop) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative h-10 w-10 z-50 text-gray-300"
                aria-label="Toggle Menu"
              >
                <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span aria-hidden="true" className={`block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
                  <span aria-hidden="true" className={`block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span aria-hidden="true" className={`block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-4/5 max-w-sm p-1 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="relative h-full bg-[#111827e6] rounded-2xl border border-purple-500/20 p-6 flex flex-col">
            <div className="absolute -inset-px rounded-2xl -z-10 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 animate-gradient-border"></div>
            <div className="flex items-center gap-3 mb-4">
              <img src={getImageUrl("https://res.cloudinary.com/dkkzhqs6z/image/upload/v1749434518/Blog_qf6yu9.svg")} className="h-10 w-10" alt="App Icon" />
              <h2 className="text-xl font-bold">Menu</h2>
            </div>
            <div className="rounded-xl p-2 bg-[#111827e6] flex flex-col gap-y-2">
              <>
                <MobileNavLink icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} text="About" onClick={() => navigate('/about')} />
                {isAuthenticated && navLinks.map(link => (
                  <MobileNavLink key={link.to} {...link} icon={React.cloneElement(link.icon, { className: "w-6 h-6" })} onClick={() => navigate(link.to)} />
                ))}
                {isAuthenticated && (
                  <MobileNavLink icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>} text="Logout" onClick={logout} />
                )}
              </>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes (no changes) */}
      <style>{`
                @keyframes shine {
                    from { transform: translateX(-100%) skewX(-20deg); }
                    to { transform: translateX(200%) skewX(-20deg); }
                }
                .animate-shine {
                    animation: shine 1.5s infinite;
                }
                .animate-gradient-border {
                    animation: gradient-border 4s ease infinite;
                    background-size: 400% 400%;
                }
                @keyframes gradient-border {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
    </nav>
  );
}

export default Navbar;