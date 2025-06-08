import React, { useEffect } from 'react';
import api from '../utils/api';

function LikeButton({ postId, initialIsLiked = false, initialLikeCount = 0 }) {
    const [isLiked, setIsLiked] = React.useState(initialIsLiked);
    const [likeCount, setLikeCount] = React.useState(initialLikeCount);
    const [isLoading, setIsLoading] = React.useState(false);
    const [animate, setAnimate] = React.useState(false);

    const fetchPostData = async () => {
        try {
            const response = await api.get(`/posts/${postId}`);
            setIsLiked(response.data.isLiked);
            setLikeCount(response.data.likeCount);
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };

    const toggleLike = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        setAnimate(true);

        try {
            const response = await api.post(`/posts/${postId}/like`);
            if (response.status === 200) {
                setIsLiked(!isLiked);
                setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setAnimate(false), 500);
        }
    };

    useEffect(() => {
        fetchPostData();
        const interval = setInterval(fetchPostData, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <button
            onClick={toggleLike}
            disabled={isLoading}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group overflow-hidden ${
                isLiked 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
            }`}
            aria-label={isLiked ? 'Unlike' : 'Like'}
            title={isLiked ? 'Dislike Post' : 'Like Post'}
        >
            {/* Animated background with gradient shine */}
            <div className={`absolute inset-0 z-0 transition-all duration-500 ${
                isLiked 
                    ? 'bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600' 
                    : 'bg-gray-800/80 group-hover:bg-gray-700/90'
            }`}>
                {isLiked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10 animate-[shine_2s_infinite]"></div>
                )}
            </div>
            
            {/* Animated pulse effect */}
            {animate && (
                <div className={`absolute inset-0 z-0 rounded-full ${
                    isLiked 
                        ? 'animate-ping bg-gradient-to-br from-rose-500 to-pink-600' 
                        : 'animate-ping bg-gray-600'
                }`}></div>
            )}
            
            {/* Floating hearts effect when liked */}
            {isLiked && animate && (
                <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute animate-[floatUp_1.2s_ease-in-out_forwards]"
                            style={{
                                top: '80%',
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 16 + 8}px`,
                                height: `${Math.random() * 16 + 8}px`,
                                background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(239,68,68,0.8) 50%, rgba(236,72,153,0.8) 100%)`,
                                opacity: 0,
                                borderRadius: '50%',
                                transform: `translate(${(Math.random() - 0.5) * 40}px, 0) rotate(${Math.random() * 360}deg)`,
                                animationDelay: `${i * 0.1}s`,
                                filter: 'blur(1px)',
                            }}
                        ></div>
                    ))}
                </div>
            )}
            
            {/* Icon container with bounce animation */}
            <div className="relative z-10 flex items-center justify-center">
                <svg
                    className={`w-6 h-6 transition-all duration-300 ${animate && isLiked ? 'animate-[bounce_0.6s_ease-in-out]' : ''}`}
                    fill={isLiked ? "url(#like-gradient)" : "none"}
                    stroke={isLiked ? "none" : "currentColor"}
                    strokeWidth={isLiked ? 0 : 1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {isLiked && (
                        <defs>
                            <linearGradient id="like-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFEEEE" />
                                <stop offset="50%" stopColor="#F43F5E" />
                                <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                        </defs>
                    )}
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                </svg>
            </div>
            
            {/* Counter with animation */}
            <span className={`relative z-10 font-medium text-sm transition-all duration-300 ${
                animate ? 'scale-125' : 'scale-100'
            } ${
                isLiked ? 'text-white/90' : 'text-gray-300 group-hover:text-white'
            }`}>
                {likeCount}
            </span>
            
            {/* Glow effect */}
            <div className={`absolute -inset-1 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-md ${
                isLiked ? 'bg-pink-500' : 'bg-gray-400'
            }`}></div>
            
            {/* Border highlight */}
            <div className={`absolute inset-0 rounded-full pointer-events-none border ${
                isLiked ? 'border-pink-300/30' : 'border-gray-600/30 group-hover:border-gray-400/50'
            }`}></div>
        </button>
    );
}

export default LikeButton;