<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Joe X!'s Perlin Melodica</title>
    <style>
        canvas {
            position: fixed;
            top: 0px;
            left: 0px;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="public/style.css">
    <!-- <script>
      var Module = {
        onRuntimeInitialized: function() {
          console.log('module loaded');
        }
      };
      Module['onRuntimeInitialized'] = function() {
        console.log("wasm loaded ");
        // var x=Module.ccall("doubleIt","number",["number"],[20]);
        // alert(x);
      }
    </script> -->
    <!-- <script src="http://yui.yahooapis.com/3.18.1/build/yui/yui-min.js"></script> -->
    <script src="../node_modules/chroma-js/chroma.js"></script>
    <script src="../node_modules/chroma-js/chroma-light.js"></script>
    <script src="../node_modules/glsl-canvas-js/dist/umd/glsl-canvas.js"></script>
    <script src="../node_modules/noise-c.wasm/src/bytes_allocation.js"></script>
    <script src="../node_modules/noise-c.wasm/src/constants.js"></script>
    <script src="../node_modules/noise-c.wasm/src/index.js"></script>
    <script src="../node_modules/noise-c.wasm/src/library_random_bytes.js"></script>
    <script src="../node_modules/noise-c.wasm/src/noise-c.js"></script>
    <!-- <script src="../node_modules/wasm-noise/wasm_noise.js"></script> -->
    <!-- <script src="../libraries/WasmNoise/html/wasmnoise.autoloader.js"></script> -->
    <script src="../libraries/OpenSimplexNoise.js"></script>
    <script src="../libraries/SimplexNoise.js"></script>
    <script src="../node_modules/libnoise.js/libnoise.js"></script>
    <script src="../libraries/joex-utils.js"></script>
  	<?
  		$sketch = $_GET['sketch'];
  		if (strlen($sketch) > "0") {
				echo '<script id="sketch" src="js/sketch.'.$sketch.'.js"></script>';
        // if (strcasecmp($sketch, 'p5') == 0 ) {
        //   echo '<script src="../libraries/joex-p5-utils.js"></script><script src="../libraries/joex-p5wasm-musicscales-helper.js"></script>';
        // }
  		} else {
  			echo '<script id="redirect">window.location.replace("betaindex.html");</script>';
  		}
  	?>
  </head>
  <body>
    <div id="bg"></div>
    <div id="fg" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;">
    </div>
  </body>
</html>
