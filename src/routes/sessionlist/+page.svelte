<script lang="ts">
	export let data: { sessions: any[] | null };
</script>

<h1>Session List</h1>

{#if data.sessions == null}
	<p>Loading...</p>
{:else}
	<ul>
		{#each data.sessions as session}
			<li>
				<p>id: {session.id}</p>
				<p>state: {session.state}</p>
				<p><a href={`/joinsession?id=${session.id}`}>link</a></p>
			</li>
		{/each}
	</ul>
{/if}
