import React from 'react';
import McSongList from '../components/McSongList/McSongList';
import { View } from '../components/Themed';
import { mock_Songs } from '../state/mock-data/mock-data';
import { RootTabScreenProps } from '../types';
import { GlobalStyles } from './shared/GlobalStyles';

export default function MySongsScreen({
  navigation,
}: RootTabScreenProps<'TabThree'>) {
  return (
    <View style={GlobalStyles.container}>
      <McSongList data={mock_Songs}></McSongList>
    </View>
  );
}
