<!-- <script lang="ts">
	import { env } from '$env/dynamic/public';
	import { io } from 'socket.io-client';

	const socket = io(env.PUBLIC_WS_URL || "ws://localhost:3000");

	let x = "not connected";

	socket.on('connectionOk', () => {
		x = "connected";
		socket.emit("ids", "st5zp8ffhtombeg");
	});

	socket.on("stateUpdate", (update) => {
		console.log(update);
	})
</script>

<main>
	<h1>Hello, SvelteKit with WebSocket!</h1>
	<h2>{x}</h2>
</main> -->
