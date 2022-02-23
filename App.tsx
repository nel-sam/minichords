import { StatusBar } from 'expo-status-bar';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import en from './translations/en.json';
import es from './translations/es.json';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  i18next
    .use(initReactI18next)
    .init({
      interpolation: {
        escapeValue: false
      },
      lng: 'es',
      fallbackLng: 'en',
      resources: {
        en: { translation: en },
        es: { translation: es }
      }
    });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
