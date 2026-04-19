/**
 * Proxima Theme — Orange & Purple
 * Warm orange accents with soft purple tones
 */

export const colors = {
  // Primary: Warm orange (buttons on auth screens)
  primary: {
    50: '#FEF5EE',
    100: '#FDE8D6',
    200: '#FAD0AD',
    300: '#F6B889',
    400: '#f2a068', // Main
    500: '#e08a4e',
    600: '#c97740',
    700: '#a56035',
    800: '#834b2a',
  },

  // Secondary: Purple tones
  secondary: {
    light: '#ece6f0',  // Received messages, channel cards, secondary buttons
    dark: '#635b72',   // Sent messages, active nav
    50: '#F7F4F9',
    100: '#ece6f0',
    200: '#ddd4e4',
    300: '#c4b8d0',
    400: '#a99abb',
    500: '#8a7a9e',
    600: '#756888',
    700: '#635b72',
    800: '#4e475a',
  },

  // Neutrals: Warm cream tones
  neutral: {
    0: '#FFFFFF',
    50: '#FFFCF7',
    100: '#FFF8EF',
    200: '#F5EFE6',
    300: '#E8E0D5',
    400: '#C4BAA9',
    500: '#9A9184',
    600: '#736B60',
    700: '#524B43',
    800: '#352F29',
    900: '#1E1A16',
  },

  // Semantic
  success: '#5CB87A',
  warning: '#E8A840',
  error: '#D45B5B',
  info: '#5B9BD5',

  // Surfaces
  surface: {
    light: '#FFFFFF',
    default: '#FFFCF7',
    elevated: '#FFF8EF',
    overlay: 'rgba(53, 47, 41, 0.25)',
  },

  // Text
  text: {
    primary: '#352F29',
    secondary: '#736B60',
    tertiary: '#C4BAA9',
    inverse: '#FFFFFF',
  },

  // Borders
  border: {
    light: '#F5EFE6',
    default: '#E8E0D5',
    dark: '#C4BAA9',
  },
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
};

export const shadows = {
  none: {
    elevation: 0,
  },
  sm: {
    elevation: 2,
  },
  md: {
    elevation: 4,
  },
  lg: {
    elevation: 8,
  },
  xl: {
    elevation: 12,
  },
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 999,
};

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
};

export type Theme = typeof theme;
