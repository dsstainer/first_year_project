<script lang="ts">
	export let form;
	function createFormLink(form: any) {
		let url = "/joinsession";
		if (form == undefined) {
			return url;
		}
		let sps = new URLSearchParams();
		sps.append("sessionId", form.id);
		return url + "?" + sps.toString();
	}
	$: formLink = createFormLink(form);
</script>

<form method="POST" class="session-form">
	<button>Create new session</button>
</form>

<div class="center" style="margin-top: 200px;">
	{#if form != undefined}
		<h2>Session created!</h2>
		<p>Session Id: {form.id}</p>
		<p>Link: <a href={formLink}>{formLink}</a> <button on:click={() => {
			navigator.clipboard.writeText(window.location.host + formLink);}}>
		Copy Link</button></p>
	{/if}
</div>

<style>
	.session-form {
		position: absolute;
		top: 70px;
		left: 10px;
	}
	
	.session-form button{
		font-size: 20px;
		padding: 15px 20px;
	}

	.center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

    button {
        cursor: pointer;
        padding: 10px 15px;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        font-size: 16px;
        transition: background-color 0.3s;
    }

    button:disabled {
        background-color: #cccccc;
    }

    button:hover:not(:disabled) {
        background-color: #0056b3;
    }

	h2{
		color:#007bff;
	}

	p{
		font-size: 20px;
	}

</style>
