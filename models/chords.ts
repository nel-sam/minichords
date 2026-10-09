import { SongSections } from './enums';

export type ChordRoot = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type ChordAccidental = '♯' | '♭';
export type ChordQuality = 'min' | 'maj' | 'add' | 'sus';
export type ChordExtension = '2'| '4' | '♭5'| '6' | '7' | '9' | '13';

export interface Chord {
  root: ChordRoot;
  accidental?: ChordAccidental;
  quality?: ChordQuality;
  extension?: ChordExtension;
}

export function formatChord(chord: Chord): string {
  return `${chord.root}${chord.accidental ?? ''}${chord.quality ?? ''}${chord.extension ?? ''}`;
}

export interface Song {
  id: number,
  name: string;
  artist: string;
  notes?: string,
  sections: SongSection[]
}

export interface SongSection {
  label: SongSections[];
  notes?: string,
  chords: Chord[]
}

