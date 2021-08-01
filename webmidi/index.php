<html>
	<head>
	<title>Joe X! WebMidi</title>
	<link rel="stylesheet" href="style.css">
	<script src="../libraries/joex-utils.js"></script>
	</head>
	<body>
		<iframe id="sketch" width="100%" height="100%" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe>
		<div id="selector">
			<input id="p5js" type="button" value="p5.js">
			<br>
			<input id="twojs" type="button" value="two.js">
			<br>
			<input id="threejs" type="button" value="three.js">
		</div>
		<script>
			let libraries = [
				"https://cwilso.github.io/WebMIDIAPIShim/build/WebMIDIAPI.min.js",
				"https://cdn.jsdelivr.net/npm/webmidi@2.5.2",
				"https://unpkg.com/tone"
			];
			let sketches = {
				"p5js": "p5tone.js",
				"twojs": "twotone.js",
				"threejs": "threetone.js"
			};
			var isketch = document.getElementById("sketch");
			function loadSketch(id) {
				console.log(id,sketches[id]);
				isketch.src = "sketch.php?sketch="+sketches[id];
				// let doc = document.implementation.createHTMLDocument();	
				// try {
				// 	console.log(loadCSS(doc,"css","style.css"));
				// 	for (lib of libraries) {
				// 		console.log(loadScript(doc,lib.split("/")[lib.split("/").length-1].replace(/[@.]/g,"-"),lib));
				// 	}
				// 	console.log(loadScript(doc,id,sketches[id]));
				// } catch(err) {
				// 	console.log(err);
				// }
				// isketch.src = "";
				// isketch.contentDocument = doc;
				// console.log(doc,isketch);
			}
			document.getElementById("p5js").onclick = (e) => {loadSketch(e.toElement.id);};
			document.getElementById("twojs").onclick =  (e) => {loadSketch(e.toElement.id);};
			document.getElementById("threejs").onclick =  (e) => {loadSketch(e.toElement.id);};
			window.onload = () => {<?
					$sketch = $_GET['sketch'];
					if (strlen($sketch) > "0"){
							echo 'loadSketch("'.$sketch.'");';
					}
				?>};
		</script>
	</body>
</html>
