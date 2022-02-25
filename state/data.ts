import { Song, SongSection } from '../models/chords';
import { Chords, SongSections } from '../models/enums';

// TODO: Get this from DB or local storage
export const data_Songs: Song[] = [
  {
    id: 1,
    name: 'Polly',
    artist: 'Nirvana',
    sections: [
      {
        label: [
          SongSections.Verse,
          SongSections.Intro,
          SongSections.Instrumental,
        ],
        notes: 'Mild distortion',
        chords: [Chords.Em, Chords.G, Chords.D, Chords.C],
      } as SongSection,
      {
        label: [SongSections.Chorus],
        chords: [Chords.D, Chords.C, Chords.G, Chords.Bb],
      } as SongSection,
      {
        label: [SongSections.Outro],
        chords: [Chords.E],
      } as SongSection
    ]
  } as Song,
  {
    id: 2,
    name: 'Creep',
    artist: 'Radiohead',
    sections: [
      {
        label: [
          SongSections.Verse,
          SongSections.Intro,
        ],
        chords: [Chords.G, Chords.B, Chords.C, Chords.Cm],
      } as SongSection,
      {
        label: [SongSections.PreChorus, SongSections.Outro],
        notes: 'x3, very short',
        chords: [Chords.G],
      } as SongSection,
    ]
  } as Song,
];