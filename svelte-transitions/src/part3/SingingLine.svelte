<script lang="ts">
  import type { Line, Song } from "./karaoke.interface";
  import { tweened } from "svelte/motion";
  import { getEltPositions, getLineTimings } from "./utils";
  import { transpose } from "ramda";

  export let song: Song;
  const ballHigh = 35;


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
      return t => g / 2 * Math.pow(t, 2) - v0 * Math.sin(alpha) * t - 1;
    }
  });

  let currentLine: Line;
  let start: number;
  let newLineStart: number = 0;
  let speed = 1.0;
  // Period of a beat in ms.
  $: beat = 60 * 1000 / song.bpm / 2 / speed;
  let lines = song.lyrics;


  let measure: number;
  let playing = false;
  let indexLine: number;


  const stop = () => {
    playing = false;
    measure = 0;
  };

  const play = () => {
    // Pause
    if (playing) {
      playing = !playing;
      return;
    }

    // Init
    if (!measure) {
      start = window.performance.now();
      currentLine = lines[0];
      indexLine = 0;
    }
    playing = true;
    let endLine = lines[0].ms;

    const continuePlaying = (ts: number) => {
      measure = Math.round((ts - start) / beat);
      if (playing && indexLine < lines.length - 1) {
        if (measure >= endLine) {
          newLineStart = endLine;
          const newLine = lines[++indexLine];
          endLine = newLine.ms;
          currentLine = newLine;
          ballX.set(100, {duration: 0});
        }
        window.requestAnimationFrame(continuePlaying);
      } else {
        stop();
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
          ballX.set(pos, {duration: timing}),
          ballY.set(0, {duration: timing})
        ]);
      }, Promise.resolve([]))
  )();

</script>


<svelte:head>
    <link href="http://fonts.cdnfonts.com/css/vcr-osd-mono" rel="stylesheet">
</svelte:head>

<div class="container">
    <div class="controls">
        <div>
            <button on:click={play}> {playing ? '⏸' : '▶️' } </button>
            <button on:click={stop}> ⏹</button>
        </div>

        <div class="speed">
            <label for="speed">Speed: {speed}</label>
            <input id="speed" type="range" min="0.5" max="2" step="0.1"
                   bind:value={speed}/>
        </div>

        <!--    <div>Measure : {measure}, beat: {beat}ms, BPM: {song.bpm}</div>-->
    </div>
    <div class="lyrics">
        <!--    <div class="ball" style="left:{$ballX}px; bottom: {ballHigh+$ballY*ballHigh}px"></div>-->
        <div class="ball" style="transform: translate({$ballX}px, {$ballY*ballHigh}px)"></div>
        <div class="current-line" bind:this={lineElt}>
            {#each currentLine?.words ?? [] as word}
                <div class="word">
                    {@html word.text.replace(' ', '&nbsp;')}
                </div>
            {/each}
        </div>
    </div>
</div>


{#each {length: 20} as i}
    <div class="circle-container">
        <div class="circle"></div>
    </div>
{/each}


<style type="text/scss">
  .container {
    display: flex;
    flex-direction: column;
  }

  .lyrics {
    margin-top: 15vh;
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: center;

    & > * {
      margin-right: 3rem;
    }
  }

  .speed {
    display: flex;
    flex-direction: row;
    justify-content: center;

    & > * {
      margin-right: 1rem;
    }

    input[type=range] {
      width: 8rem;
      position: relative;
      top: -.5rem;
    }
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
    font-size: 4vw;
    -webkit-text-stroke: 1px black;
  }

  .word {
    //border: 1px solid darkred;
  }

  button {
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0;
    background: none;
  }


  .circle-container {
    $particleNum: 20;
    $particleColor: hsl(180, 100%, 80%);

    position: absolute;
    transform: translateY(-10vh);
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    .circle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      mix-blend-mode: screen;
      background-image: radial-gradient(
                      hsl(180, 100%, 80%),
                      hsl(180, 100%, 80%) 10%,
                      hsla(180, 100%, 80%, 0) 56%
      );

      animation: fadein-frames 200ms infinite, scale-frames 2s infinite;

      @keyframes fade-frames {
        0% {
          opacity: 1;
        }

        50% {
          opacity: 0.7;
        }

        100% {
          opacity: 1;
        }
      }

      @keyframes scale-frames {
        0% {
          transform: scale3d(0.4, 0.4, 1);
        }

        50% {
          transform: scale3d(3.2, 3.2, 1);
        }

        100% {
          transform: scale3d(0.4, 0.4, 1);
        }
      }
    }

    $particleBaseSize: 8;


    @for $i from 1 through $particleNum {
      &:nth-child(#{$i}) {
        $circleSize: random($particleBaseSize);
        width: $circleSize + px;
        height: $circleSize + px;

        $startPositionY: random(10) + 100;
        $framesName: "move-frames-" + $i;
        $moveDuration: 28000 + random(9000) + ms;

        animation-name: #{$framesName};
        animation-duration: $moveDuration;
        animation-delay: random(37000) + ms;

        @keyframes #{$framesName} {
          from {
            transform: translate3d(
                            #{random(100) + vw},
                            #{$startPositionY + vh},
                            0
            );
          }

          to {
            transform: translate3d(
                            #{random(100) + vw},
                            #{- $startPositionY - random(30) + vh},
                            0
            );
          }
        }

        .circle {
          animation-delay: random(4000) + ms;
        }
      }
    }
  }
</style>