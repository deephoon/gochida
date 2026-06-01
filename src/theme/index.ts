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
  background: '#F5F5F7', // Slightly cooler, very light gray for that premium app feel
  surface: '#FFFFFF',
  surfaceMuted: '#F9F9F9',
  surfaceSoft: '#F0F0F3',
  
  white: '#FFFFFF',
  black: '#111111', // Rich black for premium cards/CTAs
  blackMuted: '#1C1C1E',

  textPrimary: '#111111', // Almost black for max readability
  textSecondary: '#6E6E73', // Apple-esque gray
  textTertiary: '#A1A1A6',

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
    pill: 9999, // For buttons and badges
  },
  shadows: {
    soft: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 4,
    }
  },
} as const;
