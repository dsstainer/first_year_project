<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io();

	let x = 3.0;

	socket.on('eventFromServer', (message) => {
		x = 4.0;
	});
</script>

<main>
	<h1>Hello, SvelteKit with WebSocket!</h1>
	<h2>{x}</h2>
</main>
