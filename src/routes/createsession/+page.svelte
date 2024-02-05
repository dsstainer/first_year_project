<script lang="ts">
	export let form;
	function createFormLink(form: any) {
		let url = "/joinsession";
		if (form == undefined) {
			return url;
		}
		let sps = new URLSearchParams();
		sps.append("id", form.id);
		return url + "?" + sps.toString();
	}
	$: formLink = createFormLink(form);
</script>

<form method="POST">
	<button>Create new session</button>
</form>

{#if form != undefined}
	<p>Session created!</p>
	<p>Session Id: {form.id}</p>
	<p>Link: <a href={formLink}>{formLink}</a> <button on:click={() => {
		navigator.clipboard.writeText(window.location.host + formLink);
	}}>Copy Link</button></p>
{/if}