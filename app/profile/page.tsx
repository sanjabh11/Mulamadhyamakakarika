'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, BookOpen, Star, Flame, Trophy, Settings } from 'lucide-react';
import { useMembership } from '../../components/whop/MembershipTiers';
import { getProgress, getProgressStats } from '../../lib/user-progress';

function ProfileStat({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
    return (
        <div className="flex flex-col items-center gap-1 p-4 bg-white/5 border border-white/10 rounded-xl">
            <Icon size={20} className={color} />
            <span className="text-xl font-bold text-white">{value}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
    );
}

export default function ProfilePage() {
    const { tier } = useMembership();
    const [stats, setStats] = React.useState({ currentStreak: 0, versesRead: 0, chaptersCompleted: 0 });

    React.useEffect(() => {
        try {
            const progress = getProgress();
            const statsData = getProgressStats();
            setStats({
                currentStreak: statsData.currentStreak || 0,
                versesRead: statsData.versesRead || 0,
                chaptersCompleted: progress.chaptersCompleted?.length || 0,
            });
        } catch (e) {
            console.error('[Profile] Failed to load stats:', e);
        }
    }, []);

    const tierLabels: Record<string, { label: string; color: string; gradient: string }> = {
        free: { label: 'Explorer', color: 'text-slate-300', gradient: 'from-slate-500/20 to-slate-600/10' },
        seeker: { label: 'Seeker', color: 'text-purple-300', gradient: 'from-purple-500/25 to-indigo-600/15' },
        practitioner: { label: 'Practitioner', color: 'text-cyan-300', gradient: 'from-cyan-500/20 to-teal-600/10' },
        teacher: { label: 'Teacher', color: 'text-amber-300', gradient: 'from-amber-500/20 to-orange-600/10' },
    };

    const currentTier = tierLabels[tier] || tierLabels['free'];

    return (
        <div className="min-h-screen text-slate-200 font-sans">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-quantum-deep to-cyan-900/10" />
            </div>

            <div className="relative z-10 max-w-lg mx-auto px-6 pb-24 pt-6">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                        <span>Home</span>
                    </Link>
                    <h1 className="text-sm font-bold text-white">My Profile</h1>
                    <div className="w-16" /> {/* spacer */}
                </header>

                {/* Avatar + Tier */}
                <div className="flex flex-col items-center mb-8">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentTier.gradient} border-2 border-white/20 flex items-center justify-center mb-3`}>
                        <User size={36} className={currentTier.color} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${currentTier.color} border-current/40 bg-current/10`}>
                        {currentTier.label}
                    </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <ProfileStat label="Streak" value={stats.currentStreak} icon={Flame} color="text-orange-400" />
                    <ProfileStat label="Verses" value={stats.versesRead} icon={BookOpen} color="text-purple-400" />
                    <ProfileStat label="Chapters" value={stats.chaptersCompleted} icon={Trophy} color="text-yellow-400" />
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/pricing"
                        className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Star size={18} className="text-purple-400" />
                            <div>
                                <p className="text-sm font-semibold text-white">Upgrade Plan</p>
                                <p className="text-xs text-slate-400">Unlock more chapters & AI Guide</p>
                            </div>
                        </div>
                        <ArrowLeft size={14} className="text-slate-400 rotate-180" />
                    </Link>

                    <Link
                        href="/course"
                        className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <BookOpen size={18} className="text-cyan-400" />
                            <div>
                                <p className="text-sm font-semibold text-white">27-Day Journey</p>
                                <p className="text-xs text-slate-400">Structured daily practice</p>
                            </div>
                        </div>
                        <ArrowLeft size={14} className="text-slate-400 rotate-180" />
                    </Link>

                    <Link
                        href="/progress"
                        className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Settings size={18} className="text-slate-400" />
                            <div>
                                <p className="text-sm font-semibold text-white">My Progress</p>
                                <p className="text-xs text-slate-400">Full progress dashboard</p>
                            </div>
                        </div>
                        <ArrowLeft size={14} className="text-slate-400 rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
