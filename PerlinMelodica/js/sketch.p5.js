
// 1 <script src="../node_modules/p5/lib/p5.js"></script>
// 2 <script src="../node_modules/p5/lib/addons/p5.sound.js"></script>
// 3 <script src="../libraries/p5.touchgui/lib/p5.touchgui.js"></script>
// 4 <script src="https://cdn.jsdelivr.net/npm/p5.wasm@0.2.1/dist/p5.wasm.js"></script>
// 5 <script src="../public/sketch.js"></script>

function sketch() {
  var fg, graphf, graph, arrgraph = [], cnv, ctl, seed, OSN, SN, LNP, gui, precision = 0.1, z = 0, bpm = 128, slb, ctlhidden = true, ctldrawn = false, noiseOpts, noiseSel, inp, osc, env, an, playing = false, arr = [], prevnote = 0, note, notecolor = [255,255,255], slv, btn, slp, noisebtn, gsize = 10, pd = 5, pw = 2, narr = [], ms0, ms1 = 0, sclbtn, maji = 6, mini = 9, notebtn, shown = true, mod = 1, at, al, dt, dl;
  // var LN = LibNoise();

  document.addEventListener("visibilitychange", (e) => {
    if (document.visibilityState == "visible") {
      console.log("tab is activate")
    } else {
      console.log("tab is inactive")
    }
  })

  window.addEventListener("keydown", (e) => {
      e.preventDefault();
  }, false);

  window.addEventListener("resize", (e) => {
      location.reload(true);
  });

  preload = () => {
      // monofont = loadFont("fonts/Dotrice-Bold-Condensed.otf");
      // monofont = loadFont("fonts/Dotrice-Bold-Expanded.otf");
      monofont = loadFont("../fonts/Dotrice-Bold.otf");
      // monofont = loadFont("fonts/Dotrice-Condensed.otf");
      // monofont = loadFont("fonts/Dotrice-Expanded.otf");
      // monofont = loadFont("fonts/Dotrice-Regular.otf");
  };

  setup = () => {
      fg = document.getElementById('fg');
      fg.addEventListener("mousedown", function(e) {
          console.log(e);
      });
      seed = Date.now();
      // console.log(P5N,OSN,SN,LNP);
      noiseOpts = [
          "Open Simplex Noise"
          ,
          "Simplex Noise"
          ,
          "LibNoise"
          ,
          "p5noise"
          ];
      noiseSel = 0;
      cnv = createCanvas(innerWidth,innerHeight);
      cnv.parent('bg');
      ctl = createGraphics(innerWidth,innerHeight);
      graph = createGraphics(innerWidth/gsize,innerHeight/gsize,WEBGL);
      graphf = createGraphics(innerWidth/gsize,innerHeight/gsize,WEBGL);
      graph.pixelDensity(pd);
      graphf.pixelDensity(pd);
      clear();
      ctl.clear();
      graph.clear();
      console.log(seed);
      LNP = new PerlinNoise(seed);
      setNoiseSeed(seed);
      genNoise(graph);
      al = 1.0; // attack level 0.0 to 1.0
      dt = (bpm2ms(bpm)/1000); // decay time in seconds
      at = dt*0.1; // attack time in seconds
      dl = 0.0; // decay level  0.0 to 1.0
      //   inp =
      osc = new p5.Oscillator('sine');
      env = new p5.Envelope(at, al, dt, dl);
      an = new p5.Amplitude();
      //   an.setInput(osc);
      musicScales.rootnote = 60;
      ctl.textFont(monofont);
      gui = ctl.createGui();
      slv = sliderVolume(ctl, innerWidth*0.975, innerHeight*0.012);
      btn = ctl.createButton("seed: "+seed, innerWidth*0.01, innerHeight*0.012,250,25);
      noisebtn = ctl.createButton(noiseOpts[noiseSel], innerWidth*0.01, (innerHeight*0.012)+30,250,25);
      sclbtn = ctl.createButton(musicScales.scales[musicScales.scl][0], innerWidth*0.01, (innerHeight*0.012)+60,250,25);
      slp = ctl.createSlider("Precision",(innerWidth*0.01)+255,innerHeight*0.012,100,25,pow(10,-2),pow(10,-1));
      slp.val = 0.05;
      slb = ctl.createSlider("bpm",(innerWidth*0.01)+255,(innerHeight*0.012)+30,100,25,pow(10,-1),pow(10,3));
      slb.val = bpm;
      notebtn = ctl.createButton(midinotes[musicScales.rootnote], (innerWidth*0.01)+255, (innerHeight*0.012)+60,100,25);
  };

  draw = () => {
      clear();
      // genNoise(graph);
      // z = z + 0.1;
      // if (noiseSel === 0){console.log(frameCount);}
      // genNoise(graph);
      if (shown) {
          image(graph,0,0,graph.width*gsize,graph.height*gsize);
      }
      image(graphf,0,0,graphf.width*gsize,graphf.height*gsize);
      image(ctl,0,0,innerWidth,innerHeight);
      // texture(graph.get());
      // noStroke();
      // plane(width,height)
      if(noisebtn.isPressed) {
          resetall();
          noiseSel = (noiseSel + 1)%4;
          setNoiseSeed(seed);
          genNoise(graph);
      }
      noisebtn.label = noiseOpts[noiseSel];
      if(btn.isPressed) {
          resetall();
          seed = Date.now();
          //  noiseSel = wasm.round(random(0,3));
          setNoiseSeed(seed);
          genNoise(graph);
      }
      btn.label = "seed: "+seed;
      if (slp.isChanged) {
          resetall();
          // if (noiseSel === 2){
          //     sleep(100);
          // }
          precision = slp.val;
          setNoiseSeed(seed);
          genNoise(graph);
      }
      sclbtn.label = musicScales.scales[musicScales.scl][0];
      if (sclbtn.isPressed) {
          let scli = (musicScales.scl+1)%musicScales.scales.length;
          console.log(scli);
          musicScales.setScale(scli);
      }
      notebtn.label = midinotes[musicScales.rootnote];
      if (notebtn.isPressed) {
          musicScales.rootnote = (((musicScales.rootnote&12)+1)%12)+60;
      }
      env.aLevel = slv.val;
      env.dLevel = slv.val/10;
      bpm = slb.val;
      // env.dTime = dt = (bpm2ms(bpm)/6000)-at;
      keycontrol();

      ctl.clear();
      if (!ctlhidden) {
          for (let el of gui.objects) {
              el.enabled = ctldrawn;
          }
          if (ctldrawn){
              ctl.drawGui();
          }
          ctl.fill("rgba(255,255,255,1)");
          // ctl.fill(notecolor);
          ctl.textAlign(LEFT,TOP);
          ctl.textSize(innerHeight/50);
          // ctl.text('Zoom: '+slp.val,(innerWidth*0.01)+360,20,1000,25);
          // ctl.text('BPM: '+bpm,(innerWidth*0.01)+360,50,1000,25);
          // ctl.text(midinotes[note]+" "+an.getLevel(),(innerWidth*0.01)+360,80,1000,25);
          ctl.text(`Seed: ${seed}\nAlgorithm: ${noiseOpts[noiseSel]}\nRoot Note: ${midinotes[musicScales.rootnote]}\nScale: ${musicScales.scales[musicScales.scl][0]}\nBPM: ${bpm}\nZoom: ${slp.val.toFixed(2)}\nVolume: ${slv.val.toFixed(2)} [${an.getLevel().toFixed(2)}]`, innerWidth*0.02, innerHeight*0.02);
      }
      // if (!(an.getLevel() > 0)){
      //     osc.stop();
      // }
      ms0 = wasm.round(millis());
      if (ms0 >= ms1) {
          if (mouseIsPressed) {
              playNoteAt();
          }
          fill("rgba(255,255,255,0.5)");
          ms1 = ms0 + bpm2ms(bpm);
      } else {
          fill("rgba(0,0,0,0.5)");
      }
      slv.x = innerWidth*0.975;
      slv.y = innerHeight*0.012;
      btn.x = innerWidth*0.01;
      btn.y = innerHeight*0.012;
      noisebtn.x = innerWidth*0.01;
      noisebtn.y = (innerHeight*0.012)+30;
      sclbtn.x = innerWidth*0.01;
      sclbtn.y = (innerHeight*0.012)+60;
      slp.x = (innerWidth*0.01)+255
      slp.y = innerHeight*0.012;
      slb.x = (innerWidth*0.01)+255
      slb.y = (innerHeight*0.012)+30;
      notebtn.x = (innerWidth*0.01)+255;
      notebtn.y = (innerHeight*0.012)+60;
      noStroke();
      rect(0,0,innerWidth, innerHeight*0.01);
      rect(0,innerHeight*0.99,innerWidth, innerHeight*0.01);
      rect(0,innerHeight*0.01,innerWidth*0.01, innerHeight*0.98);
      rect(innerWidth*0.99,innerHeight*0.01,innerWidth*0.01, innerHeight*0.98);
      playing = false;
      mouseIsMoved = false;
  };

  mouseWheel = (event) => {
      print(event.delta);
      // move the square according to the vertical scroll amount
      al = ((al - event.delta/10000)).clip(0,1);
      dl = al/10;
      env.aLevel = al;
      env.dLevel = dl;
      slv.val = al;
      // slb.val = (slb.val - wasm.round(event.delta/4)/100).clip(pow(10,-2),pow(10,3)).toFixed(2);
      // uncomment to block page scrolling
      return false;
  };

  windowResized = () => {
      location.reload(true);
  };

  mouseMoved = () => {
      mouseIsMoved = true;
  };

  // mouseDragged = () => {
  //     playNoteAt();
  // };

  // mousePressed = () => {
  //     playNoteAt();
  // };

  playNoteAt = (mx = wasm.floor(mouseX/gsize),my = wasm.floor(mouseY/gsize)) => {
      let nval = wasm.constrain(getNoiseVal(mx,my,z),-1,1);
      note = musicScales.noise2note(nval);
      let color = midi2color(note);
      notecolor = color.rgb();
      narr.push([mouseX,mouseY,note,color]);

      playing = true;
      if (graphf.loadPixels()){
          let xyloc = ((mx + my * graph.width) * 4);
          graphf.pixels[(xyloc + 0)] = notecolor[0];
          graphf.pixels[(xyloc + 1)] = notecolor[1];
          graphf.pixels[(xyloc + 2)] = notecolor[2];
          graphf.updatePixels();
      } else {
          graphf.noStroke();
          graphf.fill(notecolor);
          graphf.rect(mx-graph.width/2,my-graph.height/2,1,1);
          // graphf.rect(mx,my,1,1);

          // graphf.stroke(color.rgb(),0.5);
          // graphf.strokeWeight(pw);
          // graphf.point(mx-graph.width/2,my-graph.height/2,1);
          // graphf.point(mx,my);
      }

      // sleep(wasm.map(getNoiseVal(mouseX/10,mouseY/10,z),-1,1,300,100));
      // sleep(bpm2ms(bpm));
      // if (prevnote != note) {
          console.log(nval,note);
          // starting the oscillator ensures that audio is enabled.
          osc.start();
          osc.freq(midiToFreq(note))
          env.play(osc);
      // }

      prevnote = note;
  };

  resetall = () => {
      graph.resizeCanvas(innerWidth/gsize,innerHeight/gsize);
      // cnv.clear();
      // ctl.clear();
      graph.clear();
      graphf.clear();
      narr = [];
  };

  keyPressed = () => {
      if (keyIsDown(ENTER)) {

      }
      if (keyIsDown(ESCAPE)) {
          if (ctlhidden) {
              ctlhidden = false;
              fg.style.opacity = "1";
          } else {
              ctlhidden = true;
              fg.style.opacity = "0";
          }
      }
      if (keyIsDown(192)) {
          if (window.confirm("Esta acción borrará todo")){
              resetall();
              seed = Date.now();
              //  noiseSel = wasm.round(random(0,3));
              setNoiseSeed(seed);
              genNoise(graph);
          }
      }
      if (keyIsDown(TAB)) {
          if (window.confirm("Esta acción borrará todo")){
              resetall();
              noiseSel = (noiseSel + 1)%4;
              setNoiseSeed(seed);
              genNoise(graph);
          }
      }
      if (keyIsDown(BACKSPACE)) {
          if (shown) {
              shown = false;
          } else {
              shown = true;
          }
      }
      if (keyIsDown(81)) {
          musicScales.rootnote = 60;
      }
      if (keyIsDown(50)) {
          musicScales.rootnote = 61;
      }
      if (keyIsDown(87)) {
          musicScales.rootnote = 62;
      }
      if (keyIsDown(51)) {
          musicScales.rootnote = 63;
      }
      if (keyIsDown(69)) {
          musicScales.rootnote = 64;
      }
      if (keyIsDown(82)) {
          musicScales.rootnote = 65;
      }
      if (keyIsDown(53)) {
          musicScales.rootnote = 66;
      }
      if (keyIsDown(84)) {
          musicScales.rootnote = 67;
      }
      if (keyIsDown(54)) {
          musicScales.rootnote = 68;
      }
      if (keyIsDown(89)) {
          musicScales.rootnote = 69;
      }
      if (keyIsDown(55)) {
          musicScales.rootnote = 70;
      }
      if (keyIsDown(85)) {
          musicScales.rootnote = 71;
      }

      if (keyIsDown(65)) {
          if (musicScales.scl === musicScales.minorScales[mini]){
              mini = (mini+1)%musicScales.minorScales.length;
          }
          musicScales.setScale(musicScales.minorScales[mini]);
      }
      if (keyIsDown(90)) {
          if (musicScales.scl === musicScales.minorScales[mini]){
              mini = ((mini-1)+musicScales.minorScales.length)%musicScales.minorScales.length;
          }
          musicScales.setScale(musicScales.minorScales[mini]);
      }
      if (keyIsDown(83) && !keyIsDown(17)) {
          let scli = (musicScales.scl+1)%musicScales.scales.length;
          musicScales.setScale(scli);
      }
      if (keyIsDown(88)) {
          let scli = ((musicScales.scl-1)+musicScales.scales.length)%musicScales.scales.length;
          musicScales.setScale(scli);
      }
      if (keyIsDown(68)) {
          if (musicScales.scl === musicScales.majorScales[maji]){
              maji = (maji+1)%musicScales.majorScales.length;
          }
          musicScales.setScale(musicScales.majorScales[maji]);
      }
      if (keyIsDown(67)) {
          if (musicScales.scl === musicScales.majorScales[maji]){
              maji = ((maji-1)+musicScales.majorScales.length)%musicScales.majorScales.length;
          }
          musicScales.setScale(musicScales.majorScales[maji]);
      }
      if (keyIsDown(83) && keyIsDown(17)) {
          console.log('saving...');
          graphf.save(seed.toString());
      }
      if (keyIsDown(70)) {
          bpm = slb.val = wasm.abs(bpm * 2).toFixed(1);
          dt = (bpm2ms(bpm)/2000);
          env.aTime = at = dt*0.20;
          env.dTime = dt = dt*0.70;
      }
      if (keyIsDown(86)) {
          bpm = slb.val = wasm.abs(bpm / 2).toFixed(1);
          dt = (bpm2ms(bpm)/2000);
          env.aTime = at = dt*0.20;
          env.dTime = dt = dt*0.70;
      }
      if (keyIsDown(189)) {
          if (window.confirm("Esta acción borrará todo")) {
              resetall();
              precision = slp.val = wasm.constrain(slp.val + mod/1000,pow(10,-2),pow(10,-1));
              setNoiseSeed(seed);
              genNoise(graph);
          }
      }
      if (keyIsDown(187)) {
          if (window.confirm("Esta acción borrará todo")) {
              resetall();
              precision = slp.val = wasm.constrain(slp.val - mod/1000,pow(10,-2),pow(10,-1));
              setNoiseSeed(seed);
              genNoise(graph);
          }
      }
  };

  keycontrol = () => {
      mod = 1;
      if (keyIsDown(SHIFT)) {
          mod = 0.1;
      }
      if (keyIsDown(ALT)) {
          mod = 10;
      }
      if (keyIsDown(LEFT_ARROW)) {
          bpm = slb.val = wasm.abs(bpm - mod).toFixed(1);
          dt = (bpm2ms(bpm)/1000);
          env.aTime = at = dt*0.20;
          env.dTime = dt = dt*0.70;
      }
      if (keyIsDown(RIGHT_ARROW)) {
          bpm = slb.val = wasm.abs(bpm + mod).toFixed(1);
          dt = (bpm2ms(bpm)/1000);
          env.aTime = at = dt*0.20;
          env.dTime = dt = dt*0.70;
      }
      if (keyIsDown(UP_ARROW)) {
          env.aLevel = slv.val = wasm.constrain(env.aLevel + mod/10,0,1);
          env.dLevel = env.aLevel/10;
      }
      if (keyIsDown(DOWN_ARROW)) {
          env.aLevel = slv.val = wasm.constrain(env.aLevel - mod/10,0,1);
          env.dLevel = env.aLevel/10;
      }
  };

  bpm2ms = (bpm=128) => {
      return (60000)/bpm;
  };

  setNoiseSeed = (s) => {
      wasm.noise_seed(s);
      SN = new SimplexNoise(s);
      OSN = new OpenSimplexNoise(s);
      LNP.then((lnp)=>{
          lnp.perlin.SetSeed(s);
      })
      //   LNP = new LN.Perlin();
      //   LNP.SetSeed(s);
  };

  genNoise = (img) => {
      if (img.loadPixels()) {
          img.loadPixels();
          for (let i = 0; i < img.pixels.length/4; i++){
              img.pixels[(i*4)+3] = 255;
          }
          for (let x = 1; x < img.width-1; x++) {
              for (let y = 1; y < img.height-1; y++) {
                  // Calculate the 1D location from a 2D grid
                  let rgb = wasm.map(getNoiseVal(x,y,z),-1,1,0,255), loc = ((x + y * img.width) * pd);
                  // arrgraph.push([rgb,loc]);
                  img.pixels[(loc + 0)] = rgb;
                  img.pixels[(loc + 1)] = rgb;
                  img.pixels[(loc + 2)] = rgb;
                  img.pixels[(loc + 4)] = 0.5;
              }
          }
          img.updatePixels();
      } else {
          arrgraph = [];
          for (let x = 1; x < img.width-1; x++) {
              for (let y = 1; y < img.height-1; y++) {
                  let rgb = wasm.map(getNoiseVal(x,y,z),-1,1,0,255);
                  arrgraph.push([rgb,x-img.width/2,y-img.height/2,1,1]);
                  // img.stroke(rgb);
                  // img.strokeWeight(pd);
                  // img.point(x-img.width/2,y-img.height/2,0);
                  img.fill(rgb);
                  img.noStroke();
                  img.rect(x-img.width/2,y-img.height/2,1,1);
              }
          }
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
          try{
              val = wasm.noise3d(x*precision,y*precision,z);
          } catch (err) {
              console.log(frameCount,x,y,z,err);
          }
          break;
          default:
          break;
      }
      return val;
  };

  windowResized = () => {
  //   resizeCanvas(innerWidth,innerHeight);
  //   graph.resizeCanvas(innerWidth/10,innerHeight/10);
  }

  // Wait for promise to resolve then start p5 sketch
  // LN.then((lN)=>{
        new p5();
  // });
}

function p5wasmjs(rs,rj) {
  if (rs) {
    console.log("Response:",rs);
    //
    import("https://"+location.host+"/libraries/modules/joex-p5-utils.js").then((rs1,rj1)=>{
        if (rs1) {
          console.log("Response:",rs1);
          import("https://"+location.host+"/libraries/joex-p5noise-libnoise-helper.js").then((rs2,rj2)=>{
              if (rs2) {
                console.log("Response:",rs2);
                import("https://"+location.host+"/libraries/joex-p5wasm-musicscales-helper.js").then((rs3,rj3)=>{
                    if (rs3) {
                      console.log("Response:",rs3);
    //
                      import("https://cdn.jsdelivr.net/npm/p5.wasm@0.2.1/dist/p5.wasm.js").then((rs4,rj4)=>{
                          if (rs4) {
                            console.log("Response:",rs4);
                            // This is to stop global mode from starting automatically
                            p5.instance = true;
                            // Wait for promise to resolve then start p5 sketch
                            window.p5WasmReady.then(sketch).catch((err5)=>{console.error("p5WasmReady\n",err5);});
                          }
                          if (rj4) {
                            console.error("Reject:",rj4);
                          }
                        }).catch((err4)=>{console.error("p5.wasm\n",err4);});
      //
                    }
                    if (rj3) {
                      console.error("Reject:",rj3);
                    }
                  }).catch((err3)=>{console.error("joex-p5wasm-musicscales-helper\n",err3);});
              }
              if (rj2) {
                console.error("Reject:",rj2);
              }
            }).catch((err2)=>{console.error("joex-p5noise-libnoise-helper\n",err2);});
        }
        if (rj1) {
          console.error("Reject:",rj1);
        }
      }).catch((err1)=>{console.error("joex-p5-utils\n",err1.stack);});
      //
  }
  if (rj) {
    console.error("Reject:",rj);
  }
}

// import("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js").then((rs1,rj1)=>{
import("https://"+location.host+"/node_modules/p5/lib/p5.js").then((rs1,rj1)=>{
    if (rs1) {
      console.log("Response:",rs1);
      import("https://"+location.host+"/node_modules/p5/lib/addons/p5.sound.js").then((rs2,rj2)=>{
          if (rs2) {
            console.log("Response:",rs2);
            import("https://"+location.host+"/libraries/p5.touchgui/lib/p5.touchgui.js").then(p5wasmjs).catch((err3)=>{console.error("p5.touchgui\n",err3);});
          }
          if (rj2) {
            console.error("Reject:",rj2);
          }
      }).catch((err2)=>{console.error("p5.sound\n",err2);});
    }
    if (rj1) {
      console.error("Reject:",rj1);
    }
}).catch((err1)=>{console.error("p5.js\n",err1);});
