<script lang="ts">
	// data will be set to the return value from the code in +page.server.ts
	export let data;
</script>

<section>
	<h1>
		opposite drawing game
	</h1>

	<!-- an example of how you can use the data -->
	<p>{JSON.stringify(data)}</p>
</section>

