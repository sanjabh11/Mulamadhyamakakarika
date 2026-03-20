"use client";

/**
 * MembershipTiers - Whop Membership Integration
 * 
 * Defines membership tiers and integrates with Whop SDK for access control
 */

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { WHOP_PRODUCTS } from '../../lib/whop-auth';
import { trackMonetizationEvent, EVENTS } from '../../lib/analytics';


// Membership tier definitions — must stay in sync with lib/whop-auth.js
export const TIERS = {
  FREE: {
    id: 'free',
    name: 'Explorer',
    price: 0,
    description: 'Begin your journey with foundational teachings',
    features: [
      'Access to Chapters 1-3',
      'Basic 3D visualizations',
      'Chapter quizzes (Chapters 1-3)',
      'Progress tracking',
      'Community forum access'
    ],
    limits: {
      chapters: [1, 2, 3],
      quizzes: [1, 2, 3],
      downloads: false,
      community: 'basic',
      certificates: false,
      aiAnimations: false,
      physicsSliders: false
    }
  },
  SEEKER: {
    id: 'seeker',
    name: 'Seeker',
    price: 19,
    description: 'Deepen your understanding with expanded access',
    features: [
      'Access to Chapters 1-15',
      'All 3D visualizations',
      'AI animations (10/day)',
      'All chapter quizzes',
      'Digital certificates',
      'PDF chapter downloads',
      'Priority community support'
    ],
    limits: {
      chapters: Array.from({ length: 15 }, (_, i) => i + 1),
      quizzes: Array.from({ length: 15 }, (_, i) => i + 1),
      downloads: true,
      community: 'priority',
      certificates: true,
      aiAnimations: true,
      aiAnimationsPerDay: 10,
      physicsSliders: false
    },
    popular: true
  },
  PRACTITIONER: {
    id: 'practitioner',
    name: 'Practitioner',
    price: 45,
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
      'Direct Q&A access'
    ],
    limits: {
      chapters: Array.from({ length: 27 }, (_, i) => i + 1),
      quizzes: Array.from({ length: 27 }, (_, i) => i + 1),
      downloads: true,
      community: 'vip',
      certificates: true,
      liveSessions: true,
      aiAnimations: true,
      aiAnimationsPerDay: Infinity,
      physicsSliders: false
    }
  },
  TEACHER: {
    id: 'teacher',
    name: 'Teacher',
    price: 149,
    description: 'White-label access with advanced physics controls and API',
    features: [
      'Everything in Practitioner',
      'Advanced physics sliders',
      'White-label branding',
      'API access',
      'Affiliate dashboard',
      'Priority support'
    ],
    limits: {
      chapters: Array.from({ length: 27 }, (_, i) => i + 1),
      quizzes: Array.from({ length: 27 }, (_, i) => i + 1),
      downloads: true,
      community: 'vip',
      certificates: true,
      liveSessions: true,
      aiAnimations: true,
      aiAnimationsPerDay: Infinity,
      physicsSliders: true,
      whiteLabel: true,
      apiAccess: true
    }
  }
};

// Membership context
const MembershipContext = createContext(null);

/**
 * Membership Provider Component
 */
export function MembershipProvider({ children }) {
  const [tier, setTier] = useState('free');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for Whop membership on mount
    checkMembership();
  }, []);

  async function checkMembership() {
    setLoading(true);
    try {
      // Primary: validate session via API (OAuth flow)
      const res = await fetch('/api/auth/validate', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.valid && data.tier) {
          setTier(data.tier);
          setUser({ id: data.id, email: data.email, name: data.name });
          setLoading(false);
          return;
        }
      }
      // Fallback: Whop iframe SDK (for embedded app context)
      if (typeof window !== 'undefined' && window.Whop) {
        const membership = await window.Whop.getMembership();
        if (membership) {
          setTier(determineTierFromWhop(membership));
          setUser(membership.user);
          setLoading(false);
          return;
        }
      }
      // Dev/demo: localStorage override
      if (typeof window !== 'undefined') {
        const storedTier = localStorage.getItem('mmk_membership_tier');
        if (storedTier && TIERS[storedTier.toUpperCase()]) {
          setTier(storedTier);
        }
      }
    } catch (error) {
      console.error('Membership check failed, defaulting to free:', error);
    } finally {
      setLoading(false);
    }
  }

  function determineTierFromWhop(membership) {
    // Map Whop plan IDs to our tiers — must match lib/whop-auth.js PLAN_IDS
    const envSeeker = process.env.NEXT_PUBLIC_WHOP_PLAN_SEEKER || 'plan_seeker';
    const envPractitioner = process.env.NEXT_PUBLIC_WHOP_PLAN_PRACTITIONER || 'plan_practitioner';
    const envTeacher = process.env.NEXT_PUBLIC_WHOP_PLAN_TEACHER || 'plan_teacher';
    const planMapping = {
      [envSeeker]: 'seeker',
      [envPractitioner]: 'practitioner',
      [envTeacher]: 'teacher',
      'plan_seeker': 'seeker',
      'plan_practitioner': 'practitioner',
      'plan_teacher': 'teacher',
    };
    return planMapping[membership.planId] || 'free';
  }

  // Check if user can access a chapter
  function canAccessChapter(chapter) {
    const tierConfig = TIERS[tier.toUpperCase()];
    if (!tierConfig) return false;
    return tierConfig.limits.chapters.includes(chapter);
  }

  // Check if user can take a quiz
  function canTakeQuiz(chapter) {
    const tierConfig = TIERS[tier.toUpperCase()];
    if (!tierConfig) return false;
    return tierConfig.limits.quizzes.includes(chapter);
  }

  // Check if user can download
  function canDownload() {
    const tierConfig = TIERS[tier.toUpperCase()];
    return tierConfig?.limits.downloads || false;
  }

  // Check if user can get certificates
  function canGetCertificate() {
    const tierConfig = TIERS[tier.toUpperCase()];
    return tierConfig?.limits.certificates || false;
  }

  // Check if user has access to advanced physics sliders (Teacher tier)
  function canHavePhysicsSliders() {
    const tierConfig = TIERS[tier.toUpperCase()];
    return tierConfig?.limits.physicsSliders || false;
  }

  // Upgrade tier (for testing)
  function upgradeTier(newTier) {
    if (TIERS[newTier.toUpperCase()]) {
      trackMonetizationEvent(EVENTS.SUBSCRIPTION_PLAN_CHANGED, {
        user_tier_current: tier,
        selectedTier: newTier,
        source: 'manual_dev_toggle'
      });
      setTier(newTier);
      localStorage.setItem('mmk_membership_tier', newTier);
    }
  }

  const value = {
    tier,
    tierConfig: TIERS[tier.toUpperCase()],
    user,
    loading,
    canAccessChapter,
    canTakeQuiz,
    canDownload,
    canGetCertificate,
    canHavePhysicsSliders,
    upgradeTier,
    TIERS
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

/**
 * Hook to access membership context
 */
export function useMembership() {
  const context = useContext(MembershipContext);
  if (!context) {
    // Return default free tier if no provider
    return {
      tier: 'free',
      tierConfig: TIERS.FREE,
      user: null,
      loading: false,
      canAccessChapter: (ch) => ch <= 3,
      canTakeQuiz: (ch) => ch <= 3,
      canDownload: () => false,
      canGetCertificate: () => false,
      canHavePhysicsSliders: () => false,
      upgradeTier: () => { },
      TIERS
    };
  }
  return context;
}

/**
 * Membership Gate Component
 */
export function MembershipGate({
  children,
  requiredTier = 'seeker',
  chapter,
  feature,
  fallback
}) {
  const { tier, canAccessChapter, canDownload, canGetCertificate } = useMembership();

  let hasAccess = false;

  if (chapter) {
    hasAccess = canAccessChapter(chapter);
  } else if (feature === 'download') {
    hasAccess = canDownload();
  } else if (feature === 'certificate') {
    hasAccess = canGetCertificate();
  } else {
    // Check tier level
    const tierOrder = ['free', 'seeker', 'practitioner', 'teacher'];
    const requiredIndex = tierOrder.indexOf(requiredTier);
    const currentIndex = tierOrder.indexOf(tier);
    hasAccess = currentIndex >= requiredIndex;
  }

  if (hasAccess) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  return <UpgradePrompt requiredTier={requiredTier} />;
}

/**
 * Upgrade Prompt Component
 */
export function UpgradePrompt({ requiredTier = 'seeker' }) {
  const tierConfig = TIERS[requiredTier.toUpperCase()];

  return (
    <div className="upgrade-prompt">
      <div className="lock-icon">🔒</div>
      <h3>Premium Content</h3>
      <p>Upgrade to <strong>{tierConfig?.name}</strong> to unlock this content.</p>

      <div className="features-preview">
        <h4>What you'll get:</h4>
        <ul>
          {tierConfig?.features.slice(0, 4).map((feature, i) => (
            <li key={i}>✓ {feature}</li>
          ))}
        </ul>
      </div>

      <button
        className="upgrade-btn"
        onClick={() => {
          // WHOP_PRODUCTS is keyed by lowercase tier id (e.g. 'seeker', 'practitioner')
          const productId = WHOP_PRODUCTS[requiredTier] || WHOP_PRODUCTS[requiredTier?.toLowerCase()];
          if (requiredTier && productId) {
            window.location.href = `https://whop.com/checkout/${productId}`;
          }
        }}
      >
        Upgrade for ${tierConfig?.price}/month
      </button>

      <style jsx>{`
        .upgrade-prompt {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          max-width: 400px;
          margin: 2rem auto;
        }
        
        .lock-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        h3 {
          color: #e2e8f0;
          margin: 0 0 0.5rem;
        }
        
        p {
          color: #94a3b8;
          margin-bottom: 1.5rem;
        }
        
        p strong {
          color: #8B5CF6;
        }
        
        .features-preview {
          text-align: left;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .features-preview h4 {
          color: #8B5CF6;
          font-size: 0.875rem;
          margin: 0 0 0.75rem;
        }
        
        .features-preview ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .features-preview li {
          color: #e2e8f0;
          font-size: 0.875rem;
          padding: 0.25rem 0;
        }
        
        .upgrade-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .upgrade-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
}

/**
 * Pricing Table Component
 */
export function PricingTable() {
  const { tier, upgradeTier } = useMembership();

  const hasTrackedPricingView = useRef(false);

  useEffect(() => {
    if (hasTrackedPricingView.current) return;
    hasTrackedPricingView.current = true;

    trackMonetizationEvent(EVENTS.PRICING_VIEWED, {
      user_tier_current: tier || 'free',
      source: 'pricing_table'
    });
  }, [tier]);

  return (
    <div className="pricing-table">
      <h2>Choose Your Path</h2>
      <p className="subtitle">Select the membership that fits your spiritual journey</p>

      <div className="tiers-grid">
        {Object.values(TIERS).map((tierConfig) => (
          <div
            key={tierConfig.id}
            className={`tier-card ${tierConfig.popular ? 'popular' : ''} ${tier === tierConfig.id ? 'current' : ''}`}
          >
            {tierConfig.popular && <div className="popular-badge">Most Popular</div>}
            {tier === tierConfig.id && <div className="current-badge">Current Plan</div>}

            <h3>{tierConfig.name}</h3>
            <div className="price">
              {tierConfig.price === 0 ? (
                <span className="amount">Free</span>
              ) : (
                <>
                  <span className="currency">$</span>
                  <span className="amount">{tierConfig.price}</span>
                  <span className="period">/month</span>
                </>
              )}
            </div>
            <p className="description">{tierConfig.description}</p>

            <ul className="features">
              {tierConfig.features.map((feature, i) => (
                <li key={i}>
                  <span className="check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`select-btn ${tier === tierConfig.id ? 'current' : ''}`}
              onClick={() => {
                trackMonetizationEvent(EVENTS.UPGRADE_CTA_CLICKED, {
                  user_tier_current: tier || 'free',
                  selectedTier: tierConfig.id,
                  cta: 'pricing_select_plan'
                });
                if (tierConfig.price > 0 && WHOP_PRODUCTS[tierConfig.id]) {
                  window.location.href = `https://whop.com/checkout/${WHOP_PRODUCTS[tierConfig.id]}`;
                }
              }}
              disabled={tier === tierConfig.id}
            >
              {tier === tierConfig.id ? 'Current Plan' : tierConfig.price === 0 ? 'Get Started' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pricing-table {
          padding: 3rem 1rem;
          text-align: center;
        }
        
        h2 {
          color: #e2e8f0;
          font-size: 2rem;
          margin: 0 0 0.5rem;
        }
        
        .subtitle {
          color: #94a3b8;
          margin-bottom: 3rem;
        }
        
        .tiers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .tier-card {
          position: relative;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 2rem;
          text-align: left;
        }
        
        .tier-card.popular {
          border-color: #8B5CF6;
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);
        }
        
        .tier-card.current {
          border-color: #10B981;
        }
        
        .popular-badge, .current-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .popular-badge {
          background: linear-gradient(135deg, #8B5CF6, #EC4899);
          color: white;
        }
        
        .current-badge {
          background: #10B981;
          color: white;
        }
        
        .tier-card h3 {
          color: #e2e8f0;
          font-size: 1.5rem;
          margin: 0 0 1rem;
        }
        
        .price {
          margin-bottom: 1rem;
        }
        
        .currency {
          color: #94a3b8;
          font-size: 1.25rem;
          vertical-align: top;
        }
        
        .amount {
          color: #e2e8f0;
          font-size: 3rem;
          font-weight: 700;
        }
        
        .period {
          color: #94a3b8;
          font-size: 1rem;
        }
        
        .description {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        
        .features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
        }
        
        .features li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: #e2e8f0;
          font-size: 0.9rem;
          padding: 0.5rem 0;
        }
        
        .check {
          color: #10B981;
          font-weight: bold;
        }
        
        .select-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .select-btn:not(.current) {
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          border: none;
          color: white;
        }
        
        .select-btn.current {
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid #10B981;
          color: #10B981;
          cursor: default;
        }
        
        .select-btn:not(.current):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
}

export default MembershipProvider;
