#!/usr/bin/env node
/**
 * Validation Script: VerseData Completeness & Philosophy Field Audit
 * 
 * Checks all 27 chapters for:
 * - Critical fields required by VerseAnimationEngine
 * - Philosophy field coverage for educational accuracy
 * - Animation configuration completeness
 * 
 * Exit code: 0 if all checks pass, 1 if critical errors found
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
};

let totalErrors = 0;
let totalWarnings = 0;
let totalStubs = 0;
let totalGold = 0;

console.log(`${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.bold}VerseData Completeness Validation${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

// Check all chapter data files
for (let ch = 1; ch <= 27; ch++) {
    const chapterPath = `./data/chapters/chapter-${ch}.js`;

    if (!fs.existsSync(chapterPath)) {
        console.error(`${colors.red}❌ MISSING:${colors.reset} ${chapterPath}`);
        totalErrors++;
        continue;
    }

    try {
        // Clear require cache to get fresh data
        delete require.cache[require.resolve(path.resolve(chapterPath))];

        const chapterModule = require(path.resolve(chapterPath));
        const { VERSES, verses, getVerse, getAllVerses } = chapterModule;

        // Try multiple export formats (different chapters use different patterns)
        let verseArray = [];
        if (getAllVerses && typeof getAllVerses === 'function') {
            verseArray = getAllVerses();
        } else if (verses && Array.isArray(verses)) {
            verseArray = verses;
        } else if (VERSES && typeof VERSES === 'object') {
            verseArray = Object.values(VERSES);
        } else if (Array.isArray(chapterModule.default)) {
            verseArray = chapterModule.default;
        }

        if (verseArray.length === 0) {
            console.error(`${colors.red}❌ Ch${ch}:${colors.reset} No verses exported (check export format)`);
            totalErrors++;
            continue;
        }

        let chapterErrors = 0;
        let chapterWarnings = 0;
        let chapterStubs = 0;
        let chapterGold = 0;

        // Philosophy field coverage tracking
        const philCoverage = {
            insight: 0,
            madhyamaka: 0,
            quantum: 0,
            bridge: 0,
            accessible: 0,
            twoTruths: 0,
            commonMisconception: 0,
        };

        verseArray.forEach((v, idx) => {
            const id = v.id || `Ch${ch}:V${idx + 1}`;

            // ===== CRITICAL FIELDS (cause fallback to QuantumScene if missing) =====

            // 1. Philosophy object (required by EducationalOverlay)
            if (!v.philosophy || typeof v.philosophy !== 'object') {
                console.error(`  ${colors.red}❌ ${id}:${colors.reset} Missing/invalid philosophy object`);
                chapterErrors++;
            } else {
                // Track philosophy field coverage
                Object.keys(philCoverage).forEach(field => {
                    if (v.philosophy[field] && v.philosophy[field].length > 10) {
                        philCoverage[field]++;
                    }
                });
            }

            // 2. Animation object (required by VerseAnimationEngine)
            if (!v.animation || typeof v.animation !== 'object') {
                console.error(`  ${colors.red}❌ ${id}:${colors.reset} Missing/invalid animation object`);
                chapterErrors++;
            } else {
                // Check for stub vs gold animation
                const anim = v.animation;

                if (anim.type === 'concept-based' && !anim.geometry) {
                    console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} STUB animation (concept-based, no geometry)`);
                    chapterStubs++;
                } else if (
                    anim.geometry &&
                    anim.orchestration &&
                    anim.colors?.length >= 3 &&
                    anim.r3fTechniques?.length >= 3
                ) {
                    chapterGold++;
                }

                // Check critical animation fields
                if (!anim.geometry) {
                    console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} Missing animation.geometry`);
                    chapterWarnings++;
                }

                if (!anim.orchestration?.reveal) {
                    console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} Missing animation.orchestration.reveal`);
                    chapterWarnings++;
                }

                if (!anim.visualBridge || anim.visualBridge.length < 20) {
                    console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} Missing/short visualBridge (${anim.visualBridge?.length || 0} chars)`);
                    chapterWarnings++;
                }

                if (!anim.educationalGoal || anim.educationalGoal.length < 20) {
                    console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} Missing/short educationalGoal (${anim.educationalGoal?.length || 0} chars)`);
                    chapterWarnings++;
                }

                if (!anim.colors || anim.colors.length < 3) {
                    console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} <3 animation colors (${anim.colors?.length || 0})`);
                    chapterWarnings++;
                }

                if (!anim.r3fTechniques || anim.r3fTechniques.length < 3) {
                    console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} <3 r3fTechniques (${anim.r3fTechniques?.length || 0})`);
                    chapterWarnings++;
                }
            }

            // 3. QuantumResonance (used for concept mapping)
            if (!v.quantumResonance?.concept) {
                console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} Missing quantumResonance.concept`);
                chapterWarnings++;
            }

            // 4. Sanskrit (for verse display)
            if (!v.sanskrit?.text && !v.sanskrit?.translation) {
                console.warn(`  ${colors.yellow}⚠️  ${id}:${colors.reset} Missing sanskrit text/translation`);
                chapterWarnings++;
            }
        });

        // Chapter summary
        if (chapterErrors === 0 && chapterWarnings === 0) {
            console.log(`${colors.green}✅ Ch${ch}:${colors.reset} ${verseArray.length} verses validated - ALL FIELDS COMPLETE`);
        } else if (chapterErrors === 0) {
            console.log(`${colors.green}✅ Ch${ch}:${colors.reset} ${verseArray.length} verses - ${chapterWarnings} warnings`);
        } else {
            console.log(`${colors.red}❌ Ch${ch}:${colors.reset} ${verseArray.length} verses - ${chapterErrors} errors, ${chapterWarnings} warnings`);
        }

        // Philosophy coverage report
        const avgCoverage = Object.values(philCoverage).reduce((a, b) => a + b, 0) / Object.keys(philCoverage).length;
        const coveragePct = ((avgCoverage / verseArray.length) * 100).toFixed(0);
        const coverageColor = coveragePct >= 80 ? colors.green : coveragePct >= 50 ? colors.yellow : colors.red;

        console.log(`  ${coverageColor}📊 Philosophy coverage: ${coveragePct}%${colors.reset}`);
        Object.entries(philCoverage).forEach(([key, count]) => {
            const pct = ((count / verseArray.length) * 100).toFixed(0);
            const fieldColor = pct >= 80 ? colors.green : pct >= 50 ? colors.yellow : colors.red;
            if (pct < 70) {
                console.log(`     ${fieldColor}${key}: ${count}/${verseArray.length} (${pct}%)${colors.reset}`);
            }
        });

        // Animation quality report
        if (chapterStubs > 0) {
            console.log(`  ${colors.yellow}🎬 Animations: ${chapterGold} gold, ${chapterStubs} stubs${colors.reset}`);
        } else if (chapterGold > 0) {
            console.log(`  ${colors.green}🎬 Animations: ${chapterGold} gold standard${colors.reset}`);
        }

        console.log(''); // Blank line between chapters

        totalErrors += chapterErrors;
        totalWarnings += chapterWarnings;
        totalStubs += chapterStubs;
        totalGold += chapterGold;

    } catch (err) {
        console.error(`${colors.red}❌ Ch${ch}:${colors.reset} Import error - ${err.message}`);
        console.error(`   ${err.stack}`);
        totalErrors++;
    }
}

// Final summary
console.log(`${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.bold}FINAL VALIDATION SUMMARY${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

const errorColor = totalErrors > 0 ? colors.red : colors.green;
const warnColor = totalWarnings > 10 ? colors.yellow : colors.green;

console.log(`${errorColor}CRITICAL ERRORS: ${totalErrors}${colors.reset}`);
console.log(`${warnColor}WARNINGS: ${totalWarnings}${colors.reset}`);
console.log(`${colors.green}GOLD ANIMATIONS: ${totalGold}${colors.reset}`);
console.log(`${colors.yellow}STUB ANIMATIONS: ${totalStubs}${colors.reset}`);

console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);

if (totalErrors > 0) {
    console.log(`${colors.red}${colors.bold}❌ VALIDATION FAILED${colors.reset}`);
    console.log(`${colors.red}Fix critical errors before proceeding to manual QA${colors.reset}\n`);
    process.exit(1);
} else {
    console.log(`${colors.green}${colors.bold}✅ VALIDATION PASSED${colors.reset}`);
    console.log(`${colors.green}Ready for manual QA phase${colors.reset}\n`);
    process.exit(0);
}
