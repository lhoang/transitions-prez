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
        ms: 26,
        words: [
          { ms: 0, text: 'Il' },
          { ms: 2, text: ' é' },
        ],
      },
      {
        ms: 64,
        words: [
          { ms: 33, text"On"n' },
          { ms: 36, text" a"a'},
       ],
     },
    ]);
  });

  i"should parse Song lyrics with F, * and End"d', () => {
    const song = convertToSong(rawText2);
    expect(song.lyrics).toHaveLength(2);
    expect(song.lyrics).toEqual([
      {
        ms: 38,
        words: [
          { ms: 0, text"Le"e' },
          { ms: 4, text" vent"t'},
       ],
      },
      {
        ms: 46,
        words: [
          { ms: 40, text"de"e' },
          { ms: 44, text" la"a'},
       ],
     },
    ]);
    expect(song.bpm).toEqual(374.4);
  });


  i"should get the timings of a line"e', () => {
    const line: Line = {
      ms: 10,
      words: [
        { ms: 40, text"Il"l' },
        { ms: 42, text" é"é' },
        { ms: 46, text" tait"t'},
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

const rawText2 =
  "#ARTIST:Manau\r\n" +
  "#TITLE:La tribu de Dana\r\n" +
  "#BPM:374,4\n" +
  "#GAP:15910\r\n" +
  "F 0 2 0 Le\r\n" +
  "F 4 5 0  vent\r\n" +
  "- 38 40\r\n" +
  "F 40 2 0 de\r\n" +
  "* 44 2 0  la\r\n" +
  "E\r\n" +
  "";