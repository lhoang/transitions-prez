<script lang="ts">
  export let target = 50;
  export let duration = 2000;
  export let x = 10;
  $: cleanX = Math.round(x);

  const tween = (targetPos: number, duration: number) => {
    const startPos = x;
    const start = window.performance.now();
    const dist = (t) => startPos + t * (targetPos - startPos);

    const animate = (ts: number) => {
      const t = (ts - start) / duration;
      if (t >= 1) {
        x = targetPos;
      } else {
        x = dist(t);
        window.requestAnimationFrame(animate);
      }
    };
    window.requestAnimationFrame(animate);
  };
  $:tween(target, duration);

</script>

<div class="container">
  <h3>Tweening with RAF</h3>
  <div class="circle" style="left:{x}%">
    <span class="text">{cleanX}%</span>
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