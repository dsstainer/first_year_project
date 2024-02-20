<script lang="ts">
    // this will be the value returned from the load function in +page.server.ts
	export let data: { sessions: any[] | null };
</script>

<h1>Session List</h1>

<style>
	h1 {
		color: blue;
		font-family: 'Comic Sans MS', cursive;
		font-size: 6em;
		margin: 0;
		text-align: center;
	}
</style>


{#if data.sessions == null}
	<p>Loading...</p>
{:else}
	<ul>
		<style> ul { list-style-type: none; } </style>
		{#each data.sessions as session}
			<li>
				<p>Session ID: {session.id}<br>
					Session State: {session.state}<br>
					<a href={`/joinsession?sessionId=${session.id}`}>Press This To Join Session</a><br>
				<button on:click={() => {
						navigator.clipboard.writeText(window.location.host + `/joinsession?sessionId=${session.id}`);}}>
					Copy Link
				</button></p>
				<style>
					p {
						border-width:3px; 
						border-style:solid; 
						border-color: solid black; 
						padding: 1em;
						font-weight: bold;
						font-size: 30px;
						text-align: center;
						}
				</style>
			</li>
		{/each}
	</ul>
{/if}
