<script lang="ts">
	export let data;
	export let form;
	function createFormLink(formData: any) {
		let url = "/session";
		if (formData == undefined) {
			return undefined;
		}
		return url + "/" + formData.id;
	}
	$: formLink = createFormLink(form);
</script>

<form method="POST">
	<label>
		Session ID
		<input bind:value={data.prefill.sessionId} type="text" name="sessionId">
	</label>
	<label>
		Nickname
		<input name="nickname" type="text">
	</label>
	<button>Log in</button>
</form>

{#if form != undefined}
	<p>User created!</p>
	<p>User Id: {form.id}</p>
	<p>Link: <a href={formLink}>{formLink}</a> <button on:click={() => {
		navigator.clipboard.writeText(window.location.host + formLink);
	}}>Copy Link</button></p>
{/if}