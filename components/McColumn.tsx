import React, { FunctionComponent } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

interface McColumnProps {
  child: React.ReactNode;
}

const McColumn: FunctionComponent<McColumnProps> = ({
  child,
}: McColumnProps) => {
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
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  columnLight: {
    color: 'black',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

export default McColumn;
