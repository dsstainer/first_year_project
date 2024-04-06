<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import Canvas from './Canvas.svelte';

	export let setGetImageBase64: Function;
	export let imageSubmitted: boolean;
	export let submitImage: MouseEventHandler<HTMLButtonElement>;
	export let prompt: string;
</script>

<div class="page-container">
	<div class="page-title">
		<p>{prompt}</p>
	</div>
	<div class="page-break"></div>
	<div class="page-content">
		<Canvas width={800} height={600} {setGetImageBase64} />
		<button on:click={submitImage}>Submit Image</button>
		{#if imageSubmitted}
			<p>Image submitted!</p>
		{/if}
	</div>
</div>
