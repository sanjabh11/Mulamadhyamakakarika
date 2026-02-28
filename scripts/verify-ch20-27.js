#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Check if file is ES module or CommonJS by looking at imports
function checkModuleType(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('export const') || content.includes('export {')) {
    return 'esm';
  }
  return 'cjs';
}

// Parse verse keys from file content
function extractVerseNumbers(content) {
  const verseKeys = [];
  // Match patterns like "1: {" or "  5: {"
  const regex = /^\s*(\d+):\s*\{/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    verseKeys.push(parseInt(match[1]));
  }
  return verseKeys;
}

function extractDeeperDiveCount(content) {
  // Count { q: ..., a: ... } patterns in deeperDive arrays
  const deeperDiveMatches = content.match(/deeperDive:\s*\[/g) || [];
  return deeperDiveMatches.length;
}

function extractQuizCount(content) {
  // Count quiz sections
  const quizMatches = content.match(/quiz:\s*\{/g) || [];
  return quizMatches.length;
}

const chapters = [
  { num: 20, verses: 24, file: 'chapter-20.js' },
  { num: 21, verses: 21, file: 'chapter-21.js' },
  { num: 22, verses: 16, file: 'chapter-22.js' },
  { num: 23, verses: 25, file: 'chapter-23.js' },
  { num: 24, verses: 40, file: 'chapter-24.js' },
  { num: 25, verses: 24, file: 'chapter-25.js' },
  { num: 26, verses: 12, file: 'chapter-26.js' },
  { num: 27, verses: 30, file: 'chapter-27.js' }
];

console.log('='.repeat(70));
console.log('ADVERSARIAL VERIFICATION: Chapters 20-27');
console.log('='.repeat(70));

let allPass = true;

for (const ch of chapters) {
  const filePath = path.join(__dirname, '..', 'data', 'chapters', ch.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ Ch${ch.num}: FILE NOT FOUND: ${ch.file}`);
    allPass = false;
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const verseNumbers = extractVerseNumbers(content);
  const uniqueVerses = [...new Set(verseNumbers)].sort((a,b) => a-b);
  const maxVerse = Math.max(...uniqueVerses);
  const missing = [];
  
  for (let i = 1; i <= ch.verses; i++) {
    if (!uniqueVerses.includes(i)) missing.push(i);
  }
  
  const quizCount = extractQuizCount(content);
  const deeperDiveCount = extractDeeperDiveCount(content);
  
  const verseOk = uniqueVerses.length === ch.verses && missing.length === 0;
  const quizOk = quizCount === ch.verses;
  const deeperDiveOk = deeperDiveCount === ch.verses;
  
  const status = verseOk && quizOk && deeperDiveOk ? '✅' : '❌';
  
  console.log(`\n${status} Ch${ch.num}: ${ch.file}`);
  console.log(`   Verses found: ${uniqueVerses.length}/${ch.verses} ${!verseOk ? '(MISMATCH!)' : ''}`);
  console.log(`   Max verse: ${maxVerse}`);
  console.log(`   Missing: ${missing.length ? missing.join(', ') : 'none'}`);
  console.log(`   Quiz sections: ${quizCount}/${ch.verses} ${!quizOk ? '(MISMATCH!)' : ''}`);
  console.log(`   DeeperDive arrays: ${deeperDiveCount}/${ch.verses} ${!deeperDiveOk ? '(MISMATCH!)' : ''}`);
  
  if (!verseOk || !quizOk || !deeperDiveOk) {
    allPass = false;
  }
}

console.log('\n' + '='.repeat(70));
console.log(allPass ? '✅ ALL CHAPTERS PASS VERIFICATION' : '❌ VERIFICATION FAILED');
console.log('='.repeat(70));
