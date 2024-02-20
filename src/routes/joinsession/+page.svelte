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
  
  <style>
	.container {
	  max-width: 400px;
	  margin: 20px auto;
	  padding: 20px;
	  border: 1px solid #ccc;
	  border-radius: 8px;
	  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
  
  </style>
  
  <div class="container">
	<header>
	  <h1>Opposite Drawing Game</h1>
	</header>
  
	<form method="POST">
	  <label for="explanation">
		Explanation: Enter the session ID and a nickname to join a session
	  </label>
	  <br>
	  <br>
	  <hr>
	  <label>
		Session ID
		<input bind:value={data.prefill.sessionId} type="text" name="sessionId">
	  </label>
	  <br>
	  <br>
	  <label>
		Nickname 
		<input name="nickname" type="text">
	  </label>
	  <br>
	  <br>
	  <button>Join Session</button>
	  <br>
	  <br>
	  <label for="join button">
		Click the button to join the session
	  </label>
  
	</form>
  
	{#if form != undefined}
	  <p>User created!</p>
	  <p>User Id: {form.id}</p>
	  <p>Link: <a href={formLink}>{formLink}</a> <button on:click={() => {
		navigator.clipboard.writeText(window.location.host + formLink);
	  }}>Copy Link</button></p>
	{/if}
  </div>
  