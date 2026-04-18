/**
 * Premium Minimalist Theme
 * Sophisticated color palette for social/messaging app
 */

export const colors = {
  // Primary: Sophisticated teal/sage
  primary: {
    50: '#F0F7F5',
    100: '#D4EDE8',
    200: '#B8E4DB',
    300: '#7ECCC0',
    400: '#52B5AC',
    500: '#2E9D94', // Main primary color
    600: '#228679',
    700: '#18685F',
    800: '#0F4A44',
  },

  // Secondary: Warm coral accent
  secondary: {
    50: '#FFF5F3',
    100: '#FFE0D6',
    200: '#FFCBB9',
    300: '#FF9E7A',
    400: '#FF7A52',
    500: '#FF5722', // Main secondary color
    600: '#E64A19',
    700: '#CC3D14',
    800: '#A6320F',
  },

  // Neutrals: Sophisticated grays
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // Primary text color
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Surface colors for layering
  surface: {
    light: '#FFFFFF',
    default: '#F9FAFB',
    elevated: '#F3F4F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Border colors
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

export const typography = {
  // Font sizes
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

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Font weights (if using custom fonts)
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
