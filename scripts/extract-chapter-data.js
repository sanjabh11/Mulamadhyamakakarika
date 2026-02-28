#!/usr/bin/env node
/**
 * Extract Chapter Data Script (v2 — robust vm-based approach)
 * 
 * Uses Node's vm module to safely evaluate legacy config.js files,
 * then generates canonical data/chapters/chapter-N.js files.
 * 
 * Safeguard: 5-second timeout per chapter. If stuck, skips and moves on.
 * 
 * Run: node scripts/extract-chapter-data.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'chapters');

const CHAPTER_META = {
  2: { title: 'Examination of Motion', theme: 'motion', anim: 'wave-function', vc: 25 },
  3: { title: 'Examination of Perception', theme: 'perception', anim: 'observer-effect', vc: 9 },
  4: { title: 'Examination of Aggregates', theme: 'aggregates', anim: 'superposition', vc: 9 },
  5: { title: 'Examination of Elements', theme: 'elements', anim: 'entanglement', vc: 8 },
  6: { title: 'Examination of Desire and the Desirous', theme: 'desire', anim: 'decoherence', vc: 10 },
  7: { title: 'Examination of Arising, Abiding, and Ceasing', theme: 'arising', anim: 'fluctuations', vc: 35 },
  8: { title: 'Examination of Agent and Action', theme: 'agent-action', anim: 'complementarity', vc: 13 },
  9: { title: 'Examination of the Prior Entity', theme: 'prior-entity', anim: 'superposition', vc: 12 },
  10: { title: 'Examination of Fire and Fuel', theme: 'fire-fuel', anim: 'entanglement', vc: 16 },
  11: { title: 'Examination of Prior and Posterior Limits', theme: 'prior-limits', anim: 'non-locality', vc: 8 },
  12: { title: 'Examination of Suffering', theme: 'suffering', anim: 'dependent-origination', vc: 10 },
  13: { title: 'Examination of Compounded Phenomena', theme: 'compounded', anim: 'emptiness', vc: 8 },
  14: { title: 'Examination of Association', theme: 'association', anim: 'entanglement', vc: 8 },
  15: { title: 'Examination of Essence', theme: 'essence', anim: 'emptiness', vc: 11 },
  16: { title: 'Examination of Bondage and Liberation', theme: 'bondage', anim: 'decoherence', vc: 10 },
  17: { title: 'Examination of Action and Fruit', theme: 'action-fruit', anim: 'dependent-origination', vc: 33 },
  18: { title: 'Examination of Self and Phenomena', theme: 'self', anim: 'emptiness', vc: 12 },
  19: { title: 'Examination of Time', theme: 'time', anim: 'wave-function', vc: 6 },
  20: { title: 'Examination of Cause and Effect', theme: 'cause-effect', anim: 'fluctuations', vc: 24 },
  21: { title: 'Examination of Becoming and Destruction', theme: 'becoming', anim: 'superposition', vc: 21 },
  22: { title: 'Examination of the Tathagata', theme: 'tathagata', anim: 'emptiness', vc: 16 },
  23: { title: 'Examination of Error', theme: 'error', anim: 'decoherence', vc: 25 },
  24: { title: 'Examination of the Noble Truths', theme: 'noble-truths', anim: 'dependent-origination', vc: 40 },
  25: { title: 'Examination of Nirvana', theme: 'nirvana', anim: 'emptiness', vc: 24 },
  26: { title: 'Examination of the Twelve Links', theme: 'twelve-links', anim: 'dependent-origination', vc: 12 },
  27: { title: 'Examination of Views', theme: 'views', anim: 'complementarity', vc: 30 },
};

// Directory mappings
const DIRS = {
  2: ['Ch2 (1:2)', 'Ch2 (2:2)'],
  3: ['Ch3'], 4: ['Ch4'], 5: ['Ch5'], 6: ['Ch6'],
  7: ['Ch7 (1:3)', 'Ch7 (2:3)', 'Ch7 (3:3)'],
  8: ['Ch8'], 9: ['Ch9'],
  10: ['Ch10 (1:2)', 'Ch10 (2:2)'],
  11: ['Ch11'], 12: ['Ch12'], 13: ['Ch13'], 14: ['Ch14'],
  15: ['Ch15'], 16: ['Ch16'],
  17: ['Ch17 (1:3)', 'Ch17 (2:3)', 'Ch17 (3:3)'],
  18: ['Ch18'], 19: ['Ch19'],
  20: ['Ch20 (1:2)', 'Ch20 (2:2)'],
  21: ['Ch21 (1:2)', 'Ch21 (2:2)'],
  22: ['Ch22'],
  23: ['Ch23 (1:2)', 'Ch23 (2:2)'],
  24: ['Ch24 (1:3)', 'Ch24 (2:3)', 'Ch24 (3:3)'],
  25: ['Ch25 (1:2)', 'Ch25 (2:2)'],
  26: ['Ch26'],
  27: ['Ch27 (1:3)', 'Ch27 (2:3)', 'Ch27 (3:3)'],
};

/**
 * Safely evaluate a JS file and extract verse data using vm sandbox.
 * Returns array of raw verse objects. Timeout: 3 seconds.
 */
function extractVersesFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  let src = fs.readFileSync(filePath, 'utf-8');

  // Strip ES module syntax so it runs in CommonJS vm
  src = src.replace(/export\s+default\s+/g, '');
  src = src.replace(/export\s+const\s+/g, 'const ');
  src = src.replace(/export\s+function\s+/g, 'function ');
  src = src.replace(/import\s+.*?from\s+['"].*?['"]\s*;?/g, '');
  // Strip DOM APIs that would crash in vm
  src = src.replace(/document\.\w+/g, 'undefined');
  src = src.replace(/window\.\w+/g, 'undefined');
  src = src.replace(/new\s+THREE\.\w+/g, 'undefined');

  // Append collector that checks ALL known field/variable name patterns
  const collector = `;
var _result = [];
(function() {
  var _c = [];
  function _tp(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    if (typeof arr[0] !== 'object' || arr[0] === null) return;
    var f = arr[0];
    if (f.text || f.originalVerse || f.verseText || f.madhyamaka || f.madhyamakaConcept || f.concept || f.physics || f.quantumParallel || f.quantumPhysics || f.qaContent || f.qaSet) {
      for (var i = 0; i < arr.length; i++) _c.push(arr[i]);
    }
  }
  function _tpObj(obj) {
    if (!obj || typeof obj !== 'object') return;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      var v = obj[keys[i]];
      if (v && typeof v === 'object' && (v.text || v.madhyamaka || v.quantum || v.verseText)) {
        v._key = keys[i];
        _c.push(v);
      }
    }
  }
  try { if (typeof verses !== 'undefined') { if (Array.isArray(verses)) _tp(verses); else _tpObj(verses); } } catch(e){}
  try { if (typeof verseData !== 'undefined') _tp(verseData); } catch(e){}
  try { if (typeof config !== 'undefined' && config && config.verses) { if (Array.isArray(config.verses)) _tp(config.verses); else _tpObj(config.verses); } } catch(e){}
  try { if (typeof qaData !== 'undefined' && typeof qaData === 'object') { _qaGlobal = qaData; } } catch(e){}
  _result = _c;
})();
`;
  src += collector;

  const sandbox = { _result: [], _qaGlobal: null, module: { exports: {} }, console: { log(){}, warn(){}, error(){} }, setTimeout: function(){}, setInterval: function(){}, requestAnimationFrame: function(){} };
  try {
    vm.runInNewContext(src, sandbox, { timeout: 3000, filename: filePath });
  } catch (err) {
    console.warn(`  VM error in ${path.basename(filePath)}: ${err.message.substring(0, 120)}`);
    return [];
  }
  return { verses: sandbox._result || [], qaData: sandbox._qaGlobal };
}

/**
 * Normalize a raw verse object (from any of the 4 legacy formats) into canonical shape
 */
function norm(raw, fallbackNum) {
  const v = {};
  // Extract verse number — handle "Verse 1", numeric, or _key formats
  let rawNum = raw.number || raw.verseNumber || raw.id || fallbackNum;
  if (typeof rawNum === 'string') {
    const parsed = parseInt(rawNum.replace(/\D/g, ''));
    rawNum = isNaN(parsed) ? fallbackNum : parsed;
  }
  v.number = rawNum;
  // Extract number from _key like "1" from object-style verses
  if (!v.number && raw._key) {
    const n = parseInt(raw._key);
    if (!isNaN(n)) v.number = n;
  }
  v.title = raw.title || `Verse ${v.number}`;
  v.translation = (raw.text || raw.originalVerse || raw.verseText || '').replace(/<br\s*\/?>/gi, '\n').replace(/\s+/g, ' ').trim();
  v.madhyamaka = raw.madhyamaka || raw.madhyamakaConcept || raw.concept || '';
  v.quantum = raw.quantum || raw.quantumParallel || raw.quantumPhysics || raw.physics || raw.quantumConcept || '';
  v.accessible = raw.accessible || raw.accessibleExplanation || raw.explanation || '';
  v.instructions = raw.instructions || '';
  v.animationType = raw.animationType || '';

  // Q&A normalization — handle all variant field names and formats
  v.deeperDive = [];
  const qaSource = raw.questions || raw.qa || raw.qaContent || raw.qaSet || [];
  for (const item of qaSource) {
    if (!item) continue;
    const q = item.question || item.q || '';
    const a = item.answer || item.a || '';
    if (q && a) {
      v.deeperDive.push({ q, a });
    }
  }
  return v;
}

/**
 * Escape single quotes and newlines for JS string output
 */
function esc(s) {
  if (!s) return '';
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '');
}

/**
 * Generate the canonical chapter-N.js file content
 */
function generate(chNum, verses) {
  const m = CHAPTER_META[chNum];
  let o = `/**\n * Chapter ${chNum}: ${m.title}\n * CANONICAL DATA SOURCE\n */\n\n`;
  o += `export const CHAPTER_CONFIG = {\n`;
  o += `  id: 'ch${chNum}', number: ${chNum},\n`;
  o += `  title: '${esc(m.title)}',\n`;
  o += `  theme: '${m.theme}', verseCount: ${m.vc},\n`;
  o += `  primaryAnimation: '${m.anim}',\n`;
  o += `};\n\nexport const VERSES = {\n`;

  for (const v of verses) {
    o += `  ${v.number}: {\n`;
    o += `    id: 'v${chNum}_${v.number}', number: ${v.number},\n`;
    o += `    title: '${esc(v.title)}',\n`;
    o += `    sanskrit: { text: '', transliteration: '', translation: '${esc(v.translation)}' },\n`;
    o += `    philosophy: {\n`;
    o += `      madhyamaka: '${esc(v.madhyamaka)}',\n`;
    o += `      quantum: '${esc(v.quantum)}',\n`;
    o += `      accessible: '${esc(v.accessible)}',\n`;
    o += `    },\n`;
    o += `    animation: { quantumConcept: '${m.anim}', type: 'concept-based' },\n`;
    o += `    deeperDive: [\n`;
    for (const qa of v.deeperDive) {
      o += `      { q: '${esc(qa.q)}', a: '${esc(qa.a)}' },\n`;
    }
    o += `    ],\n`;
    o += `  },\n`;
  }

  o += `};\n\n`;
  o += `export function getVerse(n) { return VERSES[n] || null; }\n`;
  o += `export function getAllVerses() { return Object.values(VERSES); }\n`;
  o += `export default { CHAPTER_CONFIG, VERSES };\n`;
  return o;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  let totalV = 0, totalQ = 0;
  const rows = [];

  // Alternate file sources for chapters whose config.js has only animation params
  const ALT_FILES = {
    18: [{ dir: 'Ch18', file: 'qaData.js' }],
    19: [{ dir: 'Ch19', file: 'app.js' }],
    25: [{ dir: 'Ch25 (1:2)', file: 'script.js' }, { dir: 'Ch25 (2:2)', file: 'script.js' }],
  };

  // Ch19 is manually maintained (DOM-heavy app.js can't be vm-evaluated)
  const SKIP = new Set([19]);

  for (let ch = 2; ch <= 27; ch++) {
    if (SKIP.has(ch)) { console.log(`Ch${ch}: manually maintained, skip`); continue; }
    const dirs = DIRS[ch];
    if (!dirs) { console.log(`Ch${ch}: no dirs mapped, skip`); continue; }

    console.log(`Ch${ch} — ${CHAPTER_META[ch].title}`);
    let allRaw = [];
    let externalQaData = null;

    for (const dir of dirs) {
      const fp = path.join(PUBLIC_DIR, dir, 'config.js');
      console.log(`  -> ${dir}/config.js`);
      const result = extractVersesFromFile(fp);
      if (result && result.verses) {
        console.log(`     ${result.verses.length} verse objects`);
        allRaw = allRaw.concat(result.verses);
        if (result.qaData) externalQaData = result.qaData;
      }
    }

    // Try alternate files if config.js yielded nothing
    if (allRaw.length === 0) {
      const altSources = ALT_FILES[ch] || [];
      for (const alt of altSources) {
        const fp = path.join(PUBLIC_DIR, alt.dir, alt.file);
        console.log(`  -> ${alt.dir}/${alt.file} (fallback)`);
        const result = extractVersesFromFile(fp);
        if (result && result.verses) {
          console.log(`     ${result.verses.length} verse objects`);
          allRaw = allRaw.concat(result.verses);
          if (result.qaData) externalQaData = result.qaData;
        }
      }
    }

    if (allRaw.length === 0 && !externalQaData) {
      console.log(`  ⚠ No data extracted — writing placeholder`);
      const placeholder = [];
      for (let i = 1; i <= CHAPTER_META[ch].vc; i++) {
        placeholder.push({ number: i, title: `Verse ${i}`, translation: '', madhyamaka: '', quantum: '', accessible: '', deeperDive: [] });
      }
      const content = generate(ch, placeholder);
      fs.writeFileSync(path.join(OUTPUT_DIR, `chapter-${ch}.js`), content);
      rows.push({ ch, v: 0, q: 0, status: 'placeholder' });
      continue;
    }

    // If we only have qaData (Ch18 case), build verse shells from it
    if (allRaw.length === 0 && externalQaData) {
      const keys = Object.keys(externalQaData).sort((a, b) => {
        const na = parseInt(a.replace(/\D/g, '')); const nb = parseInt(b.replace(/\D/g, ''));
        return na - nb;
      });
      for (let i = 0; i < keys.length; i++) {
        const qa = externalQaData[keys[i]];
        allRaw.push({ number: i + 1, questions: qa });
      }
    }

    // Normalize
    const verses = allRaw.map((r, i) => norm(r, i + 1));
    verses.sort((a, b) => a.number - b.number);

    const qc = verses.reduce((s, v) => s + v.deeperDive.length, 0);
    totalV += verses.length;
    totalQ += qc;

    const content = generate(ch, verses);
    const outPath = path.join(OUTPUT_DIR, `chapter-${ch}.js`);
    fs.writeFileSync(outPath, content);

    rows.push({ ch, v: verses.length, q: qc, status: verses.length === CHAPTER_META[ch].vc ? 'ok' : `got ${verses.length}, exp ${CHAPTER_META[ch].vc}` });
    console.log(`  ✓ chapter-${ch}.js — ${verses.length} verses, ${qc} Q&A`);
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${totalV} verses, ${totalQ} Q&A across ${rows.length} chapters`);
  console.log(`${'='.repeat(50)}`);
  console.log('Ch | Verses | Q&A | Status');
  for (const r of rows) {
    console.log(`${String(r.ch).padStart(2)} | ${String(r.v).padStart(6)} | ${String(r.q).padStart(3)} | ${r.status}`);
  }
}

main();
