<script context="module">
  // export async function load({ fetch }) {
  //   const res = await fetch('/api/simple');
  //   const data = await res.json();
  //   console.log('***log data: ', data);
  //   if (res.ok) return {props: {data}};
  // }
  import state, { connect } from '$lib/stores';
  export async function load({ session }) {
    const response = await fetch("http://localhost:1337/smorgasbord");
    const data = await response.json();
    const smorgasbord = data.smorgasbord;
    // console.log("*** log smorgasbord: ", smorgasbord);
    // connect to event-service websocket
    connect();
    return {
      props: {
        smorgasbord,
        user: session.user,
      },
    };
  }
</script>

<script>
  import Current from "$lib/components/Current.svelte";
  import New from "$lib/components/New.svelte";
  export let user;

  let page = "Current";
	let needToFetch = true;
	let environments = [];
  export let smorgasbord;

  export let data;
  console.log('***log out data: ', data);

  async function getIt() {
    const res = await fetch('/api/login');
    const data3 = await res.json();
    return data3;
  }
  // console.log('***log data 3rd time: ', getIt());

  export let selection = {dataset: "", tool: "", infra: ""};

  // async function fetchEnvironmentsNew() {
  //       const response = await fetch(
  //         '/api/backabo.json', {method: 'GET'}
  //       );
  //   const data = await response.json();
  //   environments = data.envs;
  //   needToFetch = false;
  //   console.log("***log: fetchEnvironmentsNew: environments:", environments);
  // }

  // fetchEnvironmentsNew();
</script>

<h1>Backabo self-service environments</h1>
<hr>
{#if user}
  <!-- <h2>Logged in as {user}</h2> -->
    {#if page === "Current"}
      <div class="new-button">
        <button type="button" class="btn btn-friendly" on:click={() => (page = "New")}>NEW ENVIRONMENT</button>
      </div>
      <Current {environments} bind:needToFetch={needToFetch} bind:page={page}/>
    {:else if page === "New"}
      <New {smorgasbord} {selection} bind:needToFetch={needToFetch} bind:page={page}/>
    {:else}
    <h1>
      Page Not Found
    </h1>
    {/if}

    <form action="/api/logout">
    <button>Logout</button>
    </form>
{:else}
  <form action="/api/login">
    <button>Login using Github</button>
  </form>
{/if}

<style>
.new-button {
  position: absolute;
  right: 100px;
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
