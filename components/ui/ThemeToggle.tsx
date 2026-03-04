"use client";

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useHaptic } from '../../hooks/useHaptic';

export default function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const { theme, toggleTheme } = useTheme();
    const haptic = useHaptic();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch: render a uniform skeleton on server and first client pass
    if (!mounted) {
        return (
            <button
                className="p-2 rounded-full bg-black/20 border border-white/10 text-slate-300 hover:text-white transition-colors glass-panel-interactive flex items-center justify-center opacity-50"
                aria-label="Toggle theme"
            >
                <Moon size={18} />
            </button>
        );
    }

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
                try { haptic.tap(); } catch (e) { /* haptic not available */ }
            }}
            className="p-2 rounded-full bg-black/20 border border-white/10 text-slate-300 hover:text-white transition-colors glass-panel-interactive flex items-center justify-center focus:outline-none select-none touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}
