<script lang="ts">
    import NaiveTransition from './NaiveTransition.svelte';
    import NaiveTweening from "./NaiveTweening.svelte";
    import RafTweening from "./RafTweening.svelte";
    import SvelteTweening from "./SvelteTweening.svelte";
    import {calculatePrimes} from "./heavyComputation";

    let target = 25

    let computing = false;
    const compute = () => {
        computing = true;
        setTimeout(() => {
            const iterations = 200;
            const multiplier = 1000000000;
            const primes = calculatePrimes(iterations, multiplier);
            computing = false;
        }, 100);
    }
</script>

<main>
    <button class:computing on:click={() => compute()}>Heavy Computation</button>
    <NaiveTransition></NaiveTransition>
    <input type="range" min="0" max="100" bind:value={target}>
    <NaiveTweening {target}></NaiveTweening>
    <RafTweening {target}></RafTweening>
    <SvelteTweening {target}></SvelteTweening>

</main>

<style type="text/scss">
  :root {
    --zenika-red: #b21e3e;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  .computing {
    background-color: lightcoral;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>