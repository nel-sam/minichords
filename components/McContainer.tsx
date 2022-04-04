import React, { FunctionComponent } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

interface McContainerProps {
  child: React.ReactNode;
}

const McColumn: FunctionComponent<McContainerProps> = ({
  child,
}: McContainerProps) => {
  const theme = useColorScheme();

  return (
    <View style={theme === 'dark' ? styles.columnDark : styles.columnLight}>
      {child}
    </View>
  );
};

const styles = StyleSheet.create({
  columnDark: {
    color: 'white',
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnLight: {
    color: 'black',
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default McColumn;
