/**
 * PaywallGate Component
 * @fix H3 - All 400+ verses freely accessible
 * 
 * Gating component that blocks content based on user tier
 */

import React from 'react';
import { useUser } from '../contexts/UserContext';
import { getUpgradeRecommendation, getTierPrice, formatTierName, TIERS } from '../lib/whop-auth';
import { trackPaywallHit, trackMonetizationEvent, EVENTS } from '../lib/analytics';

/**
 * PaywallGate - Wraps content and shows upgrade CTA if user lacks access
 * 
 * @param {object} props
 * @param {number} props.chapterNumber - Chapter to check access for
 * @param {React.ReactNode} props.children - Content to gate
 * @param {React.ReactNode} props.preview - Optional preview content to show
 */
export function PaywallGate({ chapterNumber, children, preview = null }) {
  const { user, checkChapterAccess, login, isAuthenticated } = useUser();
  
  // Check if user has access
  const hasAccess = checkChapterAccess(chapterNumber);
  
  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // Get upgrade recommendation
  const upgrade = getUpgradeRecommendation(user.tier, chapterNumber);
  
  // Track paywall hit for analytics
  React.useEffect(() => {
    trackPaywallHit(chapterNumber, user.tier, upgrade?.recommendedTier);
  }, [chapterNumber, user.tier, upgrade?.recommendedTier]);

  const handleUpgradeClick = React.useCallback(() => {
    if (!upgrade) return;
    trackMonetizationEvent(EVENTS.UPGRADE_CTA_CLICKED, {
      chapterNumber,
      user_tier_current: user.tier || 'free',
      recommendedTier: upgrade.recommendedTier,
      productId: upgrade.productId,
      cta: 'paywall_upgrade_now'
    });

    trackMonetizationEvent(EVENTS.CHECKOUT_STARTED, {
      chapterNumber,
      user_tier_current: user.tier || 'free',
      recommendedTier: upgrade.recommendedTier,
      productId: upgrade.productId,
      checkoutProvider: 'whop'
    });
  }, [chapterNumber, upgrade, user.tier]);
  
  return (
    <div className="paywall-container">
      {/* Preview content if provided */}
      {preview && (
        <div className="paywall-preview">
          {preview}
          <div className="paywall-fade" />
        </div>
      )}
      
      {/* Paywall overlay */}
      <div className="paywall-overlay">
        <div className="paywall-content">
          {/* Lock icon */}
          <div className="paywall-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          
          <h3 className="paywall-title">
            Unlock Chapter {chapterNumber}
          </h3>
          
          <p className="paywall-description">
            Access this chapter's quantum-philosophy visualizations, 
            AI-generated animations, and deep-dive Q&A content.
          </p>
          
          {/* Upgrade options */}
          {!isAuthenticated ? (
            <div className="paywall-actions">
              <p className="paywall-cta-text">
                Sign in to access free chapters or upgrade for full access
              </p>
              <button 
                onClick={login}
                className="paywall-button primary"
              >
                Sign In with Whop
              </button>
            </div>
          ) : upgrade ? (
            <div className="paywall-actions">
              <p className="paywall-cta-text">
                Upgrade to <strong>{formatTierName(upgrade.recommendedTier)}</strong> for {getTierPrice(upgrade.recommendedTier)}
              </p>
              
              <a 
                href={`https://whop.com/checkout/${upgrade.productId}`}
                onClick={handleUpgradeClick}
                className="paywall-button primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Upgrade Now
              </a>
              
              <a href="/pricing" className="paywall-button secondary">
                Compare Plans
              </a>
              
              {/* Feature highlights */}
              <div className="paywall-features">
                <h4>What you'll get:</h4>
                <ul>
                  {upgrade.features.slice(0, 4).map((feature, i) => (
                    <li key={i}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      {formatFeatureName(feature)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="paywall-error">
              Unable to determine upgrade path. Please contact support.
            </p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .paywall-container {
          position: relative;
          min-height: 400px;
        }
        
        .paywall-preview {
          position: relative;
          max-height: 300px;
          overflow: hidden;
        }
        
        .paywall-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 150px;
          background: linear-gradient(transparent, #0f172a);
          pointer-events: none;
        }
        
        .paywall-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          margin-top: -50px;
          position: relative;
          z-index: 10;
        }
        
        .paywall-content {
          text-align: center;
          max-width: 500px;
        }
        
        .paywall-icon {
          margin-bottom: 1rem;
        }
        
        .paywall-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0 0 0.5rem;
        }
        
        .paywall-description {
          color: #94a3b8;
          margin: 0 0 1.5rem;
          line-height: 1.6;
        }
        
        .paywall-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .paywall-cta-text {
          color: #e2e8f0;
          margin: 0;
        }
        
        .paywall-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }
        
        .paywall-button.primary {
          background: linear-gradient(135deg, #8B5CF6, #7c3aed);
          color: white;
          box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
        }
        
        .paywall-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
        }
        
        .paywall-button.secondary {
          background: transparent;
          color: #8B5CF6;
          border: 1px solid #8B5CF6;
        }
        
        .paywall-button.secondary:hover {
          background: rgba(139, 92, 246, 0.1);
        }
        
        .paywall-features {
          margin-top: 1.5rem;
          text-align: left;
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 8px;
        }
        
        .paywall-features h4 {
          color: #e2e8f0;
          margin: 0 0 0.75rem;
          font-size: 0.875rem;
        }
        
        .paywall-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .paywall-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .paywall-error {
          color: #f87171;
        }
        
        @media (max-width: 640px) {
          .paywall-overlay {
            padding: 1.5rem;
            margin: 0;
          }
          
          .paywall-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Format feature name for display
 */
function formatFeatureName(feature) {
  const names = {
    'static_images': 'Static visualizations',
    'basic_qa': 'Basic Q&A content',
    'ai_animations': 'AI-generated 3D animations',
    'full_qa': 'Deep-dive Q&A explanations',
    'email_course': '7-Day email course',
    'downloadables': 'Downloadable meditation guides',
    'live_qa': 'Monthly live Q&A sessions',
    'priority_support': 'Priority support',
    'white_label': 'White-label embed rights',
    'api_access': 'API access',
    'affiliate_dashboard': 'Affiliate dashboard'
  };
  return names[feature] || feature.replace(/_/g, ' ');
}

/**
 * Animation Gate - Gates AI animation access
 */
export function AnimationGate({ children, fallback }) {
  const { checkAnimationAccess, user, incrementAnimationUsage } = useUser();
  const [canUse, setCanUse] = React.useState(false);
  
  React.useEffect(() => {
    setCanUse(checkAnimationAccess());
  }, [checkAnimationAccess, user.animationsUsedToday]);
  
  if (!canUse) {
    return fallback || (
      <div className="animation-gate">
        <p>AI animations require a Seeker subscription or higher.</p>
        <a href="/pricing">Upgrade to unlock</a>
      </div>
    );
  }
  
  // Clone children and inject usage tracker
  return React.cloneElement(children, {
    onAnimationGenerated: () => {
      incrementAnimationUsage();
      if (children.props.onAnimationGenerated) {
        children.props.onAnimationGenerated();
      }
    }
  });
}

export default PaywallGate;
