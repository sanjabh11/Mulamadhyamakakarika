/**
 * Chapter Index — Single entry point for all 27 canonical chapter data files
 * 
 * Usage:
 *   import { getChapter, getVerse, getAllChapters } from '../data/chapters';
 *   const ch1 = getChapter(1);
 *   const verse = getVerse(1, 3); // Chapter 1, Verse 3
 */

import ch1 from './chapter-1';
import ch2 from './chapter-2';
import ch3 from './chapter-3';
import ch4 from './chapter-4';
import ch5 from './chapter-5';
import ch6 from './chapter-6';
import ch7 from './chapter-7';
import ch8 from './chapter-8';
import ch9 from './chapter-9';
import ch10 from './chapter-10';
import ch11 from './chapter-11';
import ch12 from './chapter-12';
import ch13 from './chapter-13';
import ch14 from './chapter-14';
import ch15 from './chapter-15';
import ch16 from './chapter-16';
import ch17 from './chapter-17';
import ch18 from './chapter-18';
import ch19 from './chapter-19';
import ch20 from './chapter-20';
import ch21 from './chapter-21';
import ch22 from './chapter-22';
import ch23 from './chapter-23';
import ch24 from './chapter-24';
import ch25 from './chapter-25';
import ch26 from './chapter-26';
import ch27 from './chapter-27';

const CHAPTERS = {
  1: ch1, 2: ch2, 3: ch3, 4: ch4, 5: ch5, 6: ch6, 7: ch7,
  8: ch8, 9: ch9, 10: ch10, 11: ch11, 12: ch12, 13: ch13, 14: ch14,
  15: ch15, 16: ch16, 17: ch17, 18: ch18, 19: ch19, 20: ch20, 21: ch21,
  22: ch22, 23: ch23, 24: ch24, 25: ch25, 26: ch26, 27: ch27,
};

export function getChapter(chapterNumber) {
  return CHAPTERS[chapterNumber] || null;
}

export function getVerse(chapterNumber, verseNumber) {
  const ch = CHAPTERS[chapterNumber];
  if (!ch || !ch.VERSES) return null;
  return ch.VERSES[verseNumber] || null;
}

export function getChapterConfig(chapterNumber) {
  const ch = CHAPTERS[chapterNumber];
  return ch ? ch.CHAPTER_CONFIG : null;
}

export function getAllChapters() {
  return Object.values(CHAPTERS).map(ch => ch.CHAPTER_CONFIG);
}

export function getTotalVerseCount() {
  return Object.values(CHAPTERS).reduce((sum, ch) => {
    return sum + Object.keys(ch.VERSES).length;
  }, 0);
}

export default CHAPTERS;
