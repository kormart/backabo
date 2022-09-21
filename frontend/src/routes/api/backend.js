// import { error } from '@sveltejs/kit'; // this is valid in later versions of sveltekit
// import { json } from '@sveltejs/kit'; // this is valid in later versions of sveltekit
// /** @type {import('./$types').RequestHandler} */ // this is valid in later versions of sveltekit

//  Endpoint for Backabo backend

export async function get({ url }) {
	
	const res = await fetch('http://localhost:1337/sites');
    if (!res.ok) {
        throw error(404, 'Not found');
    } else {
        const envs = await res.json();
        // return json({envs}); // this is valid in later versions of sveltekit
		return {
			body: {envs}
		}
	}
}
