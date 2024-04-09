<script lang="ts">
	// this will be the value returned from the load function in +page.server.ts
	export let data: { sessions: any[] | null };

	// console.log(data);
</script>

<div class="page-container">
	<div class="page-title">
		<p>Choose a session to join</p>
	</div>
	<div class="page-break"></div>
	{#if data.sessions == null || data.sessions.length == 0}
		<div class="page-content">
			<p>No sessions available at the moment</p>
		</div>
	{:else}
		<ul class="page-content-list">
			{#each data.sessions as session}
				<div class="page-content" style="background-color:{session.color}">
					<li>
						<p class="small-info">Session ID: {session.id}</p>
						<p class="no-margin">Session State: {session.state}</p>
						<div class="page-content-list-break"></div>
						<div class="no-margin">
							<!-- <ul class="user-names-list"> -->
								<p style="width:fit-content; margin:auto">Current users: {session.userNames.join(", ")}</p>

							<!-- </ul> -->
							{#if session.numUsers <= 3}
								<a href={`/joinsession?sessionId=${session.id}`} target="_blank"
									>Press me To Join Session!</a
								>
								<button
									on:click={() => {
										navigator.clipboard.writeText(
											window.location.host + `/joinsession?sessionId=${session.id}`
										);
									}}
								>
									Copy Link
								</button>
							{:else}
								<div class="page-content-content">
									<p class="error">There are already 4 users in this session</p>
								</div>
							{/if}
						</div>
					</li>
				</div>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.user-names-list {
		list-style: none;
		margin: auto;
		padding: 0;
		width: min-content;
	}

	.user-names-list-el {
		display: inline;
		margin-right: 1rem;
	}
</style>
