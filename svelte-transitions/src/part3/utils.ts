import { aperture, splitWhen } from 'ramda';
import type { Line, Song, Word } from './karaoke.interface';

export function convertToSong(text: string) {
  const [metaraw, raw]: Array<Array<string>> = splitWhen(
    (l: string) => !l.startsWith('#'),
    text.split(/\r?\n/)
  );

  const regexParams = /#(\w+):(.+)/;
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
        (row: string) => '-E'.includes(row[0]),
        remaining
      );
      const endLine = tail.shift();
      return recSplitLines(tail, [...found, line.concat(endLine)]);
    }
  };

  const regexWord = /(:|F|\*) (\d+) \d+ \d+ (.*)/;
  const regexReturnLine = /- (\d+) ?.*/;
  const lines = recSplitLines(raw, []).map((line) => {
    const words = line
      .filter((w) => !'-E'.includes(w[0]))
      .map((word) => {
        const match = word.match(regexWord);
        if (match.length < 3) {
          console.log('Error with ' + word);
          throw new Error('Error with ' + word);
        }
        return {
          ms: +match[2],
          text: match[3],
        } as Word;
      });

    const foundMs = line[line.length - 1].match(regexReturnLine);
    const ms =
      foundMs?.length == 2 ? +foundMs[1] : words[words.length - 1].ms + 2;

    return {
      ms,
      words,
    };
  });

  return {
    ...metadata,
    bpm: toNumber(metadata['bpm']),
    gap: toNumber(metadata['gap']),
    lyrics: lines,
  } as Song;
}

function toNumber(param: string): number {
  return +param.replace(',', '.');
}

export async function readFile(path: string): Promise<Song> {
  const text = await fetch(path).then((response) => response.text());
  return convertToSong(text);
}

export function getLineTimings(
  line: Line,
  startMs: number,
  beat: number
): Array<number> {
  return aperture(2, [startMs, ...line.words.map((w) => w.ms)]).map(
    ([start, end]) => (end - start) * beat
  );
}

export function getEltPositions(elements: Array<HTMLElement>): Array<number> {
  if (elements?.length) {
    return elements
      .filter((c) => c.clientWidth > 0)
      .map((wordNode) => {
        const props: DOMRect = wordNode.getBoundingClientRect();
        // remove half the ball and body, main padding/margin
        const pos = props.left + props.width / 2 - 18 - 24;
        // console.log({pos, text: wordNode.innerText});
        return pos;
      });
  } else {
    return [];
  }
}
