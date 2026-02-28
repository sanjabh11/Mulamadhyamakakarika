#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

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

function countQAPairsInVerse(verseContent) {
  // Match { q: ... a: ... } patterns
  const qaMatches = verseContent.match(/\{\s*q:/g) || [];
  return qaMatches.length;
}

function hasCompleteQuiz(verseContent) {
  const hasBeginner = verseContent.includes('beginner:');
  const hasIntermediate = verseContent.includes('intermediate:');
  const hasAdvanced = verseContent.includes('advanced:');
  return hasBeginner && hasIntermediate && hasAdvanced;
}

function extractVerseContent(content, verseNum) {
  // Find the start of the verse
  const startRegex = new RegExp(`\\s+${verseNum}:\\s*\\{`);
  const startMatch = content.match(startRegex);
  if (!startMatch) return '';
  
  const startIdx = content.indexOf(startMatch[0]) + startMatch[0].length - 1; // Include the {
  
  // Look for the end: either next verse start or closing of VERSES object
  const nextVerseRegex = new RegExp(`,\\s*\\n\\s+${verseNum + 1}:\\s*\\{`);
  const closingRegex = /\};\s*\n\s*export/;
  
  let endIdx = content.length;
  
  const nextMatch = content.slice(startIdx).match(nextVerseRegex);
  if (nextMatch) {
    endIdx = startIdx + nextMatch.index;
  } else {
    // Look for closing of VERSES object
    const closingMatch = content.slice(startIdx).match(closingRegex);
    if (closingMatch) {
      endIdx = startIdx + closingMatch.index;
    }
  }
  
  return content.slice(startIdx, endIdx);
}

console.log('='.repeat(80));
console.log('DEEP ADVERSARIAL ANALYSIS: Q&A Pair Counts & Quiz Structure');
console.log('='.repeat(80));

let allPass = true;

for (const ch of chapters) {
  const filePath = path.join(__dirname, '..', 'data', 'chapters', ch.file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n📚 Chapter ${ch.num} (${ch.verses} verses):`);
  
  let issues = [];
  let qaMismatchCount = 0;
  let quizIncompleteCount = 0;
  
  for (let v = 1; v <= ch.verses; v++) {
    const verseContent = extractVerseContent(content, v);
    
    if (!verseContent) {
      issues.push(`  ❌ v${v}: Could not extract verse content`);
      allPass = false;
      continue;
    }
    
    // Check Q&A pairs
    const qaCount = countQAPairsInVerse(verseContent);
    if (qaCount !== 6) {
      qaMismatchCount++;
      issues.push(`  ❌ v${v}: ${qaCount} Q&A pairs (expected 6)`);
      allPass = false;
    }
    
    // Check quiz completeness
    if (!hasCompleteQuiz(verseContent)) {
      quizIncompleteCount++;
      const missing = [];
      if (!verseContent.includes('beginner:')) missing.push('beginner');
      if (!verseContent.includes('intermediate:')) missing.push('intermediate');
      if (!verseContent.includes('advanced:')) missing.push('advanced');
      issues.push(`  ❌ v${v}: Missing ${missing.join(', ')} quiz level`);
      allPass = false;
    }
  }
  
  if (issues.length === 0) {
    console.log(`  ✅ All ${ch.verses} verses have 6 Q&A pairs + complete quiz (3 levels)`);
  } else {
    console.log(`  ⚠️  Found ${issues.length} issues:`);
    issues.slice(0, 10).forEach(issue => console.log(issue));
    if (issues.length > 10) console.log(`  ... and ${issues.length - 10} more`);
    console.log(`  Summary: ${qaMismatchCount} verses with wrong Q&A count, ${quizIncompleteCount} with incomplete quizzes`);
  }
}

console.log('\n' + '='.repeat(80));
if (allPass) {
  console.log('✅ ADVERSARIAL VERIFICATION PASSED');
  console.log('   All verses have exactly 6 Q&A pairs and complete 3-level quizzes');
} else {
  console.log('❌ ADVERSARIAL VERIFICATION FAILED');
  console.log('   Some verses are missing required data structure elements');
}
console.log('='.repeat(80));
