<script lang="ts">
  import { tweened } from "svelte/motion";
  import {interpolateDate, interpolateString, interpolateLab} from "d3-interpolate";

  export let duration = 2000;

  const arraySource = [1, 50, 25]
  const arrayTarget = [100, 75, 35]

  let array = tweened(arraySource, {duration})
  let toggleArray = false

  $: toggleArray ? array.set(arrayTarget) : array.set(arraySource)


  const objSource = {a: 45, b: 10}
  const objTarget = {a: 100, b: 0}

  let obj = tweened(objSource, {duration})
  let toggleobj = false

  $: toggleobj ? obj.set(objTarget) : obj.set(objSource)


  const dateSource = new Date('2018-08-24')
  const dateTarget = new Date('2018-12-31')

  let date = tweened(dateSource, {duration, interpolate: interpolateDate})
  let toggledate = false

  $: toggledate ? date.set(dateTarget) : date.set(dateSource)


  const stringSource = 'On va tous recevoir une prime de 10€ et le CIR va diminuer de 3%'
  const stringTarget = 'On va tous recevoir une prime de 3000€ et le CIR va diminuer de 80% 🚀'

  let string = tweened(stringSource, {duration, interpolate: interpolateString})
  let togglestring = false

  $: togglestring ? string.set(stringTarget) : string.set(stringSource)


  const colorSource = 'lightblue'
  const colorTarget = 'rebeccapurple'

  let color = tweened(colorSource, {duration, interpolate: interpolateLab})
  let togglecolor = false

  $: togglecolor ? color.set(colorTarget) : color.set(colorSource)
</script>

<div class="container">
<section>
    <h3>Array</h3>
    <div class="display">
       Tweened array: [
        {#each $array as item}
            <span>{Math.round(item)}</span>
        {/each}
        ]
    </div>
    <div class="controls">
        <input id="array-check" type="checkbox" bind:checked={toggleArray}>
    </div>
</section>
<section>
    <h3>Object</h3>
    <div class="display">
        Tweened object: &#123; a: {Math.round($obj.a)} , b: {Math.round($obj.b)}&#125;
    </div>
    <div class="controls">
        <input id="obj-check" type="checkbox" bind:checked={toggleobj}>
    </div>
</section>

<h2>With D3-interpolate</h2>

<section>
    <h3>Date</h3>
    <div class="display">
        Tweened Date: {$date.toLocaleDateString()} 
    </div>
    <div class="controls">
        <input id="date-check" type="checkbox" bind:checked={toggledate}>
    </div>
</section>

<section>
    <h3>String</h3>
    <div class="display">
        {$string}
    </div>
    <div class="controls">
        <input id="string-check" type="checkbox" bind:checked={togglestring}>
    </div>
</section>

<section>
    <h3>Color</h3>
    <div class="display">
        <div>{$color}</div>
        <div class="color" style="background-color: {$color}"></div>
    </div>
    <div class="controls">
        <input id="color-check" type="checkbox" bind:checked={togglecolor}>
    </div>
</section>
</div>


<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: start;
    font-size: .9rem;
  }

  h3 {
    font-size: 1rem;
    margin: 0 .9rem 0;
  }

  section {
    display: flex;
    flex-direction: row;
    justify-items: start;
    align-items: center;
    margin-bottom: 1.3rem;
  }

    .controls {
      display: flex;
      justify-content: center;

      input[type='checkbox'] {
        margin-left: 1rem;
        position:relative;
        top:.25rem
      }
    }

    .display {
      span {
        display: inline-block;
        width: 2rem;
        &:not(:last-child):after {
          content: ','
        }
      }
    }
    .color {
      height: 4rem;
      width: 4rem;
      border-radius: 50%;
    }

</style>