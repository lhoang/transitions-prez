<script lang="ts">
  import { readFile } from "./utils";
  import SingingLine from "./SingingLine.svelte";

   // let pData = readFile("../Manau.txt");
   //let pData = readFile("../Sample.txt");
  //let pData = readFile("../BonnieTyler.txt");
  let pData = readFile("../Queen.txt");

</script>


<div class="container">
  {#await pData then song}
    <h2>{song.title} - {song.artist}</h2>
    <div class="current">
      <SingingLine {song} />
    </div>
  {/await}
</div>


<style type="text/scss">
  h2 {
    margin-top: 0;
  }

  .container {
    height: 100vh;
    font-family: 'VCR OSD Mono', sans-serif;
    -webkit-text-stroke: 0.5px black;
    -webkit-text-fill-color: var(--font-color);
    font-size: 1.5rem;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
    overflow-y: hidden;
  }

  .lyrics {
    display: flex;
    flex-direction: column;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

</style>
