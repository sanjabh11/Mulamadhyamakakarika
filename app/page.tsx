'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Star, Lock, PlayCircle, CheckCircle, Sparkles, Users, BookOpen } from 'lucide-react';
import ChapterProgressRing from '../components/ui/ChapterProgressRing';
import ThemeToggle from '../components/ui/ThemeToggle';

import InteractiveBackground from '../components/InteractiveBackground';
import { getProgress, getProgressStats } from '../lib/user-progress';
import { useMembership, TIERS } from '../components/whop/MembershipTiers';

export default function Dashboard() {
    const { tier } = useMembership();
    const router = useRouter();
    const [chaptersData, setChaptersData] = useState<any[]>([]);
    // BUG-8 FIX: Lazy initializer reads localStorage synchronously on first render
    // so the streak number shows immediately instead of flashing 0 for 2-3 seconds.
    const [stats, setStats] = useState(() => {
        if (typeof window === 'undefined') return { currentStreak: 0, versesRead: 0 };
        try {
            const raw = localStorage.getItem('mmk_progress');
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    currentStreak: parsed.currentStreak ?? 0,
                    versesRead: parsed.versesRead ?? 0,
                };
            }
        } catch { /* ignore */ }
        return { currentStreak: 0, versesRead: 0 };
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Derive chapter access from tier string (stable primitive — avoids
        // re-render cascade caused by unstable canAccessChapter function ref)
        const tierConfig = TIERS[tier?.toUpperCase() as keyof typeof TIERS];
        const accessibleChapters: number[] = tierConfig?.limits?.chapters || [1, 2, 3];

        try {
            const progress = getProgress();
            const statsData = getProgressStats();
            setStats({ currentStreak: statsData.currentStreak || 0, versesRead: statsData.versesRead || 0 });

            const highestCompleted = progress.chaptersCompleted.length > 0
                ? Math.max(...progress.chaptersCompleted) : 0;

            const generatedChapters = Array.from({ length: 27 }, (_, i) => {
                const chapId = i + 1;
                const hasAccess = accessibleChapters.includes(chapId);
                const isCompleted = progress.chaptersCompleted.includes(chapId);
                const isActive = progress.currentChapter === chapId ||
                    (!isCompleted && chapId <= highestCompleted + 1);
                const effectivelyActive = (chapId === 1 && highestCompleted === 0) ? true : isActive;

                return {
                    id: chapId,
                    title: `Chapter ${chapId}`,
                    status: isCompleted ? 'completed' : (!hasAccess ? 'locked' : (effectivelyActive ? 'active' : 'locked')),
                    progress: isCompleted ? 100 : (effectivelyActive ? Math.min(99, Math.max(5, (statsData.versesRead % 15) * 6)) : 0)
                };
            });

            setChaptersData(generatedChapters);
        } catch (e) {
            console.error('[Dashboard] failed to load progress:', e);
        } finally {
            setIsLoaded(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tier]); // Only re-run when tier changes (stable primitive)

    const displayChapters = isLoaded ? chaptersData : Array.from({ length: 27 }, (_, i) => ({
        id: i + 1,
        title: `Chapter ${i + 1}`,
        status: i === 0 ? 'active' : 'locked',
        progress: 0
    }));
    return (
        <div className="min-h-screen relative text-slate-200 font-sans overflow-x-hidden pt-12">
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
                    <div className="flex gap-3 items-center">
                        <ThemeToggle />
                        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-orange-500/30">
                            <Flame size={16} className="text-orange-500 animate-pulse" />
                            <span className="text-xs font-mono text-orange-400">{stats.currentStreak}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-quantum-gold/30">
                            <Star size={16} className="text-quantum-gold" />
                            <span className="text-xs font-mono text-yellow-200">{stats.versesRead}</span>
                        </div>
                    </div>
                </header>

                {/* Academic-facing trust surface for free users */}
                {tier === 'free' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 text-center premium-glass-upgrade p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-amber-500 text-transparent bg-clip-text mb-2">
                            A Digital Humanities Platform for Reading the MMK
                        </h2>
                        <p className="text-slate-300 text-sm mb-6">
                            Explore Nāgārjuna through interactive verse study, transparent AI assistance, and carefully caveated quantum analogies designed for researchers, educators, students, and serious public learners.
                        </p>

                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-cyan-200 mb-6">
                            <CheckCircle size={14} className="text-cyan-300" />
                            <span>Structural analogy only — not metaphysical identity</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-left">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2 text-white">
                                    <Users size={16} className="text-quantum-neon" />
                                    <span className="text-sm font-semibold">Researchers</span>
                                </div>
                                <p className="text-[11px] text-slate-400">Use open showcase verses, research-mode transparency, and prototype evaluation surfaces to assess the platform critically.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2 text-white">
                                    <BookOpen size={16} className="text-purple-400" />
                                    <span className="text-sm font-semibold">Educators</span>
                                </div>
                                <p className="text-[11px] text-slate-400">Pair canonical verses, explanatory scaffolds, and interactive media for classroom or seminar use.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2 text-white">
                                    <Sparkles size={16} className="text-amber-300" />
                                    <span className="text-sm font-semibold">Learners</span>
                                </div>
                                <p className="text-[11px] text-slate-400">Read, listen, and compare philosophical explanation with explicit caveats around every quantum bridge.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/iks-conference" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all hover:scale-105 active:scale-95">
                                <PlayCircle size={18} />
                                Reviewer Showcase
                            </Link>
                            <Link href="/research/data" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white px-6 py-3 rounded-full font-bold transition-all hover:bg-white/15">
                                <BookOpen size={18} />
                                Prototype Telemetry
                            </Link>
                            <button
                                onClick={(e) => { e.stopPropagation(); router.push('/pricing'); }}
                                className="inline-flex items-center justify-center gap-2 bg-transparent border border-amber-500/40 text-amber-200 px-6 py-3 rounded-full font-bold transition-all hover:bg-amber-500/10 active:scale-95 relative z-50 pointer-events-auto focus:outline-none touch-manipulation"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                <Sparkles size={18} />
                                Support / Access Options
                            </button>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-3 gap-6">
                    {displayChapters.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {chapter.status !== 'locked' ? (
                                <Link href={`/verse/${chapter.id}-1`} className="group block relative">
                                    <ChapterProgressRing
                                        chapterId={chapter.id}
                                        status={chapter.status as any}
                                        progress={chapter.progress}
                                    />
                                </Link>
                            ) : (
                                <a href="/pricing" className="group block relative">
                                    <ChapterProgressRing
                                        chapterId={chapter.id}
                                        status={chapter.status as any}
                                        progress={chapter.progress}
                                    />
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Nav Placeholder */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-glass-heavy border-t border-white/5 flex justify-around items-center backdrop-blur-md z-50">
                <Link href="/" className="text-quantum-neon flex flex-col items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-quantum-neon mb-0.5" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Path</span>
                </Link>
                <Link href="/profile" className="text-slate-400 hover:text-white flex flex-col items-center gap-1 transition-colors">
                    <span className="text-[10px] tracking-widest uppercase">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
