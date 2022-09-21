<script>
	import Card from "./Card.svelte";
	import Button from './Button.svelte';
	import ButtonGroup from './ButtonGroup.svelte';
    export let smorgasbord
    export let selection
    export let page
    export let needToFetch

    // all values starting with 'data' is for the tagging and free text search functionality
    const dataDataset = {
        tags: JSON.parse(JSON.stringify(smorgasbord.tags.dataset)),
        posters: JSON.parse(JSON.stringify(smorgasbord.dataset))
    };
    dataDataset.posters.forEach(poster => {
		poster['search'] = poster.name + ' ' + poster.descr + ' ' + poster.provider;
	});
    const dataTool = {
        tags: JSON.parse(JSON.stringify(smorgasbord.tags.tool)),
        posters: JSON.parse(JSON.stringify(smorgasbord.tool))
    };
    dataTool.posters.forEach(poster => {
		poster['search'] = poster.name + ' ' + poster.descr + ' ' + poster.provider;
	});
    const dataInfra = {
        tags: JSON.parse(JSON.stringify(smorgasbord.tags.infra)),
        posters: JSON.parse(JSON.stringify(smorgasbord.infra))
    };
    dataInfra.posters.forEach(poster => {
		poster['search'] = poster.name + ' ' + poster.descr + ' ' + poster.provider;
	});

    let envId = ""
    let envLifeTime = 0
    let tagSelectionDataset = [];
    let tagSelectionTool = [];
    let tagSelectionInfra = [];
	let searchTermDataset = "";
	let searchTermTool = "";
	let searchTermInfra = "";
	$: taggedListDataset = [...Array(dataDataset.posters.length).keys()].filter(i => tagSelectionDataset.every(tag => dataDataset.posters[i].tags.includes(tag)));
	$: filteredListDataset = [...Array(dataDataset.posters.length).keys()].filter(i => dataDataset.posters[i].search.toLowerCase().indexOf(searchTermDataset.toLowerCase()) !== -1);
	$: c2iDataset = ((taggedListDataset.filter(i=>filteredListDataset.includes(i))).length !=0) ? (taggedListDataset.filter(i=>filteredListDataset.includes(i)))[0] : -1; 
	$: taggedListTool = [...Array(dataTool.posters.length).keys()].filter(i => tagSelectionTool.every(tag => dataTool.posters[i].tags.includes(tag)));
	$: filteredListTool = [...Array(dataTool.posters.length).keys()].filter(i => dataTool.posters[i].search.toLowerCase().indexOf(searchTermTool.toLowerCase()) !== -1);
	$: c2iTool = ((taggedListTool.filter(i=>filteredListTool.includes(i))).length !=0) ? (taggedListTool.filter(i=>filteredListTool.includes(i)))[0] : -1; 
	$: taggedListInfra = [...Array(dataInfra.posters.length).keys()].filter(i => tagSelectionInfra.every(tag => dataInfra.posters[i].tags.includes(tag)));
	$: filteredListInfra = [...Array(dataInfra.posters.length).keys()].filter(i => dataInfra.posters[i].search.toLowerCase().indexOf(searchTermInfra.toLowerCase()) !== -1);
	$: c2iInfra = ((taggedListInfra.filter(i=>filteredListInfra.includes(i))).length !=0) ? (taggedListInfra.filter(i=>filteredListInfra.includes(i)))[0] : -1; 

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

<h2>Create a new environment</h2>

<div class="top-grid">
    <div class="category-column">
        <h3>1. DATASETS</h3>
		<div class="tags">
			<small><b>Tag Selector: </b></small>
			<ButtonGroup multiple bind:value={tagSelectionDataset}>
			{#each dataDataset.tags as tag, index}
				<Button value={tag}>
					{tag}
				</Button>
				<!-- <button let:active class:active on:click={() => {tagSelection.push(tag); let active=true;}} ><small>{tag}</small></button>				 -->
			{/each}
			</ButtonGroup>
			<small><b>Freetext search: </b></small>
			<input bind:value={searchTermDataset} autocapitalize="off"/>
		</div>
		<small># items: {(taggedListDataset.filter(i=>filteredListDataset.includes(i))).length} </small>   
        {#each smorgasbord.dataset as component, compIndex}
            {#if (taggedListDataset.indexOf(compIndex)!== -1) && (filteredListDataset.indexOf(compIndex)!== -1) }
                <Card {component} {compIndex} bind:selectionField={selection.dataset}/>
            {/if}
        {/each}
    </div>
    <div class="category-column">
        <h3>2. SOFTWARE</h3>
		<div class="tags">
			<small><b>Tag Selector: </b></small>
			<ButtonGroup multiple bind:value={tagSelectionTool}>
			{#each dataTool.tags as tag, index}
				<Button value={tag}>
					{tag}
				</Button>
				<!-- <button let:active class:active on:click={() => {tagSelection.push(tag); let active=true;}} ><small>{tag}</small></button>				 -->
			{/each}
			</ButtonGroup>
			<small><b>Freetext search: </b></small>
			<input bind:value={searchTermTool} autocapitalize="off"/>
		</div>
		<small># items: {(taggedListTool.filter(i=>filteredListTool.includes(i))).length} </small>        
        {#each smorgasbord.tool as component, compIndex}
            {#if (taggedListTool.indexOf(compIndex)!== -1) && (filteredListTool.indexOf(compIndex)!== -1) }
                <Card {component} {compIndex} bind:selectionField={selection.tool}/>
            {/if}
        {/each}
    </div>
    <div class="category-column">
        <h3>3. INFRASTRUCTURE RESOURCES</h3>
		<div class="tags">
			<small><b>Tag Selector: </b></small>
			<ButtonGroup multiple bind:value={tagSelectionInfra}>
			{#each dataInfra.tags as tag, index}
				<Button value={tag}>
					{tag}
				</Button>
				<!-- <button let:active class:active on:click={() => {tagSelection.push(tag); let active=true;}} ><small>{tag}</small></button>				 -->
			{/each}
			</ButtonGroup>
			<small><b>Freetext search: </b></small>
			<input bind:value={searchTermInfra} autocapitalize="off"/>
		</div>
		<small># items: {(taggedListInfra.filter(i=>filteredListInfra.includes(i))).length} </small>        
        {#each smorgasbord.infra as component, compIndex}
            {#if (taggedListInfra.indexOf(compIndex)!== -1) && (filteredListInfra.indexOf(compIndex)!== -1) }
                <Card {component} {compIndex} bind:selectionField={selection.infra}/>
            {/if}
        {/each}
    </div>
    <div class="category-column">
        <h3>Selected components</h3>
            <p>1. DATASET: 
                {#if !!smorgasbord.dataset[selection.dataset]}
                    {smorgasbord.dataset[selection.dataset].name}
                {:else}
                    Nothing selected             
                {/if}
                </p>
            <p>2. SOFTWARE: 
                {#if !!smorgasbord.tool[selection.tool]}
                    {smorgasbord.tool[selection.tool].name}
                {:else}
                    Nothing selected                
                {/if}
                </p>
            <p>3. INFRASTRUCTURE: 
                {#if !!smorgasbord.infra[selection.infra]}
                    {smorgasbord.infra[selection.infra].name}
                {:else}
                    Nothing selected                
                {/if}
                </p>
            <div class="detail-field">
                <p>Enter a name for your new environment:</p>
                <input bind:value="{envId}">
                <p>Enter a lifetime (minutes):</p>
                <input bind:value="{envLifeTime}">
                <input type="hidden" bind:value="{selection}">
            </div>
            <div>
                <button type="button" class="btn btn-blue" on:click={submitCreateEnv}>Start environment</button>
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
	.tags {
		padding: 1em;
		margin: -2em 2em -1em 0;
	    border-radius: 10px;
		box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
		background-color: #eee;
		float: left;
	}

</style>