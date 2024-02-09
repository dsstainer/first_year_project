<script lang="ts">
    export let data;
    $: formContents = data.prefill;
    // function createJoinSessionLink()
</script>

<form method="POST">
    <input type="text" bind:value={formContents.sessionId} name="sessionId">
    <!-- <input type="text" bind:value={formContents.nickname} name="nickname"> -->
    <input type="text" name="nickname">
    <button>Join Session</button>
</form>

{#if false}
    <p>Link to join session if button didn't work</p>
    <!-- <a href=""></a> -->
    <!-- <p>Link: <a href={joinSessionLink}>{joinSessionLink}</a> <button on:click={() => {
		navigator.clipboard.writeText(window.location.host + joinSessionLink);
	}}>Copy Link</button></p> -->
{/if}