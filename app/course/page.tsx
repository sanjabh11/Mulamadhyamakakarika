'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Award, Compass, PlayCircle } from 'lucide-react';
import InteractiveBackground from '../../components/InteractiveBackground';

export default function CourseDashboard() {
    return (
        <div className="min-h-screen bg-black text-slate-200 relative overflow-hidden">
            <InteractiveBackground />
            <div className="absolute inset-0 bg-nebula-glow mix-blend-screen opacity-20 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto p-6 pt-24">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 text-transparent bg-clip-text animate-gradient-text">
                        The 27-Day Journey
                    </h1>
                    <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
                        Nāgārjuna's Mūlamadhyamakakārikā bridges the gap between ancient Madhyamaka philosophy and modern quantum physics. Embark on a structured 27-day contemplation path.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/verse/1-1">
                        <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="premium-glass-upgrade p-8 rounded-2xl h-full flex flex-col group cursor-pointer"
                        >
                            <div className="bg-quantum-neon/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-quantum-neon group-hover:scale-110 transition-transform">
                                <PlayCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Resume Journey</h2>
                            <p className="text-slate-400 flex-1">Pick up exactly where you left off. Continue your exploration of emptiness and interdependence.</p>
                        </motion.div>
                    </Link>

                    <Link href="/progress">
                        <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="premium-glass p-8 rounded-2xl h-full flex flex-col group cursor-pointer"
                        >
                            <div className="bg-purple-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                <Compass size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">My Progress</h2>
                            <p className="text-slate-400 flex-1">View your completion stats, download chapter PDFs, and review your mastery of the concepts.</p>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
