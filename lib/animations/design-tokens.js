/**
 * Design System Tokens
 * 
 * Centralized design tokens following Phase 6B guidelines
 * - Single accent color (#8B5CF6)
 * - 8px grid spacing system
 * - Typography with minimum 16px body text
 */

export const DESIGN_TOKENS = {
  // Color System
  colors: {
    // Base Palette
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      600: '#6B7280',
      900: '#111827'
    },
    
    // Single Accent Color (Quantum Purple)
    accent: '#8B5CF6',
    accentHover: '#7C3AED', // 10% darker
    accentLight: 'rgba(139, 92, 246, 0.1)',
    
    // Semantic Colors
    success: '#10B981',
    error: '#EF4444',
    
    // Text Colors
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF'
    },
    
    // Dark Mode
    dark: {
      bg: '#0F172A',
      surface: '#1E293B',
      text: '#E2E8F0'
    },
    
    // Quantum Theme Colors
    quantum: {
      purple: '#8B5CF6',
      cyan: '#06B6D4',
      pink: '#EC4899',
      green: '#10B981'
    }
  },
  
  // Spacing (8px Grid - STRICT)
  spacing: {
    px: '1px',
    0: '0',
    half: '4px',    // Half-step for tight internal spacing only
    1: '8px',       // --space-1
    1.5: '12px',    // Only for button padding
    2: '16px',      // --space-2
    3: '24px',      // --space-3
    4: '32px',      // --space-4
    6: '48px',      // --space-6
    8: '64px'       // --space-8
  },
  
  // Typography
  typography: {
    // Font Families
    fonts: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: 'Georgia, "Times New Roman", serif',
      mono: 'Menlo, Monaco, Consolas, "Courier New", monospace'
    },
    
    // Font Sizes
    fontSize: {
      xs: '14px',     // Minimum for labels
      sm: '14px',
      base: '16px',   // Minimum body text
      lg: '18px',
      xl: '20px',
      '2xl': '24px',  // H3
      '3xl': '32px',  // H2
      '4xl': '48px'   // H1
    },
    
    // Font Weights
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6
    }
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.1)',
    // Dark mode shadows
    'sm-dark': '0 2px 8px rgba(0,0,0,0.3)',
    'md-dark': '0 4px 12px rgba(0,0,0,0.4)'
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease'
  },
  
  // Z-Index
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70
  },
  
  // Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px'
  }
};

/**
 * Helper: Get spacing value
 */
export function getSpacing(multiplier) {
  return `${multiplier * 8}px`;
}

/**
 * Helper: Create CSS custom properties
 */
export function createCSSVariables() {
  const vars = {};
  
  // Colors
  vars['--color-accent'] = DESIGN_TOKENS.colors.accent;
  vars['--color-accent-hover'] = DESIGN_TOKENS.colors.accentHover;
  vars['--color-text-primary'] = DESIGN_TOKENS.colors.text.primary;
  vars['--color-text-secondary'] = DESIGN_TOKENS.colors.text.secondary;
  
  // Spacing
  Object.entries(DESIGN_TOKENS.spacing).forEach(([key, value]) => {
    vars[`--space-${key}`] = value;
  });
  
  // Typography
  vars['--font-body'] = DESIGN_TOKENS.typography.fontSize.base;
  vars['--font-h1'] = DESIGN_TOKENS.typography.fontSize['4xl'];
  vars['--font-h2'] = DESIGN_TOKENS.typography.fontSize['3xl'];
  vars['--font-h3'] = DESIGN_TOKENS.typography.fontSize['2xl'];
  
  return vars;
}

export default DESIGN_TOKENS;
