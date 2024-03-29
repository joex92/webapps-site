<html>
	<head>
	<link rel="stylesheet" href="style.css">
	<script src='https://cwilso.github.io/WebMIDIAPIShim/build/WebMIDIAPI.min.js'></script>
	<script src="../node_modules/midi-parser-js/src/midi-parser.js"></script>
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
		<div style="z-index: 1; position: fixed; color: white; background-color: rgba(0,0,0,0.5);">
			<input type='file' id='file' accept=".dxf"/>:<span id='numberOfEntities'>-</span>
			<div id="main"></div>
		</div>
		<div id="MIDIPlugin" style="position: fixed; visibility: visible; right: 0; bottom: 0; background-color: rgba(0,0,0,0); width: auto; height: 100%">
			<input id="volume" type="range" step="0.1" min="0" max="1.5" orient="vertical" value="1">
			<input id="sigfreq" type="range" step="1" min="-128" max="127" orient="vertical" value="69">
			<input id="multfreq" type="range" step="0.5" min="2" max="32" orient="vertical" value="4">
		</div>
	</body>
</html>
