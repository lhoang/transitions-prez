export interface Word {
  ms: number;
  text: string;
}

export interface Line {
  ms: number;
  words: Array<Word>;
}

export interface Song {
  artist: string;
  title: string;
  bpm: number;
  gap?: number;
  lyrics: Array<Line>;
}
