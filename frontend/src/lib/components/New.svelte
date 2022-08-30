<script>
	import Card from "./Card.svelte"    
    export let smorgas
    export let selection
    export let page
    export let needToFetch

    let envId = ""
    let envLifeTime = 0

    async function submitCreateEnv () {
		const res = await fetch('http://localhost:1337/sites/create', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				envId,
                envLifeTime,
				selected: selection
			})
		})		
		const json = await res.json()
		// add error handling here, opportunity to think thru types 
		console.log("***log: submitCreateEnv response from server: " + JSON.stringify(json));
		page = "Current";
        needToFetch = true;
    }

</script>

<h2>Create new environment, by combining components</h2>
<hr>

<div class="top-grid">
    <div class="category-column">
        <h3>DATASETS</h3>
        {#each smorgas.dataset as component, compIndex}
            <Card {component} {compIndex} bind:selectionField={selection.dataset}/>
        {/each}
        </div>
    <div class="category-column">
        <h3>TOOLS</h3>
        {#each smorgas.tool as component, compIndex}
            <Card {component} {compIndex} bind:selectionField={selection.tool}/>
        {/each}
    </div>
    <div class="category-column">
        <h3>INFRA RESOURCES</h3>
        {#each smorgas.infra as component, compIndex}
            <Card {component} {compIndex} bind:selectionField={selection.infra}/>
        {/each}
    </div>
    <div class="category-column">
        <h3>Selected components</h3>
            <p>DATASET: {selection.dataset}</p>
            <p>TOOL: {selection.tool}</p>
            <p>INFRA: {selection.infra}</p>
            <div class="detail-field">
                <p>Enter a name for your new environment:</p>
                <input bind:value="{envId}">
                <p>Enter a lifetime (minutes) for your new environment:</p>
                <input bind:value="{envLifeTime}">
                <input type="hidden" bind:value="{selection}">
                <button type="button" class="btn btn-blue" on:click={submitCreateEnv}>Submit selection</button>
            </div>
        
    </div>
</div>


<style>
    .top-grid {
        display: grid;
        /* flex-direction: column; */
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
        /* text-align: center; */
        /* grid-auto-rows: 11% ;
        grid-template-rows: unset;
        overflow: scroll; */
    }
    .category-column {
        display: flex;
        flex-direction: column;
        gap: 30px;
        border-right: 1px solid #d1d5db;
    	/* text-align: center; */
    }
    .btn {
        font-size: 15px;
        border-radius: 5px;
    }
    .btn-blue {
        border-color: #1875df;
        background-color: #1875df;
        color: #ffffff;
    }

</style>