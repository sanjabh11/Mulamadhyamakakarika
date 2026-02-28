import React from 'react';
import { notFound } from 'next/navigation';
import { getVerseData } from '../../../lib/verse-data';
import VersePageClient from '../../../components/verse/VersePageClient';

// Define params type
interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function VersePage({ params }: PageProps) {
    // Await params (Next.js 14 returns plain object, await is safe on non-Promise)
    const { id } = await params;

    // Parse ID (chapter-verse)
    const match = id.match(/^(\d+)-(\d+)$/);

    if (!match) {
        return notFound();
    }

    const chapterId = parseInt(match[1], 10);
    const verseId = parseInt(match[2], 10);

    // Fetch Data
    const data = await getVerseData(chapterId, verseId);

    if (!data) {
        return notFound();
    }

    return (
        <VersePageClient data={data} />
    );
}
