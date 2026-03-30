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
import { COMPANION_MODEL_LABEL, SYSTEM_PROMPT_LABEL } from '../../lib/research-metadata';
import QuantumCompanion from '../companion/QuantumCompanion';

export default function MobileVerseLayout({ verseData, chapterId, verseId, chapterTitle, totalVerses, isShowcase = false }: any) {
    const router = useRouter();
    const haptic = useHaptic();
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [showReveal, setShowReveal] = useState(false);
    const [showCompanion, setShowCompanion] = useState(false);
    const [swipeHint, setSwipeHint] = useState(true);
    const [researchMode, setResearchMode] = useState(isShowcase);

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

                            {/* Research Mode Toggle */}
                            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-quantum-neon" />
                                    <label className="text-xs font-bold text-white uppercase tracking-widest">Research Mode</label>
                                </div>
                                <button
                                    onClick={() => setResearchMode(!researchMode)}
                                    className={cn(
                                        "w-10 h-5 rounded-full relative transition-colors",
                                        researchMode ? "bg-quantum-neon shadow-[0_0_10px_rgba(0,255,255,0.4)]" : "bg-white/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform",
                                        researchMode ? "translate-x-5.5 right-0.5" : "translate-x-0.5 left-0"
                                    )} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Quantum Companion Slide-up Panel */}
            <AnimatePresence>
                {showCompanion && (
                    <motion.div
                        className="absolute bottom-16 left-0 w-full z-50 pointer-events-auto"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="mx-3 mb-2 rounded-2xl relative shadow-[0_-8px_32px_rgba(0,255,255,0.15)] overflow-hidden pointer-events-auto">
                            <button
                                onClick={() => { setShowCompanion(false); haptic.tap(); }}
                                className="absolute right-4 top-4 z-50 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                            <QuantumCompanion chapterId={chapterId} verseId={verseId} verseData={verseData} researchMode={researchMode} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Canvas Area — dynamic height based on open panels */}
            <div className="absolute top-0 left-0 w-full z-0 transition-all duration-500 ease-in-out"
                style={{ height: (showControls || showCompanion) ? '45vh' : 'calc(100vh - 4rem)' }}>
                <AuroraBackground chapterId={chapterId} />
                <ProgressiveQuantumCanvas
                    chapter={chapterId}
                    verseData={verseData}
                    autoRotate={isPlaying}
                    animationType={verseData?.animation?.type || 'nebula'}
                    speed={speed}
                    complexity={complexity}
                    zoom={zoom}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-quantum-void/80 to-transparent pointer-events-none" />

                {/* Research Mode HUD */}
                <AnimatePresence>
                    {researchMode && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-24 left-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-4 border border-quantum-neon/50 shadow-[0_0_20px_rgba(0,255,255,0.15)] z-30 pointer-events-none"
                        >
                            <h4 className="text-[10px] text-quantum-neon font-mono uppercase font-bold tracking-widest mb-3 border-b border-quantum-neon/30 pb-1">AI Pipeline Telemetry</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono text-slate-300">
                                <div className="flex justify-between"><span>Model:</span><span className="text-white">{COMPANION_MODEL_LABEL}</span></div>
                                <div className="flex justify-between"><span>Temp:</span><span className="text-white">0.30</span></div>
                                <div className="flex justify-between"><span>Top_P:</span><span className="text-white">0.85</span></div>
                                <div className="flex justify-between"><span>System Prompt:</span><span className="text-white">{SYSTEM_PROMPT_LABEL}</span></div>
                                <div className="flex justify-between"><span>Epistemic Shield:</span><span className="text-green-400">ACTIVE</span></div>
                                <div className="flex justify-between"><span>WebGL Shaders:</span><span className="text-quantum-plasma">{verseData?.animation?.type || 'nebula'}</span></div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-white/10">
                                <span className="text-[9px] text-slate-500">Retrieval latency: ~450ms | Render: 60fps</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Top Bar with Persistent Next/Prev Arrows */}
            <header className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between items-start pointer-events-none text-white/80">
                <div className="pointer-events-auto flex items-center gap-2">
                    <a
                        href="/"
                        className="flex items-center justify-center w-8 h-8 bg-black/40 backdrop-blur rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                        aria-label="Back to chapters"
                    >
                        <X size={14} />
                    </a>

                    {/* Chapter / Verse Indicator */}
                    <div className="bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono font-bold">
                        Ch {chapterId} : {verseId}
                    </div>
                </div>

                <div className="pointer-events-auto flex gap-2">
                    {/* Mobile Navigation Arrows */}
                    <div className="flex bg-black/40 backdrop-blur rounded-full border border-white/10 overflow-hidden">
                        <button
                            onClick={() => verseId > 1 && router.push(`/verse/${chapterId}-${verseId - 1}`)}
                            disabled={verseId <= 1}
                            className="p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            aria-label="Previous verse"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="w-[1px] bg-white/10" />
                        <button
                            onClick={() => verseId < totalVerses && router.push(`/verse/${chapterId}-${verseId + 1}`)}
                            disabled={verseId >= totalVerses}
                            className="p-2 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            aria-label="Next verse"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Reveal button */}
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
                    onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); haptic.tap(); }}
                    className={cn(
                        "w-12 h-12 rounded-full border flex items-center justify-center transition-all transform active:scale-95 micro-tap focus:outline-none select-none touch-manipulation",
                        isPlaying
                            ? "bg-quantum-neon/10 border-quantum-neon/50 text-quantum-neon shadow-[0_0_15px_rgba(0,255,255,0.2)] animate-pulse-glow-full"
                            : "bg-white/10 border-white/20 text-white"
                    )}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                {/* Config — Item 4: opens real slider panel */}
                <button
                    onClick={() => { setShowControls(!showControls); setShowCompanion(false); haptic.tap(); }}
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors micro-tap",
                        showControls ? "text-quantum-cool" : "text-slate-400 hover:text-white"
                    )}
                    aria-label="Animation controls"
                >
                    <Settings size={20} className={showControls ? "animate-spin" : ""} style={{ animationDuration: '3s' }} />
                    <span className="text-[10px] uppercase tracking-wider">Config</span>
                </button>

                {/* Companion - opens AI chat */}
                <button
                    onClick={() => { setShowCompanion(!showCompanion); setShowControls(false); haptic.tap(); }}
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors micro-tap",
                        showCompanion ? "text-quantum-neon drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" : "text-slate-400 hover:text-white"
                    )}
                    aria-label="Quantum Companion"
                >
                    <MessageCircle size={20} />
                    <span className="text-[10px] uppercase tracking-wider">AI Guide</span>
                </button>
            </div>
        </div>
    );
}
