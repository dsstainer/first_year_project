<!-- YourComponent.svelte -->
<script lang="ts">
	export let data;
	export let form;
  
	function createFormLink(formData: any) {
	  let url = "/session";
	  if (formData == undefined) {
		return undefined;
	  }
	  return url + "/" + formData.id;
	}
	$: formLink = createFormLink(form);
  </script>
  
<div class='page-container'>
	<div class='page-title'>
		<p>Join a session</p>
	</div>
	<div class="page-break"></div>
	<div class='page-content'>
		<div class='page-content-explanation'>
			<p>Please enter a session id and username </p>
		</div>
		<div class='page-content-break'></div>
		<form method="POST">
		<div class='page-content-content'>
		    <label>
			  Session ID
			  <input bind:value={data.prefill.sessionId} type="text" name="sessionId">
		    </label>
		    <label>
			  Nickname 
			  <input name="nickname" type="text">
		    </label>
		    <button>Join Session</button>
	    
		</div>
		</form>
		{#if form != undefined}
		{#if form != 'session-full'}
		  <div class='page-content-break'></div>
		  <div class='page-content-content'>
		    <h2>Your User Id: {form.id}</h2>
		    <p> <a href={formLink}>Press me to join this session!</a> <button on:click={() => {
			    navigator.clipboard.writeText(window.location.host + formLink);}}>
		    Copy Link</button></p>
		  </div>
		{:else}
		  <div class='page-content-break'></div>
		  <div class='page-content-content'>
			<p class='error'>Error - there are already 4 users in this session</p>
		  </div>
		{/if}
		{/if}
	</div>
</div>
  
  
  
<style>
	.page-content{
		background-color:#FFB8B8;
	}
	.error{
		color:red;
	}
</style>
