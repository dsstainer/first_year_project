<script lang="ts">
	import Canvas from "./Canvas.svelte";

    export let setGetImageBase64: Function;
</script>

<Canvas width={800} height={600} setGetImageBase64={setGetImageBase64}/>
