/**
 * Daily Verse Cron Job
 * 
 * Posts daily verse to Discord
 * Schedule: 0 8 * * * (8 AM daily)
 * 
 * For Vercel: Add to vercel.json:
 * { "crons": [{ "path": "/api/cron/daily-verse", "schedule": "0 8 * * *" }] }
 */

import { postDailyVerse, getDailyVerseSchedule, DAILY_VERSES } from '../../../lib/discord-webhook';

// Verify cron secret to prevent unauthorized calls
const CRON_SECRET = process.env.CRON_SECRET;

export default async function handler(req, res) {
  // Verify authorization
  const authHeader = req.headers.authorization;
  
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    // Allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    // Get today's verse based on 27-day cycle
    const { chapter, verse, dayNumber } = getDailyVerseSchedule();
    
    // Get verse content
    const verseData = DAILY_VERSES[chapter] || {
      title: `Chapter ${chapter}`,
      sanskrit: 'मूलमध्यमककारिका',
      madhyamaka: 'All phenomena are empty of inherent existence.',
      quantum: 'Like quantum fields, reality emerges from emptiness.'
    };

    // Post to Discord
    const result = await postDailyVerse({
      chapter,
      verse,
      title: verseData.title,
      sanskrit: verseData.sanskrit,
      madhyamaka: verseData.madhyamaka,
      quantum: verseData.quantum
    });

    if (result.success) {
      console.log(`[Cron] Daily verse posted: Chapter ${chapter}`);
      return res.status(200).json({ 
        success: true, 
        chapter, 
        dayNumber,
        message: 'Daily verse posted successfully'
      });
    } else {
      throw new Error(result.error || 'Failed to post verse');
    }
  } catch (error) {
    console.error('[Cron] Daily verse error:', error);
    return res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
}
