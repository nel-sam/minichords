import { DarkTheme, DefaultTheme } from 'expo-router';

const accentLight = '#B84B1B';
const accentDark = '#F2A16B';
const mutedLight = '#767776';
const mutedDark = '#A8B5AC';

export default {
  light: {
    ...DefaultTheme.colors,
    surface: DefaultTheme.colors.card,
    choiceSurface: 'transparent',
    muted: mutedLight,
    noteSurface: '#F8EEE5',
    accent: accentLight,
    accentForeground: '#FFFFFF',
    scrim: '#00000066',
    disabledSurface: DefaultTheme.colors.border,
    disabledText: mutedLight,
    codeSurface: DefaultTheme.colors.card,
    tint: accentLight,
    tabIconDefault: mutedLight,
    tabIconSelected: accentLight,
  },
  dark: {
    ...DarkTheme.colors,
    surface: DarkTheme.colors.card,
    choiceSurface: 'transparent',
    muted: mutedDark,
    noteSurface: '#382B24',
    accent: accentDark,
    accentForeground: '#17201B',
    scrim: '#00000099',
    disabledSurface: DarkTheme.colors.border,
    disabledText: mutedDark,
    codeSurface: DarkTheme.colors.card,
    tint: accentDark,
    tabIconDefault: mutedDark,
    tabIconSelected: accentDark,
  },
};
