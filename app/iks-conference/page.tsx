'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SHOWCASE_VERSES = [
  {
    id: '1-1',
    chapter: 1,
    verse: 1,
    title: 'Four-Fold Negation of Arising',
    sanskrit: 'na svato nāpi parato na dvābhyāṃ nāpy ahetutaḥ',
    devanagari: 'न स्वतो नापि परतो न द्वाभ्यां नाप्यहेतुतः',
    translation: 'Not from itself, not from another, not from both, not without cause — nowhere do any phenomena arise inherently.',
    quantum: 'Superposition (RESONANCE: 88/100)',
    theme: 'Catuṣkoṭi / Four-Cornered Logic',
    color: '#8B5CF6',
  },
  {
    id: '1-8',
    chapter: 1,
    verse: 8,
    title: 'Emptiness of the Object Condition',
    sanskrit: 'bhāvānāṃ niḥsvabhāvānāṃ na sattā vidyate yataḥ',
    devanagari: 'भावानाम्',
    translation: 'An existent entity has no percept-object at all. If the entity has no object, where could the object-condition exist?',
    quantum: 'Quantum Measurement Problem (RESONANCE: 90/100)',
    theme: 'Observer-Object Co-constitution',
    color: '#06B6D4',
  },
  {
    id: '1-10',
    chapter: 1,
    verse: 10,
    title: 'Emptiness Enables Dependent Origination',
    sanskrit: 'bhāvānāṃ niḥsvabhāvānāṃ na sattā vidyate',
    devanagari: 'भावानां निःस्वभावानाम्',
    translation: "Since the existence of things without essence is not established, 'When this exists, that arises' is not tenable.",
    quantum: "Non-Locality / Bell's Theorem (RESONANCE: 91/100)",
    theme: 'Śūnyatā Enables Pratītyasamutpāda',
    color: '#10B981',
  },
  {
    id: '1-13',
    chapter: 1,
    verse: 13,
    title: 'Mutual Emptiness — Conditions & Effects',
    sanskrit: 'phalaṃ ca pratyayamayaṃ pratyayāś cāsvayaṃmayāḥ',
    devanagari: 'फलं च प्रत्ययमयं',
    translation: 'The effect has the nature of the conditions, but conditions do not have their own nature. How could an essenceless source produce an essence?',
    quantum: 'Entanglement / Non-Separability (RESONANCE: 93/100)',
    theme: 'Irreducible Relationality',
    color: '#F59E0B',
  },
  {
    id: '24-18',
    chapter: 24,
    verse: 18,
    title: 'The Grand Equation',
    sanskrit: 'yaḥ pratītyasamutpādaḥ śūnyatāṃ tāṃ pracakṣmahe',
    devanagari: 'यः प्रतीत्यसमुत्पादः शून्यतां तां प्रचक्ष्महे',
    translation: 'Whatever is dependently arisen — we call that emptiness. That, being a dependent designation, is itself the middle way.',
    quantum: 'Quantum Contextuality (RESONANCE: 95/100)',
    theme: 'The Identity of Śūnyatā & Dependent Origination',
    color: '#EC4899',
  },
];

const PAPER_SECTIONS = [
  { label: 'Abstract', summary: 'LLM-driven Madhyamaka-GPT + ATOM 3D framework for teaching MMK to digital natives.' },
  { label: 'Introduction', summary: 'Challenges of teaching emptiness; role of AI and 3D pedagogy; research questions.' },
  { label: 'System Architecture', summary: 'Next.js 15, ThreePanelVerseViewer, React Three Fiber, Gemini AI, Whop SDK.' },
  { label: 'Madhyamaka-GPT Design', summary: '10-phase instruction framework; source hierarchy; Gate 2 scientific guardrails; RESONANCE algorithm.' },
  { label: 'Design-Based Research', summary: 'Three iterative cycles; telemetry-driven refinement; quantitative and qualitative findings.' },
  { label: 'Showcase Verse Analysis', summary: 'Verses 1.1, 1.10, 1.13, and 24.18 as illustrative case studies.' },
];

const RESONANCE_DATA = [
  { concept: 'Superposition', verse: '1.1', score: 88, caveat: 'Logical possibility vs. physical simultaneity — structural analogy only.' },
  { concept: "Bell's Theorem / Non-Locality", verse: '1.10', score: 91, caveat: 'Correlation without hidden variables ≠ metaphysical identity.' },
  { concept: 'Entanglement', verse: '1.13', score: 93, caveat: 'Non-separability of state ≠ Buddhist non-dualism.' },
  { concept: 'Measurement Problem', verse: '1.8', score: 90, caveat: 'Observer-object co-constitution is structural parallel only.' },
  { concept: 'Contextuality', verse: '24.18', score: 95, caveat: 'Context-dependence of value ≠ conventionalism.' },
  { concept: 'Decoherence', verse: '1.9', score: 87, caveat: 'Transformation without annihilation — not a proof of Buddhist cessation.' },
];

export default function IKSConferencePage() {
  const [researchMode, setResearchMode] = useState(false);
  const [activeVerse, setActiveVerse] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#050520] text-slate-200 font-sans">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            IKS-AI National Conference 2026 — Academic Evaluation Access
          </div>

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-amber-400 text-transparent bg-clip-text mb-4 leading-tight">
            Quantum Śūnyatā
          </h1>
          <p className="text-xl text-slate-300 font-light mb-2">
            Teaching Nagarjuna's <em>Mūlamadhyamakakārikā</em> with Generative AI and 3D WebGL
          </p>
          <p className="text-sm text-slate-500">
            Conference Sub-Themes: (1) AI Reviving IKS · (2) Ethical AI from Wisdom · (3) Rescuing Ancient Texts
          </p>

          {/* Research Mode Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <label className="flex items-center gap-3 cursor-pointer bg-white/5 border border-white/10 rounded-xl px-5 py-3 hover:border-purple-500/40 transition-all">
              <div
                onClick={() => setResearchMode(!researchMode)}
                className={`relative w-12 h-6 rounded-full transition-all ${researchMode ? 'bg-purple-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${researchMode ? 'left-7' : 'left-1'}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">🔬 Research Mode</p>
                <p className="text-xs text-slate-400">Reveal AI prompts, RESONANCE scores & ATOM specs</p>
              </div>
            </label>
          </div>
        </header>

        {/* ── Research Mode Panel ── */}
        {researchMode && (
          <div className="mb-12 bg-slate-900/80 border border-purple-500/40 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
              🔬 Research Mode — Under-the-Hood Transparency
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* AI Instruction Architecture */}
              <div>
                <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
                  Madhyamaka-GPT Instruction Architecture
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="bg-black/40 rounded-lg p-3 border border-slate-700">
                    <p className="text-green-400">// Phase 0: Mandatory Pre-Generation</p>
                    <p className="text-slate-300">{'{'}</p>
                    <p className="text-slate-300 pl-4">"step_0_1": "MMK Structural Mapping (27-ch architecture)",</p>
                    <p className="text-slate-300 pl-4">"step_0_2": "Śūnyatā Depth Check (emptiness/dependent-origination/two-truths)",</p>
                    <p className="text-slate-300 pl-4">"step_0_3": "Prāsaṅgika Method Recognition (reductio|dilemma|regress|catuṣkoṭi)"</p>
                    <p className="text-slate-300">{'}'}</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 border border-slate-700">
                    <p className="text-yellow-400">// Source Hierarchy (Tier 1 — Canonical)</p>
                    <p className="text-slate-300 pl-4">PRIMARY: Garfield (1995) Fundamental Wisdom</p>
                    <p className="text-slate-300 pl-4">XREF: Siderits & Katsura (2013)</p>
                    <p className="text-slate-300 pl-4">AUTHORITY: Candrakīrti Prasannapadā (7th c)</p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-3 border border-red-900/50 border-l-2 border-l-red-500">
                    <p className="text-red-400">// Gate 2: Scientific Integrity (must pass)</p>
                    <p className="text-slate-300 pl-4">❌ No quantum woo / New Age mysticism</p>
                    <p className="text-slate-300 pl-4">❌ No claim consciousness causes collapse</p>
                    <p className="text-slate-300 pl-4">✅ Analogies explicitly labeled as structural only</p>
                  </div>
                </div>
              </div>

              {/* RESONANCE Scores */}
              <div>
                <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase tracking-wider">
                  RESONANCE Algorithm Scores (Showcase Verses)
                </h3>
                <div className="space-y-2">
                  {RESONANCE_DATA.map(d => (
                    <div key={d.verse} className="bg-black/40 rounded-lg p-3 border border-slate-700 flex items-start gap-3">
                      <div className="text-center min-w-[48px]">
                        <p className="text-lg font-black" style={{ color: d.score >= 90 ? '#10B981' : '#F59E0B' }}>
                          {d.score}
                        </p>
                        <p className="text-[10px] text-slate-500">/100</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{d.concept} <span className="text-slate-500">— v{d.verse}</span></p>
                        <p className="text-[10px] text-slate-400 mt-0.5 italic">{d.caveat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Paper Summary ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Paper Structure</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {PAPER_SECTIONS.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/40 transition-all">
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">Section {i + 2}</p>
                <p className="text-sm font-bold text-white mb-1">{s.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{s.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Showcase Verses ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Showcase Verses — Open Access</h2>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">No Login Required</span>
          </div>

          <div className="space-y-4">
            {SHOWCASE_VERSES.map(v => (
              <div key={v.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                <button
                  onClick={() => setActiveVerse(activeVerse === v.id ? null : v.id)}
                  className="w-full text-left p-5 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm"
                    style={{ background: `${v.color}33`, border: `1px solid ${v.color}55` }}
                  >
                    {v.chapter}.{v.verse}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-white text-sm mb-0.5">{v.title}</p>
                      <span className="text-xs text-slate-400 flex-shrink-0">{activeVerse === v.id ? '▲' : '▼'}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mb-1">{v.devanagari}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-0.5">{v.theme}</span>
                      <span className="text-[10px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">⚛ {v.quantum}</span>
                    </div>
                  </div>
                </button>

                {activeVerse === v.id && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">IAST Transliteration</p>
                      <p className="text-sm italic text-slate-300 font-mono">{v.sanskrit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Translation (Garfield)</p>
                      <p className="text-sm text-white leading-relaxed">{v.translation}</p>
                    </div>
                    {researchMode && (
                      <div className="bg-black/40 border border-slate-700 rounded-xl p-4 mt-2">
                        <p className="text-xs text-purple-400 font-semibold mb-2">🔬 Research Mode — Quantum Analogy Assessment</p>
                        <p className="text-xs text-slate-300"><span className="text-cyan-400">Quantum Concept:</span> {v.quantum}</p>
                        <p className="text-xs text-slate-400 mt-1 italic">
                          Note: This is a structural analogy used as a pedagogical scaffold, not a metaphysical identity claim.
                          The RESONANCE framework distinguishes precise philosophical parallels from superficial vocabulary similarity.
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Link
                        href={`/verse/${v.chapter}-${v.verse}?showcase=true`}
                        className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-full transition-all font-semibold"
                      >
                        🎬 Open 3D Verse Experience →
                      </Link>
                      <span className="inline-flex items-center text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        Free — no login needed
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Alignment with Conference Sub-Themes ── */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">Alignment with Conference Sub-Themes</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                theme: '1. Role of AI in Reviving IKS',
                description: '27 chapters of MMK digitized with AI-scaffolded explanations, interactive 3D, gamification, and verified certifications. Preserves philosophical depth while radically increasing accessibility.',
                icon: '🇮🇳',
                strength: 'Primary',
              },
              {
                theme: '2. Ethical AI from Wisdom',
                description: 'Madhyamaka-GPT operates under strict epistemological constraints: canonical source hierarchy, Gate 2 scientific integrity checks, explicit analogy labeling, and Research Mode transparency.',
                icon: '⚖️',
                strength: 'Primary',
              },
              {
                theme: '3. Rescuing Ancient Texts with AI',
                description: 'Devanagari Sanskrit, IAST transliteration, Garfield & Siderits translations, and Candrakīrti-grounded commentary — all preserved and made interactive for digital learners.',
                icon: '📜',
                strength: 'Primary',
              },
              {
                theme: '5. Sanskrit in Computational AI/Linguistics',
                description: 'The RESONANCE scoring algorithm adapts formal Sanskrit philosophical structures (prasaṅga, catuṣkoṭi, svabhāva) into AI evaluation criteria — demonstrating Sanskrit\'s computational tractability.',
                icon: '🔤',
                strength: 'Secondary',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">{item.theme}</p>
                      <span className={`text-[10px] rounded-full px-2 py-0.5 ${item.strength === 'Primary' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                        {item.strength}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Download / Contact ── */}
        <section className="text-center border border-white/10 rounded-2xl p-8 bg-white/5">
          <h2 className="text-xl font-bold text-white mb-2">For Evaluators & Reviewers</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-xl mx-auto">
            All showcase verses are open (no login). Research Mode reveals the AI prompt architecture, RESONANCE scores, and ATOM 3D specifications used in the paper.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:spumandiconference@gmail.com"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm px-6 py-3 rounded-full font-semibold transition-all"
            >
              ✉️ Contact: spumandiconference@gmail.com
            </a>
            <Link
              href="/verse/1-1"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm px-6 py-3 rounded-full font-semibold border border-white/20 transition-all"
            >
              🚀 Launch Platform
            </Link>
          </div>
          <p className="text-xs text-slate-600 mt-6">
            📚 Full conference paper: docs/paper.md · Platform: Nagarjuna Quantum Reflections v2.0 · Conference: IKS-AI National Conference, March 2026
          </p>
        </section>
      </div>
    </div>
  );
}
