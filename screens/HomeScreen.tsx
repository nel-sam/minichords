import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text } from 'react-native';
import McColumn from '../components/McColumn';
import { McSeparator } from '../components/McSeparator/McSeparator';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const { t } = useTranslation();

  return (
    <McColumn
      child={
        <>
          <Image
            style={styles.bannerImage}
            source={require('./../assets/images/banner.jpg')}
          />
          <McSeparator />
          <Text style={styles.explanation}>{t('home-greeting')}</Text>
          <McSeparator />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  bannerImage: { height: 200, width: '100%' },
  explanation: {
    margin: 10,
    color: 'gray',
  },
});
