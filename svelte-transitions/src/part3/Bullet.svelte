<script lang="ts">
  import { tweened } from "svelte/motion";
  import { interpolatePlasma } from 'd3-scale-chromatic'

  const duration = 3000;
  const v0 = 2;
  const alpha = Math.PI / 3;
  const g = 4 * .86; // 2 * v0 * si

  const ballX = tweened(0, {
      interpolate: (a, b) =>
        t => a + (b - a) * v0 * Math.cos(alpha) * t,
      duration,
    }
  );

  const ballY = tweened(0, {
    interpolate: () =>
      t => (g / 2 * Math.pow(t, 2) - v0 * Math.sin(alpha) * t) * 100,
    duration,
  });

  const speed = tweened(0, {
    interpolate: () =>
      t => Math.abs(g * t - v0 * Math.sin(alpha)) * 100,
    duration,
  });

  let toggle = false
  $: {
    if (toggle) {
      ballX.set(60)
      ballY.set(0)
      speed.set(0)
    } else {
      ballX.set(0)
      ballY.set(0)
      speed.set(0)
    }
  }

</script>
<div class="controls">
    <input id="date-check" type="checkbox" bind:checked={toggle}>
    <span>x: {Math.round($ballX)}</span>
    <span>y: {Math.round($ballY)}</span>
    <span>speed: {Math.round($speed)}</span>
</div>

<div class="container">
    <div class="ball"
         style="transform: translate({$ballX}vw , {$ballY}vh);
                --color:{interpolatePlasma($speed/150)}
">
    </div>
</div>


<style lang="scss">
  .container {
    height: 80vh;
    width: 80vw;
    background-color: papayawhip;
  }

  .ball {
    border: solid 1px black;
    border-radius: 50%;
    background-color: var(--color);
    width: 2rem;
    height: 2rem;
    position: relative;
    top: 70vh;
    left: 5vw;
  }

  .controls {
    display: flex;
    justify-content: start;

    & > * {
      margin-left: 2rem;
    }

    input[type='checkbox'] {
      margin-left: 1rem;
      position: relative;
      top: .25rem
    }
  }
</style>