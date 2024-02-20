<script lang="ts">
	export let data;
	// import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import Waiting from './Waiting.svelte';
	import Drawing from './Drawing.svelte';

	let wsConnected = false;
	let prompt: string;
	let error: any;
	let state = 'waiting';

	onMount(() => {
		const socket = io('http://localhost:3000');

		socket.on('connectionOk', () => {
			wsConnected = true;

			socket.emit('userId', { userId: data.userId });
		});

		socket.on('stateChange', (stateChange) => {
			console.log('sdfs');
			if (stateChange.newState == 'drawing') {
				state = 'drawing';
				prompt = stateChange.prompt;
			}
		});

		socket.on('error', (incomingError) => {
			error = incomingError;
		});
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
	<h3 style="background-color: red; color: white;">{error.message}</h3>
{/if}

<h1>Session</h1>
<p>userId: {data.userId}, websockets connected: {wsConnected}, state: {state}</p>
<h2>{prompt}</h2>

{#if state == 'waiting'}
	<Waiting />
{:else if state == "drawing"}
	<Drawing />
{:else}
	<h1>Undefined State</h1>
{/if}
