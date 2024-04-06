<script>
	export let images;
	export let socket;
	export let userId;
	const submitVote = (id) => () => {
		socket.emit('vote', id);
	};
</script>

<h1>Voting</h1>

<div class="grid-container">
	{#each images as image_data}
		<div class="item">
			<h2>{image_data.userNickname}</h2>
			<img src={image_data.image} alt="Player 1" />
			{#if image_data.userId == userId}
				<p>Can't vote on your own picture!</p>
			{:else}
				<button on:click={submitVote(image_data.userId)}>Vote</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #8db4ff;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 40px;
		padding: 20px;
		border: 1px solid #59069a;
	}
</style>
