<!-- YourComponent.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	// console.log(data);
	export let form: any;

	import { onMount } from 'svelte';

	function createFormLink(formData: any) {
		let url = '/session';
		if (formData == undefined) {
			return undefined;
		}
		return url + '/' + formData.id;
	}
	$: formLink = createFormLink(form);

	// function joinSession(e: Event) {
	// 	// e.preventDefault();
	// 	// form.id is the newly created user id
	// 	const thisInterval = setInterval(() => {
	// 		console.log("hello");
	// 		if (form == undefined) {
	// 			return;
	// 		}
	// 		if (form == 'session-full') {
	// 			clearInterval(thisInterval);
	// 		}
	// 		if (form == '500') {
	// 			clearInterval(thisInterval);
	// 		}
	// 		if (form.id == undefined) {
	// 			return;
	// 		}
	// 		goto(`/session/${form.id}`);
	// 	}, 100);
	// }

	onMount(() => {
		// const joinSessionLink = document.getElementById('join-session-link');
		// if (joinSessionLink == undefined) {
		// 	return;
		// }
		// joinSessionLink.click();
		if (form != undefined && form != "session-full" && formLink != undefined) {
			// window.location.href = window.location.protocol + "//" + window.location.host + ""
			goto(formLink);
		}
	});
</script>

<div class="page-container">
	<div class="page-title">
		<p>Join a session</p>
	</div>
	<div class="page-break"></div>
	<div class="page-content">
		<div class="page-content-explanation">
			<p>Please enter a Session ID and Nickname</p>
		</div>
		<div class="page-content-break"></div>
		<form method="POST">
			<div class="page-content-content">
				<label>
					Session ID
					<input bind:value={data.prefill.sessionId} type="text" name="sessionId" />
				</label>
				<label>
					Nickname
					<input name="nickname" type="text" />
				</label>
				<button>Join Session</button>
			</div>
		</form>
		<!-- {#if form != 'session-full'}
			{/if} -->
		{#if form == 'session-full'}
			<div class="page-content-break"></div>
			<div class="page-content-content">
				<p class="error">There are already 4 users in this session</p>
			</div>
		{:else if form == '500'}
			<div class="page-content-break"></div>
			<div class="page-content-content">
				<p class="error">Error when joining - perhaps the session ID is wrong</p>
			</div>
		{:else if form != undefined}
			<div class="page-content-content">
				<h2>Your User Id: {form.id}</h2>
				<p>
					<a id="join-session-link" href={formLink} target="_blank"
						>Press me to join this session!</a
					>
					<button
						on:click={() => {
							navigator.clipboard.writeText(window.location.host + formLink);
						}}
					>
						Copy Link</button
					>
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.page-content {
		background-color: #ffb8b8;
	}
</style>
