<script lang="ts">
	export let data;
	// import { env } from '$env/dynamic/public';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import Waiting from './Waiting.svelte';
	import Drawing from './Drawing.svelte';
	import Ended from './Ended.svelte';
	import Voting from './Voting.svelte';

	let wsConnected = false;
	let prompt: string;
	let socket;
	let error: any;
	let state = null;
	let getImageBase64: Function;
	let votes: any;
	let images:any;
	let imageSubmitted = false;
	let numUsers = 1;

	function setGetImageBase64(newGetImageBase64: Function) {
		getImageBase64 = newGetImageBase64;
	}

	let submitImage = () => {
		console.error("can't submit image until sockets are setup");
	};

	async function  setupSocket() {
		socket = await io('http://localhost:3000');
		listenToSocket(socket);
	}

	function listenToSocket(socket){
		socket.on('connectionOk', () => {
			wsConnected = true;
			console.log("connect");
			
			socket.emit('userId', { userId: data.userId });
		});

		socket.on('stateChange', (stateChange) => {
			if (stateChange.newState == 'waiting'){
				state = 'waiting';
				numUsers = stateChange.numUsers;
			}
			else if (stateChange.newState == 'drawing') {
				state = 'drawing';
				prompt = stateChange.prompt;
			} else if (stateChange.newState == 'voting') {
				state = 'voting';
				prompt = stateChange.prompt;
				images = stateChange.images;
			} else if (stateChange.newState == 'ended') {
				state = 'ended';
				prompt = stateChange.prompt;
				votes = stateChange.votes;
			}
		});

		socket.on('error', (incomingError) => {
			error = incomingError;
		});

		socket.on('disconnect', () => {
			console.log("disconnect");
			listenToSocket(socket);
		});

		submitImage = () => {
			socket.emit('image', getImageBase64());
			imageSubmitted = true;
		};
	}

	onMount(async () => {
		await setupSocket();
	});
</script>

{#if error != undefined}
	<h3 style="background-color: red; color: white;">{error.message}</h3>
{/if}

<!--
<h1>Session</h1>
<p>userId: {data.userId}, websockets connected: {wsConnected}, state: {state} </p>
-->

{#if state == 'waiting'}
	<Waiting numUsers={numUsers}/>
{:else if state == 'drawing'}
<div class='page-container'>
	<div class='page-title'>
		<p>{prompt}</p>
	</div>
	<div class="page-break"></div>
	<div class='page-content'>
			<Drawing {setGetImageBase64} />
			{#if imageSubmitted}
			<p>Image already submitted!</p>
			{/if}
			<button on:click={submitImage}>Submit Image</button>
			
	</div>
</div>
{:else if state == 'voting'}
	<Voting {images}  {socket} userId={data.userId}/>
{:else if state == 'ended'}
	<Ended votes={votes}/>
{:else}
	<h1>Undefined State</h1>
{/if}
