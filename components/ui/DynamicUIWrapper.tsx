'use client';

import dynamic from 'next/dynamic';

const StarfieldBackground = dynamic(
    () => import('./StarfieldBackground'),
    { ssr: false }
);

const ParticleCursor = dynamic(
    () => import('./ParticleCursor'),
    { ssr: false }
);

export default function DynamicUIWrapper() {
    return (
        <>
            <StarfieldBackground />
            <ParticleCursor />
        </>
    );
}
