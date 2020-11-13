<script lang="ts">
  import type { Line, Song, Word } from "./karaoke.interface";

  export let song: Song = {
    artist: "",
    title: "",
    bpm: 200,
    lyrics: []
  };

  let currentLine: Line;

  let start: number;
  // Period of a beat in ms.
  let beat = 60 * 1000 / song.bpm;

  let lines = song.lyrics;

  let measure: number;
  let playing = false;
  let i: number;

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

    let endLine = lines[0].ts;

    const continuePlaying = (ts: number) => {
      measure = Math.round((ts - start) / beat);
      if (measure < 100 && playing) {
        if (measure >= endLine) {
          const newLine = lines[++i];
          endLine = newLine.ts;
          currentLine = newLine;
        }
        window.requestAnimationFrame(continuePlaying);
      } else {
        playing = false;
      }
    };
    window.requestAnimationFrame(continuePlaying);

  };


</script>

<button on:click={play}> {playing ? '⏸' : '▶️' } </button>
<div>Measure : {measure}</div>
<div class="current-line">
  <!--{currentLine?.words.map(w =>w.text).join('') ?? 'Get ready'}-->
  {#each currentLine?.words ?? [] as word}
    <div class="word">
      {@html word.text.replace(' ', '&nbsp;')}
    </div>
  {/each}


</div>

<style type="text/scss">
  .current-line {
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: 5rem;
  }

  .word {
  }

</style>