
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Emulate iPhone 12 Pro
    await page.emulate(puppeteer.KnownDevices['iPhone 12 Pro']);

    console.log('📱 Starting Mobile Performance Test...');

    // Enable FPS monitoring (approximate via devtools protocol if needed, or simple load time)
    // Here we check load time and console logs for context loss

    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
        if (msg.text().includes('WebGL context lost')) console.error('🔴 WebGL Context Lost detected!');
    });

    const startTime = Date.now();

    try {
        // Navigate to a verse
        await page.goto('http://localhost:3000/verse/1-1', { waitUntil: 'networkidle0' });
        const loadTime = Date.now() - startTime;
        console.log(`⏱️ Load Time: ${loadTime}ms`);

        // Check if Canvas is present
        await page.waitForSelector('canvas', { timeout: 5000 });
        console.log('✅ Canvas found');

        // Interact (simulate scroll/touch)
        await page.mouse.down();
        await page.mouse.move(100, 100);
        await page.mouse.up();
        console.log('✅ Interaction simulated');

        // Wait a bit
        await new Promise(r => setTimeout(r, 2000));

        if (errors.length > 0) {
            console.log('⚠️ Console Errors:', errors);
        } else {
            console.log('✅ No Console Errors');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        await browser.close();
    }
})();
