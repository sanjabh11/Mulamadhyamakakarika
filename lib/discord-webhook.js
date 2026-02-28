/**
 * Discord Webhook Integration
 * 
 * Handles:
 * - Daily verse posting
 * - User achievement announcements
 * - Course milestone notifications
 * - Community engagement automation
 */

// Environment variables for webhook URLs
const WEBHOOKS = {
  DAILY_VERSE: process.env.DISCORD_WEBHOOK_DAILY_VERSE,
  ANNOUNCEMENTS: process.env.DISCORD_WEBHOOK_ANNOUNCEMENTS,
  ACHIEVEMENTS: process.env.DISCORD_WEBHOOK_ACHIEVEMENTS,
  GENERAL: process.env.DISCORD_WEBHOOK_GENERAL
};

// Color themes for embeds
const COLORS = {
  VERSE: 0x8B5CF6,      // Purple
  ACHIEVEMENT: 0xF59E0B, // Amber
  MILESTONE: 0x10B981,   // Emerald
  ANNOUNCEMENT: 0xEC4899 // Pink
};

/**
 * Send message to Discord webhook
 */
async function sendWebhook(webhookUrl, payload) {
  if (!webhookUrl) {
    console.warn('[Discord] Webhook URL not configured');
    return { success: false, error: 'Webhook not configured' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('[Discord] Webhook error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Post daily verse to Discord
 */
export async function postDailyVerse({ chapter, verse, title, sanskrit, madhyamaka, quantum }) {
  const embed = {
    title: `📿 Daily Verse: Chapter ${chapter}, Verse ${verse}`,
    description: title || 'Contemplation of the Day',
    color: COLORS.VERSE,
    fields: [
      {
        name: '🪷 Sanskrit',
        value: sanskrit || 'मूलमध्यमककारिका',
        inline: false
      },
      {
        name: '☸️ Madhyamaka Insight',
        value: madhyamaka || 'All phenomena are empty of inherent existence.',
        inline: false
      },
      {
        name: '⚛️ Quantum Parallel',
        value: quantum || 'Like quantum superposition, reality transcends fixed states.',
        inline: false
      }
    ],
    footer: {
      text: 'Nāgārjuna\'s Quantum Reflections • 27-Day Journey',
      icon_url: 'https://storage.googleapis.com/quantum-animations/lotus-icon.png'
    },
    timestamp: new Date().toISOString()
  };

  return sendWebhook(WEBHOOKS.DAILY_VERSE || WEBHOOKS.GENERAL, {
    username: 'Quantum Sangha',
    avatar_url: 'https://storage.googleapis.com/quantum-animations/bot-avatar.png',
    embeds: [embed]
  });
}

/**
 * Announce user achievement
 */
export async function announceAchievement({ username, achievement, description, icon }) {
  const embed = {
    title: `🏆 Achievement Unlocked!`,
    description: `**${username}** has earned a new achievement!`,
    color: COLORS.ACHIEVEMENT,
    fields: [
      {
        name: icon || '⭐',
        value: `**${achievement}**\n${description}`,
        inline: false
      }
    ],
    footer: {
      text: 'Keep exploring the path of emptiness'
    },
    timestamp: new Date().toISOString()
  };

  return sendWebhook(WEBHOOKS.ACHIEVEMENTS || WEBHOOKS.GENERAL, {
    username: 'Achievement Bot',
    embeds: [embed]
  });
}

/**
 * Announce course milestone
 */
export async function announceMilestone({ username, milestone, chapter, details }) {
  const milestoneMessages = {
    'first_chapter': '🌱 has taken their first steps on the path',
    'halfway': '⚖️ has reached the halfway point of their journey',
    'completed': '🪷 has completed the 27-Day Quantum Enlightenment Journey!',
    'quiz_master': '🎓 has passed all chapter quizzes',
    'certificate': '📜 has earned their course certificate'
  };

  const embed = {
    title: `✨ Journey Milestone`,
    description: `**${username}** ${milestoneMessages[milestone] || 'has reached a new milestone'}`,
    color: COLORS.MILESTONE,
    fields: chapter ? [
      {
        name: 'Current Progress',
        value: `Chapter ${chapter} of 27`,
        inline: true
      }
    ] : [],
    footer: {
      text: details || 'The journey continues...'
    },
    timestamp: new Date().toISOString()
  };

  return sendWebhook(WEBHOOKS.ANNOUNCEMENTS || WEBHOOKS.GENERAL, {
    username: 'Journey Tracker',
    embeds: [embed]
  });
}

/**
 * Post community announcement
 */
export async function postAnnouncement({ title, content, fields = [], mentionEveryone = false }) {
  const embed = {
    title: `📢 ${title}`,
    description: content,
    color: COLORS.ANNOUNCEMENT,
    fields,
    timestamp: new Date().toISOString()
  };

  return sendWebhook(WEBHOOKS.ANNOUNCEMENTS || WEBHOOKS.GENERAL, {
    username: 'Quantum Sangha',
    content: mentionEveryone ? '@everyone' : undefined,
    embeds: [embed]
  });
}

/**
 * Schedule daily verse posting (for server-side cron)
 */
export function getDailyVerseSchedule() {
  // Returns verse for current day in 27-day cycle
  const startDate = new Date('2024-01-01'); // Course start date
  const today = new Date();
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const dayInCycle = (daysSinceStart % 27) + 1;

  return {
    chapter: dayInCycle,
    verse: 1, // First verse of each chapter
    dayNumber: dayInCycle
  };
}

/**
 * Verse data for daily posting
 */
export const DAILY_VERSES = {
  1: {
    title: 'Investigation of Conditions',
    sanskrit: 'प्रत्ययपरीक्षा',
    madhyamaka: 'Nothing arises from itself, from another, from both, or without cause.',
    quantum: 'Like virtual particles, phenomena appear without inherent origin.'
  },
  2: {
    title: 'Investigation of Motion',
    sanskrit: 'गतागतपरीक्षा',
    madhyamaka: 'Motion cannot be found in the mover, the moved, or in motion itself.',
    quantum: 'Position and momentum cannot both be precisely known - Heisenberg uncertainty.'
  },
  3: {
    title: 'Investigation of Vision',
    sanskrit: 'चक्षुरादिपरीक्षा',
    madhyamaka: 'Seeing cannot exist without the seen, nor the seen without seeing.',
    quantum: 'The observer and observed are entangled in measurement.'
  },
  // ... continue for all 27 chapters
  27: {
    title: 'Investigation of Views',
    sanskrit: 'दृष्टिपरीक्षा',
    madhyamaka: 'All views are empty; clinging to emptiness itself must be abandoned.',
    quantum: 'The theory describing reality is itself part of reality.'
  }
};

export default {
  postDailyVerse,
  announceAchievement,
  announceMilestone,
  postAnnouncement,
  getDailyVerseSchedule,
  DAILY_VERSES
};
