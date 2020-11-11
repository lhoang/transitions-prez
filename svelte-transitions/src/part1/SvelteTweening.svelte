<script lang="ts">
  import { tween } from "./CustomTween";

  export let target = 50;
  export let duration = 2000;
  export let init = 10;

  const x = tween(init);
  $: x.set(target, duration);


</script>

<div class="container">
  <h3>Custom Tweening with Svelte Store</h3>
  <div class="circle" style="left:{$x}%">
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

    .text {
      color: whitesmoke;
    }
  }
</style>