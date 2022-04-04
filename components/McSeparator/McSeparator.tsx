import React from 'react';
import { StyleSheet, View } from 'react-native';

export const McSeparator = () => {
  return (
    <View style={styles.outer}>
      <View testID='mcseparator' style={styles.separator} />
    </View>
  );
};

// TODO: Account for dark/light
const styles = StyleSheet.create({
  outer: {
    width: '100%',
  },
  separator: {
    marginVertical: 2,
    height: 1,
    width: '80%',
    marginLeft: '10%',
  },
});
