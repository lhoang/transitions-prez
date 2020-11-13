<script lang="ts">
  import { readFile } from "./utils";
  import SingingLine from "./SingingLine.svelte";

  let pData = readFile("../Sample.txt");

</script>


<div class="container">
  {#await pData then song}
    <h2>Karaoke</h2>
    <h3>{song.title} - {song.artist}</h3>

    <div class="lyrics">
      {#each song.lyrics as line}
        <div class="line">
          {line.words.map(w => w.text).join('')}
        </div>
      {/each}
    </div>

    <div class="current">
      <SingingLine {song} />
    </div>

  {/await}
</div>


<style type="text/scss">
  .lyrics {
    display: flex;
    flex-direction: column;
  }

</style>