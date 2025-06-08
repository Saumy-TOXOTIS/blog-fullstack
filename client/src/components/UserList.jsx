import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function UserList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-grow bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Enhanced Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-12 relative">
                    <div className="relative z-10">
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-600/10 blur-3xl rounded-full"></div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-xl">
                            Community Members
                        </h1>
                        <p className="text-gray-400 mt-2 max-w-md">
                            Discover and connect with other users in our vibrant community
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="relative bg-gray-800/50 border border-gray-700/50 rounded-xl px-5 py-3 backdrop-blur-sm shadow-lg">
                                <span className="text-purple-400 font-medium text-lg">{users.length}</span> 
                                <span className="text-gray-400 ml-1"> {users.length === 1 ? 'user' : 'users'}</span>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-600/20 to-cyan-500/20 border border-purple-500/30 rounded-xl p-1 backdrop-blur-sm">
                            <div className="flex -space-x-2">
                                {users.slice(0, 4).map((user, index) => (
                                    <img 
                                        key={index}
                                        src={"http://localhost:5000/images/default_profile.jpg"} 
                                        className="w-8 h-8 rounded-full border-2 border-gray-800 shadow-md"
                                        alt={user.username}
                                    />
                                ))}
                                {users.length > 4 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-800/80 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-purple-400">
                                        +{users.length - 4}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced User Cards Grid */}
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 md:py-28 bg-gradient-to-br from-gray-800/20 to-gray-900/40 border border-gray-700/30 rounded-3xl backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
                        <div className="mb-6 p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-full backdrop-blur-sm shadow-lg">
                            <div className="bg-gray-900 p-4 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-200 mb-3">No Users Found</h3>
                        <p className="text-gray-500 max-w-md text-center mb-6">
                            It seems no users are currently available. Try again later.
                        </p>
                        <button 
                            onClick={fetchUsers}
                            className="px-5 py-2.5 bg-gradient-to-r from-purple-700/50 to-indigo-700/50 border border-purple-500/30 rounded-lg text-purple-300 hover:text-white hover:from-purple-700/70 hover:to-indigo-700/70 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="group relative bg-gradient-to-b from-gray-800/30 to-gray-900/50 border border-gray-700/30 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:border-purple-500/40 hover:shadow-purple-900/20 cursor-pointer transform hover:-translate-y-1.5"
                                onClick={() => navigate(`/users/${user._id}`)}
                            >
                                {/* Animated Background Elements */}
                                <div className="absolute inset-0 -z-10">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div>
                                </div>
                                
                                {/* Card Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* User Card Content */}
                                <div className="p-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar with Status Indicator */}
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                            <div className="relative">
                                                <img 
                                                    src={"http://localhost:5000/images/default_profile.jpg"} 
                                                    className="w-16 h-16 rounded-full border-2 border-purple-500/80 shadow-lg group-hover:border-cyan-400/80 transition-colors"
                                                    alt={user.username}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold truncate bg-gradient-to-r from-purple-200/90 to-cyan-200/90 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-cyan-300 transition-all">
                                                {user.username}
                                            </h3>
                                            <p className="text-sm text-gray-400 truncate mt-1">
                                                <span className="text-cyan-400">@{user.username.toLowerCase().replace(/\s+/g, '')}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Bio Preview */}
                                    <div className="mt-4 relative">
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-l from-gray-900 to-transparent"></div>
                                        <p className="text-gray-300 text-sm line-clamp-2 italic">
                                            {user.bio || 'This user has not written a bio yet.'}
                                        </p>
                                    </div>
                                    
                                    {/* View Profile Button */}
                                    <div className="mt-5 flex justify-end">
                                        <div className="px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/60 rounded-lg text-sm font-medium text-gray-300 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-purple-700/80 group-hover:to-indigo-700/80 transition-all duration-300 backdrop-blur-sm border border-gray-700/50 group-hover:border-purple-500/50 flex items-center gap-1.5 shadow group-hover:shadow-md group-hover:shadow-purple-900/20">
                                            View Profile
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-l from-purple-500/10 to-transparent rounded-bl-full"></div>
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-tr-full"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserList;