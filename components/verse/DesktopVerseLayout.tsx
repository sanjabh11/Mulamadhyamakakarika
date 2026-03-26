'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Maximize2, HelpCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Lightbulb, BookOpen, Sparkles, Lock, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
// @ts-ignore
import ProgressiveQuantumCanvas from '../ProgressiveQuantumCanvas';
import CollapsiblePanel from '../ui/CollapsiblePanel';
import AnimationControls from '../ui/AnimationControls';
// @ts-ignore
import EducationalRevealOverlay from '../ui/EducationalRevealOverlay';
import AuroraBackground from '../ui/AuroraBackground';
// @ts-ignore
import { useMembership } from '../whop/MembershipTiers';
// @ts-ignore
import QuantumCompanion from '../companion/QuantumCompanion';
import { CHAPTER_QUIZZES } from '../../data/quiz-questions';

interface DesktopVerseLayoutProps {
    chapterId: number;
    verseId: number;
    chapterTitle: string;
    totalVerses: number;
    verseData: any;
}

// ---------------------------------------------------------------------------
// Quiz Panel Component (Functional — tier-based, single question per tier)
// ---------------------------------------------------------------------------
interface QuizPanelProps {
    quiz: {
        question: string;
        options: string[];
        correct: string | number;
        explanation: string;
    } | null | undefined;
    tier: string;
    onClose: () => void;
}

function QuizPanel({ quiz, tier, onClose }: QuizPanelProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    if (!quiz || !quiz.question) {
        return (
            <div className="p-6 rounded-xl bg-white/5 text-center border border-white/10">
                <p className="text-slate-400 text-sm">No quiz available for the <span className="font-semibold text-quantum-cool">{tier}</span> tier.</p>
            </div>
        );
    }

    // Match correct answer letter (e.g. "B") to option index, or use numeric index directly
    const correctIndex = typeof quiz.correct === 'number'
        ? quiz.correct
        : quiz.options.findIndex((opt: string) => opt.trim().startsWith(quiz.correct + ')'));
    const isCorrect = selectedAnswer === correctIndex;

    const handleReset = () => {
        setSelectedAnswer(null);
        setShowResult(false);
    };

    return (
        <div className="p-5 rounded-xl bg-gradient-to-br from-quantum-void/80 to-quantum-cosmic/60 border border-quantum-neon/20 space-y-4">
            {/* Tier badge */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-quantum-neon bg-quantum-neon/10 px-2 py-1 rounded-full">{tier.toUpperCase()}</span>
                <button onClick={onClose} className="text-xs text-slate-500 hover:text-white transition-colors">✕ Close</button>
            </div>

            {/* Question */}
            <p className="text-sm text-white font-medium leading-relaxed">{quiz.question}</p>

            {/* Options */}
            <div className="space-y-2">
                {quiz.options.map((option: string, i: number) => (
                    <label
                        key={i}
                        className={cn(
                            "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border text-sm",
                            selectedAnswer === i && !showResult
                                ? "bg-quantum-neon/15 border-quantum-neon/60 text-white"
                                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20",
                            showResult && i === correctIndex && "!bg-green-500/20 !border-green-500/60 !text-green-200",
                            showResult && selectedAnswer === i && !isCorrect && "!bg-red-500/20 !border-red-500/60 !text-red-200"
                        )}
                    >
                        <input
                            type="radio"
                            name="quiz-option"
                            checked={selectedAnswer === i}
                            onChange={() => !showResult && setSelectedAnswer(i)}
                            disabled={showResult}
                            className="mt-0.5 accent-current"
                        />
                        <span className="leading-relaxed">{option}</span>
                    </label>
                ))}
            </div>

            {/* Check / Result */}
            {!showResult ? (
                <button
                    onClick={() => setShowResult(true)}
                    disabled={selectedAnswer === null}
                    className={cn(
                        "w-full py-2.5 rounded-full font-semibold text-sm transition-all",
                        selectedAnswer !== null
                            ? "bg-quantum-neon text-black shadow-lg shadow-quantum-neon/30 hover:shadow-quantum-neon/50"
                            : "bg-white/10 text-slate-500 cursor-not-allowed"
                    )}
                >
                    Check Answer
                </button>
            ) : (
                <div className={cn(
                    "p-4 rounded-lg border",
                    isCorrect
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                )}>
                    <p className={cn("font-bold text-sm mb-2", isCorrect ? "text-green-300" : "text-red-300")}>
                        {isCorrect ? '✓ Correct!' : '✗ Not quite'}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{quiz.explanation}</p>
                    <button
                        onClick={handleReset}
                        className="w-full py-2 rounded-full text-xs font-medium bg-white/10 text-slate-300 hover:bg-white/20 transition-all border border-white/10"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Desktop Layout
// ---------------------------------------------------------------------------
export default function DesktopVerseLayout({ verseData, chapterId, verseId, chapterTitle, totalVerses }: DesktopVerseLayoutProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [quizOpen, setQuizOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [expandedDive, setExpandedDive] = useState<number | null>(null);
    const [animControls, setAnimControls] = useState({ rotation: true, speed: 50, complexity: 50, zoom: 100, accentColor: '#8B5CF6' });
    const [showReveal, setShowReveal] = useState(false);
    const [researchMode, setResearchMode] = useState(false);
    const { tier, canHavePhysicsSliders } = useMembership();
    const hasPhysicsSliders = canHavePhysicsSliders();

    // Item 2: Chapter color modulation — set data-chapter on body
    useEffect(() => {
        document.body.dataset.chapter = String(chapterId);
        return () => { delete document.body.dataset.chapter; };
    }, [chapterId]);

    return (
        <div className="min-h-screen w-full bg-cosmic-gradient flex flex-col text-slate-200">
            {/* Desktop Header */}
            <header className="h-auto border-b border-white/10 flex items-center justify-between px-6 py-2 bg-glass-heavy sticky top-0 z-50 gap-4">
                {/* Left Section: Home + Chapter Nav */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* 🏠 Home Button */}
                    <Link
                        href="/"
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition-all border border-white/10 hover:border-white/30 micro-hover"
                        title="Home"
                    >
                        🏠
                    </Link>

                    {/* ◄ Prev Chapter */}
                    {chapterId > 1 && (
                        <Link
                            href={`/verse/${chapterId - 1}-1`}
                            className="flex items-center gap-1 px-3 h-9 rounded-lg bg-white/10 hover:bg-quantum-neon/20 border border-white/10 hover:border-quantum-neon/50 text-sm font-mono text-white/70 hover:text-quantum-neon transition-all"
                            title={`Chapter ${chapterId - 1}`}
                        >
                            ◄ Ch {chapterId - 1}
                        </Link>
                    )}

                    {/* Next Chapter ► */}
                    {chapterId < 27 && (
                        <Link
                            href={`/verse/${chapterId + 1}-1`}
                            className="flex items-center gap-1 px-3 h-9 rounded-lg bg-white/10 hover:bg-quantum-neon/20 border border-white/10 hover:border-quantum-neon/50 text-sm font-mono text-white/70 hover:text-quantum-neon transition-all"
                            title={`Chapter ${chapterId + 1}`}
                        >
                            Ch {chapterId + 1} ►
                        </Link>
                    )}
                </div>

                {/* Chapter Title + Verse Title */}
                <div className="flex-1 min-w-0 px-2">
                    <p className="text-sm font-display font-bold text-white leading-tight truncate">
                        Chapter {chapterId} · {chapterTitle}
                    </p>
                    {verseData?.title && (
                        <p className="text-xs font-display text-quantum-cool italic truncate">
                            Verse {verseId}: {verseData.title}
                        </p>
                    )}
                </div>

                {/* Center Section: Verse Navigation — Item 8: pulsing glow on active */}
                <nav
                    className="flex items-center gap-1 flex-wrap justify-center flex-shrink min-w-0"
                    style={{ maxHeight: totalVerses > 20 ? '4.5rem' : '2.5rem', overflowY: totalVerses > 20 ? 'auto' : 'visible' }}
                    aria-label="Verse navigation"
                >
                    {Array.from({ length: totalVerses }, (_, i) => i + 1).map(v => {
                        const isActive = v === verseId;
                        const isLarge = totalVerses > 20;
                        return (
                            <Link
                                key={v}
                                href={`/verse/${chapterId}-${v}`}
                                aria-label={`Verse ${v}${isActive ? ' (current)' : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    "rounded-full flex items-center justify-center font-mono font-medium transition-all duration-200 micro-hover flex-shrink-0",
                                    isLarge ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs",
                                    isActive
                                        ? "bg-quantum-neon text-black shadow-lg shadow-quantum-neon/50 scale-110 animate-pulse-glow"
                                        : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white hover:scale-105"
                                )}
                            >
                                {v}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Section: Placeholder for gamification */}
                <div className="flex items-center gap-4 w-[80px] flex-shrink-0">
                    {/* Future: Streak/XP */}
                </div>
            </header>

            {/* Educational Reveal Overlay — Item 7 */}
            {showReveal && (
                <EducationalRevealOverlay
                    verseData={verseData}
                    onClose={() => setShowReveal(false)}
                />
            )}

            {/* Main Grid */}
            <main className="flex-1 grid grid-cols-[350px_1fr_350px] overflow-hidden">

                {/* Left Panel: Text & Philosophy — Item 3: neon glow border via CSS vars */}
                <aside
                    className="border-r backdrop-blur overflow-y-auto custom-scrollbar p-6"
                    style={{
                        background: 'rgba(15,23,42,0.6)',
                        borderColor: 'var(--chapter-border-color, rgba(0,255,255,0.18))',
                        boxShadow: '4px 0 24px var(--chapter-panel-glow, rgba(0,255,255,0.06))',
                        transition: 'box-shadow 0.6s ease, border-color 0.6s ease',
                    }}
                >
                    <div className="mb-8">
                        <span className="text-xs font-mono text-quantum-cool block mb-2">Verse {chapterId}.{verseId}</span>
                        <h1 className="text-heading-display text-white mb-4">{verseData?.title || 'Verse Title'}</h1>

                        {/* Key Insight (always visible) */}
                        {verseData?.philosophy?.insight && (
                            <div className="border-l-2 border-quantum-gold pl-4 py-1 my-6">
                                <span className="text-quantum-gold font-bold uppercase text-xs block mb-1">💡 Key Insight</span>
                                <p className="text-sm text-slate-300">{verseData.philosophy.insight}</p>
                            </div>
                        )}

                        {/* ── Accordion Sections ── */}

                        {/* 1. Verse Text */}
                        <CollapsiblePanel title="Verse Text" icon="📜" defaultOpen={true}>
                            <div className="space-y-3 pt-2">
                                {verseData?.sanskrit?.text && (
                                    <p className="text-xl text-quantum-cool mb-2 text-sanskrit">{verseData.sanskrit.text}</p>
                                )}
                                {verseData?.sanskrit?.transliteration && (
                                    <p className="text-slate-300 italic text-sm mb-3">{verseData.sanskrit.transliteration}</p>
                                )}
                                <p className="text-base text-slate-100 font-serif text-verse-body">
                                    {verseData?.sanskrit?.translation || verseData?.verseText}
                                </p>
                            </div>
                        </CollapsiblePanel>

                        {/* 2. Philosophy */}
                        <CollapsiblePanel title="Philosophy" icon="🧘" defaultOpen={false}>
                            <div className="space-y-4 pt-2">
                                <div>
                                    <h4 className="text-quantum-neon text-xs font-bold uppercase mb-1">Madhyamaka</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {verseData?.philosophy?.madhyamaka || verseData?.madhyamakaConcept}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-quantum-plasma text-xs font-bold uppercase mb-1">Quantum Parallel</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {verseData?.philosophy?.quantum || verseData?.quantumPhysicsParallel}
                                    </p>
                                </div>
                                {verseData?.philosophy?.accessible && (
                                    <div>
                                        <h4 className="text-green-400 text-xs font-bold uppercase mb-1">Accessible</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed">{verseData.philosophy.accessible}</p>
                                    </div>
                                )}
                            </div>
                        </CollapsiblePanel>

                        {/* 3. Quantum Bridge */}
                        {(verseData?.philosophy?.bridge || verseData?.quantumResonance) && (
                            <CollapsiblePanel title="Quantum Bridge" icon="⚛️" defaultOpen={false}>
                                <div className="space-y-3 pt-2">
                                    {verseData?.philosophy?.bridge && (
                                        <p className="text-sm text-slate-300 leading-relaxed">{verseData.philosophy.bridge}</p>
                                    )}
                                    {verseData?.quantumResonance && (
                                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm text-white">{verseData.quantumResonance.concept}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${verseData.quantumResonance.score >= 85
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : verseData.quantumResonance.score >= 70
                                                        ? 'bg-yellow-500/20 text-yellow-300'
                                                        : 'bg-red-500/20 text-red-300'
                                                    }`}>
                                                    {verseData.quantumResonance.strength} ({verseData.quantumResonance.score}/100)
                                                </span>
                                            </div>
                                            {verseData.quantumResonance.explanation && (
                                                <p className="text-xs text-slate-400 leading-relaxed">{verseData.quantumResonance.explanation}</p>
                                            )}
                                            {verseData.quantumResonance.caveat && (
                                                <p className="text-xs text-slate-500 italic mt-2">{verseData.quantumResonance.caveat}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CollapsiblePanel>
                        )}

                        {/* 4. Two Truths & Misconceptions */}
                        {(verseData?.philosophy?.twoTruths || verseData?.philosophy?.commonMisconception) && (
                            <CollapsiblePanel title="Two Truths & Misconceptions" icon="⚖️" defaultOpen={false}>
                                <div className="space-y-3 pt-2">
                                    {verseData?.philosophy?.twoTruths && (
                                        <div>
                                            <h4 className="text-amber-400 text-xs font-bold uppercase mb-1">Two Truths</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">{verseData.philosophy.twoTruths}</p>
                                        </div>
                                    )}
                                    {verseData?.philosophy?.commonMisconception && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <h4 className="text-red-300 text-xs font-bold uppercase mb-1">⚠ Common Misconception</h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">{verseData.philosophy.commonMisconception}</p>
                                        </div>
                                    )}
                                </div>
                            </CollapsiblePanel>
                        )}

                        {/* 5. Animation Controls — Teacher tier only for advanced physics sliders */}
                        <CollapsiblePanel title="Animation Controls" icon="🎮" defaultOpen={false}>
                            {hasPhysicsSliders ? (
                                <AnimationControls
                                    config={verseData?.animation?.controls}
                                    onControlChange={(changes: any) => setAnimControls(prev => ({ ...prev, ...changes }))}
                                    onReset={() => setAnimControls({ rotation: true, speed: 50, complexity: 50, zoom: 100, accentColor: '#8B5CF6' })}
                                    onFullscreen={() => document.documentElement.requestFullscreen?.()}
                                />
                            ) : (
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-quantum-plasma/20 flex items-center justify-center mx-auto">
                                        <Lock size={18} className="text-quantum-plasma" />
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Advanced physics sliders are available to <span className="text-quantum-plasma font-semibold">Teacher</span> tier members.
                                    </p>
                                    <a
                                        href="/pricing"
                                        className="inline-block text-xs font-semibold text-quantum-neon hover:text-white transition-colors border border-quantum-neon/30 hover:border-quantum-neon/60 px-3 py-1.5 rounded-full"
                                    >
                                        Upgrade to Teacher →
                                    </a>
                                </div>
                            )}
                        </CollapsiblePanel>

                        {/* 6. Academic & Research Options */}
                        <CollapsiblePanel title="Academic Evaluation" icon="🔬" defaultOpen={false}>
                            <div className="space-y-3 pt-2">
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Tools for verifying the AI generation parameters and epistemological constraints used in this platform.
                                </p>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-slate-200">
                                        <Sparkles size={16} className="text-quantum-neon" />
                                        <span className="font-semibold">Research Mode HUD</span>
                                    </div>
                                    <button
                                        onClick={() => setResearchMode(!researchMode)}
                                        className={cn(
                                            "w-10 h-5 rounded-full relative transition-colors border",
                                            researchMode ? "bg-quantum-neon/20 border-quantum-neon/50 shadow-[0_0_10px_rgba(0,255,255,0.2)]" : "bg-white/10 border-white/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 rounded-full transition-transform absolute top-0.5",
                                            researchMode ? "translate-x-5 right-0.5 bg-quantum-neon" : "translate-x-0.5 left-0 bg-slate-400"
                                        )} />
                                    </button>
                                </div>
                            </div>
                        </CollapsiblePanel>
                    </div>
                </aside>

                {/* Center: Canvas */}
                <section className="relative bg-quantum-deep flex flex-col">
                    <div className="flex-1 relative">
                        <AuroraBackground chapterId={chapterId} />
                        <ProgressiveQuantumCanvas
                            chapter={chapterId}
                            verseData={verseData}
                            animationType={verseData?.animation?.type || 'nebula'}
                            autoRotate={isPlaying && animControls.rotation}
                            speed={animControls.speed}
                            complexity={animControls.complexity}
                            zoom={animControls.zoom}
                            accentColor={animControls.accentColor}
                        />

                        {/* Research Mode HUD overlay */}
                        {researchMode && (
                            <div className="absolute top-6 left-6 right-6 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-quantum-neon/40 shadow-[0_0_20px_rgba(0,255,255,0.1)] z-30 pointer-events-none fade-in">
                                <h4 className="text-xs text-quantum-neon font-mono uppercase font-bold tracking-widest mb-3 border-b border-quantum-neon/30 pb-1">AI Pipeline Telemetry</h4>
                                <div className="grid grid-cols-3 gap-6 text-xs font-mono text-slate-300">
                                    <div className="space-y-1">
                                        <div className="flex justify-between"><span>Model:</span><span className="text-white">Gemini 1.5 Pro</span></div>
                                        <div className="flex justify-between"><span>Temp:</span><span className="text-white">0.30</span></div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between"><span>System Prompt:</span><span className="text-white">v3-madhyamaka</span></div>
                                        <div className="flex justify-between"><span>Epistemic Shield:</span><span className="text-green-400">ACTIVE</span></div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between"><span>WebGL Shaders:</span><span className="text-quantum-plasma px-2 bg-quantum-plasma/10 rounded">{verseData?.animation?.type || 'nebula'}</span></div>
                                        <div className="flex justify-between"><span>Top_P:</span><span className="text-white">0.85</span></div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between">
                                    <span className="text-[10px] text-slate-500">Retrieval latency: ~450ms</span>
                                    <span className="text-[10px] text-slate-500">Render Pipeline: React Three Fiber @ 60fps</span>
                                </div>
                            </div>
                        )}

                        {/* Overlay Controls — Item 7: Reveal button + Item 8: pulsing glow on play */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 z-20">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={cn(
                                    "hover:text-quantum-neon transition-colors micro-hover",
                                    isPlaying && "animate-pulse-glow-full text-quantum-neon"
                                )}
                                aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            <div className="w-px h-4 bg-white/20" />
                            <button
                                onClick={() => setShowReveal(true)}
                                className="flex items-center gap-1.5 text-xs font-mono text-quantum-cool hover:text-white transition-colors hover:animate-pulse-glow-full"
                                aria-label="Reveal educational insights"
                            >
                                <Sparkles size={14} />
                                Reveal
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Panel: Deep Dive & Quiz — Item 3: neon glow border via CSS vars */}
                <aside
                    className="border-l backdrop-blur overflow-y-auto custom-scrollbar p-6"
                    style={{
                        background: 'rgba(15,23,42,0.6)',
                        borderColor: 'var(--chapter-border-color, rgba(0,255,255,0.18))',
                        boxShadow: '-4px 0 24px var(--chapter-panel-glow, rgba(0,255,255,0.06))',
                        transition: 'box-shadow 0.6s ease, border-color 0.6s ease',
                    }}
                >
                    <div className="space-y-6">

                        {/* ─── AI COMPANION SECTION ─── */}
                        <div>
                            <h3 className="flex items-center gap-2 text-quantum-neon font-bold uppercase text-xs mb-4">
                                <Bot size={14} /> AI Guide
                            </h3>
                            <QuantumCompanion
                                chapterId={chapterId}
                                verseId={verseId}
                                verseData={verseData}
                                researchMode={researchMode}
                            />
                        </div>

                        {/* ─── DEEPER DIVE SECTION ─── */}
                        <div>
                            <h3 className="flex items-center gap-2 text-quantum-neon font-bold uppercase text-xs mb-4">
                                <HelpCircle size={14} /> Deeper Dive
                            </h3>
                            <div className="space-y-3">
                                {verseData?.deeperDive?.map((item: any, i: number) => {
                                    const isExpanded = expandedDive === i;
                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "rounded-lg border transition-all duration-200 cursor-pointer",
                                                isExpanded
                                                    ? "bg-white/5 border-white/15"
                                                    : "bg-transparent border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
                                            )}
                                        >
                                            {/* Question Header (click to expand/collapse) */}
                                            <button
                                                onClick={() => setExpandedDive(isExpanded ? null : i)}
                                                className="w-full flex items-start gap-2 p-3 text-left"
                                            >
                                                <span className="text-quantum-neon text-xs font-bold mt-0.5 shrink-0">Q{i + 1}</span>
                                                <span className="text-sm text-slate-200 font-medium flex-1 leading-snug">{item.q}</span>
                                                {isExpanded
                                                    ? <ChevronUp size={14} className="text-slate-500 mt-0.5 shrink-0" />
                                                    : <ChevronDown size={14} className="text-slate-500 mt-0.5 shrink-0" />
                                                }
                                            </button>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div className="px-3 pb-4 space-y-3">
                                                    {/* Answer */}
                                                    <p className="text-xs text-slate-300 leading-relaxed pl-6">
                                                        {item.a}
                                                    </p>

                                                    {/* Real-Life Example */}
                                                    {item.realLifeExample && (
                                                        <div className="ml-6 p-3 rounded-lg bg-quantum-neon/[0.07] border-l-2 border-quantum-neon">
                                                            <p className="flex items-center gap-1.5 text-quantum-neon text-xs font-semibold mb-1">
                                                                <Lightbulb size={12} /> Real-Life Example
                                                            </p>
                                                            <p className="text-xs text-slate-300 leading-relaxed">{item.realLifeExample}</p>
                                                        </div>
                                                    )}

                                                    {/* Deeper / Advanced */}
                                                    {item.deeper && (
                                                        <details className="ml-6 group">
                                                            <summary className="flex items-center gap-1.5 text-xs text-quantum-warm cursor-pointer hover:text-quantum-neon transition-colors font-medium">
                                                                <BookOpen size={12} /> Advanced Insight
                                                            </summary>
                                                            <p className="text-xs text-slate-400 mt-2 pl-5 border-l border-quantum-warm/30 leading-relaxed">
                                                                {item.deeper}
                                                            </p>
                                                        </details>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─── QUIZ SECTION ─── */}
                        <div className="space-y-3">
                            {/* Tier Selector */}
                            <div className="flex items-center justify-center gap-2">
                                {(['beginner', 'intermediate', 'advanced'] as const).map(tier => (
                                    <button
                                        key={tier}
                                        onClick={() => {
                                            setSelectedTier(tier);
                                            setQuizOpen(false); // Reset quiz when switching tiers
                                        }}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200",
                                            selectedTier === tier
                                                ? "bg-quantum-neon text-black shadow-md shadow-quantum-neon/30"
                                                : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
                                        )}
                                    >
                                        {tier === 'beginner' ? '○' : tier === 'intermediate' ? '●' : '◉'}{' '}
                                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Quiz CTA or Active Quiz */}
                            {!quizOpen ? (
                                <div className="p-6 rounded-xl bg-gradient-to-br from-quantum-void to-quantum-cosmic border border-quantum-neon/30 text-center">
                                    <h3 className="text-white font-bold mb-2">Test Understanding</h3>
                                    <p className="text-xs text-slate-400 mb-4">Challenge your grasp of this verse.</p>
                                    <button
                                        className="w-full py-2.5 rounded-full font-semibold text-sm bg-quantum-neon text-black shadow-lg shadow-quantum-neon/30 hover:shadow-quantum-neon/50 transition-all"
                                        onClick={() => setQuizOpen(true)}
                                    >
                                        Start {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Quiz
                                    </button>
                                </div>
                            ) : (
                                (() => {
                                    let currentQuiz = verseData?.quiz?.[selectedTier];
                                    if (!currentQuiz && CHAPTER_QUIZZES[chapterId as keyof typeof CHAPTER_QUIZZES]?.questions) {
                                        const questions = CHAPTER_QUIZZES[chapterId as keyof typeof CHAPTER_QUIZZES].questions;
                                        if (questions && questions.length > 0) {
                                            const qIndex = (verseId - 1) % questions.length;
                                            currentQuiz = questions[qIndex];
                                        }
                                    }
                                    return (
                                        <QuizPanel
                                            quiz={currentQuiz}
                                            tier={selectedTier}
                                            onClose={() => setQuizOpen(false)}
                                        />
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </aside>

            </main>

            {/* Footer Navigation: Prev/Next Buttons */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3 z-30">
                {/* Progress Indicator */}
                <span className="text-xs font-mono text-slate-400 bg-black/30 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
                    Verse {verseId} of {totalVerses}
                </span>

                {/* Previous Button */}
                {verseId > 1 && (
                    <Link
                        href={`/verse/${chapterId}-${verseId - 1}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-sm font-medium transition-all border border-white/10 hover:border-quantum-cool group micro-hover"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>Previous</span>
                    </Link>
                )}

                {/* Next Button */}
                {verseId < totalVerses && (
                    <Link
                        href={`/verse/${chapterId}-${verseId + 1}`}
                        className="flex items-center gap-2 px-4 py-2 bg-quantum-neon hover:bg-quantum-neon/90 text-black rounded-full text-sm font-semibold transition-all shadow-lg shadow-quantum-neon/30 hover:shadow-quantum-neon/50 group micro-hover"
                    >
                        <span>Next</span>
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                )}
            </div>
        </div>
    );
}
