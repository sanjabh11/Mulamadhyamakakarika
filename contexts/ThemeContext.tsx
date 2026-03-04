"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Read the initial theme synchronously (client only). Falls back to 'dark'. */
function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    try {
        const stored = localStorage.getItem('mmk_theme') as Theme | null;
        if (stored === 'light' || stored === 'dark') return stored;
        if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    } catch {
        /* ignore – localStorage blocked in private mode */
    }
    return 'dark';
}

/** Apply theme imperatively to <html> element. */
function applyTheme(theme: Theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Lazy initializer: reads localStorage synchronously (client only)
    const [theme, setTheme] = useState<Theme>(() => {
        // On the server, always start with dark to match SSR HTML
        if (typeof window === 'undefined') return 'dark';
        return getInitialTheme();
    });

    // Initial mount: sync the DOM with React state (handles the case where
    // blocking script and ThemeProvider state may differ after hydration).
    // We do NOT use this effect for toggle clicks — that would be asynchronous.
    useEffect(() => {
        applyTheme(theme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // ← empty deps: run ONCE on mount only, not on every toggle

    const toggleTheme = () => {
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
        // ── CRITICAL: Apply DOM mutation SYNCHRONOUSLY on the click event ──
        // Do NOT delegate to useEffect — effects fire after the next paint,
        // so the background would visually lag or fail under React batching.
        // Calling applyTheme() here mutates html.classList and data-theme
        // in the same microtask as the click, giving instant visual feedback.
        applyTheme(newTheme);
        setTheme(newTheme);
        localStorage.setItem('mmk_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
