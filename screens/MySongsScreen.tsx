import React from 'react';
import McFlatList from '../components/McFlatList/McFlatList';
import { View } from '../components/Themed';
import { data_Songs } from '../state/data';
import { RootTabScreenProps } from '../types';
import { GlobalStyles } from './shared/GlobalStyles';

export default function MySongsScreen({
  navigation,
}: RootTabScreenProps<'TabThree'>) {
  return (
    <View style={GlobalStyles.container}>
      <McFlatList data={data_Songs}></McFlatList>
    </View>
  );
}
