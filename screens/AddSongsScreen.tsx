import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { GlobalStyles } from './shared/GlobalStyles';
import { McSeparator } from '../components/McSeparator/McSeparator';

export default function AddSongsScreen() {
  const { t } = useTranslation();

  return (
    <View style={GlobalStyles.container}>
      <Text style={styles.title}>{t('add-songs')}</Text>
      <McSeparator></McSeparator>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
