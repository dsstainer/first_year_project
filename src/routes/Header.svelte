<script>
	import { page } from '$app/stores';
</script>

<nav>
	<ul>
		<!-- aria-current is an accessibility thing -->
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a href="/">Home</a>
		</li>
		<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
			<a href="/about">About</a>
		</li>
		<li aria-current={$page.url.pathname === '/sessionlist' ? 'page' : undefined}>
			<a href="/sessionlist">Session List</a>
		</li>
		<li aria-current={$page.url.pathname === '/joinsession' ? 'page' : undefined}>
			<a href="/joinsession">Join Session</a>
		</li>
		<li aria-current={$page.url.pathname === '/createsession' ? 'page' : undefined}>
			<a href="/createsession">Create Session</a>
		</li>
	</ul>
</nav>

<style>

	nav {
		display: flex;
		background-color: rgba(255, 255, 255, 1.0);
	}


	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		list-style: none;
	}

	li {
		height: 100%;
		padding: 0 1rem;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		text-decoration: none;
	}
</style>
