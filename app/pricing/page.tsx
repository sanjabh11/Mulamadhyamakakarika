'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Check, ArrowLeft, Flame, Star, Zap, Crown } from 'lucide-react';

const TIERS = [
    {
        id: 'free',
        name: 'Explorer',
        price: 0,
        icon: '🌱',
        gradient: 'from-slate-500/20 to-slate-600/10',
        borderColor: 'border-slate-500/30',
        accentColor: 'text-slate-300',
        popular: false,
        description: 'Begin your journey with foundational teachings',
        features: [
            'Access to Chapters 1-3',
            'Basic 3D visualizations',
            'Chapter quizzes (Chapters 1–3)',
            'Progress tracking',
            'Community forum access',
        ],
        planEnvKey: null,
    },
    {
        id: 'seeker',
        name: 'Seeker',
        price: 19,
        icon: '🔮',
        popular: true,
        gradient: 'from-purple-500/25 to-indigo-600/15',
        borderColor: 'border-purple-500/60',
        accentColor: 'text-purple-300',
        description: 'Deepen your understanding with expanded access',
        features: [
            'Access to Chapters 1–15',
            'All 3D visualizations',
            'AI animations (10/day)',
            'All chapter quizzes',
            'Digital certificates',
            'PDF chapter downloads',
            'Priority community support',
        ],
        planEnvKey: 'NEXT_PUBLIC_WHOP_PLAN_SEEKER',
    },
    {
        id: 'practitioner',
        name: 'Practitioner',
        price: 45,
        icon: '⚛️',
        popular: false,
        gradient: 'from-cyan-500/20 to-teal-600/10',
        borderColor: 'border-cyan-500/40',
        accentColor: 'text-cyan-300',
        description: 'Complete access to the full quantum journey',
        features: [
            'All 27 chapters',
            'Advanced 3D visualizations',
            'Unlimited AI animations',
            'All quizzes with bonus content',
            'Premium certificates',
            'All downloadable resources',
            'Private Discord community',
            'Monthly live meditation sessions',
            'Direct Q&A access',
        ],
        planEnvKey: 'NEXT_PUBLIC_WHOP_PLAN_PRACTITIONER',
    },
    {
        id: 'teacher',
        name: 'Teacher',
        price: 149,
        icon: '🏛️',
        popular: false,
        gradient: 'from-amber-500/20 to-orange-600/10',
        borderColor: 'border-amber-500/40',
        accentColor: 'text-amber-300',
        description: 'White-label access with advanced physics controls',
        features: [
            'Everything in Practitioner',
            'Advanced physics sliders',
            'White-label branding',
            'API access',
            'Affiliate dashboard',
            'Priority support',
        ],
        planEnvKey: 'NEXT_PUBLIC_WHOP_PLAN_TEACHER',
    },
];

// Static env lookup — Next.js can only inline NEXT_PUBLIC_ vars accessed statically,
// not via dynamic indexing like process.env[key]. Map each plan key explicitly.
const WHOP_PLAN_IDS: Record<string, string> = {
    NEXT_PUBLIC_WHOP_PLAN_SEEKER: process.env.NEXT_PUBLIC_WHOP_PLAN_SEEKER || '',
    NEXT_PUBLIC_WHOP_PLAN_PRACTITIONER: process.env.NEXT_PUBLIC_WHOP_PLAN_PRACTITIONER || '',
    NEXT_PUBLIC_WHOP_PLAN_TEACHER: process.env.NEXT_PUBLIC_WHOP_PLAN_TEACHER || '',
};

function generateIntentId(): string {
    return `intent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function TierCard({ tier }: { tier: typeof TIERS[0] }) {
    const [subscribing, setSubscribing] = React.useState(false);

    // Bug #4 fix: free tier navigates to chapter 1 instead of being disabled
    const handleFreeStart = () => {
        window.location.href = '/verse/1-1';
    };

    // Bug #2 fix: async-POST to /api/checkout/intent BEFORE redirecting to Whop
    // This captures intent, emits analytics, and persists to .state/checkout-intents.json
    const handleSubscribe = async () => {
        if (!tier.planEnvKey) return;
        const planId = WHOP_PLAN_IDS[tier.planEnvKey] || '';

        // Validate we have a real Whop plan ID before proceeding
        if (!planId || planId.startsWith('plan_') && planId.length < 20) {
            alert(`⚠️ Development mode: Please set ${tier.planEnvKey} in .env.local\nto your real Whop Plan ID from your seller dashboard.\n\nGet it from: whop.com → Dashboard → Settings → Plans`);
            return;
        }

        setSubscribing(true);
        const checkoutIntentId = generateIntentId();

        try {
            // Step 1: Capture intent server-side (analytics + persistent-map write)
            await fetch('/api/checkout/intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    checkoutIntentId,
                    selectedTier: tier.id,
                    sessionId: sessionStorage.getItem('mmk_session_id') || null,
                    anonymousId: localStorage.getItem('mmk_anonymous_id') || null,
                    utmSource: new URLSearchParams(window.location.search).get('utm_source') || document.referrer || null,
                    utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || null,
                    utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || null,
                })
            });
        } catch (err) {
            // Non-blocking: intent capture failure must not block checkout
            console.warn('[pricing] Intent capture failed (non-blocking):', err);
        }

        // Step 2: Redirect to Whop checkout with intent ID as URL param for attribution
        window.location.href = `https://whop.com/checkout/${planId}/?checkout_intent=${checkoutIntentId}`;
    };

    return (
        <div
            className={`relative rounded-2xl border ${tier.borderColor} bg-gradient-to-br ${tier.gradient} p-6 flex flex-col gap-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(139,92,246,0.25)] ${tier.popular ? 'ring-2 ring-purple-500/50' : ''}`}
        >
            {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 whitespace-nowrap shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="flex items-start justify-between">
                <div>
                    <span className="text-3xl mb-2 block">{tier.icon}</span>
                    <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{tier.description}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    {tier.price === 0 ? (
                        <span className="text-3xl font-black text-white">Free</span>
                    ) : (
                        <>
                            <span className="text-slate-400 text-sm align-top">$</span>
                            <span className="text-3xl font-black text-white">{tier.price}</span>
                            <span className="text-slate-400 text-xs">/mo</span>
                        </>
                    )}
                </div>
            </div>

            <ul className="space-y-2 flex-1">
                {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check size={14} className={`mt-0.5 flex-shrink-0 ${tier.accentColor}`} />
                        <span>{f}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={tier.price === 0 ? handleFreeStart : handleSubscribe}
                disabled={subscribing}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-2
                    ${tier.price === 0
                        ? 'bg-gradient-to-r from-emerald-500/80 to-teal-600/80 hover:from-emerald-400 hover:to-teal-500 text-white active:scale-95 cursor-pointer'
                        : `bg-gradient-to-r ${tier.popular ? 'from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400' : 'from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400'} text-white hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)] active:scale-95`
                    } disabled:opacity-50 disabled:cursor-wait`}
            >
                {subscribing ? 'Preparing checkout…' : tier.price === 0 ? 'Get Started Free →' : `Subscribe — $${tier.price}/mo`}
            </button>
        </div>
    );
}

export default function PricingPage() {
    return (
        <div className="min-h-screen text-slate-200 relative overflow-hidden">
            {/* Gradient background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-quantum-deep to-cyan-900/10" />
                <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-cyan-500/8 blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-xl bg-black/30">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back</span>
                </Link>

                <div className="text-center">
                    <h1 className="text-sm font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 text-transparent bg-clip-text tracking-wide">
                        Pricing & Memberships
                    </h1>
                    <p className="text-[10px] text-slate-500">Nagarjuna's Path</p>
                </div>

                <Link href="/verse/1-1" className="text-xs px-3 py-1.5 rounded-full border border-quantum-neon/30 text-quantum-neon hover:bg-quantum-neon/10 transition-colors">
                    Begin Free
                </Link>
            </header>

            {/* Hero */}
            <main className="relative z-10 container mx-auto px-4 pb-24 pt-16">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs text-purple-300 font-semibold mb-6">
                        <Sparkles size={12} />
                        Choose Your Quantum Path
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-cyan-300 to-purple-400 text-transparent bg-clip-text mb-4">
                        Deepen Your Practice
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        Unlock AI-guided contemplation, animated verses, and deep philosophical insights across all 27 chapters of Nagarjuna&apos;s Mūlamadhyamakakārikā.
                    </p>
                </div>

                {/* Tier Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {TIERS.map((tier) => (
                        <TierCard key={tier.id} tier={tier} />
                    ))}
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-sm text-slate-400">
                    <div className="flex items-center gap-2"><Zap size={14} className="text-yellow-400" /><span>Cancel anytime</span></div>
                    <div className="flex items-center gap-2"><Star size={14} className="text-purple-400" /><span>12,000+ practitioners</span></div>
                    <div className="flex items-center gap-2"><Crown size={14} className="text-cyan-400" /><span>Powered by Whop</span></div>
                    <div className="flex items-center gap-2"><Flame size={14} className="text-orange-400" /><span>2.1M verses explored</span></div>
                </div>

                {/* FAQ */}
                <div className="mt-24 max-w-3xl mx-auto border-t border-white/10 pt-16">
                    <h3 className="text-2xl font-bold text-center text-white mb-10">Frequently Asked Questions</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { q: 'Can I cancel anytime?', a: 'Yes, cancel through your Whop dashboard. You retain access until the end of your billing cycle.' },
                            { q: 'What happens to my progress?', a: 'Progress, quiz scores, and streak data are tied to your account and remain even if a membership lapses.' },
                            { q: 'How do AI animations work?', a: 'Premium tiers grant access to our AI generation engine for creating custom visualizations of philosophical concepts.' },
                            { q: 'Is there a community?', a: 'Practitioner and Teacher tiers include private Discord access with direct Q&A and monthly live sessions.' },
                        ].map(({ q, a }) => (
                            <div key={q}>
                                <h4 className="text-quantum-neon font-semibold mb-2 text-sm">{q}</h4>
                                <p className="text-sm text-slate-400">{a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
