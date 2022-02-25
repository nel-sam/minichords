import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Text, View } from '../components/Themed';
import { Song, SongSection } from '../models/chords';
import { Chords, SongSections } from '../models/enums';
import { data_Songs } from '../state/data';
import { RootTabScreenProps } from '../types';
import { Constants } from './shared/constants';
import { GlobalStyles } from './shared/global-styles';
import { Separator } from './shared/separator';

export default function MySongsScreen({ navigation }: RootTabScreenProps<'TabThree'>) {

  const styles = StyleSheet.create({
    listItem: {
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
      margin: 'auto'
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
      width: '10%'
    }
  });

  interface ListItemProps {
    item: Song,
    index: number,
  }

  const ListItem = ({ item, index }: ListItemProps) => (
    <View>
      <View style={styles.listItem}>
        <View style={styles.listItemIndex}>
          <Text style={styles.listItemIndexText}>{index}</Text>
        </View>
        <View style={styles.listItemContent}>
          <Text style={styles.songName}>{item.name}</Text>
          <Text>{item.artist}</Text>
        </View>
        <View style={styles.iconArea}>
          <FontAwesomeIcon
            icon={faStar}
          />
        </View>
      </View>
      <Separator></Separator>
    </View>
  );

  return (<View style={GlobalStyles.container}>
    <FlatList
      data={data_Songs}
      renderItem={({ item, index }) => <ListItem item={item} index={index} />}>
    </FlatList>
  </View >);
}