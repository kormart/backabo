<script>
	import Current from "./Current.svelte"
	import New from "./New.svelte"

	let name = "Backabo AI/ML and Data Self-service Platform";

	let page = "New";
	let needToFetch = true;

	export let selection = {dataset: "nothing selected", tool: "nothing selected", infra: "nothing selected"};
	export const smorgas = {datasets: [
		{name: "nlp", descr: "Language models", img: "datalab.png"}, 
		{name: "weed", descr: "Dataset with photographs of weed", img: "datalab.png"}], 
		tools: [
		{name: "hopsworks", descr: "A complete data science platform", img: "hopsworks-symbol.png"}, 
		{name: "jupyter notebook in container", descr: "Jupyter notebook with Tensorflow", img: "jupyter.png"},
		{name: "just-a-vm", descr: "Ubuntu with conda and CUDA drivers", img: "datalab.png"}],
		infra: [
		{name: "ice", descr: "GPU, Cost:0 \n Compliance: EU", img: "ice.png"}, 
		{name: "azure", descr: "GPU, Cost: 30SEK/hour \n Compliance: non-EU", img: "azure-native.svg"},
		{name: "gcp", descr: "GPU, Cost: 30SEK/hour \n Compliance: non-EU", img: "gcp.png"},
		{name: "test", descr: "Empty", img: "ice.png"}, 
	]};

	let environments = [];

</script>

<main>
	<ul id="menu">
		<li><a href="/" on:click|preventDefault={() => (page = "Current")}>Current</a></li> |
		<li><a href="/" on:click|preventDefault={() => (page = "New")}>New</a></li>
	</ul>

	<h1>{name}</h1>
	
	{#if page === "Current"}
	<Current {environments} bind:needToFetch={needToFetch} bind:page={page}/>
	{:else if page === "New"}
	<New {smorgas} {selection} bind:needToFetch={needToFetch} bind:page={page}/>
	{:else}
	<h1>
		Page Not Found
	</h1>
	{/if}

</main>

<style>
  main {
    /* text-align: center; */
    padding: 40px 0;
    margin: 0 auto;
	/* background: url('Squares-Red.png') */
  }
  ul#menu li{
		display: inline-flex;
	}
  /* h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  } */
  /* .grid {
    display: flex;
	flex-direction: column;
    grid-template-columns: repeat(3, 300px);
    gap: 30px;
	text-align: center;
	grid-auto-rows: 11% ;
	grid-template-rows: unset;
	overflow: scroll;
  } */
  @media (min-width: 640px) {
    main {
      max-width: 1600px;
      padding: 40px 20px;
    }
  }
</style>