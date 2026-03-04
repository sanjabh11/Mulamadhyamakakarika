/**
 * Whop Authentication & Tier Management
 * @fix H1, H2 - No Whop SDK integration, No user auth system
 * 
 * Installation: npm install @whop-sdk/core @whop-sdk/browser
 */

// Tier definitions matching monetization strategy
export const TIERS = {
  FREE: 'free',
  SEEKER: 'seeker',        // $19/mo - Chapters 1-15
  PRACTITIONER: 'practitioner', // $45/mo - All chapters
  TEACHER: 'teacher'       // $149/mo - White-label + API
};

// Chapter access mapping by tier
export const TIER_ACCESS = {
  [TIERS.FREE]: {
    chapters: [1, 2, 3],
    aiAnimationsPerDay: 0,
    features: ['static_images', 'basic_qa']
  },
  [TIERS.SEEKER]: {
    chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    aiAnimationsPerDay: 10,
    features: ['ai_animations', 'full_qa', 'email_course']
  },
  [TIERS.PRACTITIONER]: {
    chapters: Array.from({ length: 27 }, (_, i) => i + 1),
    aiAnimationsPerDay: Infinity,
    features: ['ai_animations', 'full_qa', 'downloadables', 'live_qa', 'priority_support']
  },
  [TIERS.TEACHER]: {
    chapters: Array.from({ length: 27 }, (_, i) => i + 1),
    aiAnimationsPerDay: Infinity,
    features: ['ai_animations', 'full_qa', 'downloadables', 'live_qa', 'priority_support', 'white_label', 'api_access', 'affiliate_dashboard']
  }
};

// Whop Product IDs (replace with actual IDs from Whop dashboard)
export const WHOP_PRODUCTS = {
  [TIERS.SEEKER]: process.env.NEXT_PUBLIC_WHOP_PLAN_SEEKER || 'plan_seeker',
  [TIERS.PRACTITIONER]: process.env.NEXT_PUBLIC_WHOP_PLAN_PRACTITIONER || 'plan_practitioner',
  [TIERS.TEACHER]: process.env.NEXT_PUBLIC_WHOP_PLAN_TEACHER || 'plan_teacher'
};

/**
 * Check if user has access to a specific chapter
 * @param {string} userTier - User's subscription tier
 * @param {number} chapterNumber - Chapter to check access for
 * @returns {boolean}
 */
export function hasChapterAccess(userTier, chapterNumber) {
  const tier = userTier || TIERS.FREE;
  const access = TIER_ACCESS[tier];

  if (!access) {
    console.warn(`Unknown tier: ${tier}, defaulting to FREE`);
    return TIER_ACCESS[TIERS.FREE].chapters.includes(chapterNumber);
  }

  return access.chapters.includes(chapterNumber);
}

/**
 * Check if user can use AI animations
 * @param {string} userTier - User's subscription tier
 * @param {number} usedToday - Animations used today
 * @returns {boolean}
 */
export function canUseAiAnimation(userTier, usedToday = 0) {
  const tier = userTier || TIERS.FREE;
  const access = TIER_ACCESS[tier];

  if (!access) return false;

  return usedToday < access.aiAnimationsPerDay;
}

/**
 * Check if user has a specific feature
 * @param {string} userTier - User's subscription tier
 * @param {string} feature - Feature to check
 * @returns {boolean}
 */
export function hasFeature(userTier, feature) {
  const tier = userTier || TIERS.FREE;
  const access = TIER_ACCESS[tier];

  if (!access) return false;

  return access.features.includes(feature);
}

/**
 * Get upgrade CTA based on current tier and desired access
 * @param {string} currentTier - User's current tier
 * @param {number} chapterNumber - Chapter user wants to access
 * @returns {object} - Upgrade recommendation
 */
export function getUpgradeRecommendation(currentTier, chapterNumber) {
  if (hasChapterAccess(currentTier, chapterNumber)) {
    return null; // No upgrade needed
  }

  // Find minimum tier that grants access
  for (const [tier, access] of Object.entries(TIER_ACCESS)) {
    if (access.chapters.includes(chapterNumber) && tier !== currentTier) {
      return {
        recommendedTier: tier,
        productId: WHOP_PRODUCTS[tier],
        message: `Upgrade to ${tier.charAt(0).toUpperCase() + tier.slice(1)} to access Chapter ${chapterNumber}`,
        features: access.features
      };
    }
  }

  return null;
}

/**
 * Format tier for display
 * @param {string} tier - Tier ID
 * @returns {string} - Formatted tier name
 */
export function formatTierName(tier) {
  const names = {
    [TIERS.FREE]: 'Free Explorer',
    [TIERS.SEEKER]: 'Seeker',
    [TIERS.PRACTITIONER]: 'Practitioner',
    [TIERS.TEACHER]: 'Teacher'
  };
  return names[tier] || 'Free Explorer';
}

/**
 * Get tier pricing for display
 * @param {string} tier - Tier ID
 * @returns {string} - Formatted price
 */
export function getTierPrice(tier) {
  const prices = {
    [TIERS.FREE]: '$0',
    [TIERS.SEEKER]: '$19/mo',
    [TIERS.PRACTITIONER]: '$45/mo',
    [TIERS.TEACHER]: '$149/mo'
  };
  return prices[tier] || '$0';
}
