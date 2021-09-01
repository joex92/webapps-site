var millis = 0, fps = 0, avfps, innerMin = Math.min(innerWidth,innerHeight), bg, fg, params, two, cnv, seed = Date.now(), precision = 0.1, noiseSel, noiseOpts, noise;
function twoSketch() {
  bg = document.getElementById('bg');
  fg = document.getElementById('fg');
  window.onmousemove = (e) => {
    fg.style["left"] = (e.clientX.clip(innerWidth-fg.clientWidth)) + "px";
    fg.style["top"] = (e.clientY.clip(innerHeight-fg.clientHeight)) + "px";
  };
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
  noiseSel = 3;

  bpm2ms = (bpm=128) => {
      return (60000)/bpm;
  };

  setNoiseSeed = (s) => {
      WasmNoise.SetSeed(Date.now());
      SN = new SimplexNoise(s);
      OSN = new OpenSimplexNoise(s);
      LNP.then((lnp)=>{
          lnp.perlin.SetSeed(s);
      })
      //   LNP = new LN.Perlin();
      //   LNP.SetSeed(s);
  };

  genNoise = (twoObj, nw = innerWidth, nh = innerHeight) => {
    for (let x = 0; x < nw; x++){
      for (let y = 0; y < nh; y++){
        const val = getNoiseVal(x,y,0);
        switch (objType(twoObj)) {
          case 'Group':
            let p = new Two.Rectangle(x+0.5,y+0.5,1,1);
            p.fill = "rgba(255,255,255,"+val+")";
            twoObj.add(p);
            break;
          case 'Points':
            break;
          case 'ImageData':
            let i = ((x + y * twoObj.width) * 4);
            twoObj.data[i+0] = 255;
            twoObj.data[i+1] = 255;
            twoObj.data[i+2] = 255;
            twoObj.data[i+3] = val.lmap(-1,1,0,255);
            break;
          default:
            break;
        }
      }
    }
    if (objType(twoObj) === 'ImageData'){
      cnv.putImageData(twoObj, 0, 0);
    }
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
  // Make an instance of two and place it on the page.
  params = {
    type: Two.Types.canvas,
    width: innerWidth,
    height: innerHeight };
  two = new Two(params).appendTo(bg);
  two.renderer.domElement.style["background-color"] = "#000000ff"; // background;
  switch (two.type) {
    case Two.Types.canvas:
      cnv = two.renderer.domElement.getContext('2d');
      break;
    case Two.Types.webgl:
      cnv = two.renderer.domElement.getContext('webgl');
      break;
    default:
      cnv = two.renderer.domElement;
      break;
  }
  window.onresize = (e) => {
    console.log(e);
    two.width = innerWidth;
    two.height = innerHeight;
    innerMin = Math.min(innerWidth,innerHeight);
  };
  noise = two.makeGroup();
  noise.noStroke();
  noise.scale = 1;

  twoDraw = (frameCount,timeDelta) => {
    millis += timeDelta;
    avfps = 1000*(frameCount/millis);
    fps = 1000/timeDelta;
    fg.innerHTML = "<br><b>Frame Count:</b> <i>"+frameCount+"</i>f<br><b>Delta Time:</b> <i>"+timeDelta+"</i>ms<br><b>Frame Rate:</b> <i>"+fps.toFixed(2)+"</i>fps<br><b>Average Frame Rate:</b> <i>"+avfps.toFixed(2)+"</i>fps";
  };

  // Bind a function to scale and rotate the group
  // to the animation loop.
  two.bind('update', twoDraw).play();  // Finally, start the animation loop
}

var libNoiseScript = loadJSscript("https://"+location.host+"/libraries/joex-p5noise-libnoise-helper.js",(e) => {
  console.log(e);
  LNP = new PerlinNoise(seed);
  // import("https://"+location.host+"/node_modules/wasm-noise/wasm_noise.js").then((rs0,rj0) => {
  //   if (rs0) {
  //     console.log("Response:\n",rs0,rs0.toString());
      import("https://unpkg.com/tone").then((rs1,rj1) => {
        if (rs1) {
          console.log("Response:\n",rs1,propsAsString(rs1,"\n"));
          import("https://"+location.host+"/libraries/two.js/build/two.js").then((rs2,rj2) => {
            if (rs2) {
              console.log("Response:\n",rs2,propsAsString(rs2,"\n"));
              WasmNoise.onLoaded = () => {
                twoSketch();
              };
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
  //   }
  //   if (rj0) {
  //     console.log("Reject:\n",rj0);
  //   }
  // }).catch((err0)=>{console.error("wasm-noise.js",err0);});
});
