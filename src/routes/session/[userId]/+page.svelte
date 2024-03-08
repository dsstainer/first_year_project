<script lang="ts">
	export let data;
	// import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import Waiting from './Waiting.svelte';
	import Drawing from './Drawing.svelte';
	import Ended from './Ended.svelte';

	let wsConnected = false;
	let prompt: string;
	let error: any;
	let state = 'waiting';
	let getImageBase64: Function;

	function setGetImageBase64(newGetImageBase64: Function) {
		getImageBase64 = newGetImageBase64;
	}

	let submitImage = () => {
		console.error("can't submit image until sockets are setup");
	};

	function setupSocket() {
		const socket = io('http://localhost:3000');

		socket.on('connectionOk', () => {
			wsConnected = true;
			console.log("connect");

			socket.emit('userId', { userId: data.userId });
		});

		socket.on('stateChange', (stateChange) => {
			if (stateChange.newState == 'drawing') {
				state = 'drawing';
				prompt = stateChange.prompt;
			} else if (stateChange.newState == 'voting') {
				state = 'voting';
			}
		});

		socket.on('error', (incomingError) => {
			error = incomingError;
		});

		socket.on('disconnect', () => {
			console.log("disconnect");
			setupSocket();
		});

		submitImage = () => {
			socket.emit('image', getImageBase64());
		};
	}

	onMount(() => {
		setupSocket();
	});
</script>

{#if error != undefined}
	<h3 style="background-color: red; color: white;">{error.message}</h3>
{/if}

<h1>Session</h1>
<p>userId: {data.userId}, websockets connected: {wsConnected}, state: {state}</p>
<h2>{prompt}</h2>

{#if state == 'waiting'}
	<Waiting />
{:else if state == 'drawing'}
	<Drawing {setGetImageBase64} />
	<button on:click={submitImage}>Submit Image</button>
{:else if state == 'voting'}
	<p>voting...</p>
{:else if state == 'ended'}
	<Ended />
{:else}
	<h1>Undefined State</h1>
{/if}
