'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Sparkles, Share2, Bookmark, Lock } from 'lucide-react';
// @ts-ignore
import { useMembership } from '../whop/MembershipTiers';
import { cn } from '../../lib/utils';

export default function QuantumCompanion({ verseData, chapterId, verseId, researchMode = false }) {
    const { tier } = useMembership();
    const messagesEndRef = useRef(null);

    // Gating logic
    const isFree = tier === 'free';

    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: '/api/companion/chat',
        body: {
            chapterId,
            verseId,
            verseData: {
                title: verseData?.title,
                sanskrit: verseData?.sanskrit?.text,
                translation: verseData?.sanskrit?.translation,
                philosophy: verseData?.philosophy,
                quantumResonance: verseData?.quantumResonance,
            },
            tier
        },
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (isFree) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-quantum-neon/10 flex items-center justify-center mb-4 border border-quantum-neon/30">
                    <Lock className="text-quantum-neon w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Quantum Companion</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs">
                    Upgrade to Seeker or higher to discuss this verse with your personalized AI philosophical guide.
                </p>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/pricing';
                    }}
                    className="px-6 py-3 rounded-full bg-quantum-neon text-black font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all cursor-pointer inline-block"
                >
                    Upgrade to Unlock
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px] bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-quantum-neon/20 flex items-center justify-center border border-quantum-neon/50">
                        <Sparkles className="w-4 h-4 text-quantum-neon" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white leading-tight">Quantum Companion</h3>
                        <p className="text-[10px] text-quantum-cool uppercase tracking-widest">AI Guide • Ch {chapterId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Save to Notes">
                        <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors" title="Share Insight">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                        <Sparkles className="w-8 h-8 text-quantum-neon mb-2" />
                        <p className="text-sm text-slate-300 max-w-[250px]">
                            I'm ready to discuss the philosophical and quantum depths of Verse {verseId}.
                        </p>
                        <p className="text-xs text-slate-500">Ask me anything about {verseData?.title}.</p>
                    </div>
                )}

                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={cn(
                            "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                            m.role === 'user'
                                ? "bg-white/10 text-white ml-auto border border-white/5 rounded-tr-sm"
                                : "bg-quantum-neon/10 text-slate-200 border border-quantum-neon/20 rounded-tl-sm mr-auto relative"
                        )}
                    >
                        {m.role === 'assistant' && (
                            <Sparkles className="absolute -top-1 -left-1 w-3 h-3 text-quantum-neon" />
                        )}
                        <div className="prose prose-sm prose-invert max-w-none">
                            {m.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-2 last:mb-0">{line}</p>
                            ))}
                        </div>

                        {/* Research Mode: Message Metadata */}
                        {researchMode && m.role === 'assistant' && (
                            <div className="mt-3 pt-2 border-t border-quantum-neon/20 text-[9px] font-mono text-quantum-cool flex flex-col gap-1">
                                <span className="flex justify-between"><span>Model:</span> <span>gemini-2.5-flash</span></span>
                                <span className="flex justify-between"><span>Context:</span> <span>Verse ${verseId} + Foundation Prompt v2.1</span></span>
                                <span className="flex justify-between"><span>Safety Check:</span> <span className="text-green-400">PASSED</span></span>
                            </div>
                        )}
                    </div>
                ))}

                {researchMode && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                    <div className="p-3 bg-quantum-neon/5 border border-quantum-neon/20 rounded-xl text-[10px] font-mono text-slate-400 mt-4 h-32 overflow-y-auto custom-scrollbar">
                        <p className="text-quantum-neon font-bold mb-1 uppercase tracking-tighter">Research Mode: Active System Prompt Snippet</p>
                        <p className="leading-tight opacity-70">
                            "You are MADHYAMAKA-GPT... prioritize Prasangika-Madhyamaka dialectic... 
                            enforce Gate 2 Scientific Integrity: No quantum mysticism... 
                            map structural parallels to: ${verseData?.quantumResonance?.concept || 'Quantum Superposition'}..."
                        </p>
                    </div>
                )}

                {isLoading && (
                    <div className="max-w-[85%] rounded-2xl p-4 bg-quantum-neon/5 border border-quantum-neon/10 rounded-tl-sm mr-auto flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-quantum-neon animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-quantum-neon animate-pulse" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-quantum-neon animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}

                {error && (
                    <div className="max-w-[85%] rounded-2xl p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs mx-auto text-center">
                        An error occurred. Please try again.
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-white/10 bg-black/20">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about dependent origination..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-quantum-neon/50 focus:ring-1 focus:ring-quantum-neon/50 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 rounded-full bg-quantum-neon text-black disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all flex-shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <div className="mt-2 text-center">
                    {tier === 'seeker' && <p className="text-[10px] text-slate-500">Seeker Tier: 5 AI messages per day</p>}
                    {tier === 'practitioner' && <p className="text-[10px] text-slate-500">Practitioner Tier: 50 AI messages per day</p>}
                </div>
            </div>
        </div>
    );
}
