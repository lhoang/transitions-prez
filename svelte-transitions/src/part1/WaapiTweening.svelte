<script lang="ts">
  import { tween } from "./CustomTween";

  export let target = 50;
  export let duration = 2000;
  export let init = 10;

  const x = tween(init);
  $: x.set(target, duration);

  let container: HTMLElement;
  let width: number;
  $: width = container?.clientWidth * 9 / 10;


  let circle: HTMLElement;
  $: {
    if (circle) {
      circle.animate(
        [
          {},
          { transform: `translateX(${target / 100 * width}px)` }
        ], {
          duration,
          iterations: 1,
          fill: 'both',
          composite: 'replace',
        }
      );
    }
  }


</script>

<div class="container" bind:this={container}>
  <h3>Custom Tweening with Svelte Store</h3>
  <div class="circle" bind:this={circle}>
    <span class="text">{Math.round($x)}%</span>
  </div>
</div>

<style type="text/scss">
  .container {
    border: #999999 1px solid;
    border-radius: 4px;
    padding: 1rem 4rem;
  }

  h3 {
    margin: 0;
  }

  .circle {
    border: solid 1px black;
    border-radius: 50%;
    background-color: var(--zenika-red);
    width: 3rem;
    height: 3rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform;

    .text {
      color: whitesmoke;
    }
  }
</style>
