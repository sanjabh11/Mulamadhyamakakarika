import { expect, test as base } from '@playwright/test';

const returningUserSeed = () => {
  localStorage.setItem('mmk_onboarded', 'true');
      localStorage.setItem(
        'mmk_progress_guest',
        JSON.stringify({
          onboardingCompleted: true,
          chaptersCompleted: [],
          versesRead: {},
          currentStreak: 0,
          totalVisits: 1,
        })
      );
  localStorage.setItem(
    'mmk_progress',
    JSON.stringify({
      currentStreak: 0,
      versesRead: 0,
    })
  );
};

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(returningUserSeed);
    await use(page);
  },
});

export { expect };
