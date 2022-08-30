<script>
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';

	const navigation = [
		{
			href: '/',
			name: 'Home',
		},
		{
			href: '/protected',
			// name: `${$session.user ? '🔓' : '🔒'} Protected`,
			name: `Protected`,
		},
	];

	async function handleSignOut() {
		await fetch('/api/logout');
		$session = {};
		await goto('/sign-in');
	}
</script>
<header>
<div class="topnav">
	{#each navigation as link, i}
		<a href={link.href} class={i==0 ? "active" : ""} >
			{link.name}
		</a>
	{/each}
	<div class="topnav-right">
		{#if $session.user}
			<a href="#{session.user}" >
				{$session.user}
			</a>
			<button
				on:click={handleSignOut}
				class="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
			>
				Logout
			</button>
		{:else}
			<a
				href="/sign-in"
				class="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
			>
				Login
			</a>
			<!-- <a
				href="/sign-up"
				class="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
			>
				Sign up
			</a> -->
		{/if}
	</div>
</div>

</header>

<style>
/* Add a black background color to the top navigation */
.topnav {
	background-color: #111;
	font-family: 'Courier New', monospace;
	text-align: center;
	overflow: hidden;
	margin-right: -30px;
	margin-top: -10px;
	margin-left: -30px;
}

.topnav-right {
	float: right;
}

/* Style the links inside the navigation bar */
.topnav a {
	float: left;
	color: #f2f2f2;
	padding: 20px 25px;
	text-decoration: none;
	font-size: 17px;
}

/* Change the color of links on hover */
.topnav a:hover {
background-color: #ddd;
color: black;
}

/* Add a color to the active/current link */
.topnav a.active {
background-color: #04AA6D;
color: white;
}

button {
	background-color: #111;
	color: #f2f2f2;
	padding: 20px 25px;
	font-family: 'Courier New', monospace;
	font-size: 17px;

}
</style>
