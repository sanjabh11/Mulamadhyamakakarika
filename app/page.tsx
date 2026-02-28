'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Star, Lock, PlayCircle, CheckCircle } from 'lucide-react';
import ChapterProgressRing from '../components/ui/ChapterProgressRing';

import InteractiveBackground from '../components/InteractiveBackground';

const chapters = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    title: `Chapter ${i + 1}`,
    status: i === 0 ? 'completed' : i === 1 ? 'active' : 'locked',
}));

export default function Dashboard() {
    return (
        <div className="h-full w-full overflow-y-auto relative bg-black">
            {/* Interactive 3D Spline Background */}
            <InteractiveBackground />

            {/* Background Gradients over the 3D scene */}
            <div className="aurora-background">
                <div className="aurora-blob aurora-blob-1" />
                <div className="aurora-blob aurora-blob-2" />
                <div className="aurora-blob aurora-blob-3" />
            </div>
            <div className="absolute inset-0 bg-nebula-glow pointer-events-none mix-blend-screen opacity-40" />

            {/* Content */}
            <div className="relative z-10 max-w-lg mx-auto p-6 pb-24">
                {/* Header */}
                <header className="flex justify-between items-center mb-10 pt-6">
                    <div>
                        <h1 className="text-display bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 text-transparent bg-clip-text animate-gradient-text animate-text-reveal">
                            The Middle Way
                        </h1>
                        <p className="text-slate-400 text-sm mt-1 animate-text-reveal" style={{ animationDelay: '0.2s', opacity: 0 }}>
                            Nagarjuna's Path
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-orange-500/30">
                            <Flame size={16} className="text-orange-500 animate-pulse" />
                            <span className="text-xs font-mono text-orange-400">7</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-quantum-gold/30">
                            <Star size={16} className="text-quantum-gold" />
                            <span className="text-xs font-mono text-yellow-200">1,250</span>
                        </div>
                    </div>
                </header>

                {/* Chapter Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {chapters.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={chapter.status !== 'locked' ? `/verse/${chapter.id}-1` : '#'} className="group block relative">
                                <ChapterProgressRing
                                    chapterId={chapter.id}
                                    status={chapter.status as any}
                                    progress={chapter.status === 'completed' ? 100 : chapter.status === 'active' ? 45 : 0}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Nav Placeholder */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-glass-heavy border-t border-white/5 flex justify-around items-center backdrop-blur-md z-50">
                <button className="text-quantum-neon flex flex-col items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-quantum-neon mb-0.5" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Path</span>
                </button>
                <button className="text-slate-500 flex flex-col items-center gap-1">
                    <span className="text-[10px] tracking-widest uppercase">Profile</span>
                </button>
            </nav>
        </div>
    );
}
