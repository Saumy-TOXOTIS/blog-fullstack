import React from 'react';

function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl shadow-purple-900/30 pt-20 pb-12 border-t border-gray-700/50 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-900/10 via-purple-900/0 to-transparent animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/10 via-blue-900/0 to-transparent animate-pulse"></div>
                
                {/* Floating Particles with Animation */}
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute rounded-full animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 8 + 2}px`,
                            height: `${Math.random() * 8 + 2}px`,
                            background: `rgba(${i % 3 === 0 ? '139, 92, 246' : i % 3 === 1 ? '59, 130, 246' : '6, 182, 212'}, ${Math.random() * 0.3 + 0.1})`,
                            animationDuration: `${Math.random() * 20 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    ></div>
                ))}
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[size:30px_30px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
            </div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12">
                    {/* Brand Section - Enhanced */}
                    <div className="text-center lg:text-left max-w-md">
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="flex items-center gap-3 mb-5 group cursor-pointer">
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                    <img 
                                        src={"http://localhost:5000/images/Blog.svg"} 
                                        className="relative w-14 h-14 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                                        alt="App Icon"
                                    />
                                </div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Blog <span className="font-extrabold">App</span>
                                </h2>
                            </div>
                            
                            <p className="text-gray-400/90 mb-6 text-lg leading-relaxed">
                                A modern blogging platform where ideas meet innovation, built with passion by Saumy Tiwari
                            </p>
                            
                            {/* Social Links - Enhanced */}
                            <div className="flex gap-5">
                                {[
                                    { platform: 'github', icon: 'G', color: 'from-purple-600 to-indigo-600' },
                                    { platform: 'twitter', icon: 'T', color: 'from-sky-500 to-blue-600' },
                                    { platform: 'linkedin', icon: 'L', color: 'from-blue-500 to-cyan-600' }
                                ].map((item) => (
                                    <a 
                                        key={item.platform}
                                        href="#" 
                                        className={`relative w-12 h-12 flex items-center justify-center rounded-xl bg-gray-800/50 hover:bg-gradient-to-r ${item.color} transition-all duration-300 group border border-gray-700/50 hover:border-transparent shadow-md hover:shadow-lg`}
                                        aria-label={`Follow on ${item.platform}`}
                                    >
                                        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="text-xl font-medium text-gray-400 group-hover:text-white transition-colors duration-300">
                                            {item.icon}
                                        </span>
                                        <div className="absolute -bottom-1 left-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 group-hover:left-0 group-hover:w-full"></div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Creator Info - Enhanced */}
                    <div className="bg-gray-800/20 border border-gray-700/50 rounded-3xl p-8 backdrop-blur-lg shadow-2xl hover:shadow-purple-900/20 transition-all duration-500 group transform hover:-translate-y-1">
                        <div className="flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 p-1 animate-gradient-border">
                                    <div className="bg-gray-900 rounded-full p-1.5">
                                        <div className="bg-gray-800/80 rounded-full w-full h-full flex items-center justify-center">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">ST</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                            </div>
                            <p className="text-gray-400/80 text-lg mb-1">Created with passion by</p>
                            <h3 className="text-2xl font-bold mt-1 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500">
                                Saumy Tiwari
                            </h3>
                            <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Full Stack Developer
                            </p>
                            
                            <div className="mt-6 flex gap-4">
                                <button className="px-5 py-2 bg-gray-800/70 hover:bg-gray-700/90 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2">
                                    <span>Contact</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </button>
                                <button className="px-5 py-2 bg-gradient-to-r from-purple-600/80 to-blue-500/80 hover:from-purple-600 hover:to-blue-500 border border-purple-500/30 rounded-xl text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-purple-500/20">
                                    <span>Portfolio</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider - Enhanced */}
                <div className="my-12 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>

                {/* Bottom Section - Enhanced */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-500/80 text-sm">
                        &copy; {new Date().getFullYear()} Blog Verse.
                    </div>
                    
                    {/* Footer Links - Enhanced */}
                    <div className="flex gap-6">
                        {['Terms', 'Privacy', 'Cookies', 'Guidelines'].map((item) => (
                            <a 
                                key={item}
                                href="#" 
                                className="text-gray-500/80 hover:text-gray-300 text-sm transition-colors duration-300 relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add this to your global CSS */}
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                .animate-gradient-border {
                    animation: gradient-border 3s ease infinite;
                    background-size: 200% 200%;
                }
                @keyframes gradient-border {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </footer>
    );
}

export default Footer;