import { Stack, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { formatChord } from '../../models/chords';
import { SongSections } from '../../models/enums';
import { Song } from '../../models/chords';
import { data_Songs } from '../../state/data';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 720,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 22,
    marginBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  artist: {
    fontSize: 24,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    paddingTop: 22,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionNumber: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginRight: 10,
  },
  sectionNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  chordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  chordTile: {
    minWidth: 62,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  chordText: {
    fontSize: 19,
    fontWeight: '700',
  },
  note: {
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderLeftWidth: 3,
    borderRadius: 5,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default function SongDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [song, setSong] = useState<Song | undefined>(() =>
    data_Songs.find((item) => item.id === Number(id)),
  );

  useFocusEffect(
    useCallback(() => {
      setSong(data_Songs.find((item) => item.id === Number(id)));
    }, [id]),
  );

  if (!song) {
    return (
      <View style={[styles.screen, styles.content]}>
        <Text style={[styles.emptyText, { color: colors.muted }]}>Song not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: song.name, headerBackTitle: t('back') }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={[styles.intro, { borderBottomColor: colors.border }]}>
          <Text style={[styles.artist, { color: colors.text }]}>{song.artist}</Text>
          <Text style={[styles.sectionCount, { color: colors.muted }]}>
            {song.sections.length} {song.sections.length === 1 ? t('section') : t('sections')}
          </Text>
        </View>

        <Button
          title={t('edit-song')}
          onPress={() =>
            router.push({ pathname: '/add-songs', params: { id: String(song.id) } })
          }
          color={colors.accent}
        />

        {song.notes ? (
          <View
            style={[
              styles.note,
              {
                backgroundColor: colors.noteSurface,
                borderLeftColor: colors.accent,
              },
            ]}>
            <Text style={[styles.noteLabel, { color: colors.accent }]}>{t('notes')}</Text>
            <Text style={[styles.noteText, { color: colors.text }]}>{song.notes}</Text>
          </View>
        ) : null}

        {song.sections.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.muted }]}>{t('no-chord-sections')}</Text>
        ) : null}

        {song.sections.map((section, index) => (
          <View
            key={`${id}-${index}`}
            style={[styles.section, { borderBottomColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumber, { backgroundColor: colors.noteSurface }]}>
                <Text style={[styles.sectionNumberText, { color: colors.accent }]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {section.label
                  .map((label) => t(sectionTranslationKey(label)))
                  .join(' / ')}
              </Text>
            </View>

            <View style={styles.chordRow}>
              {section.chords.map((chord, chordIndex) => (
                <View
                  key={`${id}-${index}-${chordIndex}`}
                  style={[styles.chordTile]}>
                  <Text style={[styles.chordText, { color: colors.text }]}>
                    {formatChord(chord)}
                  </Text>
                </View>
              ))}
            </View>

            {section.notes ? (
              <View
                style={[
                  styles.note,
                  {
                    backgroundColor: colors.noteSurface,
                    borderLeftColor: colors.accent,
                  },
                ]}>
                <Text style={[styles.noteText, { color: colors.text }]}>
                  {section.notes}
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function sectionTranslationKey(section: SongSections) {
  const sectionName = SongSections[section].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return `section-${sectionName}`;
}