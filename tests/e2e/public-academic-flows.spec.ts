import { expect, test } from './fixtures';

test.describe('Public academic flows', () => {
  test('reviewer showcase loads with research mode enabled by default', async ({ page }) => {
    await page.goto('/iks-conference');

    await expect(page).toHaveURL(/\/iks-conference$/);
    await expect(page.getByRole('heading', { name: 'Quantum Śūnyatā' })).toBeVisible();
    await expect(page.getByTestId('research-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('research-mode-panel')).toBeVisible();
  });

  test('reviewer showcase research mode toggle updates explicit state', async ({ page }) => {
    await page.goto('/iks-conference');

    const researchModeToggle = page.getByTestId('research-mode-toggle');
    const researchModePanel = page.getByTestId('research-mode-panel');

    await expect(researchModeToggle).toHaveAttribute('aria-pressed', 'true');
    await researchModeToggle.click();
    await expect(researchModeToggle).toHaveAttribute('aria-pressed', 'false');
    await expect(researchModePanel).toBeHidden();
  });

  test('reviewer showcase verse expansion reveals translation content', async ({ page }) => {
    await page.goto('/iks-conference');

    const verseToggle = page.getByTestId('showcase-verse-toggle-1-1');
    await expect(verseToggle).toHaveAttribute('aria-expanded', 'false');

    await verseToggle.click();

    await expect(verseToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('showcase-verse-panel-1-1')).toBeVisible();
    await expect(page.getByText('Not from itself, not from another, not from both')).toBeVisible();
  });

  test('research telemetry loads overview by default', async ({ page }) => {
    await page.goto('/research/data');

    await expect(page).toHaveURL(/\/research\/data$/);
    await expect(page.getByRole('heading', { name: 'Research Telemetry Dashboard' })).toBeVisible();
    await expect(page.getByTestId('telemetry-tab-overview')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('telemetry-overview-panel')).toBeVisible();
  });

  test('research telemetry verses tab exposes selected state and panel', async ({ page }) => {
    await page.goto('/research/data');

    const versesTab = page.getByTestId('telemetry-tab-verses');
    await versesTab.click();

    await expect(versesTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('telemetry-verses-panel')).toBeVisible();
    await expect(page.getByText('Four-Fold Negation')).toBeVisible();
  });

  test('research telemetry animation tab exposes selected state and panel', async ({ page }) => {
    await page.goto('/research/data');

    const animationTab = page.getByTestId('telemetry-tab-animation');
    await animationTab.click();

    await expect(animationTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('telemetry-animation-panel')).toBeVisible();
    await expect(page.getByText('Animated vs Text-Only Verse Engagement Comparison')).toBeVisible();
  });
});
