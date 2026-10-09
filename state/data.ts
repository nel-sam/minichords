import { Song } from '../models/chords';
import { SongSections } from '../models/enums';

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
        chords: [
          { root: 'E', quality: 'min' },
          { root: 'G' },
          { root: 'D' },
          { root: 'C' },
        ],
      },
      {
        label: [SongSections.Chorus],
        chords: [
          { root: 'D' },
          { root: 'C' },
          { root: 'G' },
          { root: 'B', accidental: '♭' },
        ],
      },
      {
        label: [SongSections.Outro],
        chords: [{ root: 'E' }],
      },
    ]
  },
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
        chords: [
          { root: 'G' },
          { root: 'B' },
          { root: 'C' },
          { root: 'C', quality: 'min' },
        ],
      },
      {
        label: [SongSections.PreChorus, SongSections.Outro],
        chords: [{ root: 'G' }],
      },
    ]
  },
];