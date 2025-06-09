// client/src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';

const NotificationItem = ({ notification }) => {
    const navigate = useNavigate();

    const handleNotificationClick = () => {
        if (notification.type === 'follow' || notification.type === 'chat') {
            navigate(`/users/${notification.sender._id}`);
        } else if (notification.post?._id) {
            navigate(`/dashboard`);
        }
    };

    const getAvatarSrc = (user) => {
        if (!user || !user.avatar) return getImageUrl("https://res.cloudinary.com/dkkzhqs6z/image/upload/v1749432192/default_profile_avatar_lvdgfa.svg");
        return getImageUrl(user.avatar); // 2. Use the helper
    };

    const notificationIcons = {
        like: (
            <div className="p-2 bg-gradient-to-br from-rose-500/20 to-rose-700/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
            </div>
        ),
        comment: (
            <div className="p-2 bg-gradient-to-br from-sky-500/20 to-sky-700/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
            </div>
        ),
        reply: (
            <div className="p-2 bg-gradient-to-br from-violet-500/20 to-violet-700/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        ),
        follow: (
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-700/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
        ),
        chat: (
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-700/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                </svg>
            </div>
        )
    };

    const notificationText = {
        like: `liked your post`,
        comment: `commented on your post`,
        reply: `replied to your comment`,
        follow: 'started following you',
        chat: 'sent you a message',
    };

    return (
        <div
            onClick={handleNotificationClick}
            className={`relative p-4 flex items-start gap-4 cursor-pointer hover:bg-gradient-to-r from-indigo-900/20 to-indigo-900/5 transition-all duration-200 border-b border-indigo-900/20 last:border-b-0 group ${!notification.read ? 'bg-gradient-to-r from-indigo-900/10 to-transparent' : 'bg-transparent'
                }`}
        >
            {/* Unread indicator */}
            {!notification.read && (
                <div className="absolute top-4 left-3 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_2px_rgba(56,189,248,0.5)] animate-pulse"></div>
            )}

            <div className="flex-shrink-0 mt-1">
                {notificationIcons[notification.type]}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="relative">
                        <img
                            src={getAvatarSrc(notification.sender)}
                            alt={notification.sender.username}
                            className="w-7 h-7 rounded-full object-cover border-2 border-indigo-500/30 shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <p className="text-white font-medium truncate">{notification.sender.username}</p>
                </div>
                
                <p className="text-sm text-indigo-100">
                    {notificationText[notification.type]}
                </p>
                
                {notification.post?.title && (
                    <p className="text-xs mt-1 text-ellipsis overflow-hidden whitespace-nowrap text-indigo-300/70 italic">
                        "{notification.post.title}"
                    </p>
                )}
                
                <p className="text-xs text-indigo-400/60 mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' • '}
                    {new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
};

const NotificationBell = () => {
    const { notifications, unreadCount, setUnreadCount, fetchNotifications } = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    const handleToggle = async () => {
        if (!isOpen) {
            await fetchNotifications();
            if (unreadCount > 0) {
                try {
                    await api.post('/notifications/read');
                    setUnreadCount(0);
                } catch (error) {
                    console.error("Failed to mark notifications as read", error);
                }
            }
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={handleToggle} 
                className={`relative p-2 rounded-full transition-all duration-300 ${isOpen 
                    ? 'bg-gradient-to-br from-indigo-700/60 to-indigo-900/60 text-white shadow-[0_0_15px_0px_rgba(99,102,241,0.5)]' 
                    : 'text-gray-300 hover:bg-gradient-to-br from-indigo-700/40 to-indigo-900/40 hover:text-white hover:shadow-[0_0_10px_0px_rgba(99,102,241,0.3)]'}`}
            >
                <div className="relative">
                    <div className="relative">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-6 w-6 transition-transform duration-300 ${unreadCount > 0 ? 'animate-float' : ''}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                            />
                        </svg>
                        
                        {unreadCount > 0 && (
                            <span className={`absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-white font-bold shadow-sm shadow-indigo-700/70 ${unreadCount > 9 ? 'w-6' : ''}`}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-[320px] md:w-[380px] bg-gradient-to-b from-gray-900/95 to-gray-900 backdrop-blur-xl border border-indigo-900/30 rounded-xl shadow-2xl shadow-indigo-900/30 overflow-hidden z-50 transform transition-all duration-300 origin-top-right scale-95 animate-fadeIn">
                    <div className="p-4 bg-gradient-to-r from-indigo-900/50 to-indigo-900/30 border-b border-indigo-900/30">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                Notifications
                            </h3>
                            <span className="text-xs bg-indigo-700/40 text-indigo-200 px-2 py-1 rounded-full flex items-center gap-1">
                                <span className="text-indigo-100 font-bold">{notifications.length}</span> total
                            </span>
                        </div>
                    </div>
                    
                    <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((n) => <NotificationItem key={n._id} notification={n} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 p-5 rounded-full mb-4 border border-indigo-900/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="text-gray-300 font-medium">All caught up!</p>
                                <p className="text-sm text-gray-500 mt-2">No new notifications</p>
                            </div>
                        )}
                    </div>
                    
                    {notifications.length > 0 && (
                        <div className="p-3 text-center bg-gradient-to-r from-gray-900/60 to-gray-900/40 border-t border-indigo-900/30">
                            <span className="text-xs text-indigo-400/80 flex items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Notifications automatically marked as read
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;