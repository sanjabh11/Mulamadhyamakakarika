import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [expandedChapters, setExpandedChapters] = useState({});
  
  // Total number of chapters (27 as mentioned by the user)
  const totalChapters = 27;
  
  // Average verses per chapter (10 as mentioned by the user)
  const avgVerses = 10;
  
  // Special case for Chapter 1 which has 14 verses, Chapter 2 which has 25 verses, Chapter 3 which has 9 verses, Chapter 4 which has 9 verses, Chapter 5 which has 8 verses, Chapter 6 which has 10 verses, Chapter 7 which has 12 verses, Chapter 8 which has 13 verses, Chapter 9 which has 12 verses, Chapter 10 Part 1 which has 8 verses, Chapter 10 Part 2 which has 8 verses, Chapter 11 which has 8 verses, Chapter 12 which has 10 verses, Chapter 13 which has 8 verses, Chapter 14 which has 8 verses, Chapter 15 which has 11 verses, Chapter 16 which has 10 verses, Chapter 17 which has 33 verses, Chapter 18 which has 12 verses, Chapter 19 which has 6 verses, Chapter 20 which has 24 verses, Chapter 21 which has 21 verses, Chapter 22 which has 16 verses, Chapter 23 which has 24 verses, Chapter 24 which has 40 verses, Chapter 26 which has 12 verses, and Chapter 27 which has 30 verses
  const chapterVerses = {
    1: 14,
    2: 25,
    3: 9,
    4: 9,
    5: 8,
    6: 10,
    7: 12,
    8: 13,
    9: 12,
    10: 16, // Combined verses from Part 1 (8) and Part 2 (8)
    11: 8,
    12: 10,
    13: 8,
    14: 8,
    15: 11,
    16: 10,
    17: 33,
    18: 12,
    19: 6,
    20: 24,
    21: 21,
    22: 16,
    23: 24,
    24: 40,
    25: 24, // Added Chapter 25 verse count
    26: 12,
    27: 30
  };
  
  // Toggle chapter expansion
  const toggleChapter = (chapter) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapter]: !prev[chapter]
    }));
  };
  
  // Create an array of chapters
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  // Get the number of verses for a given chapter
  const getVerseCount = (chapter) => {
    return chapterVerses[chapter] || avgVerses;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nāgārjuna's Quantum Reflections</title>
        <meta name="description" content="Exploring Madhyamaka philosophy and quantum physics through 3D animations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Nāgārjuna's Quantum Reflections
        </h1>
        
        <p className={styles.description}>
          Exploring the parallels between Madhyamaka philosophy and quantum physics through 3D animations
        </p>

        <div className={styles.grid}>
          {/* Featured verses */}
          <div className={styles.featuredContainer}>
            <Link href="/chapter-1" className={styles.featuredCard}>
              <h2>Chapter 1 - Examination of Conditions</h2>
              <p>Explore Nāgārjuna's analysis of causality and dependent origination, with quantum parallels like entanglement and wave function collapse</p>
            </Link>
            
            <Link href="/chapter-2" className={styles.featuredCard}>
              <h2>Chapter 2 - Examination of Motion</h2>
              <p>Explore Nāgārjuna's critique of motion and its parallels with quantum mechanics concepts like superposition, wave function, and measurement</p>
            </Link>
            
            <Link href="/chapter-3" className={styles.featuredCard}>
              <h2>Chapter 3 - Examination of the Senses</h2>
              <p>Explore Nāgārjuna's analysis of sense perception and how it relates to quantum concepts like observer effect and complementarity</p>
            </Link>
            
            <Link href="/chapter-4" className={styles.featuredCard}>
              <h2>Chapter 4 - Emptiness and Quantum Physics</h2>
              <p>Explore the profound relationship between form and its causes, and how quantum physics similarly challenges our understanding of objects</p>
            </Link>
            
            <Link href="/chapter-5" className={styles.featuredCard}>
              <h2>Chapter 5 - Examination of Elements</h2>
              <p>Explore Nāgārjuna's analysis of the fundamental elements and their parallels with quantum field theory and particle physics</p>
            </Link>
            
            <Link href="/chapter-6" className={styles.featuredCard}>
              <h2>Chapter 6 - Investigation of Desire and the Desirous One</h2>
              <p>Examine the relationship between desire and the desirous one, and how quantum entanglement mirrors their mutual dependence</p>
            </Link>
            
            <Link href="/chapter-7" className={styles.featuredCard}>
              <h2>Chapter 7 - Investigation of Birth, Abiding and Perishing</h2>
              <p>Examine how birth, abiding, and perishing cannot be established as either compounded or uncompounded, with quantum parallels like wave function collapse</p>
            </Link>
            
            <Link href="/chapter-8" className={styles.featuredCard}>
              <h2>Chapter 8 - Investigation of Act and Actor</h2>
              <p>Explore Nāgārjuna's analysis of the agent and the action, showing how neither can be established as inherently existent, with quantum parallels like observer effect and complementarity</p>
            </Link>

            <Link href="/chapter-9" className={styles.featuredCard}>
              <h2>Chapter 9 - Investigation of the Presence of Something Prior</h2>
              <p>Examine whether a self exists prior to experiences, revealing mutual dependence between perceiver and perceived, with quantum parallels like wave function collapse</p>
            </Link>
            
            <Link href="/chapter-10" className={styles.featuredCard}>
              <h2>Chapter 10 - Investigation of Fire and Firewood</h2>
              <p>Explore the relationship between fire and firewood, with quantum parallels like entanglement, contextuality, uncertainty, and quantum field theory</p>
            </Link>
            
            <Link href="/chapter-11" className={styles.featuredCard}>
              <h2>Chapter 11 - Investigation of Extremes of Before and After</h2>
              <p>Explore Nāgārjuna's analysis of temporal extremes, showing how samsara has no beginning or end, with quantum parallels like vacuum fluctuations and contextuality</p>
            </Link>
            
            <Link href="/chapter-12" className={styles.featuredCard}>
              <h2>Chapter 12 - Investigation of Anguish</h2>
              <p>Explore Nāgārjuna's analysis of suffering's origin, refuting four possible views of causation, with quantum parallels like wave-particle duality and entanglement</p>
            </Link>
            
            <Link href="/chapter-13" className={styles.featuredCard}>
              <h2>Chapter 13 - Investigation of Samskaras</h2>
              <p>Explore Nāgārjuna's analysis of conditioned phenomena, showing how all samskaras are deceptive and ultimately empty, with quantum parallels like wave function collapse and entanglement</p>
            </Link>
            
            <Link href="/chapter-14" className={styles.featuredCard}>
              <h2>Chapter 14 - Investigation of Connection</h2>
              <p>Explore Nāgārjuna's analysis of connection and relation, showing how the seer, seeing, and seen lack inherent connections, with quantum parallels like entanglement and contextuality</p>
            </Link>
            
            <Link href="/chapter-15" className={styles.featuredCard}>
              <h2>Chapter 15 - Investigation of Essence</h2>
              <p>Explore Nāgārjuna's analysis of essence (svabhāva), showing how it cannot arise from causes and conditions, with quantum parallels like wave function collapse and superposition</p>
            </Link>
            
            <Link href="/chapter-16" className={styles.featuredCard}>
              <h2>Chapter 16 - Investigation of Bondage and Freedom</h2>
              <p>Explore Nāgārjuna's analysis of bondage and freedom in samsara, showing how neither can be established as inherently existent, with quantum parallels like superposition and entanglement</p>
            </Link>
            
            <Link href="/chapter-17" className={styles.featuredCard}>
              <h2>Chapter 17 - Investigation of Birth, Abiding and Perishing</h2>
              <p>Explore Nāgārjuna's analysis of birth, abiding, and perishing, showing how these characteristics cannot be established as either compounded or uncompounded, with quantum parallels like wave function collapse and superposition</p>
            </Link>
            
            <Link href="/chapter-18" className={styles.featuredCard}>
              <h2>Chapter 18 - Investigation of Self and Phenomena</h2>
              <p>Explore Nāgārjuna's analysis of self and phenomena, demonstrating that neither can be established as inherently existent, with quantum parallels like superposition and entanglement</p>
            </Link>
            
            <Link href="/chapter-19" className={styles.featuredCard}>
              <h2>Chapter 19 - Investigation of Time</h2>
              <p>Explore Nāgārjuna's analysis of time, showing how past, present, and future cannot be established as inherently existent, with quantum parallels like relational time and non-locality</p>
            </Link>
            
            <Link href="/chapter-20" className={styles.featuredCard}>
              <h2>Chapter 20 - Investigation of Aggregation</h2>
              <p>Explore Nāgārjuna's analysis of aggregations and collections, showing that wholes cannot be established as inherently existent apart from their parts, with quantum parallels like entanglement and field theory</p>
            </Link>
            
            <Link href="/chapter-21" className={styles.featuredCard}>
              <h2>Chapter 21 - Investigation of Arising and Dissolution</h2>
              <p>Explore Nāgārjuna's analysis of arising and dissolution, showing that neither can be established as inherently existent, with quantum parallels like wave function collapse and vacuum fluctuations</p>
            </Link>
            
            <Link href="/chapter-22" className={styles.featuredCard}>
              <h2>Chapter 22 - Investigation of the Tathāgata</h2>
              <p>Explore Nāgārjuna's analysis of the Buddha's nature, showing it cannot be identified with the five aggregates nor separate from them, with quantum parallels like superposition and observer-dependence</p>
            </Link>
            
            <Link href="/chapter-23" className={styles.featuredCard}>
              <h2>Chapter 23 - Investigation of Errors</h2>
              <p>Explore Nāgārjuna's analysis of conceptual errors and how they arise from misapprehending reality, with quantum parallels like measurement error and observer effect</p>
            </Link>
            
            <Link href="/chapter-24" className={styles.featuredCard}>
              <h2>Chapter 24 - Investigation of the Four Noble Truths</h2>
              <p>Explore Nāgārjuna's analysis of the Four Noble Truths and emptiness, showing how they can only be properly understood through dependent origination, with quantum parallels like measurement problem and contextuality</p>
            </Link>
            
            <Link href="/chapter-26" className={styles.featuredCard}>
              <h2>Chapter 26 - Investigation of the Twelve Links</h2>
              <p>Explore Nāgārjuna's analysis of dependent origination, showing how the twelve links operate without a substantial self, with quantum parallels like causality and emergent phenomena</p>
            </Link>
            
            <Link href="/chapter-27" className={styles.featuredCard}>
              <h2>Chapter 27 - Investigation of Views</h2>
              <p>Explore Nāgārjuna's analysis of views about the self and the world, showing that all fixed views about reality are ultimately incoherent, with quantum parallels like complementarity and uncertainty principle</p>
            </Link>
            
            {/* Added Chapter 25 Featured Card */}
            <Link href="/chapter-25" className={styles.featuredCard}>
              <h2>Chapter 25 - Investigation of Nirvana</h2>
              <p>Explore Nāgārjuna's analysis of Nirvāṇa, demonstrating its transcendence of conventional categories, with quantum parallels like complementarity and observer effect</p>
            </Link>
            
          </div>
          
          {/* Chapter navigation */}
          <div className={styles.chapterNavigator}>
            <h2 className={styles.sectionTitle}>Chapter Index</h2>
            
            <div className={styles.chapters}>
              {chapters.map(chapter => (
                <div key={chapter} className={styles.chapterItem}>
                  <button 
                    className={styles.chapterButton}
                    onClick={() => toggleChapter(chapter)}
                    aria-expanded={expandedChapters[chapter]}
                  >
                    <span>Chapter {chapter}
                      {chapter === 1 && " - Investigation of Conditions"}
                      {chapter === 2 && " - Examination of Motion"}
                      {chapter === 3 && " - Examination of the Senses"}
                      {chapter === 4 && " - Emptiness and Quantum Physics"}
                      {chapter === 5 && " - Examination of Elements"}
                      {chapter === 6 && " - Investigation of Desire and the Desirous One"}
                      {chapter === 7 && " - Investigation of Birth, Abiding and Perishing"}
                      {chapter === 8 && " - Investigation of Act and Actor"}
                      {chapter === 9 && " - Investigation of the Presence of Something Prior"}
                      {chapter === 10 && " - Investigation of Fire and Firewood"}
                      {chapter === 11 && " - Investigation of Extremes of Before and After"}
                      {chapter === 12 && " - Investigation of Anguish"}
                      {chapter === 13 && " - Investigation of Samskaras"}
                      {chapter === 14 && " - Investigation of Connection"}
                      {chapter === 15 && " - Investigation of Essence"}
                      {chapter === 16 && " - Investigation of Bondage and Freedom"}
                      {chapter === 17 && " - Investigation of Birth, Abiding and Perishing"}
                      {chapter === 18 && " - Investigation of Self and Phenomena"}
                      {chapter === 19 && " - Investigation of Time"}
                      {chapter === 20 && " - Investigation of Aggregation"}
                      {chapter === 21 && " - Investigation of Arising and Dissolution"}
                      {chapter === 22 && " - Investigation of the Tathāgata"}
                      {chapter === 23 && " - Investigation of Errors"}
                      {chapter === 24 && " - Investigation of the Four Noble Truths"}
                      {chapter === 25 && " - Investigation of Nirvana"} {/* Added Chapter 25 Title */}
                      {chapter === 26 && " - Investigation of the Twelve Links"}
                      {chapter === 27 && " - Investigation of Views"}
                    </span>
                    <span className={styles.expandIcon}>
                      {expandedChapters[chapter] ? '−' : '+'}
                    </span>
                  </button>
                  
                  {expandedChapters[chapter] && (
                    <div className={styles.verseList}>
                      {/* Added Chapter 25 to Overview Link condition */}
                      {(chapter === 1 || chapter === 2 || chapter === 3 || chapter === 4 || chapter === 5 || chapter === 6 || chapter === 7 || chapter === 8 || chapter === 9 || chapter === 10 || chapter === 11 || chapter === 12 || chapter === 13 || chapter === 14 || chapter === 15 || chapter === 16 || chapter === 17 || chapter === 18 || chapter === 19 || chapter === 20 || chapter === 21 || chapter === 22 || chapter === 23 || chapter === 24 || chapter === 25 || chapter === 26 || chapter === 27) && (
                        <Link 
                          href={`/chapter-${chapter}`} 
                          className={`${styles.verseLink} ${styles.chapterLink}`}
                        >
                          Overview
                          <span className={styles.availableBadge}>Available</span>
                        </Link>
                      )}
                      {Array.from({ length: getVerseCount(chapter) }, (_, i) => i + 1).map(verse => (
                        <Link 
                          href={`/verse-${chapter}-${verse}`} 
                          key={verse}
                          className={styles.verseLink}
                        >
                          Verse {chapter}.{verse}
                          {((chapter === 1 && verse >= 1 && verse <= 14) || 
                            (chapter === 2 && verse >= 1 && verse <= 25) ||
                            (chapter === 3 && verse >= 1 && verse <= 9) ||
                            (chapter === 4 && verse >= 1 && verse <= 9) ||
                            (chapter === 5 && verse >= 1 && verse <= 8) ||
                            (chapter === 6 && verse >= 1 && verse <= 10) ||
                            (chapter === 7 && verse >= 1 && verse <= 12) ||
                            (chapter === 8 && verse >= 1 && verse <= 13) ||
                            (chapter === 9 && verse >= 1 && verse <= 12) ||
                            (chapter === 10 && verse >= 1 && verse <= 16) ||
                            (chapter === 11 && verse >= 1 && verse <= 8) ||
                            (chapter === 12 && verse >= 1 && verse <= 10) ||
                            (chapter === 13 && verse >= 1 && verse <= 8) ||
                            (chapter === 14 && verse >= 1 && verse <= 8) ||
                            (chapter === 15 && verse >= 1 && verse <= 11) ||
                            (chapter === 16 && verse >= 1 && verse <= 10) ||
                            (chapter === 17 && verse >= 1 && verse <= 33) ||
                            (chapter === 18 && verse >= 1 && verse <= 12) ||
                            (chapter === 19 && verse >= 1 && verse <= 6) ||
                            (chapter === 20 && verse >= 1 && verse <= 24) ||
                            (chapter === 21 && verse >= 1 && verse <= 21) ||
                            (chapter === 22 && verse >= 1 && verse <= 16) ||
                            (chapter === 23 && verse >= 1 && verse <= 24) ||
                            (chapter === 24 && verse >= 1 && verse <= 40) ||
                            (chapter === 25 && verse >= 1 && verse <= 24) || // Added Chapter 25 Available Badge condition
                            (chapter === 26 && verse >= 1 && verse <= 12) ||
                            (chapter === 27 && verse >= 1 && verse <= 30)) && (
                            <span className={styles.availableBadge}>Available</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* About section */}
          <div className={styles.aboutSection}>
            <h2 className={styles.sectionTitle}>About This Project</h2>
            <p>
              This project explores the profound parallels between Nāgārjuna's Madhyamaka philosophy from the 2nd century CE 
              and modern quantum physics. Through 3D animations created with Blender and powered by fal.ai's Hyper3D technology, 
              we visualize these connections to make ancient wisdom accessible through contemporary scientific understanding.
            </p>
            <p>
              Each verse page features a custom 3D animation representing the philosophical concept and its quantum parallel, 
              along with detailed explanations of both traditions and analysis of their intersections.
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Nāgārjuna's Quantum Reflections © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
