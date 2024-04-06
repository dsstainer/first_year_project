<script lang="ts">
	// TypeScript code here
	export let votes: any;

	function orderVotes(votes: any) {
		let orderedVotes = Object.keys(votes).map((userId) => ({
			userId,
			...votes[userId],
		}));
		orderedVotes.sort((a, b) => b.votes - a.votes);
		return orderedVotes;
	}

	$: orderedVotes = orderVotes(votes);

	function navigateTo(path: string) {
		window.location.href = path;
	}
</script>

<div class="ranking-container">
	<div class="title-row">
		<div>Nickname</div>
		<div class="title rank">Ranking</div>
		<div class="title score">Voting Score</div>
		<div class="title">Picture Drawn</div>
	</div>
	{#if orderVotes == undefined}
		<p>waiting for votes...</p>
	{:else}
		{#each orderedVotes.map((value, index) => ({ value, index })) as x}
			<div class="ranking-item">
				<div>{x.value.nickname}</div>
				<div class="rank">
					{x.index + 1}{x.index == 0 ? 'st' : x.index == 1 ? 'nd' : x.index == 2 ? 'rd' : 'st'}
				</div>
				<div class="score">votes: {x.value.votes}</div>
				<img src={x.value.image} alt="" />
			</div>
		{/each}
	{/if}
	<!-- <div class="ranking-item">
		<div class="rank">1 st:</div>
		<div class="score">100</div>
		<img src="path_to_image1.jpg" alt="picture 1" />
	</div>
	<div class="ranking-item">
		<div class="rank">2 nd:</div>
		<div class="score">90</div>
		<img src="path_to_image2.jpg" alt="picture 2" />
	</div>
	<div class="ranking-item">
		<div class="rank">3 rd:</div>
		<div class="score">80</div>
		<img src="path_to_image3.jpg" alt="picture 3" />
	</div>
	<div class="ranking-item">
		<div class="rank">4 th:</div>
		<div class="score">70</div>
		<img src="path_to_image4.jpg" alt="picture 4" />
	</div> -->
</div>

<div style="text-align: center; margin-top: 20px;">
	<button on:click={() => navigateTo('/createsession')} class="create-session-button">
		Create a New Session
	</button>
</div>

<div style="text-align: center; margin-top: 20px;">
	<button on:click={() => navigateTo('/')} class="home-button">Home</button>
</div>

<style>
	/* CSS styles remain the same */
	.centered-text {
		text-align: center;
		font-size: 24px;
		margin-top: 20px;
	}
	.ranking-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin-top: 50px;
	}
	.title-row,
	.ranking-item {
		display: flex;
		width: 80%;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
	.ranking-item img {
		width: 50px;
		height: 50px;
	}
	.home-button,
	.create-session-button {
		cursor: pointer;
		background-color: #007bff;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 5px;
		font-weight: bold;
		font-size: 16px;
		transition: background-color 0.3s;
		margin-top: 20px;
	}
	.score,
	.rank,
	.title {
		min-width: 50px;
		text-align: center;
	}
	.title {
		font-weight: bold;
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
</style>
