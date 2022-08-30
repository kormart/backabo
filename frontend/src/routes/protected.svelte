<script context="module">
	export async function load({ session }) {
		if (!session?.user) {
			return {
				status: 302,
				redirect: '/sign-in',
			};
		}
		return {
			props: {
				user: session.user,
			},
		};
	}

	// export let user;
	// import envs from "$lib/envs.js"

	import { session } from '$app/stores';
</script>

<h1 class="text-2xl font-semibold text-center">Hi! You are logged in as {session.user}.</h1>
<br>
<!-- {#each envs as env}
	<p>
		Environment name: <b>{env.name}</b>, output data: <b>{JSON.stringify(env.outputs)}</b>, config data: <b>{JSON.stringify(env.configs)}</b>
	</p>
{/each} 
<br>
{JSON.stringify(envs)} -->