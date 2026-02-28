// lib/verse-data.ts

const CHAPTER_IMPORTS: Record<number, () => Promise<any>> = {
    1: () => import('../data/chapters/chapter-1'),
    2: () => import('../data/chapters/chapter-2'),
    3: () => import('../data/chapters/chapter-3'),
    4: () => import('../data/chapters/chapter-4'),
    5: () => import('../data/chapters/chapter-5'),
    6: () => import('../data/chapters/chapter-6'),
    7: () => import('../data/chapters/chapter-7'),
    8: () => import('../data/chapters/chapter-8'),
    9: () => import('../data/chapters/chapter-9'),
    10: () => import('../data/chapters/chapter-10'),
    11: () => import('../data/chapters/chapter-11'),
    12: () => import('../data/chapters/chapter-12'),
    13: () => import('../data/chapters/chapter-13'),
    14: () => import('../data/chapters/chapter-14'),
    15: () => import('../data/chapters/chapter-15'),
    16: () => import('../data/chapters/chapter-16'),
    17: () => import('../data/chapters/chapter-17'),
    18: () => import('../data/chapters/chapter-18'),
    19: () => import('../data/chapters/chapter-19'),
    20: () => import('../data/chapters/chapter-20'),
    21: () => import('../data/chapters/chapter-21'),
    22: () => import('../data/chapters/chapter-22'),
    23: () => import('../data/chapters/chapter-23'),
    24: () => import('../data/chapters/chapter-24'),
    25: () => import('../data/chapters/chapter-25'),
    26: () => import('../data/chapters/chapter-26'),
    27: () => import('../data/chapters/chapter-27'),
};

export interface VerseData {
    verseText: string;
    madhyamakaConcept: string;
    quantumPhysicsParallel: string;
    sanskrit?: {
        text: string;
        transliteration: string;
        translation: string;
    };
    philosophy?: {
        insight: string;
        twoTruths?: string;
        commonMisconception?: string;
        accessible?: string;
    };
    animation?: {
        visualBridge?: string;
        educationalGoal?: string;
    };
    deeperDive?: any[];
    quiz?: any;
    [key: string]: any;
}

export async function getVerseData(chapterId: number, verseId: number) {
    const importFn = CHAPTER_IMPORTS[chapterId];
    if (!importFn) return null;

    try {
        const chapterMod = await importFn();
        const { CHAPTER_CONFIG, VERSES } = chapterMod;

        // Handle case where VERSES might not be exported or empty
        const verseObj = VERSES?.[verseId];

        if (!verseObj) return null;

        return {
            chapterId,
            verseId,
            chapterTitle: CHAPTER_CONFIG.title,
            totalVerses: CHAPTER_CONFIG.verseCount,
            verseData: {
                ...verseObj,
                verseText: verseObj.sanskrit?.translation || '',
                madhyamakaConcept: verseObj.philosophy?.madhyamaka || '',
                quantumPhysicsParallel: verseObj.philosophy?.quantum || '',
            } as VerseData,
        };
    } catch (error) {
        console.error(`Failed to load chapter ${chapterId} data:`, error);
        return null;
    }
}
