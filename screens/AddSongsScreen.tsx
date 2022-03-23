import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { McSeparator } from '../components/McSeparator/McSeparator';
import { Text, View } from '../components/Themed';
import { GlobalStyles } from './shared/GlobalStyles';

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
  },
});
