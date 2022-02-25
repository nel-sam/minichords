import { Chords, SongSections } from './enums';

export interface Song {
  id: number,
  name: string;
  artist: string;
  sections: SongSection[]
}

export interface SongSection {
  label: SongSections[];
  notes?: string,
  chords: Chords[]
}

