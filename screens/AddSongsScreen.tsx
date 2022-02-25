import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { GlobalStyles } from './shared/global-styles';
import { Separator } from './shared/separator';

export default function AddSongsScreen() {
  const { t } = useTranslation();

  return (
    <View style={GlobalStyles.container}>
      <Text style={styles.title}>{t('add-songs')}</Text>
      <Separator></Separator>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
