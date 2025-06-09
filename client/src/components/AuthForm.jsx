import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

function AuthForm({ isLogin: initialIsLogin = true }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(!initialIsLogin);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');

    try {
      const res = await api.post(isSignUp ? '/auth/register' : '/auth/login', {
        ...(isSignUp && { username }),
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      console.log("AuthForm.jsx: New token set for login/register:", res.data.token ? res.data.token.substring(0,15)+"..." : "N/A");
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Nebula Layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-gray-950 to-gray-950"></div>
        
        {/* Stars with different sizes and intensities */}
        {[...Array(200)].map((_, i) => {
          const size = Math.random() * 4 + 1;
          const opacity = Math.random() * 0.8 + 0.2;
          const duration = Math.random() * 15 + 5;
          return (
            <div 
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: `rgba(255, 255, 255, ${opacity})`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${duration}s`,
                filter: `blur(${size > 2 ? 0.5 : 0}px)`,
              }}
            />
          );
        })}
        
        {/* Floating Cosmic Particles */}
        {[...Array(25)].map((_, i) => {
          const size = Math.random() * 10 + 5;
          const color = i % 4 === 0 ? '139, 92, 246' : 
                         i % 4 === 1 ? '99, 102, 241' : 
                         i % 4 === 2 ? '236, 72, 153' : '6, 182, 212';
          return (
            <div 
              key={`particle-${i}`}
              className="absolute rounded-full animate-float"
              style={{
                '--random-x': Math.random() * 2 - 1,
                top: `${Math.random() * 100 + 10}%`,
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle, rgba(${color}, ${Math.random() * 0.7 + 0.3}) 0%, rgba(${color}, 0) 70%)`,
                filter: `blur(${size > 8 ? 1.5 : 1}px)`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${Math.random() * 30 + 20}s`,
              }}
            />
          );
        })}
        
        {/* Shooting Stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute animate-shooting-star"
            style={{
              top: `${Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
              animationDelay: `${i * 10}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>
      
      {/* Nebula Glow Effects */}
      <div className="fixed -top-1/3 -left-1/4 w-[800px] h-[800px] bg-purple-900/15 rounded-full filter blur-[180px] animate-pulse-slow opacity-80"></div>
      <div className="fixed -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-blue-900/20 rounded-full filter blur-[150px] animate-pulse-slower opacity-70"></div>
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-900/15 rounded-full filter blur-[120px] animate-pulse-delayed opacity-60"></div>
      <div className="fixed bottom-1/3 left-1/3 w-[600px] h-[600px] bg-pink-900/10 rounded-full filter blur-[130px] animate-pulse-slowest opacity-50"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-gray-900/70 via-gray-950/80 to-gray-950/90 border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 ease-in-out hover:shadow-[0_0_50px_10px_rgba(139,92,246,0.2)] z-10 group/card">
        {/* Animated Holographic Border */}
        <div className="absolute inset-0 rounded-3xl p-[2px] overflow-hidden">
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,#3b82f6_0deg,#8b5cf6_120deg,#ec4899_240deg,#3b82f6_360deg)] opacity-40 animate-spin-slow"></div>
          <div className="absolute inset-[2px] bg-gradient-to-br from-gray-900/90 to-gray-950/90 rounded-3xl"></div>
        </div>

        {/* Interactive Inner Glow */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500 group-hover/card:shadow-[inset_0_0_40px_10px_rgba(139,92,246,0.15)]"></div>

        <div className="relative p-8 z-10">
          {/* Logo Header with Enhanced Effects */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="relative w-24 h-24 mb-6 group/logo">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 to-blue-500/60 rounded-2xl opacity-80 blur-xl group-hover/logo:opacity-100 group-hover/logo:blur-2xl transition-all duration-700"></div>
              
              {/* Holographic Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 opacity-0 group-hover/logo:opacity-100 group-hover/logo:animate-ping-slow transition-opacity duration-500"></div>
              
              {/* Logo Container */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover/logo:rotate-3 transition-transform duration-300 overflow-hidden">
                {/* Subtle Inner Glow */}
                <div className="absolute inset-0 bg-white/5"></div>
                
                {/* Logo Image */}
                <img 
                  src={getImageUrl("https://res.cloudinary.com/dkkzhqs6z/image/upload/v1749428242/Blog_l3xelq.svg")} 
                  className="w-14 h-14 transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:brightness-110"
                  alt="App Icon"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
              {isSignUp ? 'Welcome!' : 'Welcome Back!'}
            </h1>
            <p className="text-gray-400/90 mt-3 text-center max-w-xs text-sm leading-relaxed">
              {isSignUp ? 'Join our cosmic community to begin your journey' : 'Sign in to continue your stellar adventure'}
            </p>
          </div>

          {/* Error Message with Enhanced Animation */}
          {error && (
            <div className="relative mb-6 overflow-hidden rounded-xl animate-shake">
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 backdrop-blur-sm"></div>
              <div className="relative px-4 py-3 text-red-100 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gray-900/50 rounded-xl border border-gray-800/50 group-hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
                  {/* Input Field Glow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_10px_0_rgba(139,92,246,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <label htmlFor="username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 px-4 pt-3">
                    Username
                  </label>
                  <div className="relative px-4 pb-3">
                    <input
                      name="username"
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      required={isSignUp}
                      className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none focus:ring-0 border-none p-0"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-900/50 rounded-xl border border-gray-800/50 group-hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
                {/* Input Field Glow */}
                <div className="absolute inset-0 shadow-[inset_0_0_10px_0_rgba(99,102,241,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 px-4 pt-3">
                  Email
                </label>
                <div className="relative px-4 pb-3">
                  <input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none focus:ring-0 border-none p-0"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-blue-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gray-900/50 rounded-xl border border-gray-800/50 group-hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
                {/* Input Field Glow */}
                <div className="absolute inset-0 shadow-[inset_0_0_10px_0_rgba(6,182,212,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1 px-4 pt-3">
                  Password
                </label>
                <div className="relative px-4 pb-3">
                  <input
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none focus:ring-0 border-none p-0"
                    placeholder="Enter your password"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button with Enhanced Effects */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-500 relative overflow-hidden group/btn
                  ${isSubmitting ? 'bg-gray-800 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}`}
              >
                {/* Button Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Border Animation */}
                <div className="absolute inset-0 rounded-xl border border-white/10 group-hover/btn:border-white/20 transition-all duration-500"></div>
                
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-0 h-0 rounded-full bg-white/10 group-hover/btn:w-[300px] group-hover/btn:h-[300px] group-hover/btn:-translate-x-1/2 group-hover/btn:-translate-y-1/2 transition-all duration-700 ease-out"></div>
                </div>
              </button>
            </div>
          </form>

          {/* Toggle Link with Enhanced Animation */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors group/link relative"
              type="button"
            >
              {isSignUp ? (
                <span>Already have an account? <span className="text-purple-300 group-hover/link:text-purple-200 underline underline-offset-4 decoration-purple-500/50 hover:decoration-purple-400 transition-all">Sign In</span></span>
              ) : (
                <span>Don't have an account? <span className="text-blue-300 group-hover/link:text-blue-200 underline underline-offset-4 decoration-blue-500/50 hover:decoration-blue-400 transition-all">Register</span></span>
              )}
              {/* Underline animation */}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-blue-400 group-hover/link:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) translateX(calc(var(--random-x) * 100px)) rotate(360deg); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(var(--rotation)); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateX(500px) translateY(200px) rotate(var(--rotation)); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse-slowest {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-delayed {
          0%, 60% { opacity: 0.3; }
          80% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float linear forwards;
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        .animate-shooting-star {
          animation: shooting-star linear forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
        .animate-pulse-slowest {
          animation: pulse-slowest 15s ease-in-out infinite;
        }
        .animate-pulse-delayed {
          animation: pulse-delayed 10s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}

export default AuthForm;