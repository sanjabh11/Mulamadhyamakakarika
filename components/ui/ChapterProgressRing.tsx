'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, Lock, Book } from 'lucide-react';

interface ChapterProgressRingProps {
    chapterId: number;
    status: 'locked' | 'active' | 'completed';
    progress?: number; // 0-100
    color?: string;
    onClick?: () => void;
}

export default function ChapterProgressRing({
    chapterId,
    status,
    progress = 0,
    color,
    onClick
}: ChapterProgressRingProps) {

    // Determine color based on status if not provided
    const ringColor = color || (
        status === 'completed' ? '#FFD700' :
            status === 'active' ? '#00FFFF' :
                '#64748b'
    );

    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div
            className="relative w-24 h-24 flex items-center justify-center cursor-pointer group"
            onClick={onClick}
        >
            {/* Base Ring (Track) */}
            <svg className="absolute w-full h-full -rotate-90 pointer-events-none">
                <circle
                    cx="50%" cy="50%" r={radius}
                    stroke={status === 'locked' ? '#1e293b' : 'rgba(255,255,255,0.1)'}
                    strokeWidth="4"
                    fill="transparent"
                />

                {/* Progress Ring */}
                {status !== 'locked' && (
                    <motion.circle
                        cx="50%" cy="50%" r={radius}
                        stroke={ringColor}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: status === 'completed' ? 0 : strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                    />
                )}
            </svg>

            {/* Pulsing Glow for Active */}
            {status === 'active' && (
                <div className="absolute inset-0 rounded-full animate-pulse-glow-full opacity-50 blur-md bg-quantum-neon/20 z-0 pointer-events-none" />
            )}

            {/* Inner Content */}
            <div className={`
                relative z-10 w-16 h-16 rounded-full flex flex-col items-center justify-center transition-transform duration-300
                ${status === 'locked' ? 'bg-white/5 grayscale opacity-50' : 'bg-black/40 backdrop-blur-sm'}
                group-hover:scale-105
            `}>
                {status === 'completed' && <CheckCircle size={24} className="text-quantum-gold mb-1" />}
                {status === 'active' && <PlayCircle size={28} className="text-quantum-neon mb-1 group-hover:scale-110 transition-transform" />}
                {status === 'locked' && <Lock size={20} className="text-slate-500 mb-1" />}

                <span className={`text-[10px] font-mono font-bold ${status === 'locked' ? 'text-slate-500' : 'text-white/80'}`}>
                    Ch {chapterId}
                </span>
            </div>

            {/* Hover Tooltip Label */}
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded text-[10px] text-white pointer-events-none border border-white/10 z-20">
                {status === 'locked' ? `Unlock Ch ${chapterId}` : status === 'active' ? 'Resume' : 'Review'}
            </div>
        </div>
    );
}
