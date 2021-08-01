var debug = false, div, cnv, woff = 0, hoff = 0;
var kick, snare, hihat, dlooper, plucky, metro, bpm = 128;
var col = 0;

import("https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js").then((rs1,rj1)=>{
    if (rs1) {
      console.log("Response:",rs1);
      import("https://cdn.jsdelivr.net/npm/p5.wasm@0.2.1/dist/p5.wasm.js").then((rs2,rj2)=>{
        if (rs2) {
          console.log("Response:",rs2);
          // This is to stop global mode from starting automatically
          p5.instance = true;
          // Wait for promise to resolve then start p5 sketch
          window.p5WasmReady.then(sketch).catch((err3)=>{console.log("p5WasmReady",err3);});
        }
        if (rj2) {
          console.log("Reject:",rj2);
        }
      }).catch((err2)=>{console.log("p5.wasm",err2);});
    }
    if (rj1) {
      console.log("Reject:",rj1);
    }
}).catch((err1)=>{console.log("p5.js",err1);});

function sketch() {
  preload = () => {
    div = document.getElementById('main');
    window.onresize = (ev) => {
      resizeCanvas(innerWidth,innerHeight);
    };
    WebMidi.enable(function (err) {
      if (err) {
        div.innerHTML = "WebMidi could not be enabled.<br>" + err.message;
      } else {
        div.innerHTML = "WebMidi enabled!<br>in: " + WebMidi.inputs + " out: " + WebMidi.outputs;
      }
    });
    onclick = (e) => {
      if (Tone.now() > 0.1) {
        console.log(e);
      } else {
        Tone.start();
      }
    };
  };

  setup = () => {
    cnv = createCanvas(innerWidth,innerHeight,WEBGL);
    background("#660000");
    kick = new Tone.MembraneSynth().toDestination();
    snare = new Tone.MetalSynth().toDestination();
    hihat = new Tone.NoiseSynth().toDestination();
    plucky = new Tone.PluckSynth().toDestination();
    metro = new Tone.Loop(metronome, '1m');
    dlooper = new Tone.Loop(drums, '1m');
    // Tone.Transport.schedule((time) => {
    //     // use the time argument to schedule a callback with Draw
    //     Tone.Draw.schedule(tdraw, time);
    // }, "+0.5");
    Tone.Transport.start();
    metro.start();
    dlooper.start();
  };

  metronome = (time) => {
    for (let m = 0; m < 4; m++){
      let mtime = time + Tone.Time('4n').toSeconds()*m;
      Tone.Draw.schedule(ddraw1, mtime);
      Tone.Draw.schedule(ddraw2, mtime + Tone.Time('32n').toSeconds());
      const oct = 2*(1-wasm.ceil(m/4))+3;
      plucky.triggerAttack('A'+oct,mtime);
    }
  };

  live = () => {
    background("#660000");
  };

  draw = () => {
    if (cnv.isP3D) {
      woff = 0;
      hoff = 0;
    } else {
      woff = -innerWidth/2;
      hoff = -innerHeight/2;
    }
    try {

      Tone.Transport.bpm.value = bpm;
      live();
      // col = wasm.round(kick.getLevelAtTime())*255;
      noStroke();
      fill(col);
      ellipse(0+woff,0+hoff,min(innerWidth,innerHeight)/2);

    } catch(err) {
      if (debug) {
        div.innerHTML = err.message;
      }
    }
  };

  ddraw1 = (time) => {
    col = 255;
  };

  ddraw2 = (time) => {
    col = 0;
  };

  drums = (time) => {
    ntime = Tone.Transport.now() / Tone.Time('1m').toSeconds();
    if (debug){console.log(wasm.floor(ntime));}
    for (let k = 0; k < 2; k++) {
      let ktime = time + Tone.Time('4n').toSeconds()*(2*k);
      kick.triggerAttackRelease('A1','8n', ktime);
    }
    for (let s = 0; s < 2; s++) {
      snare.triggerAttackRelease('A-1','16n', time + Tone.Time('4n').toSeconds()*(2*s+1));
    }
    for (let h = 0; h < 16; h++) {
      let htime = time + Tone.Time('16n').toSeconds()*h;
      hihat.triggerAttackRelease('16n', htime,(16-h)/32);
    }
  };

  new p5();
}