import type { TextStyle } from 'react-native';

type TypographyToken = Pick<TextStyle, 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'>;

const typography: Record<
  'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'caption' | 'small',
  TypographyToken
> = {
  // Reference styling: high contrast, tight letter spacing for headers, readable line heights
  display: { fontSize: 32, fontWeight: '800', lineHeight: 40, letterSpacing: -0.8 },
  h1: { fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700', lineHeight: 28, letterSpacing: -0.4 },
  h3: { fontSize: 16, fontWeight: '700', lineHeight: 24, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22, letterSpacing: -0.1 },
  bodyStrong: { fontSize: 15, fontWeight: '600', lineHeight: 22, letterSpacing: -0.1 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing: 0 },
  small: { fontSize: 12, fontWeight: '500', lineHeight: 16, letterSpacing: 0 },
};

const palette = {
  // Keeping original brand color
  primary: '#5B6CFF',
  primaryLight: '#EEF0FF',
  primaryDark: '#4654D9',

  // Clean, premium grayscale inspired by references
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surface2: '#FFFFFF',
  surfaceMuted: '#F9F9F9',
  surfaceSoft: '#F0F0F3',
  premiumDark: '#1E2335',

  white: '#FFFFFF',
  black: '#111111',
  blackMuted: '#1C1C1E',

  textPrimary: '#111111',
  textSecondary: '#6E6E73',
  textTertiary: '#A1A1A6',
  onDark: '#FFFFFF',
  onDarkSoft: 'rgba(255,255,255,0.66)',

  border: '#E5E5EA',
  borderStrong: '#D1D1D6',
  divider: '#F0F0F3',

  // Semantic
  accent: '#FFB38A',
  warning: '#F5A623',
  warningLight: '#FFF5E5',
  success: '#34C759',
  successLight: '#E8F8EE',
  danger: '#FF3B30',
  dangerLight: '#FFEBEA',
};

export const theme = {
  colors: {
    ...palette,
    text: palette.textPrimary,
    secondary: palette.surfaceMuted,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24, // Generous padding
    xxl: 32,
    xxxl: 48,
  },
  typography,
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24, // Matches the reference card roundness
    xxl: 32, // For very large cards (like the premium black one)
    xxxl: 40,
    pill: 9999, // For buttons and badges
  },
  // `radius` is an additive alias of `borderRadius` so new code can use the
  // shorter token name without breaking existing `theme.borderRadius.*` usage.
  radius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    pill: 9999,
  },
  // Interaction tokens: keep press feedback consistent across Button/Chip/Card.
  motion: {
    pressScale: 0.97,
    chipPressScale: 0.96,
    activeOpacity: 0.86,
    disabledOpacity: 0.45,
    fast: 120,
    base: 180,
    slow: 260,
    skeletonPulse: 700,
  },
  // Shared layout constants for screens with a fixed bottom CTA.
  layout: {
    screenPadding: 20,
    bottomCtaHeight: 56,
    bottomSafePadding: 20,
  },
  shadows: {
    soft: {
      shadowColor: '#111111',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 14,
      elevation: 2,
    },
    medium: {
      shadowColor: '#111111',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.09,
      shadowRadius: 30,
      elevation: 4,
    },
    primary: {
      shadowColor: '#5B6CFF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.30,
      shadowRadius: 20,
      elevation: 8,
    },
    float: {
      shadowColor: '#111111',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 40,
      elevation: 12,
    }
  },
} as const;
