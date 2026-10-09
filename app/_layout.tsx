import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from '../hooks/useCachedResources';
import useColorScheme from '../hooks/useColorScheme';
import '../translations/i18n';

export default function RootLayout() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const theme = (colorScheme === 'dark' ? DarkTheme : DefaultTheme) as unknown as ReactNavigation.Theme;

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      </ThemeProvider>
      <StatusBar />
    </SafeAreaProvider>
  );
}