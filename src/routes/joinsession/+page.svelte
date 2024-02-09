<script>
	export let data;
	function createFormLink(form) {
		let url = "/session";
		if (form == undefined) {
			return undefined;
		}
		let sps = new URLSearchParams();
		sps.append("id", form.id);
		return url + "?" + sps.toString();
	}
	$: formLink = createFormLink(data.response);
</script>

<form method="POST">
	<label>
		Session ID
		<input bind:value={data.prefill.sessionId} type="text" name="sessionId">
	</label>
	<label>
		Username
		<input name="nickname" type="text">
	</label>
	<button>Log in</button>
</form>

{#if formLink != undefined}
	<p>User created!</p>
	<p>User Id: {data.response.id}</p>
	<p>Link: <a href={formLink}>{formLink}</a> <button on:click={() => {
		navigator.clipboard.writeText(window.location.host + formLink);
	}}>Copy Link</button></p>
{/if}