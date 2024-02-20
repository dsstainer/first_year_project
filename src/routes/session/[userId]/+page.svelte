<script lang="ts">
	export let data;
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	// import store from './store.js';

	let wsConnected = false;
	let prompt: string;
	let error: any;

	onMount(() => {
		const socket = io("http://localhost:3000");

		socket.on("connectionOk", () => {
			wsConnected = true;
		});

		socket.on("error", ({message}) => {
			error = {message};
		})
		// const events = new EventSource("http://localhost:3000/subscribe");
		// // const events = new EventSource(env.PUBLIC_WS_URL as string);

		// events.addEventListener("connected", () => {
		// 	sseConnected = true;
		// });

		// events.addEventListener("message", ({data}) => {
		// 	prompt = data;
		// });
	});

	// events.onmessage = (event) => {
	// 	console.log(JSON.parse(event.data));
	// };

	// socket.on('connectionOk', () => {
	// 	wsConnected = true;
	// 	socket.emit("ids", data.userId);
	// });

	// socket.on("disconnect", () => {
	// 	wsConnected = false;
	// 	// socket.emit("ids", data.userId);
	// });

	// socket.on("startDrawing", (startDrawingData) => {
	// 	prompt = startDrawingData.prompt;
	// });
</script>

{#if error != undefined}
	<h3>{error.message}</h3>
{/if}

<p>Session, userId: {data.userId} websockets connected: {wsConnected}</p>
<h2>{prompt}</h2>