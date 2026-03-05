#!/usr/bin/env node
/**
 * validate-analytics-contract.js
 *
 * Verifies that the analytics implementation satisfies the required contract:
 * - All required monetization event names are declared in lib/analytics.js
 * - Server analytics emitter exists
 * - Checkout intent API exists
 * - Webhook emits server analytics events
 * - Auth callback emits login_succeeded
 *
 * Exit 0 = contract satisfied. Exit 1 = violations found.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const errors = [];
const passes = [];

function check(label, file, pattern) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
        errors.push(`MISSING FILE: ${file} (required for: ${label})`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const found = pattern instanceof RegExp ? pattern.test(content) : content.includes(pattern);
    if (found) {
        passes.push(`✅ ${label}`);
    } else {
        errors.push(`❌ ${label} — pattern not found in ${file}`);
    }
}

// 1. Event taxonomy completeness
check('upgrade_cta_shown declared', 'lib/analytics.js', 'upgrade_cta_shown');
check('upgrade_cta_clicked declared', 'lib/analytics.js', 'upgrade_cta_clicked');
check('checkout_started declared', 'lib/analytics.js', /checkout_started|CHECKOUT_STARTED/);
check('paywall_hit declared', 'lib/analytics.js', 'paywall_hit');

// 2. Server analytics emitter
check('Server analytics emitter exists', 'lib/server-analytics.js', 'emitServerAnalyticsEvent');
check('Checkout intent API exists', 'pages/api/checkout/intent.js', 'checkout_intent_captured');
check('Persistent map utility exists', 'lib/persistent-map.js', 'PersistentMap');

// 3. Webhook attribution
check('Webhook emits payment_succeeded', 'pages/api/webhooks/whop.js', 'payment_succeeded');
check('Webhook emits subscription_started', 'pages/api/webhooks/whop.js', 'subscription_started');
check('Webhook emits subscription_cancelled', 'pages/api/webhooks/whop.js', 'subscription_cancelled');

// 4. Auth callback telemetry
check('Auth callback emits login_succeeded', 'pages/api/auth/callback.js', 'login_succeeded');

// 5. Paywall funnel instrumentation
check('PaywallGate tracks paywall_hit', 'components/PaywallGate.jsx', 'trackPaywallHit');

// Output results
console.log('\n=== Analytics Contract Validation ===\n');
passes.forEach(p => console.log(p));

if (errors.length > 0) {
    console.log('\n--- VIOLATIONS ---');
    errors.forEach(e => console.error(e));
    console.log(`\n❌ Contract check FAILED (${errors.length} violation${errors.length > 1 ? 's' : ''})`);
    process.exit(1);
} else {
    console.log(`\n✅ Contract check PASSED — all ${passes.length} checks satisfied`);
    process.exit(0);
}
