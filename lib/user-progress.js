/**
 * User Progress Tracking System
 * CRITICAL for spiritual app engagement and retention
 * 
 * Tracks:
 * - Chapters/verses completed
 * - Reading streaks
 * - Bookmarks/favorites
 * - Session history
 * - Meditation minutes
 */

// Storage key prefix
const STORAGE_PREFIX = 'mmk_';

/**
 * Progress data structure
 */
const DEFAULT_PROGRESS = {
  // Reading progress
  chaptersStarted: [],      // [1, 2, 3]
  chaptersCompleted: [],    // [1, 2]
  versesRead: {},           // { "1.1": true, "1.2": true }
  currentChapter: null,
  currentVerse: null,

  // Engagement metrics
  totalReadingTime: 0,      // minutes
  totalMeditationTime: 0,   // minutes
  sessionsCompleted: 0,

  // Streak tracking
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  streakHistory: [],        // [{ date, minutes }]

  // Bookmarks & favorites
  bookmarkedVerses: [],     // ["1.1", "2.3", "24.18"]
  favoriteChapters: [],     // [1, 24]
  notes: {},                // { "1.1": "My note here" }

  // Achievements
  achievements: [],         // ["first_verse", "first_chapter", "week_streak"]

  // Timestamps
  firstVisit: null,
  lastVisit: null,
  totalVisits: 0
};

/**
 * Get user progress from localStorage
 * @param {string} userId - Optional user ID for logged-in users
 * @returns {object} Progress data
 */
export function getProgress(userId = null) {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };

  const key = userId ? `${STORAGE_PREFIX}progress_${userId}` : `${STORAGE_PREFIX}progress_guest`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    const initial = {
      ...DEFAULT_PROGRESS,
      firstVisit: new Date().toISOString()
    };
    saveProgress(initial, userId);
    return initial;
  }

  try {
    return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Save user progress to localStorage
 * @param {object} progress - Progress data
 * @param {string} userId - Optional user ID
 */
export function saveProgress(progress, userId = null) {
  if (typeof window === 'undefined') return;

  const key = userId ? `${STORAGE_PREFIX}progress_${userId}` : `${STORAGE_PREFIX}progress_guest`;
  progress.lastVisit = new Date().toISOString();

  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

/**
 * Mark a verse as read
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @param {string} userId - Optional user ID
 */
export function markVerseRead(chapter, verse, userId = null) {
  const progress = getProgress(userId);
  const verseKey = `${chapter}.${verse}`;

  // Mark verse as read
  progress.versesRead[verseKey] = true;

  // Update current position
  progress.currentChapter = chapter;
  progress.currentVerse = verse;

  // Add chapter to started if not already
  if (!progress.chaptersStarted.includes(chapter)) {
    progress.chaptersStarted.push(chapter);
    progress.chaptersStarted.sort((a, b) => a - b);
  }

  // Check for achievements
  checkAchievements(progress);

  saveProgress(progress, userId);
  return progress;
}

/**
 * Mark a chapter as completed
 * @param {number} chapter - Chapter number
 * @param {string} userId - Optional user ID
 */
export function markChapterCompleted(chapter, userId = null) {
  const progress = getProgress(userId);

  if (!progress.chaptersCompleted.includes(chapter)) {
    progress.chaptersCompleted.push(chapter);
    progress.chaptersCompleted.sort((a, b) => a - b);
    progress.sessionsCompleted++;
  }

  checkAchievements(progress);
  saveProgress(progress, userId);
  return progress;
}

/**
 * Toggle bookmark on a verse
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @param {string} userId - Optional user ID
 * @returns {boolean} New bookmark state
 */
export function toggleBookmark(chapter, verse, userId = null) {
  const progress = getProgress(userId);
  const verseKey = `${chapter}.${verse}`;

  const index = progress.bookmarkedVerses.indexOf(verseKey);
  if (index === -1) {
    progress.bookmarkedVerses.push(verseKey);
  } else {
    progress.bookmarkedVerses.splice(index, 1);
  }

  saveProgress(progress, userId);
  return index === -1; // Returns true if now bookmarked
}

/**
 * Check if verse is bookmarked
 */
export function isBookmarked(chapter, verse, userId = null) {
  const progress = getProgress(userId);
  return progress.bookmarkedVerses.includes(`${chapter}.${verse}`);
}

/**
 * Add note to a verse
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @param {string} note - Note content
 * @param {string} userId - Optional user ID
 */
export function addNote(chapter, verse, note, userId = null) {
  const progress = getProgress(userId);
  const verseKey = `${chapter}.${verse}`;

  if (note && note.trim()) {
    progress.notes[verseKey] = note.trim();
  } else {
    delete progress.notes[verseKey];
  }

  saveProgress(progress, userId);
  return progress;
}

/**
 * Get note for a verse
 */
export function getNote(chapter, verse, userId = null) {
  const progress = getProgress(userId);
  return progress.notes[`${chapter}.${verse}`] || '';
}

/**
 * Update streak based on activity
 * @param {string} userId - Optional user ID
 */
export function updateStreak(userId = null) {
  const progress = getProgress(userId);
  const today = new Date().toISOString().split('T')[0];

  if (progress.lastActiveDate === today) {
    // Already active today
    return progress;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (progress.lastActiveDate === yesterday) {
    // Consecutive day - increase streak
    progress.currentStreak++;
  } else if (progress.lastActiveDate !== today) {
    // Streak broken - reset to 1
    progress.currentStreak = 1;
  }

  // Update longest streak
  if (progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  progress.lastActiveDate = today;
  progress.totalVisits++;

  // Add to streak history
  progress.streakHistory.push({
    date: today,
    streak: progress.currentStreak
  });

  // Keep only last 90 days
  if (progress.streakHistory.length > 90) {
    progress.streakHistory = progress.streakHistory.slice(-90);
  }

  checkAchievements(progress);
  saveProgress(progress, userId);
  return progress;
}

/**
 * Log meditation/reading time
 * @param {number} minutes - Minutes spent
 * @param {string} type - 'reading' or 'meditation'
 * @param {string} userId - Optional user ID
 */
export function logTime(minutes, type = 'reading', userId = null) {
  const progress = getProgress(userId);

  if (type === 'meditation') {
    progress.totalMeditationTime += minutes;
  } else {
    progress.totalReadingTime += minutes;
  }

  checkAchievements(progress);
  saveProgress(progress, userId);
  return progress;
}

/**
 * Check and award achievements
 */
function checkAchievements(progress) {
  const achievements = [];

  // First verse
  if (Object.keys(progress.versesRead).length >= 1 && !progress.achievements.includes('first_verse')) {
    achievements.push('first_verse');
  }

  // First chapter
  if (progress.chaptersCompleted.length >= 1 && !progress.achievements.includes('first_chapter')) {
    achievements.push('first_chapter');
  }

  // All chapters started
  if (progress.chaptersStarted.length >= 27 && !progress.achievements.includes('explorer')) {
    achievements.push('explorer');
  }

  // 10 verses
  if (Object.keys(progress.versesRead).length >= 10 && !progress.achievements.includes('ten_verses')) {
    achievements.push('ten_verses');
  }

  // 100 verses
  if (Object.keys(progress.versesRead).length >= 100 && !progress.achievements.includes('hundred_verses')) {
    achievements.push('hundred_verses');
  }

  // Week streak
  if (progress.currentStreak >= 7 && !progress.achievements.includes('week_streak')) {
    achievements.push('week_streak');
  }

  // Month streak
  if (progress.currentStreak >= 30 && !progress.achievements.includes('month_streak')) {
    achievements.push('month_streak');
  }

  // First bookmark
  if (progress.bookmarkedVerses.length >= 1 && !progress.achievements.includes('first_bookmark')) {
    achievements.push('first_bookmark');
  }

  // Meditation time achievements
  if (progress.totalMeditationTime >= 60 && !progress.achievements.includes('hour_meditation')) {
    achievements.push('hour_meditation');
  }

  if (progress.totalMeditationTime >= 600 && !progress.achievements.includes('ten_hour_meditation')) {
    achievements.push('ten_hour_meditation');
  }

  // Add new achievements
  if (achievements.length > 0) {
    progress.achievements = [...progress.achievements, ...achievements];

    // Fire webhook asynchronously
    if (typeof window !== 'undefined') {
      achievements.forEach(ach => {
        const details = ACHIEVEMENTS[ach];
        if (details) {
          fetch('/api/webhooks/discord', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'achievement', payload: details })
          }).catch(console.error);
        }
      });
    }
  }

  return achievements;
}

/**
 * Get achievement details
 */
export const ACHIEVEMENTS = {
  first_verse: {
    name: 'First Step',
    description: 'Read your first verse',
    icon: '🌱'
  },
  first_chapter: {
    name: 'Chapter Complete',
    description: 'Complete your first chapter',
    icon: '📖'
  },
  explorer: {
    name: 'Explorer',
    description: 'Start all 27 chapters',
    icon: '🧭'
  },
  ten_verses: {
    name: 'Dedicated Reader',
    description: 'Read 10 verses',
    icon: '📚'
  },
  hundred_verses: {
    name: 'Scholar',
    description: 'Read 100 verses',
    icon: '🎓'
  },
  week_streak: {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥'
  },
  month_streak: {
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '⭐'
  },
  first_bookmark: {
    name: 'Bookmark Keeper',
    description: 'Save your first bookmark',
    icon: '🔖'
  },
  hour_meditation: {
    name: 'Mindful Hour',
    description: 'Accumulate 1 hour of meditation',
    icon: '🧘'
  },
  ten_hour_meditation: {
    name: 'Deep Practice',
    description: 'Accumulate 10 hours of meditation',
    icon: '🕉️'
  }
};

/**
 * Calculate completion percentage
 * @param {number} totalVerses - Total verses in content
 * @param {string} userId - Optional user ID
 */
export function getCompletionPercentage(totalVerses = 450, userId = null) {
  const progress = getProgress(userId);
  const readCount = Object.keys(progress.versesRead).length;
  return Math.round((readCount / totalVerses) * 100);
}

/**
 * Get progress stats summary
 */
export function getProgressStats(userId = null) {
  const progress = getProgress(userId);

  return {
    versesRead: Object.keys(progress.versesRead).length,
    chaptersCompleted: progress.chaptersCompleted.length,
    chaptersStarted: progress.chaptersStarted.length,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    totalReadingTime: progress.totalReadingTime,
    totalMeditationTime: progress.totalMeditationTime,
    bookmarksCount: progress.bookmarkedVerses.length,
    achievementsCount: progress.achievements.length,
    totalVisits: progress.totalVisits,
    completionPercent: getCompletionPercentage(450, userId)
  };
}

/**
 * Merge guest progress with user progress after login
 */
export function mergeGuestProgress(userId) {
  if (typeof window === 'undefined') return;

  const guestProgress = getProgress(null);
  const userProgress = getProgress(userId);

  // Merge versesRead
  userProgress.versesRead = { ...guestProgress.versesRead, ...userProgress.versesRead };

  // Merge arrays (unique values)
  userProgress.chaptersStarted = [...new Set([...guestProgress.chaptersStarted, ...userProgress.chaptersStarted])];
  userProgress.chaptersCompleted = [...new Set([...guestProgress.chaptersCompleted, ...userProgress.chaptersCompleted])];
  userProgress.bookmarkedVerses = [...new Set([...guestProgress.bookmarkedVerses, ...userProgress.bookmarkedVerses])];
  userProgress.achievements = [...new Set([...guestProgress.achievements, ...userProgress.achievements])];

  // Merge notes (user notes take precedence)
  userProgress.notes = { ...guestProgress.notes, ...userProgress.notes };

  // Sum times
  userProgress.totalReadingTime += guestProgress.totalReadingTime;
  userProgress.totalMeditationTime += guestProgress.totalMeditationTime;

  // Keep better streak
  if (guestProgress.currentStreak > userProgress.currentStreak) {
    userProgress.currentStreak = guestProgress.currentStreak;
  }
  if (guestProgress.longestStreak > userProgress.longestStreak) {
    userProgress.longestStreak = guestProgress.longestStreak;
  }

  saveProgress(userProgress, userId);

  // Clear guest progress
  localStorage.removeItem(`${STORAGE_PREFIX}progress_guest`);

  return userProgress;
}

export default {
  getProgress,
  saveProgress,
  markVerseRead,
  markChapterCompleted,
  toggleBookmark,
  isBookmarked,
  addNote,
  getNote,
  updateStreak,
  logTime,
  getProgressStats,
  getCompletionPercentage,
  mergeGuestProgress,
  ACHIEVEMENTS
};
