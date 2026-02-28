/**
 * Header Component
 * 
 * Displays: Chapter title, verse navigation, streak, XP, profile
 * Per specification: Ch1: Conditions [1][2][3]●[5][6][7] 🔥7 ⭐450 XP [👤 Profile]
 */

import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header({ chapter, verse, title, isMobile = false }) {
  const totalVerses = 7; // Chapter 1 has 7 verses (will be configurable per chapter)
  const currentVerse = parseInt(verse);
  
  // Mock user data (will come from context/API)
  const userData = {
    streak: 7,
    xp: 450,
    level: 12
  };

  return (
    <header className={`${styles.header} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.backButton}>
          ←
        </Link>
        <div className={styles.titleSection}>
          <h1 className={styles.chapterTitle}>
            {isMobile ? `Ch${chapter}` : `Chapter ${chapter}`}: {title}
          </h1>
        </div>
      </div>
      
      <nav className={styles.verseNav}>
        {Array.from({ length: totalVerses }, (_, i) => i + 1).map(v => (
          <Link
            key={v}
            href={`/chapters/${chapter}/verse/${v}`}
            className={`${styles.verseButton} ${v === currentVerse ? styles.verseCurrent : ''}`}
          >
            {v}
          </Link>
        ))}
      </nav>
      
      <div className={styles.rightSection}>
        <div className={styles.statBadge} title="Day Streak">
          <span className={styles.statIcon}>🔥</span>
          <span className={styles.statValue}>{userData.streak}</span>
        </div>
        
        <div className={styles.statBadge} title="Experience Points">
          <span className={styles.statIcon}>⭐</span>
          <span className={styles.statValue}>{userData.xp} XP</span>
        </div>
        
        <button className={styles.profileButton} title="Profile">
          👤
        </button>
      </div>
    </header>
  );
}
