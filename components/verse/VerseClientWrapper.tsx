'use client';

import React, { useState, useEffect } from 'react';
// import { useDevice } from '../../hooks/use-device'; // Assuming we might make a hook later, but logic is simple for now
import MobileVerseLayout from './MobileVerseLayout';
import DesktopVerseLayout from './DesktopVerseLayout';

interface VerseClientWrapperProps {
    data: any; // Using any for now to avoid strict typing friction during migration
    isShowcase?: boolean;
}

export default function VerseClientWrapper({ data, isShowcase = false }: VerseClientWrapperProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        setMounted(true);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) {
        // Fade-in shell to prevent hydration mismatch flicker
        return <div className="h-screen w-full bg-quantum-void" />;
    }

    // Extract metadata and verse content
    const { chapterId, verseId, chapterTitle, totalVerses, verseData } = data;

    // Pass all data down
    if (isMobile) {
        return (
            <MobileVerseLayout
                chapterId={chapterId}
                verseId={verseId}
                chapterTitle={chapterTitle}
                totalVerses={totalVerses}
                verseData={verseData}
                isShowcase={isShowcase}
            />
        );
    }

    return (
        <DesktopVerseLayout
            chapterId={chapterId}
            verseId={verseId}
            chapterTitle={chapterTitle}
            totalVerses={totalVerses}
            verseData={verseData}
            researchModeEnabled={isShowcase}
        />
    );
}
