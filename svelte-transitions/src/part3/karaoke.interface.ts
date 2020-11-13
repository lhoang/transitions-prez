export interface Word {
  ts: number;
  text: string;
}

export interface Line {
  ts: number;
  words: Array<Word>;
}

export interface Song {
  artist: string;
  title: string;
  bpm: number;
  gap?: number;
  lyrics: Array<Line>;
}
