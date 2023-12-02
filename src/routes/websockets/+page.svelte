<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io();

	socket.on('eventFromServer', (message) => {
		console.log(message);
	});
</script>

<main>
	<h1>Hello, SvelteKit with WebSocket!</h1>
</main>
