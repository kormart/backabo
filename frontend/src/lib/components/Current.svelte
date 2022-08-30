<script>
  	import { onMount } from 'svelte';
    import state from '$lib/stores';

    import Environment from "./Environment.svelte"
    export let environments
    export let needToFetch
    export let page

    function toggleIt() {
      needToFetch = true;
    }
    function changeMenu() {
      page = "New";
    }


    // add observed variable as an argument to trigger update 
    async function fetchEnvironments() {
        const response = await fetch(
            "http://localhost:1337/sites"
        );
      const data = await response.json();
      environments = data.envs;
      needToFetch = false;
      console.log("***log: fetchEnvironments: environments:", environments);
    }

    $: if (needToFetch) {
      console.log("***log: Current main: needToFetch:", needToFetch, fetchEnvironments());
    }

    async function fetchEnvironmentsNew() {
        const response = await fetch(
          '/api/simple'
        );
    const data = await response.json();
    environments = data.envs;
    needToFetch = false;
    console.log("***log: fetchEnvironmentsNew: environments:", environments);
    }

</script>

<button type="button" class="btn btn-friendly" on:click={() => (page = "New")}>NEW ENVIRONMENT</button>
<hr>
<h2>Current environments</h2>
{#if environments.length === 0}
	<h3>No environments...</h3>
{:else}
<div class="grid">
  {#each environments as environment}
    <Environment {environment} bind:needToFetch={needToFetch}/>
  {/each}
</div>
{/if}

<br>
<button type="button" class="" on:click={toggleIt}>Re-fresh (current: {needToFetch})</button>
<!-- <button type="button" class="btn btn-danger" on:click={changeMenu}>Change menu {page}</button> -->

<style>
  .grid {
    display: flex;
	flex-direction: column;
    /* grid-template-columns: repeat(3, 300px); */
    gap: 30px;
	/* text-align: center; */
	/* grid-auto-rows: 11% ;
	grid-template-rows: unset;
	overflow: scroll; */
  }
  .btn {
    border-radius: 7px;
    font-family: 'Courier New', monospace;
    font-size: 15px;
    padding: 10px;
  }
  .btn-danger {
    background-color: #df1839;
    color: #ffffff;
  }

  .btn-friendly {
    background-color: #339152;
    color: #ffffff;
  }

</style>