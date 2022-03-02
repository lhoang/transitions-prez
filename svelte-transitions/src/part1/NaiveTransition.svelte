<script lang="ts">

    let x = 10;

    const reset = () => x = 10;
    const jump = () => x += 5;
    $: cleanX = Math.round(x);

    const smoothMove = (step: number, duration = 1) => {
        const start = window.performance.now();
        const loopID = setInterval(() => {
              const now = window.performance.now();
              if (now > start + duration * 1000) {
                  clearInterval(loopID);
              }
              x += step;
          }, 1000 / 60  // 60 fps
        );

    }
</script>

<div class="container">
    <button on:click={() => smoothMove(.25)}>Click me</button>
    <button on:click={() => reset()}>Reset</button>
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
      font-size: .8rem;
    }
  }
</style>