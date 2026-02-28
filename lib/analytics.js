import { logger } from "@/lib/logger";
/**
 * Analytics Module
 * @fix H4 - No telemetry/event tracking
 * 
 * Lightweight analytics wrapper supporting multiple providers
 * Configure with Mixpanel, Amplitude, or PostHog
 */

// Analytics configuration
const ANALYTICS_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  provider: process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'console', // 'mixpanel' | 'amplitude' | 'posthog' | 'console'
  debug: process.env.NODE_ENV === 'development'
};

// Event names for consistency
export const EVENTS = {
  // Page views
  PAGE_VIEW: 'page_view',
  CHAPTER_VIEW: 'chapter_view',
  VERSE_VIEW: 'verse_view',
  
  // User actions
  ANIMATION_STARTED: 'animation_started',
  ANIMATION_COMPLETED: 'animation_completed',
  ANIMATION_ERROR: 'animation_error',
  QA_EXPANDED: 'qa_expanded',
  
  // Monetization
  UPGRADE_CTA_SHOWN: 'upgrade_cta_shown',
  UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked',
  PAYWALL_HIT: 'paywall_hit',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  
  // Engagement
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  TIME_ON_CHAPTER: 'time_on_chapter',
  SCROLL_DEPTH: 'scroll_depth',
  
  // Errors
  ERROR_CAUGHT: 'error_caught',
  API_ERROR: 'api_error'
};

// Internal queue for batching events
let eventQueue = [];
let flushTimeout = null;

/**
 * Initialize analytics provider
 * Call this in _app.js on mount
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  
  if (!ANALYTICS_CONFIG.enabled) {
    if (ANALYTICS_CONFIG.debug) {
      logger.log('[Analytics] Disabled - set NEXT_PUBLIC_ANALYTICS_ENABLED=true to enable');
    }
    return;
  }
  
  // Provider-specific initialization
  switch (ANALYTICS_CONFIG.provider) {
    case 'mixpanel':
      // Mixpanel will be loaded via script tag or npm package
      if (window.mixpanel) {
        window.mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
      }
      break;
    case 'amplitude':
      // Amplitude initialization
      if (window.amplitude) {
        window.amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY);
      }
      break;
    case 'posthog':
      // PostHog initialization
      if (window.posthog) {
        window.posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
        });
      }
      break;
    default:
      // Console logging for development
      break;
  }
  
  // Track session start
  track(EVENTS.SESSION_START, {
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  });
  
  // Track session end on unload
  window.addEventListener('beforeunload', () => {
    flushEvents();
    track(EVENTS.SESSION_END, { 
      duration: Math.round((Date.now() - window.__sessionStart) / 1000)
    });
  });
  
  window.__sessionStart = Date.now();
}

/**
 * Track an event
 * @param {string} eventName - Event name from EVENTS
 * @param {object} properties - Event properties
 */
export function track(eventName, properties = {}) {
  if (typeof window === 'undefined') return;
  
  const event = {
    name: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname
    }
  };
  
  if (ANALYTICS_CONFIG.debug) {
    logger.log('[Analytics] Track:', event);
  }
  
  if (!ANALYTICS_CONFIG.enabled) return;
  
  // Add to queue for batching
  eventQueue.push(event);
  
  // Schedule flush
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushEvents, 1000);
  }
}

/**
 * Flush queued events to analytics provider
 */
function flushEvents() {
  if (eventQueue.length === 0) return;
  
  const events = [...eventQueue];
  eventQueue = [];
  flushTimeout = null;
  
  switch (ANALYTICS_CONFIG.provider) {
    case 'mixpanel':
      events.forEach(e => {
        if (window.mixpanel) {
          window.mixpanel.track(e.name, e.properties);
        }
      });
      break;
    case 'amplitude':
      events.forEach(e => {
        if (window.amplitude) {
          window.amplitude.track(e.name, e.properties);
        }
      });
      break;
    case 'posthog':
      events.forEach(e => {
        if (window.posthog) {
          window.posthog.capture(e.name, e.properties);
        }
      });
      break;
    default:
      // Console output for development
      if (ANALYTICS_CONFIG.debug) {
        console.table(events.map(e => ({ event: e.name, ...e.properties })));
      }
      break;
  }
}

/**
 * Identify a user
 * @param {string} userId - User ID
 * @param {object} traits - User traits
 */
export function identify(userId, traits = {}) {
  if (typeof window === 'undefined') return;
  
  if (ANALYTICS_CONFIG.debug) {
    logger.log('[Analytics] Identify:', userId, traits);
  }
  
  if (!ANALYTICS_CONFIG.enabled) return;
  
  switch (ANALYTICS_CONFIG.provider) {
    case 'mixpanel':
      if (window.mixpanel) {
        window.mixpanel.identify(userId);
        window.mixpanel.people.set(traits);
      }
      break;
    case 'amplitude':
      if (window.amplitude) {
        window.amplitude.setUserId(userId);
        window.amplitude.setUserProperties(traits);
      }
      break;
    case 'posthog':
      if (window.posthog) {
        window.posthog.identify(userId, traits);
      }
      break;
    default:
      break;
  }
}

/**
 * Track page view
 * @param {string} pageName - Page name
 * @param {object} properties - Additional properties
 */
export function trackPageView(pageName, properties = {}) {
  track(EVENTS.PAGE_VIEW, {
    pageName,
    ...properties
  });
}

/**
 * Track chapter view with engagement timing
 * @param {number} chapterNumber - Chapter number
 * @param {string} userTier - User's subscription tier
 */
export function trackChapterView(chapterNumber, userTier) {
  track(EVENTS.CHAPTER_VIEW, {
    chapterNumber,
    userTier,
    hasAccess: true // Will be set based on tier check
  });
}

/**
 * Track paywall hit
 * @param {number} chapterNumber - Blocked chapter
 * @param {string} userTier - User's current tier
 * @param {string} requiredTier - Required tier for access
 */
export function trackPaywallHit(chapterNumber, userTier, requiredTier) {
  track(EVENTS.PAYWALL_HIT, {
    chapterNumber,
    userTier,
    requiredTier,
    conversionOpportunity: true
  });
}

/**
 * Track animation events
 * @param {string} eventType - 'started' | 'completed' | 'error'
 * @param {object} details - Animation details
 */
export function trackAnimation(eventType, details) {
  const eventMap = {
    started: EVENTS.ANIMATION_STARTED,
    completed: EVENTS.ANIMATION_COMPLETED,
    error: EVENTS.ANIMATION_ERROR
  };
  
  track(eventMap[eventType] || EVENTS.ANIMATION_STARTED, details);
}

export default {
  init: initAnalytics,
  track,
  identify,
  trackPageView,
  trackChapterView,
  trackPaywallHit,
  trackAnimation,
  EVENTS
};
