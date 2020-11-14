<script lang="ts">
  import NaiveTransition from "./part1/NaiveTransition.svelte";
  import NaiveTweening from "./part1/NaiveTweening.svelte";
  import RafTweening from "./part1/RafTweening.svelte";
  import SvelteTweening from "./part1/SvelteTweening.svelte";
  import { calculatePrimes } from "./heavyComputation";
  import FunTweening from "./part2/FunTweening.svelte";
  import Karaoke from "./part3/Karaoke.svelte";

  let target = 10;
  let duration = 2000;

  let computing = false;
  const compute = () => {
    computing = true;
    setTimeout(() => {
      const iterations = 200;
      const multiplier = 1000000000;
      const primes = calculatePrimes(iterations, multiplier);
      computing = false;
    }, 100);
  };
</script>

<main>
<!--    <button class:computing on:click={() => compute()}>Heavy Computation</button>-->
<!--    <NaiveTransition />-->
<!--    <div class="inputs">-->
<!--      <input type="range" min="0" max="100" bind:value={target}>-->
<!--      <div class="field">-->
<!--        <label for="duration">Duration</label>-->
<!--        <input id="duration" type="text" bind:value={duration}>ms-->
<!--      </div>-->

<!--    </div>-->

<!--    <NaiveTweening {target} {duration} />-->
<!--    <RafTweening {target} {duration} />-->
<!--    <SvelteTweening {target} {duration} />-->

<!--    <FunTweening />-->

  <Karaoke></Karaoke>

</main>

<style type="text/scss">
  :root {
    --zenika-red: #b21e3e;
    --font-color: #ffd42a;
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

  .inputs {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    & > * {
      padding-left: 2rem;
    }

    .field {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;

      input {
        width: 4rem;
      }
    }
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>