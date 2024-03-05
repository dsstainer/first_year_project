<script lang="ts">
    // this will be the value returned from the load function in +page.server.ts
	export let data: { sessions: any[] | null };
</script>



<div class='page-container'>
	<div class='page-title'>
		<p>Choose a session to join</p>
	</div>
	<div class='page-break'></div>
	{#if data.sessions == null || data.sessions.length == 0}
	<div class='page-content'>
		<p>No sessions available at the moment</p>
	</div>
	{:else}
		<ul class='page-content-list'>
		{#each data.sessions as session}
		<div class='page-content' style='background-color:{session.color}'>
			<li>
				<h2>Session ID: {session.id}</h2>
				<p class='no-margin'>Session State: {session.state}</p>
				<div class='page-content-list-break'></div>
				<p class='no-margin'>
				<a href={`/joinsession?sessionId=${session.id}`}>Press me To Join Session!</a>
				<button on:click={() => {
						navigator.clipboard.writeText(window.location.host + `/joinsession?sessionId=${session.id}`);}}>
					Copy Link
				</button>
				</p>
			</li>
		</div>
		{/each}
		</ul>
	{/if}
</div>
