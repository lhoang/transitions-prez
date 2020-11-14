// Isolated Module ?
import { convertToSong, getLineTimings } from "./utils";
import type { Line } from "./karaoke.interface";

export {};

describe('Karaoke Utils', () => {
  it('should parse Song metadata', () => {
    const song = convertToSong(rawText);
    expect(song).toEqual(
      expect.objectContaining({
        title: 'le chasseur',
        artist: 'michel delpech',
        bpm: 223.36,
        gap: 5488,
      })
    );
  });

  it('should parse Song lyrics', () => {
    const song = convertToSong(rawText);
    expect(song.lyrics).toHaveLength(2);
    expect(song.lyrics).toEqual([
      {
        ts: 26,
        words: [
          { ts: 0, text: 'Il' },
          { ts: 2, text: ' é' },
        ],
      },
      {
        ts: 64,
        words: [
          { ts: 33, text: 'On' },
          { ts: 36, text: ' a' },
        ],
      },
    ]);
  });

  it('should get the timings of a line', () => {
    const line: Line = {
      ms: 10,
      words: [
        { ms: 40, text: 'Il' },
        { ms: 42, text: ' é' },
        { ms: 46, text: ' tait' },
      ],
    };

    const res = getLineTimings(line, 38, 150);
    expect(res).toEqual([300, 300, 600]);
  });
});

const rawText =
  '#TITLE:le chasseur\n' +
  '#ARTIST:michel delpech\n' +
  '#BPM:223.36\n' +
  '#GAP:5488\n' +
  ': 0 1 0 Il\n' +
  ': 2 1 0  é\n' +
  '- 26\n' +
  ': 33 1 0 On\n' +
  ': 36 1 0  a\n' +
  '- 64\n' +
  'E';
