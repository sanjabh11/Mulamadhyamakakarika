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
    title: 'Nagarjuna Quantum Reflections',
    description: 'Explore the intersection of Madhyamaka philosophy and quantum physics.',
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
