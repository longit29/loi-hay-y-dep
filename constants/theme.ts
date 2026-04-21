export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#666666',
    background: '#FAFAFA',
    card: '#FFFFFF',
    tint: '#4CAF50',
    icon: '#888888',
    tabIconDefault: '#888888',
    tabIconSelected: '#4CAF50',
    border: '#E0E0E0',
  },
  dark: {
    text: '#F5F5F5',
    textSecondary: '#888888',
    background: '#0F0F0F',
    card: '#1A1A1A',
    tint: '#4CAF50',
    icon: '#888888',
    tabIconDefault: '#888888',
    tabIconSelected: '#4CAF50',
    border: '#2A2A2A',
  },
};

export const CategoryColors = {
  'cuoc-song': '#4CAF50',
  'tinh-yeu': '#E91E63',
  'thanh-cong': '#FF9800',
  'ban-than': '#9C27B0',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const FontFamily = {
  quote: 'PlayfairDisplay_400Regular_Italic',
  quoteRegular: 'PlayfairDisplay_400Regular',
  ui: 'Inter_400Regular',
  uiSemiBold: 'Inter_600SemiBold',
  uiBold: 'Inter_700Bold',
} as const;
