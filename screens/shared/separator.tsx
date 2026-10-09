import React from 'react';
import { StyleSheet } from 'react-native';
import { View, useThemeColor } from '../../components/Themed';

export const Separator = () => {
  const border = useThemeColor({}, 'border');

  return (
    <View style={styles.outer}>
      <View style={[styles.separator, { backgroundColor: border }]} />
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
