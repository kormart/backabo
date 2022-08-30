<script>
	// import '../app.css';

	import Navigation from '$lib/components/Navigation.svelte';
</script>

<head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>
	<div class="sidebar">
		<a href="#home"><i class="fa fa-fw fa-home"></i></a>
		<a href="#services"><i class="fa fa-fw fa-gear"></i></a>
		<a href="#clients"><i class="fa fa-fw fa-user"></i></a>
		<a href="#contact"><i class="fa fa-fw fa-envelope"></i></a>
	</div>
	  
	<div class="main">
		<Navigation />
		<slot />
	</div>	
</body>

<style>
body {
	font-family: 'Courier New', monospace;
}

.sidebar {
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #111;
  overflow-x: hidden;
  padding-top: 16px;
}

.sidebar a {
  padding: 6px 8px 6px 26px;
  text-decoration: none;
  font-size: 30px;
  color: #818181;
  display: block;
}

.sidebar a:hover {
  color: #f1f1f1;
}

.main {
  margin-left: 100px; /* Same as the width of the sidenav */
  padding: 0px 10px;
}
</style>
