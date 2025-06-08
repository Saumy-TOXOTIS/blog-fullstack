// client/src/components/AboutPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Enhanced card component with improved animations and visuals
const InfoCard = ({ icon, title, description, color }) => (
    <div className={`relative bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-700/50 rounded-2xl p-6 overflow-hidden group hover:border-${color}-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-${color}-900/30 transform hover:-translate-y-2 hover:scale-[1.02] z-0`}>
        <div className="absolute inset-0 -z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className={`absolute -inset-[3px] bg-gradient-to-r from-${color}-500/20 to-cyan-400/20 rounded-xl blur-md animate-pulse-slow`}></div>
        </div>
        <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${color}-600/40 to-${color}-700/40 flex items-center justify-center border border-${color}-500/40 backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-${color}-900/30 transition-all duration-300`}>
                <span className="text-3xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-300">{icon}</span>
            </div>
            <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-${color}-300 to-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(125,211,252,0.5)] transition-all duration-500`}>{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">{description}</p>
    </div>
);

function AboutPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const technologies = [
        { icon: '⚛️', title: 'React', description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces, powering our entire dynamic frontend.', color: 'cyan' },
        { icon: '🚀', title: 'Node.js & Express', description: 'The backbone of our server, providing a fast and scalable environment for our API and real-time communication.', color: 'green' },
        { icon: '🗄️', title: 'MongoDB', description: 'A flexible NoSQL database that allows us to store and manage complex data structures for users, posts, and chats with ease.', color: 'emerald' },
        { icon: '🔌', title: 'Socket.IO', description: 'Enabling real-time, bi-directional communication for our instant messaging feature, making chats seamless and interactive.', color: 'yellow' },
        { icon: '🎨', title: 'Tailwind CSS', description: 'A utility-first CSS framework that allows for rapid, custom UI development, giving the app its unique cosmic look.', color: 'sky' },
        { icon: '🔐', title: 'JWT', description: 'JSON Web Tokens are used for securing our application, ensuring that user sessions and API requests are properly authenticated.', color: 'rose' },
    ];

    const features = [
        { icon: '📝', title: 'Dynamic Post Management', description: 'Users can create, edit, and delete their own blog posts, complete with image uploads and rich content.', color: 'purple' },
        { icon: '👥', title: 'Social Interaction', description: 'Engage with the community through post likes, a full-featured follow/unfollow system, and user profiles.', color: 'pink' },
        { icon: '💬', title: 'Real-Time Chat', description: 'A complete private messaging system with live updates, message editing, deletion, and conversation management.', color: 'indigo' },
        { icon: '💭', title: 'Nested Comments', description: 'Deeply nested comment threads on posts allow for structured and engaging discussions within the community.', color: 'blue' },
    ];

    return (
        <div className="flex-grow bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 md:p-8 min-h-screen overflow-hidden">
            {/* Animated cosmic background elements */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] animate-float-1"></div>
                <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-cyan-600/10 rounded-full blur-[120px] animate-float-2"></div>
                <div className="absolute bottom-[15%] left-[25%] w-60 h-60 bg-indigo-600/10 rounded-full blur-[90px] animate-float-3"></div>
            </div>
            
            <div className="max-w-6xl mx-auto">
                {/* Enhanced Hero Section */}
                <div className="text-center py-16 md:py-24 relative">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-cyan-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-text-pulse">
                        A Cosmos of Ideas
                    </h1>
                    <p className="mt-6 text-xl md:text-2xl text-gray-300/90 max-w-3xl mx-auto bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                        This platform is more than just a blog. It's a fully-featured, modern social application built from the ground up to showcase the power of the MERN stack and real-time technologies.
                    </p>
                </div>

                {/* Technology Section */}
                <section className="my-16 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full blur-sm"></div>
                    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent inline-block">Powered by the Stars</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {technologies.map(tech => <InfoCard key={tech.title} {...tech} />)}
                    </div>
                </section>

                {/* Features Section */}
                <section className="my-24 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full blur-sm"></div>
                    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent inline-block">Explore the Galaxy of Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map(feature => <InfoCard key={feature.title} {...feature} />)}
                    </div>
                </section>

                {/* Enhanced Creator Section */}
                <section className="my-20">
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/20 border border-gray-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-lg shadow-2xl hover:shadow-purple-900/30 transition-all duration-700 group transform hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute -inset-2 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl animate-pulse-slow"></div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="relative flex-shrink-0">
                                <div className="w-36 h-36 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 p-1.5 shadow-lg shadow-purple-500/30 animate-pulse-slow">
                                    <div className="bg-gray-900 rounded-full p-1.5 h-full">
                                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-full w-full h-full flex items-center justify-center">
                                            <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">ST</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-lg text-cyan-400/80 mb-1 font-light">Project Architect</p>
                                <h3 className="text-5xl font-bold mt-1 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">Saumy Tiwari</h3>
                                <p className="mt-6 text-gray-300 max-w-2xl text-lg leading-relaxed bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                    A passionate Full Stack Developer dedicated to building beautiful, functional, and scalable web applications. This project is a testament to the journey of learning and creating with modern web technologies.
                                </p>
                                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                                    <button onClick={() => window.open("https://github.com/Saumy-TOXOTIS", "_blank")} className="cursor-pointer px-6 py-3 bg-gray-800/70 hover:bg-gray-700/90 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 font-medium hover:shadow-lg hover:shadow-gray-700/20 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                        </svg>
                                        GitHub
                                    </button>
                                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600/80 to-blue-500/80 hover:from-purple-600 hover:to-blue-500 border border-purple-500/30 rounded-xl text-white transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/30 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                                        </svg>
                                        Portfolio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced Call to Action */}
                <div className="text-center py-16 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full blur-sm"></div>
                    <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Ready to Join the Journey?</h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">Become a part of our growing community. Share your thoughts, connect with others, and start your own blog today.</p>
                    <button
                        onClick={() => navigate(token ? '/dashboard' : '/register')}
                        className="px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl text-white font-bold text-lg transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-900/50 transform hover:scale-105 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{token ? 'Go to Your Dashboard' : 'Create an Account'}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700/30 to-indigo-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                </div>
            </div>

            {/* Add global animations */}
            <style jsx>{`
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(15px) translateX(-15px); }
                }
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-10px) translateX(-10px); }
                }
                @keyframes text-pulse {
                    0%, 100% { background-size: 100% 100%; background-position: left center; }
                    50% { background-size: 200% 200%; background-position: right center; }
                }
                .animate-float-1 { animation: float-1 12s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 15s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 18s ease-in-out infinite; }
                .animate-text-pulse { 
                    animation: text-pulse 6s ease infinite;
                    background-size: 200% 200%;
                }
            `}</style>
        </div>
    );
}

export default AboutPage;