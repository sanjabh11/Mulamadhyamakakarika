'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
// @ts-ignore
import { useMembership } from '../whop/MembershipTiers';

// Dynamic import the verse viewer with ssr: false to prevent hydration mismatch.
// The verse viewer uses Canvas API, WebGL, Three.js, and window-dependent code
// that cannot reliably hydrate from server-rendered HTML.
const VerseClientWrapper = dynamic(
    () => import('./VerseClientWrapper'),
    {
        ssr: false,
        loading: () => (
            <div className="h-screen w-full bg-quantum-deep flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">Loading verse...</p>
                </div>
            </div>
        ),
    }
);

interface VersePageClientProps {
    data: any;
    chapterId: number;
}

export default function VersePageClient({ data, chapterId }: VersePageClientProps) {
    const router = useRouter();
    const { canAccessChapter, loading } = useMembership();
    const [isShowcase, setIsShowcase] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        setIsShowcase(params.get('showcase') === 'true');
    }, []);

    useEffect(() => {
        if (!loading && chapterId > 3 && !isShowcase && !canAccessChapter(chapterId)) {
            // Unauthorized direct access pattern detected. Redirecting to paywall.
            router.push('/pricing');
        }
    }, [loading, chapterId, isShowcase, canAccessChapter, router]);

    useEffect(() => {
        if (typeof window !== 'undefined' && data?.verse?.chapter) {
            document.body.setAttribute('data-chapter', data.verse.chapter.toString());
            return () => document.body.removeAttribute('data-chapter');
        }
    }, [data?.verse?.chapter]);

    return <VerseClientWrapper data={data} isShowcase={isShowcase} />;
}
