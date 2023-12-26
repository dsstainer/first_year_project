<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io("ws://localhost:3000");

	let x = "not connected";

	socket.on('eventFromServer', (message) => {
		x = "connected";
	});

	let messages: string[] = [];

	let data: any;

	socket.on('message', (message) => {
		messages.push(message);
		messages = messages;
	});

	socket.on('datafromthedatabase', (incomingdata) => {
		data = incomingdata;
	});

	socket.on("error", (e) => {
		console.error(e);
	})
</script>

<main>
	<h1>Hello, SvelteKit with WebSocket!</h1>
	<h2>{x}</h2>
	<h3>{JSON.stringify(data)}</h3>
	{#each messages as m}
		<p>{m}</p>
	{/each}
</main>
