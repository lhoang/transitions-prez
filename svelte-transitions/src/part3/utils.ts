import { splitWhen } from 'ramda';
import type { Song, Word } from './karaoke.interface';

export function convertToSong(text: string) {
  const [metaraw, raw]: Array<Array<string>> = splitWhen(
    (l: string) => !l.startsWith('#'),
    text.split('\n')
  );

  const regexParams = /#(\w+):([\w\. ]+)/;
  const metadata = Object.fromEntries(
    metaraw.map((d) => {
      const match = d.match(regexParams);
      return [match[1].toLowerCase(), match[2]];
    })
  );

  const recSplitLines = (
    remaining: Array<string>,
    found: Array<Array<string>>
  ): Array<Array<string>> => {
    if (remaining.length <= 2) {
      return found;
    } else {
      const [line, tail]: Array<Array<string>> = splitWhen(
        (row: string) => row.startsWith('-'),
        remaining
      );
      const endLine = tail.shift();
      return recSplitLines(tail, [...found, line.concat(endLine)]);
    }
  };

  const regexWord = /: (\d+) \d+ \d+ (.*)/;
  const lines = recSplitLines(raw, []).map((line) => {
    const ts = line[line.length - 1].startsWith('-')
      ? +line[line.length - 1].replace('- ', '')
      : 0;

    const words = line
      .filter((w) => !w.startsWith('-'))
      .map((word) => {
        const match = word.match(regexWord);
        return {
          ts: +match[1],
          text: match[2],
        } as Word;
      });

    return {
      ts,
      words,
    };
  });

  return {
    ...metadata,
    bpm: +metadata['bpm'],
    gap: +metadata['gap'],
    lyrics: lines,
  } as Song;
}

export async function readFile(path: string): Promise<Song> {
  const text = await fetch(path).then((response) => response.text());
  return convertToSong(text);
}
