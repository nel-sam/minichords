import { render } from '@testing-library/react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { Song } from '../../models/chords';
import { mock_Songs } from '../../state/mock-data/mock-data';
import McSongList from '../McSongList/McSongList';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => {
    return <svg />;
  },
}));

describe('McFlatList component', () => {
  it('renders', () => {
    const { getByTestId } = render(<McSongList data={mock_Songs} />);
    const comp = getByTestId('mcsonglist');
    expect(comp).toBeDefined();
  });

  it('should match snapshot', () => {
    renderer.create(
      <McSongList
        data={[
          {
            id: 1009,
            name: 'test-song',
            artist: 'test-artist',
          } as Song,
        ]}
      />,
    );
  });
});
