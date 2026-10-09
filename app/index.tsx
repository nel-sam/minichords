import { faStar, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
	Button,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Song } from '../models/chords';
import { data_Songs } from '../state/data';
import { Separator } from '../screens/shared/separator';

export default function MySongsScreen() {
	const { t } = useTranslation();
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme];
	const insets = useSafeAreaInsets();
	const [songs, setSongs] = useState<Song[]>(() => [...data_Songs]);
	const [pendingDelete, setPendingDelete] = useState<Song | null>(null);

	useFocusEffect(
		useCallback(() => {
			setSongs([...data_Songs]);
		}, []),
	);

	function confirmDelete() {
		if (!pendingDelete) {
			return;
		}

		const songIndex = data_Songs.findIndex((song) => song.id === pendingDelete.id);
		if (songIndex >= 0) {
			data_Songs.splice(songIndex, 1);
			setSongs([...data_Songs]);
		}
		setPendingDelete(null);
	}

	return (
		<View style={styles.screen}>
			<FlatList
				data={songs}
				keyExtractor={(song) => String(song.id)}
				contentContainerStyle={styles.listContent}
				ListEmptyComponent={
					<Text style={[styles.empty, { color: colors.muted }]}>{t('no-songs-yet')}</Text>
				}
				renderItem={({ item, index }) => (
					<Swipeable
						overshootRight={false}
						rightThreshold={40}
						renderRightActions={() => (
							<Pressable
								accessibilityRole="button"
								accessibilityLabel={t('delete-song', { song: item.name })}
								onPress={() => setPendingDelete(item)}
								style={[styles.deleteAction, { backgroundColor: colors.danger }]}
							>
								<FontAwesomeIcon icon={faTrashCan} color={colors.dangerForeground} />
								<Text style={[styles.deleteActionText, { color: colors.dangerForeground }]}>
									{t('delete')}
								</Text>
							</Pressable>
						)}>
						<Pressable
							accessibilityRole="button"
							onPress={() =>
								router.push({ pathname: '/songs/[id]', params: { id: String(item.id) } })
							}
							style={styles.rowPressable}>
							<View style={styles.listItem}>
								<View style={styles.listItemIndex}>
									<Text style={[styles.listItemIndexText, { color: colors.muted }]}>
										{index + 1}
									</Text>
								</View>
								<View style={styles.listItemContent}>
									<Text style={[styles.songName, { color: colors.accent }]}>{item.name}</Text>
									<Text style={[styles.artist, { color: colors.muted }]}>{item.artist}</Text>
								</View>
								<View style={styles.iconArea}>
									<FontAwesomeIcon icon={faStar} color={colors.accent} />
								</View>
							</View>
							<Separator />
						</Pressable>
					</Swipeable>
				)}
			/>

			<View
				style={[
					styles.footer,
					{
						backgroundColor: colors.background,
						borderTopColor: colors.border,
						paddingBottom: Math.max(insets.bottom, 12),
					},
				]}>
				<Button title={t('add-songs')} onPress={() => router.push('/add-songs')} color={colors.accent} />
			</View>

			<Modal
				visible={pendingDelete !== null}
				transparent
				animationType="fade"
				onRequestClose={() => setPendingDelete(null)}>
				<View style={[styles.confirmOverlay, { backgroundColor: colors.scrim }]}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t('cancel')}
						onPress={() => setPendingDelete(null)}
						style={StyleSheet.absoluteFill}
					/>
					<View style={[styles.confirmDialog]}>
						<Text style={[styles.confirmTitle, { color: colors.text }]}>{t('delete-song-title')}</Text>
						<Text style={[styles.confirmMessage, { color: colors.muted }]}>
							{t('delete-song-message', { song: pendingDelete?.name ?? '' })}
						</Text>
						<View style={styles.confirmActions}>
							<Pressable
								accessibilityRole="button"
								onPress={() => setPendingDelete(null)}
								style={[styles.cancelButton, { borderColor: colors.border }]}>
								<Text style={[styles.cancelButtonText, { color: colors.text }]}>{t('cancel')}</Text>
							</Pressable>
							<Pressable
								accessibilityRole="button"
								onPress={confirmDelete}
								style={[styles.confirmDeleteButton, { backgroundColor: colors.danger }]}>
								<Text style={[styles.confirmDeleteText, { color: colors.dangerForeground }]}>
									{t('delete')}
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	listContent: {
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
	rowPressable: {
		marginVertical: 4,
	},
	listItem: {
		minHeight: 76,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
	},
	listItemIndex: {
		width: 40,
		alignItems: 'center',
	},
	listItemIndexText: {
		fontSize: 13,
		fontWeight: '600',
	},
	listItemContent: {
		flex: 1,
		gap: 3,
	},
	songName: {
		fontSize: 17,
		fontWeight: '700',
	},
	artist: {
		fontSize: 14,
	},
	iconArea: {
		width: 36,
		alignItems: 'center',
	},
	deleteAction: {
		width: 92,
		marginVertical: 4,
		marginLeft: 8,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 5,
	},
	deleteActionText: {
		fontSize: 12,
		fontWeight: '700',
	},
	empty: {
		paddingTop: 32,
		textAlign: 'center',
		fontSize: 16,
	},
	footer: {
		borderTopWidth: StyleSheet.hairlineWidth,
		paddingTop: 10,
		paddingHorizontal: 24,
	},
	confirmOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	confirmDialog: {
		width: '100%',
		maxWidth: 420,
		padding: 22,
		borderRadius: 14,
	},
	confirmTitle: {
		fontSize: 20,
		fontWeight: '700',
	},
	confirmMessage: {
		marginTop: 10,
		fontSize: 15,
		lineHeight: 21,
	},
	confirmActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 10,
		marginTop: 24,
	},
	cancelButton: {
		minHeight: 44,
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderWidth: 1,
		borderRadius: 8,
	},
	cancelButtonText: {
		fontSize: 14,
		fontWeight: '600',
	},
	confirmDeleteButton: {
		minHeight: 44,
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	confirmDeleteText: {
		fontSize: 14,
		fontWeight: '700',
	},
});