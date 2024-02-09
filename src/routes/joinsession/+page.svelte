<script>
	export let data;

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