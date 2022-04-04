import React from 'react';
import McColumn from '../components/McColumn';
import McSongList from '../components/McSongList/McSongList';
import { mock_Songs } from '../state/mock-data/mock-data';
import { RootTabScreenProps } from '../types';

export default function MySongsScreen({
  navigation,
}: RootTabScreenProps<'TabThree'>) {
  return (
    <McColumn
      child={
        <>
          <McSongList data={mock_Songs}></McSongList>
        </>
      }
    />
  );
}
