import type { TextStyle } from 'react-native';

type TypographyToken = Pick<TextStyle, 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'>;

const typography: Record<
  'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'caption' | 'small',
  TypographyToken
> = {
  display: { fontSize: 28, fontWeight: '700', lineHeight: 36, letterSpacing: -0.5 },
  h1: { fontSize: 22, fontWeight: '700', lineHeight: 30, letterSpacing: -0.3 },
  h2: { fontSize: 18, fontWeight: '700', lineHeight: 26, letterSpacing: -0.2 },
  h3: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  small: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
};

const palette = {
  primary: '#3D5AFE',
  primaryLight: '#EEF1FF',
  primaryDark: '#2D44C6',

  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F8FA',
  white: '#FFFFFF',
  black: '#0A0A0A',

  textPrimary: '#0F1115',
  textSecondary: '#5B6470',
  textTertiary: '#98A0AC',

  border: '#ECEEF1',
  borderStrong: '#D9DCE2',
  divider: '#F1F2F5',

  accent: '#FFB38A',
  warning: '#B7791F',
  warningLight: '#FEF6E5',
  success: '#0E8A5F',
  successLight: '#E6F7EF',
  danger: '#D24A48',
  dangerLight: '#FCEBEA',
};

export const theme = {
  colors: {
    ...palette,
    // Backward-compat aliases (some screens still reference these names)
    text: palette.textPrimary,
    secondary: palette.surfaceMuted,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 12,
    l: 20,
    xl: 28,
    xxl: 44,
  },
  typography,
  borderRadius: {
    s: 6,
    m: 10,
    l: 14,
    xl: 20,
    round: 9999,
  },
  shadows: {
    soft: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },
} as const;
