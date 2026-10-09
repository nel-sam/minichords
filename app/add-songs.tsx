import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Button,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
} from 'react-native';

import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import {
	Chord,
	ChordAccidental,
	ChordExtension,
	ChordQuality,
	ChordRoot,
	formatChord,
	Song,
} from '../models/chords';
import { SongSections } from '../models/enums';
import { data_Songs } from '../state/data';

interface SectionDraft {
	key: number;
	label: SongSections[];
	chords: Chord[];
	notes: string;
}

interface ChordEditorTarget {
	sectionKey: number;
	chordIndex?: number;
}

interface ChordDraft {
	root: ChordRoot | null;
	accidental?: ChordAccidental;
	quality?: ChordQuality;
	extension?: ChordExtension;
}

const sectionTypes = [
	SongSections.Verse,
	SongSections.Chorus,
	SongSections.Intro,
	SongSections.Outro,
	SongSections.Bridge,
	SongSections.Instrumental,
	SongSections.Interlude,
	SongSections.PreChorus,
];

const chordRoots: ChordRoot[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const chordAccidentals: ChordAccidental[] = ['♯', '♭'];
const chordQualities: ChordQuality[] = ['min', 'maj', 'add', 'sus'];
const chordExtensions: ChordExtension[] = ['2', '4', '♭5', '6', '7', '9', '13'];

function emptyChordDraft(): ChordDraft {
	return { root: null };
}

export default function AddSongsScreen() {
	const { t } = useTranslation();
	const { id: editIdParam } = useLocalSearchParams<{ id?: string }>();
	const editId = editIdParam ? Number(editIdParam) : undefined;
	const editingSong = editId === undefined ? undefined : data_Songs.find((song) => song.id === editId);
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme];
	const [name, setName] = useState('');
	const [artist, setArtist] = useState('');
	const [notes, setNotes] = useState('');
	const nextSectionKey = useRef(2);
	const [sections, setSections] = useState<SectionDraft[]>([
		{ key: 1, label: [SongSections.Verse], chords: [], notes: '' },
	]);
	const [chordEditorTarget, setChordEditorTarget] = useState<ChordEditorTarget | null>(null);
	const [chordDraft, setChordDraft] = useState<ChordDraft>(emptyChordDraft());
	const canSave =
		name.trim().length > 0 &&
		artist.trim().length > 0 &&
		sections.length > 0 &&
		sections.every((section) => section.label.length > 0 && section.chords.length > 0);

	useFocusEffect(
		useCallback(() => {
			const song = editId === undefined ? undefined : data_Songs.find((item) => item.id === editId);
			setName(song?.name ?? '');
			setArtist(song?.artist ?? '');
			setNotes(song?.notes ?? '');
			setSections(
				song
					? song.sections.map((section, index) => ({
							key: index + 1,
							label: [...section.label],
							chords: section.chords.map((chord) => ({ ...chord })),
							notes: section.notes ?? '',
						}))
					: [{ key: 1, label: [SongSections.Verse], chords: [], notes: '' }],
			);
			nextSectionKey.current = (song?.sections.length ?? 1) + 1;
			setChordEditorTarget(null);
			setChordDraft(emptyChordDraft());
		}, [editId]),
	);

	function updateSection(key: number, update: (section: SectionDraft) => SectionDraft) {
		setSections((current) => current.map((section) => (section.key === key ? update(section) : section)));
	}

	function addSection() {
		const key = nextSectionKey.current++;
		setSections((current) => [
			...current,
			{ key, label: [SongSections.Verse], chords: [], notes: '' },
		]);
	}

	function toggleSectionType(sectionKey: number, type: SongSections) {
		updateSection(sectionKey, (section) => {
			const labels = section.label.includes(type)
				? section.label.filter((label) => label !== type)
				: [...section.label, type];

			return {
				...section,
				label: sectionTypes.filter((label) => labels.includes(label)),
			};
		});
	}

	function openChordEditor(sectionKey: number, chordIndex?: number) {
		const section = sections.find((item) => item.key === sectionKey);
		const chord = chordIndex === undefined ? undefined : section?.chords[chordIndex];

		setChordDraft(chord ? { ...chord } : emptyChordDraft());
		setChordEditorTarget({ sectionKey, chordIndex });
	}

	function closeChordEditor() {
		setChordEditorTarget(null);
		setChordDraft(emptyChordDraft());
	}

	function toggleRoot(root: ChordRoot) {
		setChordDraft((current) => ({ ...current, root: current.root === root ? null : root }));
	}

	function toggleModifier<K extends 'accidental' | 'extension'>(
		modifier: K,
		value: NonNullable<ChordDraft[K]>,
	) {
		setChordDraft((current) => ({
			...current,
			[modifier]: current[modifier] === value ? undefined : value,
		}));
	}

	function toggleQuality(quality: ChordQuality) {
		setChordDraft((current) => {
			const nextQuality = current.quality === quality ? undefined : quality;
			const allowedExtensions = getAllowedExtensions(nextQuality);
			const extension = current.extension;

			return {
				...current,
				quality: nextQuality,
				extension: extension && allowedExtensions.includes(extension) ? extension : undefined,
			};
		});
	}

	function saveChord() {
		if (!chordEditorTarget || !chordDraft.root) {
			return;
		}

		const chord: Chord = { root: chordDraft.root };
		if (chordDraft.accidental) chord.accidental = chordDraft.accidental;
		if (chordDraft.quality) chord.quality = chordDraft.quality;
		if (chordDraft.extension) chord.extension = chordDraft.extension;

		updateSection(chordEditorTarget.sectionKey, (section) => ({
			...section,
			chords:
				chordEditorTarget.chordIndex === undefined
					? [...section.chords, chord]
					: section.chords.map((item, index) =>
						index === chordEditorTarget.chordIndex ? chord : item,
					),
		}));
		closeChordEditor();
	}

	function removeChord(sectionKey: number, chordIndex: number) {
		updateSection(sectionKey, (section) => ({
			...section,
			chords: section.chords.filter((_, index) => index !== chordIndex),
		}));
	}

	function saveSong() {
		if (!canSave) {
			return;
		}
		const existingIndex = editingSong
			? data_Songs.findIndex((song) => song.id === editingSong.id)
			: -1;

		const song: Song = {
			id:
				existingIndex >= 0
					? data_Songs[existingIndex].id
					: data_Songs.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1,
			name: name.trim(),
			artist: artist.trim(),
			notes: notes.trim() || undefined,
			sections: sections.map((section) => ({
				label: [...section.label],
				chords: [...section.chords],
				notes: section.notes.trim() || undefined,
			})),
		};

		if (existingIndex >= 0) {
			data_Songs[existingIndex] = song;
			router.setParams({ id: undefined });
			router.back();
			return;
		}

		data_Songs.push(song);
		router.replace('/');
	}

	function cancelEdit() {
		if (!editingSong) {
			return;
		}

		router.setParams({ id: undefined });
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace({ pathname: '/songs/[id]', params: { id: String(editingSong.id) } });
		}
	}

	return (
		<View style={styles.screen}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={styles.keyboard}>
				<ScrollView
					contentContainerStyle={styles.content}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}>
					<Text style={[styles.heading, { color: colors.text }]}>
						{editingSong ? t('edit-song-title') : t('add-song-title')}
					</Text>

					<View style={styles.form}>
						<FormField label={t('song-title')} colors={colors}>
							<TextInput
								accessibilityLabel={t('song-title')}
								autoCapitalize="words"
								placeholder={t('song-title-placeholder')}
								placeholderTextColor={colors.muted}
								returnKeyType="next"
								value={name}
								onChangeText={setName}
								style={[styles.input, { color: colors.text }]}
							/>
						</FormField>

						<FormField label={t('artist')} colors={colors}>
							<TextInput
								accessibilityLabel={t('artist')}
								autoCapitalize="words"
								placeholder={t('artist-placeholder')}
								placeholderTextColor={colors.muted}
								returnKeyType="next"
								value={artist}
								onChangeText={setArtist}
								style={[styles.input, { color: colors.text }]}
							/>
						</FormField>

						<FormField label={t('notes-optional')} colors={colors}>
							<TextInput
								accessibilityLabel={t('notes-optional')}
								multiline
								placeholder={t('song-notes-placeholder')}
								placeholderTextColor={colors.muted}
								textAlignVertical="top"
								value={notes}
								onChangeText={setNotes}
								style={[styles.input, styles.notesInput, { color: colors.text }]}
							/>
						</FormField>
					</View>

					<View style={styles.sectionsHeading}>
						<Text style={[styles.subheading, { color: colors.text }]}>{t('sections')}</Text>
						<Text style={[styles.requiredHint, { color: colors.muted }]}>{t('chords-required')}</Text>
					</View>

					{sections.map((section, index) => (
						<View
							key={section.key}
							style={[styles.sectionEditor, { borderTopColor: colors.border }]}>
							<View style={styles.sectionHeading}>
								<View style={styles.sectionHeadingTitle}>
									<Text style={[styles.sectionNumber, { color: colors.accent }]}>
										{String(index + 1).padStart(2, '0')}
									</Text>
									<Text style={[styles.sectionTitle, { color: colors.text }]}>
										{section.label.map((label) => t(sectionTranslationKey(label))).join(' / ')}
									</Text>
								</View>
								<Pressable
									accessibilityRole="button"
									accessibilityLabel={t('remove-section')}
									onPress={() => setSections((current) => current.filter((item) => item.key !== section.key))}
									style={styles.iconButton}>
									<FontAwesomeIcon icon={faTrashCan} color={colors.muted} />
								</Pressable>
							</View>

							<Text style={[styles.label, { color: colors.muted }]}>{t('section-type')}</Text>
							<View style={styles.choiceRow}>
								{sectionTypes.map((type) => {
									const selected = section.label.includes(type);

									return (
										<Pressable
											key={type}
											accessibilityRole="button"
											accessibilityState={{ selected }}
											onPress={() =>
												toggleSectionType(section.key, type)
											}
											style={[
												styles.choice,
												{
													backgroundColor: selected ? colors.accent : colors.surface,
													borderColor: selected ? colors.accent : colors.border,
												},
											]}>
											<Text
												style={[
													styles.choiceText,
													{ color: selected ? colors.accentForeground : colors.text },
												]}>
												{t(sectionTranslationKey(type))}
											</Text>
										</Pressable>
									);
								})}
							</View>

							<Text style={[styles.label, { color: colors.muted }]}>{t('chord-sequence')}</Text>
							<View style={styles.selectedChords}>
								{section.chords.length === 0 ? (
									<Text style={[styles.emptyChords, { color: colors.muted }]}>{t('no-chords-yet')}</Text>
								) : (
									section.chords.map((chord, chordIndex) => (
										<View
											key={`${section.key}-${chordIndex}`}
											style={[styles.selectedChord]}>
											<Pressable
												accessibilityRole="button"
												accessibilityLabel={t('edit-chord', { chord: formatChord(chord) })}
												onPress={() => openChordEditor(section.key, chordIndex)}
												style={styles.chordChipEdit}>
												<Text style={[styles.selectedChordText, { color: colors.text }]}>
													{formatChord(chord)}
												</Text>
											</Pressable>
											<Pressable
												accessibilityRole="button"
												accessibilityLabel={t('remove-chord', { chord: formatChord(chord) })}
												onPress={() => removeChord(section.key, chordIndex)}
												style={styles.chordChipRemove}>
												<FontAwesomeIcon icon={faXmark} size={12} color={colors.muted} />
											</Pressable>
										</View>
									))
								)}
							</View>
							<Button
								title={t('append-chord')}
								onPress={() => openChordEditor(section.key)}
								color={colors.accent}
							/>

							<FormField label={t('section-notes-optional')} colors={colors}>
								<TextInput
									accessibilityLabel={t('section-notes-optional')}
									placeholder={t('section-notes-placeholder')}
									placeholderTextColor={colors.muted}
									value={section.notes}
									onChangeText={(value) =>
										updateSection(section.key, (item) => ({ ...item, notes: value }))
									}
									style={[styles.input, { color: colors.text }]}
								/>
							</FormField>
						</View>
					))}

					<Button title={t('add-section')} onPress={addSection} color={colors.accent} />
					{editingSong ? (
						<Button title={t('cancel')} onPress={cancelEdit} color={colors.muted} />
					) : null}
					<Button
						title={editingSong ? t('save-changes') : t('save-song')}
						onPress={saveSong}
						disabled={!canSave}
						color={colors.accent}
					/>
				</ScrollView>
			</KeyboardAvoidingView>

			<Modal
				visible={chordEditorTarget !== null}
				transparent
				animationType="slide"
				onRequestClose={closeChordEditor}>
				<View style={[styles.modalOverlay, { backgroundColor: colors.scrim }]}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t('cancel')}
						onPress={closeChordEditor}
						style={StyleSheet.absoluteFill}
					/>
					<View style={[styles.modalSheet]}>
						<View style={[styles.modalHandle]} />
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, { color: colors.text }]}>
								{chordEditorTarget?.chordIndex !== undefined
									? t('edit-chord-title')
									: t('new-chord-title')}
							</Text>
							<Pressable
								accessibilityRole="button"
								accessibilityLabel={t('cancel')}
								onPress={closeChordEditor}
								style={styles.modalClose}>
								<FontAwesomeIcon icon={faXmark} color={colors.muted} />
							</Pressable>
						</View>

						<ScrollView
							style={styles.modalScroll}
							contentContainerStyle={styles.modalContent}
							keyboardShouldPersistTaps="handled">
							<View style={[styles.chordPreview]}>
								<Text style={[styles.chordPreviewValue, { color: colors.text }]}>
									{formatChordDraft(chordDraft)}
								</Text>
							</View>
							<ChordOptionGroup
								colors={colors}
								options={chordRoots.map((root) => ({ value: root, label: root }))}
								selected={chordDraft.root}
								onSelect={toggleRoot}
							/>
							<ChordOptionGroup
								colors={colors}
								options={chordAccidentals.map((accidental) => ({
									value: accidental,
									label: accidental,
								}))}
								selected={chordDraft.accidental}
								onSelect={(value) => toggleModifier('accidental', value)}
							/>
							<ChordOptionGroup
								colors={colors}
								options={chordQualities.map((quality) => ({ value: quality, label: quality }))}
								selected={chordDraft.quality}
								onSelect={toggleQuality}
							/>
							<ChordOptionGroup
								colors={colors}
								options={chordExtensions.map((extension) => ({ value: extension, label: extension }))}
								selected={chordDraft.extension}
								onSelect={(value) => toggleModifier('extension', value)}
								isOptionDisabled={(extension) => !getAllowedExtensions(chordDraft.quality).includes(extension)}
							/>
						</ScrollView>

						<View style={[styles.modalActions, { borderTopColor: colors.border }]}>
							<Button title={t('cancel')} onPress={closeChordEditor} color={colors.muted} />
							<Button
								title={chordEditorTarget?.chordIndex !== undefined ? t('save-chord') : t('append-chord')}
								disabled={!chordDraft.root}
								onPress={saveChord}
								color={colors.accent}
							/>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

function FormField({
	label,
	colors,
	children,
}: {
	label: string;
	colors: (typeof Colors)['light'];
	children: React.ReactNode;
}) {
	return (
		<View style={styles.field}>
			<Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
			<View style={[styles.inputFrame, { backgroundColor: colors.surface, borderColor: colors.border }]}>
				{children}
			</View>
		</View>
	);
}

function ChordOptionGroup<T extends string>({
	colors,
	options,
	selected,
	onSelect,
	isOptionDisabled,
}: {
	colors: (typeof Colors)['light'];
	options: readonly { value: T; label: string }[];
	selected: T | null | undefined;
	onSelect: (value: T) => void;
	isOptionDisabled?: (value: T) => boolean;
}) {
	return (
		<View style={styles.choiceRow}>
			{options.map((option) => {
				const isSelected = selected === option.value;
				const isDisabled = !isSelected && (
					(selected !== null && selected !== undefined) ||
					(isOptionDisabled?.(option.value) ?? false)
				);

				return (
					<Pressable
						key={option.value}
						disabled={isDisabled}
						accessibilityRole="button"
						accessibilityState={{ selected: isSelected, disabled: isDisabled }}
						onPress={() => onSelect(option.value)}
						style={[
							styles.choice,
							{
								backgroundColor: isSelected ? colors.accent : colors.choiceSurface,
								borderColor: isDisabled
									? colors.disabledSurface
									: isSelected
										? colors.accent
										: colors.border,
							},
						]}>
						<Text
							style={[
								styles.choiceText,
								{
									color: isSelected
										? colors.accentForeground
										: isDisabled
											? colors.disabledText
											: colors.text,
								},
							]}>
							{option.label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

function formatChordDraft(draft: ChordDraft) {
	if (!draft.root) {
		return '—';
	}

	const chord: Chord = { root: draft.root };
	if (draft.accidental) chord.accidental = draft.accidental;
	if (draft.quality) chord.quality = draft.quality;
	if (draft.extension) chord.extension = draft.extension;
	return formatChord(chord);
}

function getAllowedExtensions(quality?: ChordQuality): ChordExtension[] {
	switch (quality) {
		case 'sus':
			return ['2', '4'];
		case 'min':
			return ['6', '7', '9', '13'];
		case 'maj':
			return ['7', '9', '13'];
		default:
			return chordExtensions;
	}
}

function sectionTranslationKey(section: SongSections) {
	const sectionName = SongSections[section].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	return `section-${sectionName}`;
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	keyboard: {
		flex: 1,
	},
	content: {
		alignSelf: 'center',
		width: '100%',
		maxWidth: 680,
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 32,
		paddingBottom: 36,
	},
	heading: {
		fontSize: 28,
		fontWeight: '700',
		marginBottom: 28,
	},
	form: {
		gap: 20,
	},
	sectionsHeading: {
		flexDirection: 'row',
		alignItems: 'baseline',
		justifyContent: 'space-between',
		marginTop: 34,
		marginBottom: 4,
	},
	subheading: {
		fontSize: 20,
		fontWeight: '700',
	},
	requiredHint: {
		fontSize: 12,
	},
	sectionEditor: {
		borderTopWidth: StyleSheet.hairlineWidth,
		paddingTop: 20,
		paddingBottom: 24,
		gap: 12,
	},
	sectionHeading: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 4,
	},
	sectionHeadingTitle: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	sectionNumber: {
		fontSize: 14,
		fontWeight: '700',
	},
	sectionTitle: {
		fontSize: 17,
		fontWeight: '700',
	},
	iconButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	choiceRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	choice: {
		minHeight: 38,
		justifyContent: 'center',
		paddingHorizontal: 12,
		borderWidth: 1,
		borderRadius: 19,
	},
	choiceText: {
		fontSize: 13,
		fontWeight: '600',
	},
	selectedChords: {
		minHeight: 48,
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: 8,
	},
	emptyChords: {
		fontSize: 14,
	},
	selectedChord: {
		minHeight: 38,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 12,
		borderRadius: 19,
	},
	chordChipEdit: {
		minHeight: 38,
		justifyContent: 'center',
		paddingLeft: 12,
	},
	chordChipRemove: {
		width: 34,
		minHeight: 38,
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedChordText: {
		fontSize: 14,
		fontWeight: '700',
	},
	chordPreview: {
		minHeight: 76,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		borderRadius: 8,
		marginTop: 4,
	},
	chordPreviewValue: {
		fontSize: 28,
		fontWeight: '700',
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	modalSheet: {
		alignSelf: 'center',
		width: '100%',
		maxWidth: 680,
		maxHeight: '90%',
		borderWidth: 1,
		borderBottomWidth: 0,
		borderTopLeftRadius: 18,
		borderTopRightRadius: 18,
		paddingTop: 12,
		paddingBottom: 12,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 20,
		paddingRight: 12,
		paddingBottom: 8,
	},
	modalHandle: {
		width: 28,
		height: 4,
		borderRadius: 2,
		alignSelf: 'center',
		marginBottom: 6,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
	},
	modalClose: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalScroll: {
		flexShrink: 1,
	},
	modalContent: {
		paddingHorizontal: 20,
		paddingTop: 8,
		paddingBottom: 16,
		gap: 14,
	},
	modalActions: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		borderTopWidth: StyleSheet.hairlineWidth,
		paddingTop: 8,
		paddingHorizontal: 12,
	},
	field: {
		gap: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
	},
	inputFrame: {
		borderWidth: 1,
		borderRadius: 10,
	},
	input: {
		minHeight: 52,
		paddingHorizontal: 15,
		paddingVertical: 13,
		fontSize: 16,
	},
	notesInput: {
		minHeight: 112,
	},
});