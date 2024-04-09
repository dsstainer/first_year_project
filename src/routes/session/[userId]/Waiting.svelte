<script lang="ts">
	export let numUsers: any;
	export let userNicknames: any[];
	console.log(userNicknames);
</script>

<div class="page-container">
	<div class="page-title">
		<p>Waiting</p>
	</div>
	<div class="page-break"></div>
	<div class="page-content">
		<div class="page-content-explanation">
			<p>We are waiting for {4 - numUsers} more users</p>
			<p style="width:fit-content; margin:auto">Current users: {userNicknames.join(", ")}</p>

		</div>
	</div>
</div>

<style>
	.page-content {
		background-color: rgb(255, 247, 172);
	}
</style>
