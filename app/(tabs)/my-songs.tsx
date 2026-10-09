import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { Song } from '../../models/chords';
import { data_Songs } from '../../state/data';
import { GlobalStyles } from '../../screens/shared/global-styles';
import { Separator } from '../../screens/shared/separator';

export default function MySongsScreen() {
	const colorScheme = useColorScheme();
	const [songs, setSongs] = useState<Song[]>(() => [...data_Songs]);

	useFocusEffect(
		useCallback(() => {
			setSongs([...data_Songs]);
		}, []),
	);

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
			margin: 'auto',
		},
		listItemContent: {
			width: '80%',
		},
		songName: {
			color: Colors[colorScheme].accent,
			fontWeight: 'bold',
			fontSize: RFPercentage(2.2),
		},
		iconArea: {
			width: '10%',
		},
	});

	interface ListItemProps {
		item: Song;
		index: number;
		onPress: () => void;
	}

	const ListItem = ({ item, index, onPress }: ListItemProps) => (
		<Pressable onPress={onPress}>
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
			<Separator />
		</Pressable>
	);

	return (
		<View style={GlobalStyles.container}>
			<FlatList
				data={songs}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item, index }) => (
					<ListItem
						item={item}
						index={index}
						onPress={() =>
							router.push({ pathname: '/songs/[id]', params: { id: String(item.id) } })
						}
					/>
				)}
			/>
		</View>
	);
}