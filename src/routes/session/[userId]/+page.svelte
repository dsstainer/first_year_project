<script lang="ts">
	export let data;
	import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	// import store from './store.js';

	let sseConnected = false;
	let prompt: string;

	onMount(() => {
		const socket = io("http://localhost:3000");
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

<p>Session, userId: {data.userId} websockets connected: {sseConnected}</p>
<h2>{prompt}</h2>
