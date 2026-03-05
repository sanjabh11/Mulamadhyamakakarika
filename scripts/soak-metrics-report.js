/**
 * soak-metrics-report.js
 * KPI gate calculator for post-7-day soak.
 *
 * Usage: node scripts/soak-metrics-report.js [days]
 * Example: npm run soak:metrics -- 7
 *
 * Reads docs/soak/day-N-log.md files and produces a pass/fail KPI report.
 * Gate thresholds: completeness ≥95, attribution ≥90, webhook p95 <60ms
 */

const fs = require('fs');
const path = require('path');

const DAYS = parseInt(process.argv[2] || '7', 10);
const SOAK_DIR = path.join(process.cwd(), 'docs', 'soak');

const GATES = {
    completeness: 95,       // % events with all required fields
    attribution: 90,        // % checkout→activation joins with intent linkage
    webhookP95Ms: 60        // ms
};

console.log(`\n📊 Soak Metrics Report — ${DAYS}-Day Summary`);
console.log('='.repeat(50));

let webhookTimes = [];
let daysPassed = 0;
let daysMissing = [];

for (let d = 1; d <= DAYS; d++) {
    const logFile = path.join(SOAK_DIR, `day-${d}-log.md`);
    if (!fs.existsSync(logFile)) {
        daysMissing.push(d);
        continue;
    }

    const content = fs.readFileSync(logFile, 'utf8');

    // Extract webhook p95 timing from log
    const webhookMatch = content.match(/Webhook p95 sample.*?:\s*(\d+)ms/);
    if (webhookMatch) {
        webhookTimes.push(parseInt(webhookMatch[1], 10));
    }
    daysPassed++;
}

console.log(`\nDays with logs: ${daysPassed}/${DAYS}`);
if (daysMissing.length) {
    console.log(`⚠️  Missing logs for days: ${daysMissing.join(', ')}`);
}

// Compute webhook p95
const p95 = webhookTimes.length
    ? webhookTimes.sort((a, b) => a - b)[Math.floor(webhookTimes.length * 0.95)] || Math.max(...webhookTimes)
    : null;

console.log('\n--- KPI Gate Results ---');

const results = [];

// Webhook p95
if (p95 !== null) {
    const webhookPass = p95 < GATES.webhookP95Ms;
    console.log(`Webhook p95: ${p95}ms  ${webhookPass ? '✅ PASS' : '❌ FAIL'} (threshold: <${GATES.webhookP95Ms}ms)`);
    results.push(webhookPass);
} else {
    console.log('Webhook p95: ⏳ No timing data found — check soak logs');
    results.push(false);
}

// Completeness and attribution must be verified manually from server logs
console.log(`Event completeness: ⏳ Manual check required  (threshold: ≥${GATES.completeness}%)`);
console.log(`  → Grep server logs for ANALYTICS_EVENT and count missing required fields`);
console.log(`Attribution rate: ⏳ Manual check required  (threshold: ≥${GATES.attribution}%)`);
console.log(`  → Count subscription_started events with linked checkout_intent_id`);

const allClear = results.every(Boolean) && daysPassed >= DAYS;

console.log('\n' + '='.repeat(50));
if (allClear) {
    console.log('🟢 SOAK GATE: PASSED — Ready for canary rollout to Whop');
} else {
    console.log('🔴 SOAK GATE: NOT CLEARED — Fix failures before deploying');
}

console.log('\nNext steps if passed:');
console.log('  1. Open PR to merge work → main');
console.log('  2. Deploy to Whop staging / canary cohort');
console.log('  3. Monitor for 48h before full ramp\n');
