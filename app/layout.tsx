import '../styles/globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono, Noto_Sans } from 'next/font/google';
import DynamicUIWrapper from '../components/ui/DynamicUIWrapper';
import ServiceWorkerRegister from '../components/pwa/ServiceWorkerRegister';
import InstallPrompt from '../components/pwa/InstallPrompt';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'optional',
});

const notoSans = Noto_Sans({
    subsets: ['devanagari', 'latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-devanagari',
    display: 'optional',
});

export const metadata = {
    metadataBase: new URL('https://nagarjunaquantum.com'),
    title: {
        default: 'Nagarjuna Quantum Reflections',
        template: '%s | Nagarjuna Quantum Reflections',
    },
    description: 'A digital humanities learning and research platform for studying Nagarjuna’s Mūlamadhyamakakārikā with interactive verse exploration, transparent AI assistance, and carefully caveated quantum analogies.',
    keywords: [
        'Madhyamaka',
        'Nagarjuna',
        'Mūlamadhyamakakārikā',
        'digital humanities',
        'Buddhist philosophy',
        'quantum analogies',
        'research transparency',
        'interactive pedagogy'
    ],
    openGraph: {
        title: 'Nagarjuna Quantum Reflections',
        description: 'A digital humanities platform for studying the MMK through interactive pedagogy, transparent AI assistance, and structural quantum analogies.',
        type: 'website',
        siteName: 'Nagarjuna Quantum Reflections',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nagarjuna Quantum Reflections',
        description: 'Study the MMK with interactive verse exploration, research-mode transparency, and carefully caveated quantum analogies.',
    },
    robots: {
        index: true,
        follow: true,
    },
    manifest: '/manifest.json',
};

export const viewport = {
    themeColor: '#001F3F',
};

import RootProviders from '../components/providers/RootProviders';

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoSans.variable}`}>
            <head>
                {/*
                 * BLOCKING THEME SCRIPT — Must run before any CSS or React code.
                 * Reads localStorage synchronously and applies the correct class
                 * to <html> before the browser first paints, eliminating FOUC.
                 * This also prevents React reconciliation from overwriting the class
                 * because the script fires before React hydrates.
                 */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
(function() {
  try {
    var theme = localStorage.getItem('mmk_theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = theme === 'light' ? 'light' : (theme === 'dark' ? 'dark' : (prefersDark ? 'dark' : 'light'));
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.setAttribute('data-theme', resolved);
  } catch(e) {
    // localStorage blocked (private mode) — default to dark
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
                        `
                    }}
                />
            </head>
            <body suppressHydrationWarning className="text-slate-200 antialiased min-h-screen selection:bg-quantum-neon/30 selection:text-white overflow-x-hidden" style={{ backgroundColor: 'var(--color-void-deep)' }}>
                <DynamicUIWrapper />
                <ServiceWorkerRegister />
                <InstallPrompt />
                <RootProviders>
                    <main className="h-full w-full relative">
                        {children}
                    </main>
                </RootProviders>
            </body>
        </html>
    );
}
