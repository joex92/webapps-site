<html>
  <head>
    <meta charset="UTF-8">
    <title>PLYR</title>
    <style> 
      html { 
        overflow-y: hidden;
        overflow-x: hidden; 
      }
      body {
        padding: 0; 
        margin: 0; 
        background-color: #000000;
        /*overflow: auto;*/
      } 

      main {
        position: fixed;
        width: auto;
        height: auto;
        z-index: 0;
        top: 0;
        left: 0;
        padding: 0;
        margin: 0;
      }
          
      .centered {
          position: fixed;
          display: block;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          /*width: 100%;*/
          /*height: 100%;*/
          font-family: monospace;
          white-space: pre;
          text-align: center;
          background-color: rgba(255,255,255,0.5);
      }
    </style>
    <script src="https://unpkg.com/web-audio-daw"></script>
    <script src="libraries/SoundSource.js"></script>
    <!-- <script src="libraries/p5.js" type="text/javascript"></script> -->
    <script src="https://github.com/processing/p5.js/releases/download/v1.3.1/p5.js" type="text/javascript"></script>
    <!-- <script src="libraries/p5.dom.js" type="text/javascript"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.dom.min.js" type="text/javascript"></script>
    <!-- <script src="libraries/p5.sound.js" type="text/javascript"></script> -->
    <script src="https://github.com/processing/p5.js-sound/releases/download/v1.0.1/p5.sound.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5.wasm@0.2.1/dist/p5.wasm.js"></script>
    <script>
      var assets = [];
      <?php 
        $dir = "./stems/";
        function getContent($d){
            $content = scandir($d);
            $allfiles = array();
            for ($i = 0; $i <= count($content); $i++) {
                if ($content[$i] != "." && $content[$i] != ".." && $content[$i] != ""){
                    // var_dump($content[$i]);
                    if (strpos($content[$i],".") > 0){
                        array_push($allfiles, $d . $content[$i]);
                    } else {
                        $allfiles = array_merge($allfiles, getContent($d . $content[$i] . "/"));
                    }
                }
            }
            return $allfiles;
        }
        echo "stems = " . json_encode(getContent($dir), JSON_HEX_TAG) . ";\n"; 
      ?>
      p5.instance = true;
    </script>
    <script src="sketch.js" type="text/javascript"></script>
    <script>
      window.p5WasmReady.then(() => {
        new p5();
      });
    </script>
  </head>
  <body>
    <main></main>
    <div id="loading" class="centered"></div>
  </body>
</html>
