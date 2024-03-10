<script>
    export let images;
    export let socket;
    export let userId;
    const submitVote = id => () =>{
        socket.emit("vote",id);
    }
</script>
<h1>Voting State</h1>

<div class="grid-container">
    {#each images as image_data}
    {#if image_data.userId != userId}
    <div class="item">
        <h2>{image_data.userNickname}</h2>
        <img src="{image_data.image}" alt="Player 1">
        <button on:click={submitVote(image_data.userId)}>Vote</button>
    </div>
    {:else}
    <div class="item">
        <h2>{image_data.userNickname}</h2>
        <img src="{image_data.image}" alt="Player 1">
        <p>Can't vote on your own picture!</p>
    </div>
    {/if}
    {/each}

</div>

