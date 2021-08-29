// <script src="https://unpkg.com/js-wasm/js-wasm.js"></script>
var innerMin = Math.min(innerWidth,innerHeight), bg, fg, params, two, seed = Date.now(), precision = 0.1, noiseSel, noiseOpts;
function twoSketch() {
  // Make an instance of two and place it on the page.
  bg = document.getElementById('bg'); //document.getElementById('draw-shapes');
  fg = document.getElementById('fg');
  // console.log(P5N,OSN,SN,LNP);
  noiseOpts = [
      "Open Simplex Noise"
      ,
      "Simplex Noise"
      ,
      "LibNoise"
      ,
      "WasmNoise"
      ];
  noiseSel = 0;

  bpm2ms = (bpm=128) => {
      return (60000)/bpm;
  };

  setNoiseSeed = (s) => {
      WasmNoise.SetSeed(Date.now())
      SN = new SimplexNoise(s);
      OSN = new OpenSimplexNoise(s);
      LNP.then((lnp)=>{
          lnp.perlin.SetSeed(s);
      })
      //   LNP = new LN.Perlin();
      //   LNP.SetSeed(s);
  };

  genNoise = (img) => {
      // if (img.loadPixels()) {
      //     img.loadPixels();
      //     for (let i = 0; i < img.pixels.length/4; i++){
      //         img.pixels[(i*4)+3] = 255;
      //     }
      //     for (let x = 1; x < img.width-1; x++) {
      //         for (let y = 1; y < img.height-1; y++) {
      //             // Calculate the 1D location from a 2D grid
      //             let rgb = wasm.map(getNoiseVal(x,y,z),-1,1,0,255), loc = ((x + y * img.width) * pd);
      //             // arrgraph.push([rgb,loc]);
      //             img.pixels[(loc + 0)] = rgb;
      //             img.pixels[(loc + 1)] = rgb;
      //             img.pixels[(loc + 2)] = rgb;
      //             img.pixels[(loc + 4)] = 0.5;
      //         }
      //     }
      //     img.updatePixels();
      // } else {
      //     arrgraph = [];
      //     for (let x = 1; x < img.width-1; x++) {
      //         for (let y = 1; y < img.height-1; y++) {
      //             let rgb = wasm.map(getNoiseVal(x,y,z),-1,1,0,255);
      //             arrgraph.push([rgb,x-img.width/2,y-img.height/2,1,1]);
      //             // img.stroke(rgb);
      //             // img.strokeWeight(pd);
      //             // img.point(x-img.width/2,y-img.height/2,0);
      //             img.fill(rgb);
      //             img.noStroke();
      //             img.rect(x-img.width/2,y-img.height/2,1,1);
      //         }
      //     }
      // }
  };

  getNoiseVal = (x,y,z) => {
      let val = 0;
      switch(noiseSel){
          case 0:
            val = OSN.noise3D(x*precision,y*precision,z);
            break;
          case 1:
            val = SN.noise3D(x*precision,y*precision,z);
            break;
          case 2:
            LNP.then((lnp)=>{
                val = lnp.perlin.GetValue(x*precision,y*precision,z);
            });
            break;
          case 3:
            val = WasmNoise.GetSimplex3(x*precision,y*precision,z);
            break;
          default:
            break;
      }
      return val;
  };
  setNoiseSeed(seed);
  params = {
    type: Two.Types.svg,
    width: innerWidth,
    height: innerHeight };
  two = new Two(params).appendTo(bg);
  two.renderer.domElement.style["background-color"] = "#000000"; // background;
  window.onresize = (e) => {
    console.log(e);
    two.width = innerWidth;
    two.height = innerHeight;
    innerMin = Math.min(innerWidth,innerHeight);
  };
  window.onmousemove = (e) => {
    fg.style["left"] = e.clientX + "px";
    fg.style["top"] = e.clientY + "px";
  };
}

var libNoiseScript = loadJSscript("https://"+location.host+"/libraries/joex-p5noise-libnoise-helper.js",(e) => {
  console.log(e);
  LNP = new PerlinNoise(seed);
  import("https://unpkg.com/tone").then((rs1,rj1) => {
    if (rs1) {
      console.log("Response:\n",rs1);
      import("https://"+location.host+"/libraries/two.js/build/two.js").then((rs2,rj2) => {
        if (rs2) {
          console.log("Response:\n",rs2);
          twoSketch();
        }
        if (rj2) {
          console.log("Reject:\n",rj2);
        }
      }).catch((err2)=>{console.error("Two.js\n",err2);});
    }
    if (rj1) {
      console.log("Reject:\n",rj1);
    }
  }).catch((err1)=>{console.error("Tone.js",err1);});
});
