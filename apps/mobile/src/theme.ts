/**
 * Proxima Theme — Warm & Bright
 * Inviting, friendly palette that feels alive and approachable
 */

export const colors = {
  // Primary: Warm golden amber
  primary: {
    50: '#FFF9F0',
    100: '#FFEFD6',
    200: '#FFDDB0',
    300: '#FFC87A',
    400: '#FFAE42',
    500: '#F59B24', // Main — warm, bright amber
    600: '#DB8518',
    700: '#B56C12',
    800: '#8F540E',
  },

  // Secondary: Warm coral-rose
  secondary: {
    50: '#FFF5F3',
    100: '#FFE4DE',
    200: '#FFCFC4',
    300: '#FFB0A0',
    400: '#FF8E78',
    500: '#F0735C', // Main — friendly coral
    600: '#D45E49',
    700: '#B04A39',
    800: '#8C3A2D',
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
