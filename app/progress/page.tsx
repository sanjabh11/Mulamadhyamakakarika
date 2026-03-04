'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Zap, CheckCircle, BookOpen, Download } from 'lucide-react';
import { getProgress, getProgressStats } from '../../lib/user-progress';
import { useMembership } from '../../components/whop/MembershipTiers';
import { BulkPDFExporter } from '../../components/whop/PDFExporter';
import InteractiveBackground from '../../components/InteractiveBackground';

export default function ProgressDashboard() {
    const { tier, isLoaded: tierLoaded } = useMembership();
    const [stats, setStats] = useState({ currentStreak: 0, highestStreak: 0, versesRead: 0, chaptersCompleted: [] as number[] });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const pStats = getProgressStats();
        const prog = getProgress();
        setStats({
            currentStreak: pStats.currentStreak || 0,
            highestStreak: pStats.highestStreak || 0,
            versesRead: pStats.versesRead || 0,
            chaptersCompleted: prog.chaptersCompleted || []
        });
        setIsLoaded(true);
    }, []);

    if (!isLoaded || !tierLoaded) return null;

    return (
        <div className="min-h-screen bg-black text-slate-200 relative overflow-y-auto">
            <InteractiveBackground />
            <div className="absolute inset-0 bg-nebula-glow mix-blend-screen opacity-20 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto p-6 pb-24 pt-24">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                        My Journey Progress
                    </h1>
                    <p className="text-slate-400 mt-2">Track your contemplative mastery</p>
                </header>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="premium-glass p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <Zap className="text-orange-500 mb-2" size={24} />
                        <div className="text-3xl font-mono font-bold text-white">{stats.currentStreak}</div>
                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Day Streak</div>
                    </div>
                    <div className="premium-glass p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <BookOpen className="text-quantum-neon mb-2" size={24} />
                        <div className="text-3xl font-mono font-bold text-white">{stats.versesRead}</div>
                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Verses Read</div>
                    </div>
                    <div className="premium-glass p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <CheckCircle className="text-emerald-400 mb-2" size={24} />
                        <div className="text-3xl font-mono font-bold text-white">{stats.chaptersCompleted.length}</div>
                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Chapters Finished</div>
                    </div>
                    <div className="premium-glass p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                        <Award className="text-quantum-gold mb-2" size={24} />
                        <div className="text-lg font-bold text-white uppercase">{tier}</div>
                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Current Tier</div>
                    </div>
                </div>

                {/* STREAK GAMIFICATION BANNER */}
                {stats.currentStreak > 0 && (
                    <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-[#FF512F] to-[#DD2476] shadow-lg shadow-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6 transform hover:scale-[1.01] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Zap className="text-white fill-white" size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                                    {stats.currentStreak} Day Streak!
                                </h2>
                                <p className="text-sm text-white/80">
                                    {stats.currentStreak >= 7 ? "You're a Week Warrior! Keep the momentum going." : "The path to enlightenment is walked one day at a time."}
                                </p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end hidden md:flex">
                            <div className="text-sm text-white/80 font-medium uppercase tracking-widest mb-1">Personal Best</div>
                            <div className="text-3xl font-mono font-bold text-white">{stats.highestStreak}</div>
                        </div>
                    </div>
                )}

                {/* DIGITAL PRODUCTS EXPORT */}
                <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                            <Download size={20} className="text-quantum-neon" /> Offline Reading
                        </h2>
                        <p className="text-sm text-slate-400 max-w-lg">
                            Download high-quality summaries and guided meditations for offline contemplation. Available exclusively for Seeker tier and above.
                        </p>
                    </div>

                    <BulkPDFExporter chapters={Array.from({ length: 27 }, (_, i) => i + 1)} />
                </div>

                {/* CERTIFICATES */}
                <h2 className="text-xl font-bold text-white mb-4">Earned Certificates</h2>
                {stats.chaptersCompleted.length === 0 ? (
                    <div className="premium-glass p-8 rounded-2xl text-center">
                        <Award size={40} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg text-slate-300 font-semibold">No certificates yet</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">Complete chapters and pass quizzes to unlock your achievement certificates.</p>
                        <Link href="/course" className="inline-block mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm text-white">
                            Start Learning
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {stats.chaptersCompleted.map((chap) => (
                            <Link key={chap} href={`/certificate/${chap}`} className="block">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="premium-glass-upgrade p-6 rounded-2xl flex flex-col items-center justify-center text-center border border-quantum-gold/30"
                                >
                                    <Award className="text-quantum-gold mb-3" size={32} />
                                    <div className="text-sm font-bold text-white">Chapter {chap}</div>
                                    <div className="text-xs text-quantum-gold mt-1">Mastery Achieved</div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
