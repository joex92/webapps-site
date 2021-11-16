var div, mousedrag = false, debug = false, woff = -innerWidth/2, hoff = -innerHeight/2, innerMin = Math.min(innerWidth,innerHeight);
var kick, snare, hihat, dlooper, mixer = [], master, plucky, metro, bpm = 100, t, n = 1, splitter, wave = [], sig, sigmult = 4;
var animate = false, elem, params, two, circle, rect, group, shape, scope, drawloop;
var col = "rgb(0, 0, 0)";
var numberOfEntities, fileInput, DXF, dxfhelper, dxfpoints = [], dxfpoly;
import("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js").then((rs,rj) => {
        console.log(rs,rj);
        loadJSscript("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js", (e) => {
                console.log(e);
                // var svgContainer = document.getElementById('svg')
                numberOfEntities = document.getElementById('numberOfEntities');
                fileInput = document.getElementById('file');
                window.requirejs(['../node_modules/dxf/dist/dxf'], function(dxf) {
                        DXF = dxf;
                        dxf.config.verbose = true;
                        fileInput.addEventListener('change', function(event) {
                                var file = event.target.files[0]
                                var reader = new FileReader()
                                numberOfEntities.innerHTML = 'reading...'
                                reader.onload = function(e) {
                                        if (e.target.readyState === 2) {
                                                var dxfContents = e.target.result
                                                dxfhelper = new dxf.Helper(dxfContents)
                                                numberOfEntities.innerHTML = dxfhelper.denormalised.length
                                                // const svg = dxfhelper.toSVG()
                                                // svgContainer.innerHTML = svg
                                                dxfpoly = dxfhelper.toPolylines();
                                                dxfpoints = [];
                                                for (i = 0; i < dxfhelper.denormalised.length; i++) {
                                                        if (dxfhelper.denormalised[i].type === 'LINE') {
                                                                // dxfpoints.push(dxfhelper.denormalised[i].start,dxfhelper.denormalised[i].end);
                                                                const llength = 128;
                                                                for (j = 0; j < llength; j++){
                                                                        dxfpoints.push({
                                                                                x: dxfhelper.denormalised[i].start.x+((dxfhelper.denormalised[i].end.x-dxfhelper.denormalised[i].start.x)*(j/llength)),
                                                                                y: dxfhelper.denormalised[i].start.y+((dxfhelper.denormalised[i].end.y-dxfhelper.denormalised[i].start.y)*(j/llength)),
                                                                                z: dxfhelper.denormalised[i].start.z+((dxfhelper.denormalised[i].end.z-dxfhelper.denormalised[i].start.z)*(j/llength))
                                                                        });
                                                                }
                                                        // } else if (dxfhelper.denormalised[i].type === 'POLYLINE') {
                                                        //         for (j = 0; j < dxfhelper.denormalised[i].vertices.length; j++){
                                                        //                 dxfpoints.push(dxfhelper.denormalised[i].vertices[j]);
                                                        //         }
                                                        // } else if (dxfhelper.denormalised[i].type === 'SPLINE') {
                                                        //         for (j = 0; j < dxfhelper.denormalised[i].controlPoints.length; j++){
                                                        //                 dxfpoints.push(dxfhelper.denormalised[i].controlPoints[j]);
                                                        //         }
                                                        } else {
                                                                console.log(dxfhelper.denormalised[i].type);
                                                                for (j = 0; j < dxfpoly.polylines[i].vertices.length; j++){
                                                                        dxfpoints.push({
                                                                                x: dxfpoly.polylines[i].vertices[j][0],
                                                                                y: dxfpoly.polylines[i].vertices[j][1],
                                                                                z: dxfpoly.polylines[i].vertices[j][2]
                                                                        });
                                                                }
                                                        }
                                                }
                                                console.log(dxfpoly,dxfpoints.length);
                                                if (dxfpoints.length > 1){
                                                        const dx = (Math.abs(dxfhelper.parsed.header.extMax.x) - Math.abs(dxfhelper.parsed.header.extMin.x)) / 2;
                                                        const dy = (Math.abs(dxfhelper.parsed.header.extMax.y) - Math.abs(dxfhelper.parsed.header.extMin.y)) / 2;
                                                        const dmax = Math.max(
                                                                Math.abs(dxfhelper.parsed.header.extMax.x - dx),
                                                                Math.abs(dxfhelper.parsed.header.extMin.x - dx),
                                                                Math.abs(dxfhelper.parsed.header.extMax.y - dy),
                                                                Math.abs(dxfhelper.parsed.header.extMin.y - dy)
                                                        );
                                                        console.log(dx,dy,dmax);
                                                        sig.L.setMap((val,ind) => (dxfpoints[Math.floor((ind/1024) * dxfpoints.length)].x - dx) / dmax);
                                                        sig.R.setMap((val,ind) => (dxfpoints[Math.floor((ind/1024) * dxfpoints.length)].y - dy) / dmax);
                                                }
                                        }
                                }
                                reader.readAsBinaryString(file)
                        });
                });
        });
}).catch((err1)=>{console.log("Require.js",err1);});
import("../libraries/two.js/build/two.js").then(twoSketch).catch((err2)=>{console.log("two.js",err2);});

function twoSketch(rs1,rj1) {

  debugdiv = (ev) => {
    let evtxt = "";
    if (ev.type.search("key") > -1) {
      evtxt = "<br> Key: " + ev.code;
    } else if (ev.type.search("mouse") > -1) {
      evtxt = "<br>  X: "+ev.clientX+" px | Y: "+ev.clientY+" px";
    }
    div.innerHTML = "Synth: " + Tone.Transport.state +
    "<br>Freq: " + Math.round(Tone.mtof(Number(document.getElementById("sigfreq").value))*1000)/1000 + " Hz | Vol: " + Math.round(master.get().volume*100)/100 + " dB" +
    "<br> Mouse: " + (mousedrag ? 'dragging' : 'moving')+
    evtxt+
    "<br> Shape Length: "+shape.vertices.length;
  }

  twoPreload = () => {
    window.onload = (ev) => {
      div = document.getElementById('main');
      WebMidi.enable(function (err) {
        if (err) {
          div.innerHTML = "WebMidi could not be enabled.<br>" + err.message;
        } else {
          div.innerHTML = "WebMidi enabled!<br>in: " + WebMidi.inputs + " out: " + WebMidi.outputs;
        }
        div.innerHTML = div.innerHTML + "<br><b>Press [SPACE] to Play/Stop</b>"
      });

      document.getElementById("sigfreq").addEventListener('mousedown', (ev) => {
        mousedrag = true;
      });
      document.getElementById("sigfreq").addEventListener('mouseup', (ev) => {
        mousedrag = false;
      });
      document.getElementById("sigfreq").addEventListener('mousemove', (ev) => {
        debugdiv(ev);
        if (mousedrag) {
          // console.log(ev.target.value);
          sig.nal.set({frequency: Tone.mtof(Number(ev.target.value))});
        }
      });
      document.getElementById("sigfreq").addEventListener('change', (ev) => {
        debugdiv(ev);
        sig.nal.set({frequency: Tone.mtof(Number(ev.target.value))});
      });

      document.getElementById("multfreq").addEventListener('mousedown', (ev) => {
        mousedrag = true;
      });
      document.getElementById("multfreq").addEventListener('mouseup', (ev) => {
        mousedrag = false;
      });
      document.getElementById("multfreq").addEventListener('mousemove', (ev) => {
        debugdiv(ev);
        if (mousedrag) {
          // console.log(ev.target.value);
          sigmult = Number(ev.target.value);
          sig.L.setMap((val,ind) => (ind/512)-1);
          sig.R.setMap((val,ind) => Math.sin(sigmult*(ind/1023)*Math.PI));
        }
      });
      document.getElementById("multfreq").addEventListener('change', (ev) => {
        debugdiv(ev);
        sigmult = Number(ev.target.value);
        sig.L.setMap((val,ind) => (ind/512)-1);
        sig.R.setMap((val,ind) => Math.sin(sigmult*(ind/1023)*Math.PI));
      });

      document.getElementById("volume").addEventListener('mousedown', (ev) => {
        mousedrag = true;
      });
      document.getElementById("volume").addEventListener('mouseup', (ev) => {
        mousedrag = false;
      });
      document.getElementById("volume").addEventListener('mousemove', (ev) => {
        debugdiv(ev);
        if (mousedrag) {
          // console.log(ev.target.value);
          master.set({volume: Math.round(Math.log(Number(ev.target.value))/Math.log(1.0699)*Math.pow(10,2))/Math.pow(10,2)})
        }
      });
      document.getElementById("volume").addEventListener('change', (ev) => {
        debugdiv(ev);
        master.set({volume: Math.round(Math.log(Number(ev.target.value))/Math.log(1.0699)*Math.pow(10,2))/Math.pow(10,2)})
      });

      twoSetup();
    };
    window.onresize = (ev) => {
      // resizeCanvas(innerWidth,innerHeight);
      two.width = innerWidth;
      two.height = innerHeight;
      innerMin = Math.min(innerWidth,innerHeight);
    };
    window.onclick = (e) => {
      if (Tone.now() > 0.1) {
        // console.log(e);
      } else {
        Tone.start();
        // Tone.Transport.start();
      }
    };
  };

  twoSetup = () => {
    for (let w = 0; w < 2; w++){
      wave[w] = new Tone.Waveform(128);
    }
    splitter = new Tone.Split(2);
    master = new Tone.Channel({channelCount: 2});
    for (let ch = 0; ch < 4; ch++){
      mixer[ch] = new Tone.Channel({channelCount: 2}).connect(master);
    }
    sig = {
      nal: new Tone.Oscillator(110,"triangle"),
      // nal: new Tone.PulseOscillator(1, 0),
      panL: new Tone.Panner({pan: -1}).connect(master),
      // L: new Tone.WaveShaper((val) => Math.max(-0.5,Math.min(val,0.5))*2),
      // L: new Tone.WaveShaper((val) => Math.cos((0.5+Math.max(-0.5,Math.min(val,0.5)))*2*Math.PI)/2),
      // L: new Tone.WaveShaper((val) => Math.cos(val*Math.PI)/2),
      // L: new Tone.WaveShaper((val,ind) => Math.cos((ind/511.5)*Math.PI)/2),
      L: new Tone.WaveShaper((val,ind) => (ind/512)-1),
      panR: new Tone.Panner({pan: 1}).connect(master),
      // R: new Tone.WaveShaper((val) => Math.sin((0.5+Math.max(-0.5,Math.min(val,0.5)))*2*Math.PI)/2),
      // R: new Tone.WaveShaper((val) => Math.sin(val*Math.PI)/2),
      R: new Tone.WaveShaper((val,ind) => Math.sin(sigmult*(ind/1023)*Math.PI))
    };
    sig.nal.fan(sig.L,sig.R);
    sig.L.connect(sig.panL);
    sig.R.connect(sig.panR);
    master.fan(splitter,Tone.Destination);
    splitter.connect(wave[0],0);
    splitter.connect(wave[1],1);
    kick = new Tone.MembraneSynth();
    kick.connect(mixer[0]);
    snare = new Tone.MetalSynth();
    snare.connect(mixer[1]);
    mixer[1].set({pan: 0.5});
    hihat = new Tone.NoiseSynth();
    hihat.connect(mixer[2]);
    mixer[2].set({pan: -0.5})
    plucky = new Tone.PluckSynth();
    plucky.connect(mixer[3]);
    metro = new Tone.Loop(metronome, '1m');
    dlooper = new Tone.Loop(drums, '1m');
    // Tone.Transport.schedule((time) => {
    //     // use the time argument to schedule a callback with Draw
    //     Tone.Draw.schedule(tdraw, time);
    // }, "+0.5");
    sig.nal.start();
    metro.start();
    dlooper.start();

    window.onkeydown = (ev) => {
      debugdiv(ev);
      if (ev.code === "Space"){
        try{
          if (Tone.Transport.state === "stopped") {
            Tone.Transport.start();
          } else {
            Tone.Transport.stop();
          }
        } catch(err) {
          console.log(err);
        }
      } else if (ev.code === "Escape") {
        shape.vertices = []; //new Two.Utils.Collection();
      }
    };


    // Make an instance of two and place it on the page.
    elem = document.getElementsByTagName('main')[0]; //document.getElementsById('draw-shapes');
    params = {
      type: Two.Types.canvas,
      width: innerWidth,
      height: innerHeight };
    two = new Two(params).appendTo(elem);
    two.renderer.domElement.style["background-color"] = "#000000"; // background;

    // two has convenience methods to create shapes.
    circle = two.makeCircle(0, 0, Math.min(innerWidth,innerHeight)/2);
    rect = two.makeRectangle(0, 0, Math.min(innerWidth,innerHeight), Math.min(innerWidth,innerHeight));

    // The object returned has many stylable properties:
    circle.fill = col; // '#FF8000';
    // circle.stroke = 'orangered'; // Accepts all valid css color
    // circle.linewidth = 5;

    rect.fill = col; // 'rgb(0, 200, 255)';
    // rect.opacity = 0.75;
    // rect.noStroke();

    // Groups can take an array of shapes and/or groups.
    group = two.makeGroup(circle, rect);

    // And have translation, rotation, scale like all shapes.
    group.scale = 1;
    group.stroke = "white";

    // You can also set the same properties a shape have.
    group.noStroke();

    shape = two.makePath([],false,false,true);
    shape.noFill();
    shape.stroke = "rgba(255,255,255,0.5)"
    shape.linewidth = 1;
    shape.join = "round";
    // scope = two.makeGroup();
    // scope = two.makePath();
    scope = new Two.Points();
    for (let i = 0; i < Math.min(wave[0].getValue().length,wave[1].getValue().length); i++){
      // let tmp = two.makeCircle(0,0,1);
      // scope.add(tmp);
      // let tmp = new Two.Anchor(0,0);
      let tmp = new Two.Vector(0,0);
      scope.vertices.push(tmp);
    }
    // scope.stroke = "#ffffff77";
    scope.noStroke();
    scope.fill = "#ffffff77";
    scope.size = 1;
    // scope.join = "miter";
    two.add(scope);

    two.renderer.domElement.addEventListener('mousedown', (ev) => {
      mousedrag = true;
      const mvert = new Two.Anchor(ev.clientX+woff,ev.clientY+hoff);
      const newVert = shape.vertices[shape.vertices.length-1] !== mvert;
      // div.innerHTML = newVert;
      if (newVert) {
        shape.vertices.push(mvert);
      }
    });
    two.renderer.domElement.addEventListener('mouseup', (ev) => {
      mousedrag = false;
    });
    two.renderer.domElement.addEventListener('mousemove', (ev) => {
      debugdiv(ev);
      if (mousedrag) {
        const mvert = new Two.Anchor(ev.clientX+woff,ev.clientY+hoff);
        shape.vertices.push(mvert);
      }
    });

    try {
      // Bind a function to scale and rotate the group
      // to the animation loop.
      two.bind('update', twoDraw).play();  // Finally, start the animation loop
    } catch(err) {
      console.log(err);
      drawloop = new Tone.Loop((time) => {
        Tone.Draw.schedule(()=>{
          twoDraw();
          drawloop.set({interval: '96n'});
          try{two.update();}catch(err){div.innerHTML = err.message;}
        }, time);
      }, '96n');
      drawloop.start();
    }
  };

  metronome = (time) => {
    for (let m = 0; m < 4; m++){
      let mtime = time + Tone.Time('4n').toSeconds()*m;
      Tone.Draw.schedule(ddraw1, mtime);
      Tone.Draw.schedule(ddraw2, mtime + Tone.Time('32n').toSeconds());
      const oct = 2*(1-Math.ceil(m/4))+3;
      plucky.triggerAttack('A'+oct,mtime);
    }
  };

  background = (color,twoCnv = two) => {
      twoCnv.renderer.domElement.style["background-color"] = color
  };

  live = (fc) => {
    // background("#660000");
  };

  twoDraw = (frameCount) => {
    try {
      woff = -innerWidth/2;
      hoff = -innerHeight/2;

      // This code is called everytime two.update() is called.
      // Effectively 60 times per second.
      shape.translation.set(two.width / 2, two.height / 2);
      group.translation.set(two.width / 2, two.height / 2);
      scope.translation.set(two.width / 2, two.height / 2);
      // circle.position.set(-two.width / 3, 0);
      circle.radius = innerMin/2;
      circle.fill = col;
      // rect.position.set(two.width / 3, 0);
      rect.width = innerMin;
      rect.height = innerMin;
      rect.fill = col;

      if (shape.vertices.length > 1024) {
        shape.vertices.shift();
      }

      if (animate){
        // if (group.scale > 0.999) {
        //   group.scale = group.rotation = 0;
        // }
        // var t = (1 - group.scale) * (Tone.Time('1m').toSeconds()/Tone.Time('1m').toSeconds());
        t = Math.log10((((Tone.Transport.seconds%Tone.Time('4n').toSeconds())/Tone.Time('4n').toSeconds())*9)+1);
        group.scale = ((1 - Math.abs((t*2)-1))/2)+0.5;
        group.rotation = t * (2 * Math.PI) * n;
      }

      Tone.Transport.bpm.value = bpm;
      scope.vertices = []; //new Two.Utils.Collection();
      const scopesize = Math.min(innerWidth,innerHeight);
      for (let i = 0; i < Math.min(wave[0].getValue().length,wave[1].getValue().length); i++){
        // div.innerHTML = wave[0].getValue()[i]*100+", "+wave[1].getValue()[i]*(-100);

        const p = new Two.Vector(wave[0].getValue()[i]*scopesize/2,wave[1].getValue()[i]*(-scopesize/2));

        // if (scope.children[i]){
        //   scope.children[i].position.set(wave[0].getValue()[i]*100,wave[1].getValue()[i]*(-100));
        // } else {
        //   scope.add(two.makeCircle(wave[0].getValue()[i]*100,wave[1].getValue()[i]*(-100),1));
        // }

        // scope.vertices.push(new Two.Anchor(wave[0].getValue()[i]*100,wave[1].getValue()[i]*(-100)));
          scope.vertices.push(p);
      }
      scope.noStroke();
      scope.fill = "#00ff00";
      scope.size = 2;
      // col = Math.round(kick.getLevelAtTime())*255;
      // noStroke();
      // fill(col);
      // ellipse(0+woff,0+hoff,min(innerWidth,innerHeight)/2);
      live(frameCount);

    } catch(err) {
      if (debug) {
        div.innerHTML = err.message;
      }
    }
  };

  ddraw1 = (time) => {
    col = "rgba(255, 255, 255, 0.255)";
  };

  ddraw2 = (time) => {
    col = "rgba(0, 0, 0, 0.255)";
  };

  drums = (time) => {
    ntime = Tone.Transport.now() / Tone.Time('1m').toSeconds();
    if (debug){console.log(Math.floor(ntime));}
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

  if (rs1) {
    console.log("Response:",rs1);
    twoPreload();
  }
  if (rj1) {
    console.log("Reject:",rj1);
  }
}
