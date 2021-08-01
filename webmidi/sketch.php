<html>
	<head>
	<link rel="stylesheet" href="style.css">
	<script src='https://cwilso.github.io/WebMIDIAPIShim/build/WebMIDIAPI.min.js'></script>
	<script src="https://cdn.jsdelivr.net/npm/webmidi@2.5.2"></script>
	<script src="https://unpkg.com/tone"></script>
	<?
		$sketch = $_GET['sketch'];
		if (strlen($sketch) > "0"){
				echo '<script id="sketch" src="'.$sketch.'"></script>';
		} else {
			echo '<script id="redirect">window.location.replace("https://'. $_SERVER['SERVER_NAME'] .'/webmidi");</script>';
		}
	?><!--  -->
	<script src="../libraries/joex-utils.js"></script>
	</head>
	<body>
		<main></main>
		<div id="main"></div>
	</body>
</html>