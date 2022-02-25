import React from 'react';
import { View } from '../../components/Themed';
import { StyleSheet } from 'react-native';

export const Separator = () => {
  return (
    <View style={styles.outer}>
      <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%'
  },
  separator: {
    marginVertical: 2,
    height: 1,
    width: '80%',
    marginLeft: '10%',
  },
});
