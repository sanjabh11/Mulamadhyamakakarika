/**
 * EducationalRevealOverlay — Item 7
 * Full-screen ethereal overlay revealing twoTruths, commonMisconception,
 * visualBridge, and educationalGoal from verseData.
 * Triggered by "✨ Reveal" button on canvas. Dismiss via backdrop or Escape.
 */

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, AlertTriangle, Zap, Target } from 'lucide-react';

const EducationalRevealOverlay = ({ verseData, onClose }) => {
    // Dismiss on Escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll while overlay is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    const twoTruths = verseData?.philosophy?.twoTruths;
    const misconception = verseData?.philosophy?.commonMisconception;
    const visualBridge = verseData?.animation?.visualBridge;
    const educationalGoal = verseData?.animation?.educationalGoal;
    const title = verseData?.title;

    const hasContent = twoTruths || misconception || visualBridge || educationalGoal;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                role="dialog"
                aria-modal="true"
                aria-label="Educational insights overlay"
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'rgba(0, 5, 15, 0.88)',
                        backdropFilter: 'blur(16px)',
                    }}
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Panel */}
                <motion.div
                    className="liquid-glass-border relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0,15,35,0.97) 0%, rgba(20,0,50,0.97) 100%)',
                        border: '1px solid var(--chapter-border-color, rgba(0,255,255,0.25))',
                        boxShadow: `
                            0 0 0 1px var(--chapter-border-color, rgba(0,255,255,0.15)),
                            0 0 60px var(--chapter-panel-glow, rgba(0,255,255,0.12)),
                            0 32px 80px rgba(0,0,0,0.6)
                        `,
                    }}
                    initial={{ scale: 0.88, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 10 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                >
                    {/* Header */}
                    <div className="sticky top-0 flex items-center justify-between p-6 pb-4"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,15,35,0.98), transparent)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                        <div>
                            <p className="text-xs font-mono uppercase tracking-widest mb-1"
                                style={{ color: 'var(--color-chapter-current, #00FFFF)' }}>
                                ✨ Educational Reveal
                            </p>
                            <h2 className="text-xl font-display font-bold text-white leading-tight">
                                {title || 'Verse Insights'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 hover:border-white/20 flex-shrink-0 ml-4"
                            aria-label="Close overlay"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 pt-4 space-y-5">
                        {!hasContent && (
                            <div className="text-center py-8">
                                <p className="text-slate-500 text-sm">No additional insights available for this verse.</p>
                            </div>
                        )}

                        {/* Two Truths */}
                        {twoTruths && (
                            <motion.div
                                className="rounded-xl p-5 space-y-2"
                                style={{
                                    background: 'rgba(16, 185, 129, 0.07)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                }}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                        <Layers size={14} className="text-emerald-400" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                        Two Truths
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{twoTruths}</p>
                            </motion.div>
                        )}

                        {/* Common Misconception */}
                        {misconception && (
                            <motion.div
                                className="rounded-xl p-5 space-y-2"
                                style={{
                                    background: 'rgba(245, 158, 11, 0.07)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                }}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.18 }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                                        <AlertTriangle size={14} className="text-amber-400" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                        Common Misconception
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{misconception}</p>
                            </motion.div>
                        )}

                        {/* Visual Bridge */}
                        {visualBridge && (
                            <motion.div
                                className="rounded-xl p-5 space-y-2"
                                style={{
                                    background: 'rgba(0, 255, 255, 0.05)',
                                    border: '1px solid rgba(0, 255, 255, 0.15)',
                                }}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.26 }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                                        <Zap size={14} className="text-cyan-400" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                                        Visual Bridge
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{visualBridge}</p>
                            </motion.div>
                        )}

                        {/* Educational Goal */}
                        {educationalGoal && (
                            <motion.div
                                className="rounded-xl p-5"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.06))',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                }}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.34 }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                                        <Target size={14} className="text-violet-400" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                                        Educational Goal
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed italic">{educationalGoal}</p>
                            </motion.div>
                        )}

                        {/* Dismiss hint */}
                        <p className="text-center text-xs text-slate-600 pt-2">
                            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono text-[10px]">Esc</kbd> or tap outside to close
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EducationalRevealOverlay;
