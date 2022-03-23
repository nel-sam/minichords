import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Song } from '../../models/chords';
import { Constants } from '../../screens/shared/Constants';
import { McSeparator } from '../McSeparator/McSeparator';

interface McSongListProps {
  data: Song[];
}

interface ListItemProps {
  item: Song;
  index: number;
}

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
  },
  listItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  listItemIndex: {
    width: '10%',
    textAlign: 'center',
  },
  listItemIndexText: {
    margin: 'auto',
  },
  listItemContent: {
    width: '80%',
  },
  songName: {
    color: Constants.highlightColor,
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
  },
  iconArea: {
    width: '10%',
  },
});

const ListItem = ({ item, index }: ListItemProps) => (
  <View testID={`${item.artist}-${item.name}`}>
    <View style={styles.listItem}>
      <View style={styles.listItemIndex}>
        <Text style={styles.listItemIndexText}>{index}</Text>
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.songName}>{item.name}</Text>
        <Text>{item.artist}</Text>
      </View>
      <View style={styles.iconArea}>
        <FontAwesomeIcon icon={faStar} />
      </View>
    </View>
    <McSeparator></McSeparator>
  </View>
);

export default function McSongList({ data }: McSongListProps): JSX.Element {
  return (
    <FlatList
      testID='mcsonglist'
      style={styles.flatList}
      data={data}
      keyExtractor={(item: any | Song) => item.id}
      renderItem={({ item, index }) => <ListItem item={item} index={index} />}
    ></FlatList>
  );
}
