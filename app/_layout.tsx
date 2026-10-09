import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import useCachedResources from '../hooks/useCachedResources';
import useColorScheme from '../hooks/useColorScheme';
import '../translations/i18n';

export default function RootLayout() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const theme = (colorScheme === 'dark' ? DarkTheme : DefaultTheme) as unknown as ReactNavigation.Theme;

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <Stack>
            <Stack.Screen name="index" options={{ title: t('my-songs') }} />
            <Stack.Screen name="add-songs" options={{ title: t('add-song-title') }} />
            <Stack.Screen name="songs/[id]" />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
        </ThemeProvider>
        <StatusBar />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}