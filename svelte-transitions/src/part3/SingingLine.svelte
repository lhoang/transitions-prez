<script lang="ts">
  import type { Line, Song } from "./karaoke.interface";
  import { tweened } from "svelte/motion";
  import { getEltPositions, getLineTimings } from "./utils";
  import { transpose } from "ramda";

  export let song: Song = {
    artist: "",
    title: "",
    bpm: 200,
    lyrics: []
  };

  let currentLine: Line;
  const ballX = tweened(100, {
      interpolate: (a, b) => {
        const alpha = Math.PI / 4;
        const v0 = 1.41;
        return t => a + (b - a) * v0 * Math.cos(alpha) * t;
      }
    }
  );

  const ballY = tweened(0, {
    interpolate: () => {
      const g = 4;
      const alpha = Math.PI / 4;
      const v0 = 1.41;
      return t => -g / 2 * Math.pow(t, 2) + v0 * Math.sin(alpha) * t;
    }
  });


  let start: number;
  let newLineStart: number = 0;
  // Period of a beat in ms.
  let beat = 60 * 1000 / song.bpm;

  let lines = song.lyrics;

  let measure: number;
  let playing = false;
  let i: number;

  const stop = () => {
    playing = false;
    measure = 0;
  };

  const play = () => {
    if (playing) {
      playing = !playing;
      return;
    }

    if (!measure) {
      start = window.performance.now();
      currentLine = lines[0];
      i = 0;
    }

    playing = true;

    let endLine = lines[0].ms;

    const continuePlaying = (ts: number) => {
      measure = Math.round((ts - start) / beat);
      if (measure < 100 && playing) {
        if (measure >= endLine) {
          newLineStart = endLine;
          const newLine = lines[++i];
          endLine = newLine.ms;
          currentLine = newLine;
          ballX.set(100, { duration: 0 });
        }
        window.requestAnimationFrame(continuePlaying);
      } else {
        playing = false;
      }
    };
    window.requestAnimationFrame(continuePlaying);

  };


  let lineElt: HTMLElement;
  let tweenParams: Array<[number, number]> = [];
  let children;
  $: {
    if (currentLine && lineElt) {
      // Delay, waiting for the DOM to be filled
      setTimeout(() => children = [...lineElt?.children], 200);
    }
  }

  $: positions = getEltPositions(children);
  $: timings = currentLine
    ? getLineTimings(currentLine, newLineStart, beat)
    : [];
  $: tweenParams = transpose([positions, timings])
    .filter(p => p.length === 2);

  // resolve sequentially the promises
  $:(async () =>
      await tweenParams.reduce(async (previousPromise, [pos, timing]) => {
        await previousPromise;
        // console.log({pos, timing});
        return await Promise.all([
          ballX.set(pos, { duration: timing }),
          ballY.set(0, { duration: timing })
        ]);
      }, Promise.resolve([]))
  )();


</script>
<svelte:head>
  <link href="http://fonts.cdnfonts.com/css/vcr-osd-mono" rel="stylesheet">
</svelte:head>

<div class="container">
  <div class="controls">
    <button on:click={play}> {playing ? '⏸' : '▶️' } </button>
    <button on:click={stop}> ⏹</button>
    <div>Measure : {measure}</div>
  </div>
  <div class="lyrics">
    <div class="ball" style="left:{$ballX}px; bottom: {25+$ballY*25}px"></div>
    <div class="current-line" bind:this={lineElt}>
      {#each currentLine?.words ?? [] as word}
        <div class="word">
          {@html word.text.replace(' ', '&nbsp;')}
        </div>
      {/each}
    </div>
  </div>
</div>




<style type="text/scss">
  .container {
    display: flex;
    flex-direction: column;
  }

  .lyrics {
    margin-top: 15vh;
  }

  .ball {
    border: solid 1px black;
    border-radius: 50%;
    background-color: var(--font-color);
    width: 2rem;
    height: 2rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .current-line {
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-family: 'VCR OSD Mono', sans-serif;
    font-size: 3rem;
    -webkit-text-stroke: 1px black;
    -webkit-text-fill-color: var(--font-color);
  }

  button {
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0;
    background: none;
  }

</style>