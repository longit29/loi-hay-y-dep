import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, Radius, FontFamily } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return {
    colors: Colors[scheme],
    spacing: Spacing,
    radius: Radius,
    fonts: FontFamily,
    isDark: scheme === 'dark',
  };
}
