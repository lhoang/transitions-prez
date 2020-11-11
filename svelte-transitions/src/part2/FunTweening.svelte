<script lang="ts">
  import { shape } from "./z-shape";
  import { tweened } from "svelte/motion";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { cubicInOut } from "svelte/easing";

  let path: SVGPathElement;
  let length = 0;
  onMount(() => length = path.getTotalLength());

  let pathPercent = tweened(0, { duration: 3000, easing: cubicInOut });

  let drawn = true;
  const toggleDraw = () => {
    pathPercent.set(drawn ? 1 : 0);
    drawn = !drawn;
  };
  const drawing = derived(pathPercent, ($p) => `stroke-dasharray: ${$p * length} ${(1 - $p) * length}`);


</script>
<div class="container">
  <button on:click={() => toggleDraw(path)}>Toggle draw</button>
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
       width="228" height="228" viewBox="0 0 228 228"
       preserveAspectRatio="xMidYMid meet">

    <g transform="translate(0,228) scale(0.1,-0.1)">
      <path d={shape} bind:this={path} style={$drawing}></path>
    </g>
  </svg>
</div>

<style type="text/scss">
  .container {
    display: grid;
    justify-items: center;
  }

  svg {
    path {
      stroke: #b21e3e;
      stroke-width: 50;
      fill: none;
    }
  }
</style>