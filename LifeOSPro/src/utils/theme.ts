export const colors = {
  dark: {
    background: '#0D0D12',
    surface: '#16161D',
    surfaceLight: '#1E1E28',
    surfaceLighter: '#282834',
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    primaryDark: '#5B21B6',
    secondary: '#06B6D4',
    secondaryLight: '#22D3EE',
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentSecondary: '#EC4899',
    accentSecondaryLight: '#F472B6',
    text: '#FFFFFF',
    textSecondary: '#C4C4D4',
    textTertiary: '#6B6B7B',
    border: '#2A2A36',
    success: '#10B981',
    successLight: '#34D399',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    error: '#EF4444',
    errorLight: '#F87171',
    gradient: {
      primary: ['#7C3AED', '#A78BFA'],
      secondary: ['#06B6D4', '#22D3EE'],
      accent: ['#F59E0B', '#FBBF24'],
      pink: ['#EC4899', '#F472B6'],
      success: ['#10B981', '#34D399'],
      error: ['#EF4444', '#F87171'],
      royal: ['#3B82F6', '#60A5FA'],
      sunset: ['#F97316', '#FB923C'],
      midnight: ['#1E1E28', '#0D0D12'],
      aurora: ['#7C3AED', '#06B6D4'],
    }
  },
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceLight: '#F4F4F5',
    surfaceLighter: '#E4E4E7',
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    accentSecondary: '#EC4899',
    text: '#18181B',
    textSecondary: '#71717A',
    textTertiary: '#A1A1AA',
    border: '#E4E4E7',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  fontSizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  h1: { fontSize: 40, fontWeight: '800' as const, lineHeight: 48, letterSpacing: -1 },
  h2: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: -0.5 },
  h3: { fontSize: 26, fontWeight: '700' as const, lineHeight: 34 },
  h4: { fontSize: 22, fontWeight: '600' as const, lineHeight: 30 },
  h5: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  glow: (color: string, opacity: number = 0.5) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: opacity,
    shadowRadius: 12,
    elevation: 12,
  }),
};

export const theme = {
  colors: colors.dark,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export type Theme = typeof theme;
