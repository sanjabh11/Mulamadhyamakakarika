/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // BUG-R7-02 FIX: enables html.classList.remove('dark') to control all dark: utilities
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                quantum: {
                    void: '#001F3F',
                    deep: '#000a12',
                    light: '#112D4E',
                    cosmic: '#4B0082',
                    neon: '#00FFFF',
                    plasma: '#8B5CF6',
                    gold: '#FFD700',
                    warm: '#FF6B6B',
                    cool: '#A78BFA',
                },
            },
            backgroundImage: {
                'cosmic-gradient': 'linear-gradient(170deg, var(--color-void-main) 0%, #4B0082 60%, var(--color-void-main) 100%)',
                'nebula-glow': 'radial-gradient(circle at 50% 50%, rgba(75, 0, 130, 0.25), transparent 70%)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-space)', 'var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
                devana: ['var(--font-devanagari)', 'sans-serif'],
            },
            fontSize: {
                xs: 'var(--text-xs)',
                sm: 'var(--text-sm)',
                base: 'var(--text-base)',
                lg: 'var(--text-lg)',
                xl: 'var(--text-xl)',
                '2xl': 'var(--text-2xl)',
                '3xl': 'var(--text-3xl)',
                display: 'var(--text-display)',
            },
            keyframes: {
                'pulsing-glow': {
                    '0%, 100%': { opacity: 0.8, filter: 'brightness(1)' },
                    '50%': { opacity: 1, filter: 'brightness(1.2)' },
                },
                swirl: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'fade-in-up': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            animation: {
                'pulse-glow': 'pulsing-glow 3s infinite ease-in-out',
                'slow-spin': 'swirl 20s linear infinite',
                'fade-in': 'fade-in-up 0.5s ease-out forwards',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
};
