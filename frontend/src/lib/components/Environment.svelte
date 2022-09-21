<script>
  export let environment;
  export let needToFetch;
  import state from '$lib/stores';
  import App from './App.svelte';

  let provider = '';
  let imgFilename = '';
  let message = '';

  function statusIsPositive(priceChange) { 
      return priceChange >= 0;
    }
  async function submitStopEnv () { }
  async function submitDeleteEnv () {
		const res = await fetch('http://localhost:1337/sites/delete', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				envId: environment.name,
				// content: selection
			})
		})		
		const json = await res.json()
		// add error handling here, opportunity to think thru types 
		console.log("***log: delete response: " + JSON.stringify(json));
		needToFetch = true;
  }
  if (!!environment.configs['ns:environment']) {
    provider = JSON.parse(JSON.parse(environment.configs['ns:environment'].value).selection).infra.provider;
 
  }
  if (!!environment.export.deployment.resources) {
    if (!!environment.export.deployment.resources[2]) {
      provider = environment.export.deployment.resources[2].type.split(':')[0]
    }
  }
  switch (provider) {
    case 'gcp':
      imgFilename = 'gcp.svg'
      break;
    case 'aws':
      imgFilename = 'aws.svg'
      break;
    case 'azure':
      imgFilename = 'azure-native.svg'
      break;
    case 'equinix-metal':
      imgFilename = 'equinix.png'
      break;
    case 'cleura':
      imgFilename = 'cleura.png'
      break;
    case 'test':
      imgFilename = 'equinix.png'
      break;
    case '':
      imgFilename = 'gcp.png'
      provider = 'test'
      break;
    default:
      imgFilename = 'ice.png'
      break;      
  }
  // Parse messages from websocket
  // 'delete ongoing'
  $: if ($state.requests.length != 0) {
    if (!!$state.requests[0].body.envName) {
      if ($state.requests[0].body.envName == environment.name) {
        console.log("***log: message: ", $state.requests[0].body);
        let envState = $state.requests[0].body.envState;
        switch (envState) {
          case 'running':
            message = 'Running, time to delete: ' + $state.requests[0].body.eventTime;
            break;
          case 'delete ongoing':
            message = 'Delete ongoing ';
            break;
          case 'delete completed':
            message = 'Delete completed ';
            needToFetch = true;
            break;
        }
      }
    }
  }
</script>

<div class="env-card">
    <img class="env-image" src={imgFilename} alt="" />
    <div class="env-descr">
      <div class="env-name">{environment.name}</div>
      <div> 
        {provider}, resource count: {environment.stack.resourceCount}
      </div>
    </div>    
    <div class="env-details">
      {#if (environment.outputs.envUrl)}
        <a class="detail-field" href="http://{environment.outputs.envUrl.value}">Link to environment &#8594;</a>
      {:else}
        <a class="detail-field" href="http://">Link to environment</a>
      {/if}
      <div
        class="detail-field status-change"
        class:positive={statusIsPositive(1.0)}
      >
        <div> 
          {message}
        </div> 
      </div>
      <div class="detail-field">
          <input type="hidden" bind:value="{environment.name}">
          <button type="button" class="btn btn-danger" on:click={submitStopEnv}>STOP</button>
          <input type="hidden" bind:value="{environment.name}">
          <button type="button" class="btn btn-danger" on:click={submitDeleteEnv}>DELETE</button>
      </div>
    </div>
</div>

<style>
  .env-card {
    display: flex;
    align-items: center;
    justify-content: space-around;
    /* grid-template-columns: 1fr 1fr 1fr 1fr; */
    /* background: url('Squares-Red.png'); */
    /* background-color: rgba(158, 145, 145, 0.418); */
    border: 1px solid;
    border-color: lightgrey;
    border-radius: 10px;
    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  .env-image {
    flex: 3;
    max-width: 4.5rem;
    padding: 20px;
    /* margin-top: 10px; */
  }
  .env-descr {
    flex: 1;
    display: grid
  }
  .env-name {
    font-size: 20px;
    font-weight: bold;
    margin-top: 5px;
  }

  .env-details {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* border-top: 1px solid #d1d5db; */
    /* background-color: #f3f4f6; */
    padding: 10px;
  }

  .detail-field {
    font-size: 12px;
    font-weight: bold;
    padding: 15px 0;
  }

  .detail-field:not(:last-child) {
    border-right: 1px solid #d1d5db;
  }

  .btn {
    font-family: 'Courier New', monospace;
    font-size: 15px;
    border-radius: 7px;
    padding: 10px;
  }
  .btn-danger {
    background-color: #df1839;
    color: #ffffff;
  }

  .status-change {
    color: #dc2626;
  }

  .positive {
    color: black;
  }

  @media (min-width: 1024px) {
    .detail-field {
      font-size: 17px;
      padding: 15px;
    }
  }
</style>