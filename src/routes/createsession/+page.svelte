<script lang="ts">
	export let form;
	function createFormLink(form: any) {
		let url = '/joinsession';
		if (form == undefined) {
			return url;
		}
		let sps = new URLSearchParams();
		sps.append('sessionId', form.id);
		return url + '?' + sps.toString();
	}
	$: formLink = createFormLink(form);
</script>

<div class="page-container">
	<div class="page-title">
		<p>Create a session</p>
	</div>
	<div class="page-break"></div>
	<div class="page-content">
		<div class="page-content-explanation">
			<p>Please press the button to create a session!</p>
		</div>
		<div class="page-content-break"></div>
		{#if form == undefined}
			<div class="page-content-content">
				<form method="POST" class="session-form">
					<button>Create new session</button>
				</form>
			</div>
		{:else}
			<div class="page-content-content">
				<h2>Your Session Id: {form.id}</h2>
				<p>
					<a href={formLink} target="_blank">Press me to join this session!</a>
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
