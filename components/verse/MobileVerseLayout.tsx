'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, MessageCircle, ChevronUp, ChevronDown, BookOpen, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
// @ts-ignore
import ProgressiveQuantumCanvas from '../ProgressiveQuantumCanvas';
// @ts-ignore
import EducationalRevealOverlay from '../ui/EducationalRevealOverlay';
import { useHaptic } from '../../hooks/useHaptic';
import AuroraBackground from '../ui/AuroraBackground';

export default function MobileVerseLayout({ verseData, chapterId, verseId, chapterTitle, totalVerses }: any) {
    const router = useRouter();
    const haptic = useHaptic();
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [showReveal, setShowReveal] = useState(false);
    const [swipeHint, setSwipeHint] = useState(true);

    // Animation controls state
    const [speed, setSpeed] = useState(50);
    const [complexity, setComplexity] = useState(50);
    const [zoom, setZoom] = useState(100);

    // Item 2: Chapter color modulation — set data-chapter on body
    useEffect(() => {
        document.body.dataset.chapter = String(chapterId);
        return () => { delete document.body.dataset.chapter; };
    }, [chapterId]);

    // Hide swipe hint after 3s
    useEffect(() => {
        const t = setTimeout(() => setSwipeHint(false), 3000);
        return () => clearTimeout(t);
    }, []);

    // Item 6: Swipe gesture navigation
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;

        // Only trigger if horizontal swipe is dominant (not a scroll)
        if (Math.abs(deltaX) < 50 || Math.abs(deltaY) > Math.abs(deltaX) * 0.8) return;

        if (deltaX < -50 && verseId < totalVerses) {
            // Swipe left → next verse
            router.push(`/verse/${chapterId}-${verseId + 1}`);
        } else if (deltaX > 50 && verseId > 1) {
            // Swipe right → previous verse
            router.push(`/verse/${chapterId}-${verseId - 1}`);
        }
    }, [chapterId, verseId, totalVerses, router]);

    const toggleSheet = () => setSheetOpen(!sheetOpen);

    return (
        <div
            className="h-screen w-full bg-quantum-void relative overflow-hidden flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Educational Reveal Overlay — Item 7 */}
            {showReveal && (
                <EducationalRevealOverlay
                    verseData={verseData}
                    onClose={() => setShowReveal(false)}
                />
            )}

            {/* Mobile Controls Slide-up Panel — Item 4 */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        className="absolute bottom-16 left-0 w-full z-40"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div
                            className="mx-3 mb-2 rounded-2xl p-5 space-y-5"
                            style={{
                                background: 'rgba(0, 10, 30, 0.92)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid var(--chapter-border-color, rgba(0,255,255,0.2))',
                                boxShadow: '0 -8px 32px var(--chapter-panel-glow, rgba(0,255,255,0.1))',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-quantum-cool uppercase tracking-widest">Animation Controls</span>
                                <button
                                    onClick={() => { setShowControls(false); haptic.tap(); }}
                                    className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white micro-tap"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Speed Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-slate-300">Speed</label>
                                    <span className="text-xs font-mono text-quantum-cool">{speed}%</span>
                                </div>
                                <input
                                    type="range" min={0} max={100} value={speed}
                                    onChange={e => setSpeed(Number(e.target.value))}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-chapter-current, #00FFFF) ${speed}%, rgba(255,255,255,0.1) ${speed}%)`
                                    }}
                                    aria-label="Animation speed"
                                />
                            </div>

                            {/* Complexity Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-slate-300">Complexity</label>
                                    <span className="text-xs font-mono text-quantum-cool">{complexity}%</span>
                                </div>
                                <input
                                    type="range" min={0} max={100} value={complexity}
                                    onChange={e => setComplexity(Number(e.target.value))}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-chapter-current, #00FFFF) ${complexity}%, rgba(255,255,255,0.1) ${complexity}%)`
                                    }}
                                    aria-label="Animation complexity"
                                />
                            </div>

                            {/* Zoom Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-slate-300">Zoom</label>
                                    <span className="text-xs font-mono text-quantum-cool">{zoom}%</span>
                                </div>
                                <input
                                    type="range" min={50} max={200} value={zoom}
                                    onChange={e => setZoom(Number(e.target.value))}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-chapter-current, #00FFFF) ${((zoom - 50) / 150) * 100}%, rgba(255,255,255,0.1) ${((zoom - 50) / 150) * 100}%)`
                                    }}
                                    aria-label="Zoom level"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Canvas Area — height = 100vh minus collapsed sheet (35vh) minus bottom bar (4rem) */}
            <div className="absolute top-0 left-0 w-full z-0" style={{ height: 'calc(100vh - 35vh - 4rem)' }}>
                <AuroraBackground chapterId={chapterId} />
                <ProgressiveQuantumCanvas
                    chapter={chapterId}
                    verseData={verseData}
                    autoRotate={isPlaying}
                    animationType={verseData?.animation?.type || 'nebula'}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-quantum-void/80 to-transparent pointer-events-none" />
            </div>

            {/* Top Bar */}
            <header className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-start pointer-events-none text-white/80">
                <div className="pointer-events-auto">
                    <a
                        href="/"
                        className="flex items-center gap-2 text-xs font-mono bg-black/30 backdrop-blur px-3 py-1.5 rounded-full border border-white/10"
                    >
                        ← Ch {chapterId}
                    </a>
                </div>
                {/* Reveal button — Item 7 */}
                <div className="pointer-events-auto">
                    <button
                        onClick={() => { setShowReveal(true); haptic.success(); }}
                        className="flex items-center gap-1.5 text-xs font-mono bg-black/30 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 text-quantum-cool hover:text-white transition-colors micro-tap"
                        aria-label="Reveal educational insights"
                    >
                        <Sparkles size={12} />
                        Reveal
                    </button>
                </div>
            </header>

            {/* Swipe hint arrows — Item 6 */}
            <AnimatePresence>
                {swipeHint && (
                    <motion.div
                        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-3 pointer-events-none z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {verseId > 1 && (
                            <div className="flex items-center gap-1 text-white/20 text-xs">
                                <ChevronLeft size={20} className="animate-pulse" />
                            </div>
                        )}
                        <div className="flex-1" />
                        {verseId < totalVerses && (
                            <div className="flex items-center gap-1 text-white/20 text-xs">
                                <ChevronRight size={20} className="animate-pulse" />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Sheet */}
            <motion.div
                className={cn(
                    "absolute bottom-16 left-0 w-full rounded-t-3xl overflow-hidden z-20 flex flex-col",
                )}
                style={{
                    background: 'linear-gradient(to top, rgba(0,10,18,0.98), rgba(0,31,63,0.95))',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid var(--chapter-border-color, rgba(0,255,255,0.2))',
                    boxShadow: '0 -4px 32px var(--chapter-panel-glow, rgba(0,255,255,0.08))',
                }}
                initial={false}
                animate={{ height: sheetOpen ? '85vh' : '35vh' }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
                {/* Handle */}
                <div
                    className="w-full h-8 flex justify-center items-center cursor-pointer active:bg-white/5"
                    onClick={toggleSheet}
                >
                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar">
                    <div className="mb-6">
                        <h2 className="text-quantum-cool text-xs uppercase tracking-wider font-bold mb-1">
                            Chapter {chapterId} · Verse {verseId}
                        </h2>
                        <h1 className="text-white mb-4 text-heading-display leading-tight">
                            {verseData?.title || `Verse ${verseId}`}
                        </h1>

                        {/* Sanskrit */}
                        <div className="mb-4 space-y-2">
                            {verseData?.sanskrit?.text && (
                                <p className="text-lg text-quantum-cool/90 italic mb-2 text-sanskrit">
                                    {verseData.sanskrit.text}
                                </p>
                            )}
                            <p className="text-slate-300 text-verse-body font-sans">
                                {verseData.verseText}
                            </p>
                        </div>

                        {/* Key Insight */}
                        {verseData?.philosophy?.insight && (
                            <div className="border-l-2 p-4 rounded-r-lg my-4"
                                style={{ borderColor: 'var(--color-chapter-current, #FFD700)', background: 'rgba(255,215,0,0.06)' }}>
                                <p className="text-sm text-yellow-100/90">
                                    <span className="font-bold uppercase text-xs block mb-1"
                                        style={{ color: 'var(--color-chapter-current, #FFD700)' }}>
                                        Key Insight
                                    </span>
                                    {verseData.philosophy.insight}
                                </p>
                            </div>
                        )}

                        {/* Expanded Content */}
                        <div className={cn("space-y-6 mt-8", !sheetOpen && "opacity-50 blur-sm pointer-events-none")}>
                            <div>
                                <h3 className="text-quantum-neon text-sm font-bold uppercase mb-2">Madhyamaka Logic</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{verseData.madhyamakaConcept}</p>
                            </div>
                            <div>
                                <h3 className="text-quantum-plasma text-sm font-bold uppercase mb-2">Quantum Parallel</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{verseData.quantumPhysicsParallel}</p>
                            </div>
                            {verseData?.philosophy?.twoTruths && (
                                <div>
                                    <h3 className="text-amber-400 text-sm font-bold uppercase mb-2">Two Truths</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{verseData.philosophy.twoTruths}</p>
                                </div>
                            )}
                            {verseData?.philosophy?.commonMisconception && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <h3 className="text-red-300 text-xs font-bold uppercase mb-1">⚠ Common Misconception</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{verseData.philosophy.commonMisconception}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Controls Bar — Item 4: real sliders via showControls panel */}
            <div className="absolute bottom-0 left-0 w-full h-16 border-t z-30 flex items-center justify-around px-4 backdrop-blur-xl"
                style={{
                    background: 'rgba(0,10,18,0.95)',
                    borderColor: 'var(--chapter-border-color, rgba(0,255,255,0.15))',
                }}>
                {/* Text toggle */}
                <button
                    onClick={() => { toggleSheet(); haptic.tap(); }}
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors micro-tap"
                    aria-label="Toggle verse text"
                >
                    <BookOpen size={20} />
                    <span className="text-[10px] uppercase tracking-wider">Text</span>
                </button>

                {/* Play/Pause — Item 8: pulsing glow */}
                <button
                    onClick={() => { setIsPlaying(!isPlaying); haptic.tap(); }}
                    className={cn(
                        "w-12 h-12 rounded-full border flex items-center justify-center transition-all transform active:scale-95 micro-tap",
                        isPlaying
                            ? "bg-quantum-neon/10 border-quantum-neon/50 text-quantum-neon shadow-[0_0_15px_rgba(0,255,255,0.2)] animate-pulse-glow-full"
                            : "bg-white/10 border-white/20 text-white"
                    )}
                    aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>

                {/* Config — Item 4: opens real slider panel */}
                <button
                    onClick={() => { setShowControls(!showControls); haptic.tap(); }}
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors micro-tap",
                        showControls ? "text-quantum-cool" : "text-slate-400 hover:text-white"
                    )}
                    aria-label="Animation controls"
                >
                    <Settings size={20} className={showControls ? "animate-spin" : ""} style={{ animationDuration: '3s' }} />
                    <span className="text-[10px] uppercase tracking-wider">Config</span>
                </button>
            </div>
        </div>
    );
}
