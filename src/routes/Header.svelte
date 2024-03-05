<script>
	import { page } from '$app/stores';

	$: routeId = $page.route.id
</script>

<nav>
	<ul class="left-links">
		<!-- aria-current is an accessibility thing -->
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined} class:active ={routeId == "/"}>
            <a href="/"><b>Home</b></a>
		</li>
		<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined} class:active={routeId == "/about"}>
            <a href="/about"><b>About</b></a>
        </li>
	</ul>
	<ul class="right-links">
        <li aria-current={$page.url.pathname === '/sessionlist' ? 'page' : undefined} class:active={routeId == "/sessionlist"}>
            <a href="/sessionlist"><b>Session List</b></a> 
        </li>
        <li aria-current={$page.url.pathname === '/joinsession' ? 'page' : undefined} class:active={routeId == "/joinsession"}>
            <a href="/joinsession"><b>Join Session</b></a>
        </li>
        <li aria-current={$page.url.pathname === '/createsession' ? 'page' : undefined} class:active ={routeId == "/createsession"}>
            <a href="/createsession"><b>Create Session</b></a>
		</li>
		
	</ul>

</nav>

<style>

	nav {
		display: flex;
		background-color: #59069A;
		text-align: center;
		justify-content: space-between;
	}

	ul {
		position: relative;
		text-align: center;
		padding: 0;
		margin: 0;
		height: 4em;
		display: flex;
		list-style: none;
	}

	ul.left-links li {
	    display: inline;
    }

	ul.right-links li {
	    display: inline;
	}

	li {
		height: 100%;
		padding: 0 1rem;
		display: flexbox;
		position: relative;
	}


	nav a {
		display: flex;
		height: 100%;
		color:#E0D250;
		align-items: center;
	}

	a {	
		text-decoration: none;
		color: whitesmoke
	}

	li:hover{
		text-decoration-color:#E0D250;
		text-decoration-line:underline;
		
	}

	li.active {
		background-color: #B57BFF;
	}
	li.active:hover{

		text-decoration-color:#FFFFFF;
	}
	li.active a {
		color:#FFFFFF;
	}


</style>
