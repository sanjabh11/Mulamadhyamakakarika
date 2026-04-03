'use client';

import React, { useState } from 'react';

const MOCK_TELEMETRY = {
  totalSessions: 847,
  avgSessionMinutes: 12.4,
  totalVerseViews: 5231,
  topVerses: [
    { id: '1.1', title: 'Four-Fold Negation', views: 423, avgMinutes: 8.2, quizPass: 81 },
    { id: '1.10', title: 'Emptiness Enables Dependence', views: 387, avgMinutes: 9.1, quizPass: 74 },
    { id: '24.18', title: 'The Grand Equation', views: 352, avgMinutes: 11.3, quizPass: 68 },
    { id: '1.13', title: 'Mutual Emptiness', views: 318, avgMinutes: 9.7, quizPass: 77 },
    { id: '1.8', title: 'Emptiness of Object Condition', views: 291, avgMinutes: 8.9, quizPass: 72 },
  ],
  quizResults: {
    beginner: { attempts: 1203, passRate: 79 },
    intermediate: { attempts: 891, passRate: 64 },
    advanced: { attempts: 534, passRate: 48 },
  },
  animatedVsText: {
    animated: { avgMinutes: 4.8, faqExpansionRate: 61, quizAttemptRate: 53 },
    textOnly: { avgMinutes: 2.1, faqExpansionRate: 34, quizAttemptRate: 28 },
  },
  commonMisconceptions: [
    { topic: 'Śūnyatā = Nihilism', occurrences: 143, resolved: 89 },
    { topic: 'Quantum analogies = metaphysical identity', occurrences: 78, resolved: 76 },
    { topic: 'Emptiness = nothingness', occurrences: 112, resolved: 94 },
  ],
};

function MetricCard({ label, value, sub, color = '#8B5CF6' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function ResearchDataPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verses' | 'quizzes' | 'animation'>('overview');
  const telemetryTabIds = {
    overview: 'telemetry-tab-overview',
    verses: 'telemetry-tab-verses',
    quizzes: 'telemetry-tab-quizzes',
    animation: 'telemetry-tab-animation',
  } as const;
  const telemetryPanelIds = {
    overview: 'telemetry-panel-overview',
    verses: 'telemetry-panel-verses',
    quizzes: 'telemetry-panel-quizzes',
    animation: 'telemetry-panel-animation',
  } as const;

  return (
    <div className="min-h-screen bg-[#050520] text-slate-200 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5 text-sm text-amber-300 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            PROTOTYPE DATA — Illustrative visualization for demonstration purposes
          </div>
          <div className="text-xs text-slate-500 mb-4">
            Real telemetry aggregation pending IRB approval and data collection pipeline
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Research Telemetry Dashboard</h1>
          <p className="text-slate-400 text-sm">
            Nagarjuna Quantum Reflections — IKS-AI Conference 2026 Academic Evaluation Data
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap" data-testid="research-telemetry-tabs" role="tablist" aria-label="Research telemetry sections">
          {(['overview', 'verses', 'quizzes', 'animation'] as const).map(tab => (
            <button
              key={tab}
              id={telemetryTabIds[tab]}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={telemetryPanelIds[tab]}
              onClick={() => setActiveTab(tab)}
              data-testid={`telemetry-tab-${tab}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        <div
          id={telemetryPanelIds.overview}
          role="tabpanel"
          aria-labelledby={telemetryTabIds.overview}
          hidden={activeTab !== 'overview'}
          data-testid="telemetry-overview-panel"
          className="space-y-6"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Sessions" value={MOCK_TELEMETRY.totalSessions.toString()} color="#8B5CF6" />
              <MetricCard label="Avg Session" value={`${MOCK_TELEMETRY.avgSessionMinutes}m`} sub="per user" color="#06B6D4" />
              <MetricCard label="Verse Views" value={MOCK_TELEMETRY.totalVerseViews.toLocaleString()} color="#10B981" />
              <MetricCard label="Pilot Period" value="Cycle 2–3" sub="Nov 2025 – Mar 2026" color="#F59E0B" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-4">Common Misconception Resolution Rates</h2>
              {MOCK_TELEMETRY.commonMisconceptions.map((m, i) => (
                <div key={i} className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{m.topic}</span>
                    <span className="text-green-400 font-semibold">{m.resolved}% resolved</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-green-500 transition-all"
                      style={{ width: `${m.resolved}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-500 mt-3">
                "Resolved" = learner correctly answered advanced quiz item distinguishing śūnyatā from nihilism/quantum mysticism.
              </p>
            </div>
          </div>

        {/* Verses Tab */}
        <div
          id={telemetryPanelIds.verses}
          role="tabpanel"
          aria-labelledby={telemetryTabIds.verses}
          hidden={activeTab !== 'verses'}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          data-testid="telemetry-verses-panel"
        >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left p-4">Verse</th>
                  <th className="text-right p-4">Views</th>
                  <th className="text-right p-4">Avg Time</th>
                  <th className="text-right p-4">Quiz Pass %</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TELEMETRY.topVerses.map((v, i) => (
                  <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="p-4">
                      <span className="text-purple-400 font-mono mr-2">{v.id}</span>
                      <span className="text-white">{v.title}</span>
                    </td>
                    <td className="text-right p-4 text-slate-300">{v.views}</td>
                    <td className="text-right p-4 text-slate-300">{v.avgMinutes}m</td>
                    <td className="text-right p-4">
                      <span className={`font-semibold ${v.quizPass >= 75 ? 'text-green-400' : 'text-amber-400'}`}>
                        {v.quizPass}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Quizzes Tab */}
        <div
          id={telemetryPanelIds.quizzes}
          role="tabpanel"
          aria-labelledby={telemetryTabIds.quizzes}
          hidden={activeTab !== 'quizzes'}
          className="grid md:grid-cols-3 gap-4"
        >
            {Object.entries(MOCK_TELEMETRY.quizResults).map(([tier, data]) => (
              <div key={tier} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  {tier === 'beginner' ? '🌱 Seed' : tier === 'intermediate' ? '🌿 Sprout' : '🌳 Tree'} Tier
                </p>
                <p className="text-3xl font-black text-purple-400 mb-1">{data.passRate}%</p>
                <p className="text-xs text-slate-500">Pass rate across {data.attempts.toLocaleString()} attempts</p>
                <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${data.passRate}%` }} />
                </div>
              </div>
            ))}
          </div>

        {/* Animation Tab */}
        <div
          id={telemetryPanelIds.animation}
          role="tabpanel"
          aria-labelledby={telemetryTabIds.animation}
          hidden={activeTab !== 'animation'}
          className="space-y-4"
          data-testid="telemetry-animation-panel"
        >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-6">Animated vs Text-Only Verse Engagement Comparison</h2>
              {[
                { metric: 'Avg Time on Page', animated: `${MOCK_TELEMETRY.animatedVsText.animated.avgMinutes}m`, text: `${MOCK_TELEMETRY.animatedVsText.textOnly.avgMinutes}m`, improvement: '2.3×' },
                { metric: 'FAQ Expansion Rate', animated: `${MOCK_TELEMETRY.animatedVsText.animated.faqExpansionRate}%`, text: `${MOCK_TELEMETRY.animatedVsText.textOnly.faqExpansionRate}%`, improvement: '1.8×' },
                { metric: 'Quiz Attempt Rate', animated: `${MOCK_TELEMETRY.animatedVsText.animated.quizAttemptRate}%`, text: `${MOCK_TELEMETRY.animatedVsText.textOnly.quizAttemptRate}%`, improvement: '1.9×' },
              ].map(row => (
                <div key={row.metric} className="flex items-center gap-4 mb-4 last:mb-0">
                  <p className="text-xs text-slate-400 w-36 flex-shrink-0">{row.metric}</p>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 bg-slate-800/60 rounded-lg px-3 py-2 text-center">
                      <p className="text-[10px] text-slate-500 mb-0.5">Text-Only</p>
                      <p className="text-sm font-bold text-slate-300">{row.text}</p>
                    </div>
                    <div className="flex-1 bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-2 text-center">
                      <p className="text-[10px] text-purple-400 mb-0.5">Animated 3D</p>
                      <p className="text-sm font-bold text-white">{row.animated}</p>
                    </div>
                    <div className="text-center w-14">
                      <p className="text-lg font-black text-green-400">{row.improvement}</p>
                      <p className="text-[10px] text-slate-500">lift</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 text-center">
              *Animated verses = Chapters 1–7 (with full ATOM 3D animation). Text-only = Chapters 8–14 (Cycle 1). Controlled comparison is a planned future study.
            </p>
          </div>

        <footer className="mt-10 text-center text-xs text-slate-600">
          <p className="text-amber-500/80 mb-2">⚠️ This dashboard displays PROTOTYPE/MOCK data for demonstration purposes only.</p>
          <p>All metrics shown are illustrative examples. Real aggregated telemetry will be available once data collection and IRB approval are complete.</p>
          <p className="mt-2">Contact: sanjabh11@gmail.com</p>
        </footer>
      </div>
    </div>
  );
}
