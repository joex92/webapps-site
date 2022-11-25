var btn,
  mousedrag = false,
  debug = false,
  twodraw,
  cnv,
  two,
  shape,
  noVertices,
  fslider,
  mixer = [],
  master,
  bpm = 100,
  t,
  n = 1,
  scope,
  mic,
  wave = [],
  sig,
  sigmult = 4,
  T,
  R,
  X,
  XL,
  Y,
  YR,
  wflength = 1024,
  updateScope = () => {},
  setFormulas = () => {},
  woff = -innerWidth / 2,
  hoff = -innerHeight / 2,
  innerMin = (w = innerWidth, h = innerHeight) => {
    return Math.min(w, h);
  },
  fradio,
  fp,
  fc,
  finput,
  efocus,
  midiDevices = '',
  checkMidiDevices = () => {},
  div,
  debugdiv = (ev) => {
    let evtxt = "";
    if (ev.type.search("key") > -1) {
      evtxt = "&nbsp;<br>&nbsp;Key: " + ev.code;
    } else if (ev.type.search("mouse") > -1) {
      evtxt =
        "&nbsp;<br>&nbsp;X: " + ev.offsetX + " px | Y: " + ev.offsetY + " px";
    } else if (ev.type.search("touch") > -1) {
      if (debug) console.log(ev.changedTouches);
      evtxt =
        "&nbsp;<br>&nbsp;X: " +
        Math.round(
          ev.changedTouches[ev.changedTouches.length - 1].clientX -
            (ev.target.parentNode.offsetLeft -
              ev.target.parentNode.offsetWidth / 2)
        ) +
        " px | Y: " +
        Math.round(
          ev.changedTouches[ev.changedTouches.length - 1].clientY -
            (ev.target.parentNode.offsetTop -
              ev.target.parentNode.offsetHeight / 2)
        ) +
        " px";
    }
    div.innerHTML =
      "&nbsp;Oscilloscope: " +
      Tone.context.state +
      "&nbsp;<br>&nbsp;Freq: " +
      Math.round(sig.nal.frequency.value * 1000) / 1000 +
      " Hz&nbsp;<br>&nbsp;Midi: " +
      notes[$("#freq")[0].value] +
      " | " +
      $("#freq")[0].value +
      "&nbsp;<br>&nbsp;Vol: " +
      Math.round(master.get().volume * 100) / 100 +
      " dB&nbsp;<br>&nbsp;" +
      // ev.constructor.toString().split(" ")[1].replace('(','').replace(')','') +
      "Pointer: " +
      (mousedrag ? "dragging" : "moving") +
      evtxt +
      "&nbsp;<br>&nbsp;Draw Length: " +
      shape.vertices.length +
      "&nbsp;<br>&nbsp;Midi Devices: " + midiDevices + '&nbsp;';
  },
  dimAtLoad = innerMin(),
  Parser = new exprEval.Parser(),
  notes = [],
  n = 0,
  clipboard;

const templates = { 
  'Heart': {
    F: 'c',
    T: "t - PI/4",
    X: "pow(sin(θ),3)",
    Y: "( 13*cos(θ) - 5*cos(2*θ) - 2*cos(3*θ) - cos(4*θ) )/16"
  }
}
/**
 * @param {value} number Value to scale
 * @param {from} Array<number> Scale from
 * @param {to} Array<number> Scale to
 * @param {cap} Boolean Is capped?
 */
function scale(value, from, to, cap = false) {
  var scale = (to[1] - to[0]) / (from[1] - from[0]);
  var capped = Math.min(from[1], Math.max(from[0], value));
  if (cap) {
    return (capped - from[0]) * scale + to[0];
  } else {
    return (value - from[0]) * scale + to[0];
  }
}

const wl2color = (from, to = "RGB") => {
  var w = parseFloat(from);
  const v = [380, 440, 490, 510, 580, 645, 760];
  if (w >= v[0] && w < v[1]) {
    red = -(w - v[1]) / (v[1] - v[0]);
    green = 0.0;
    blue = 1.0;
  } else if (w >= v[1] && w < v[2]) {
    red = 0.0;
    green = (w - v[1]) / (v[2] - v[1]);
    blue = 1.0;
  } else if (w >= v[2] && w < v[3]) {
    red = 0.0;
    green = 1.0;
    blue = -(w - v[3]) / (v[3] - v[2]);
  } else if (w >= v[3] && w < v[4]) {
    red = (w - v[3]) / (v[4] - v[3]);
    green = 1.0;
    blue = 0.0;
  } else if (w >= v[4] && w < v[5]) {
    red = 1.0;
    green = -(w - v[5]) / (v[5] - v[4]);
    blue = 0.0;
  } else if (w >= v[5] && w < v[6]) {
    red = 1.0;
    green = 0.0;
    blue = 1 - (w - v[6]) / (v[5] - v[6]);
  } else {
    red = 0.0;
    green = 0.0;
    blue = 0.0;
  }

  // Let the intensity fall off near the vision limits
  // const i = [380,420,701,781];

  // if (w >= i[0] && w < i[1])
  //     factor = 0.3 + 0.7*(w - i[0]) / (i[1] - i[0]);
  // else if (w >= i[1] && w < i[2])
  //     factor = 1.0;
  // else if (w >= i[2] && w < i[3])
  //     factor = 0.3 + 0.7*((i[3]-1) - w) / ((i[3]-1) - (i[2]-1));
  // else
  //     factor = 0.0;

  return [red * 255, green * 255, blue * 255];
};

const C = 299792458; // m/s
const mtonm = 1000000000; // nm
const midi2wavelength = (note) => {
  // from Tone.ftom((299792458/760 * 1000000000)/(Math.pow(2,40))) to Tone.ftom((299792458/380 * 1000000000)/(Math.pow(2,40)))
  // from 66 to 78
  let freq = Tone.mtof(note);
  let to40oct = Math.pow(2, 40);
  let wavelength = (C / (freq * to40oct)) * mtonm;
  return wavelength;
};

function fallbackCopyTextToClipboard(text) {
  var textArea = clipboard;
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, 99999); // For mobile devices

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    if (debug) console.log("Fallback: Copying text command was " + msg);
    return msg;
  } catch (err) {
    if (debug) console.error("Fallback: Oops, unable to copy", err);
    return err;
  }
}
function copyTextToClipboard(t) {
  let text = t.toString();
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  return navigator.clipboard.writeText(text).then(
    function () {
      if (debug) console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      if (debug) console.error("Async: Could not copy text: ", err);
      return fallbackCopyTextToClipboard(text);
    }
  );
}

function ftom(f) {
  return Math.log2(f / 440) * 12 + 69;
}

cnv = $("#Oscilloscope")[0];
btn = $("#button")[0];

T = "t";
R = "0";
X = "(" + R + ") * cos(θ)";
Y = "(" + R + ") * sin(θ)";

twoDraw = (frameCount) => {
  try {
    // This code is called everytime two.update() is called.
    // Effectively 60 times per second.
    shape.translation.set(two.width / 2, two.height / 2);
    scope.translation.set(two.width / 2, two.height / 2);

    if (shape.vertices.length > 1024) {
      shape.vertices.shift();
      updateScope();
    }

    Tone.Transport.bpm.value = bpm;
    scope.vertices = []; //new Two.Utils.Collection();
    const scopesize = Math.min(innerWidth, innerHeight);
    for (
      let i = 0;
      i < Math.min(wave[0].getValue().length, wave[1].getValue().length);
      i++
    ) {
      const p = new Two.Vector(
        (wave[0].getValue()[i] * scopesize) / 2,
        wave[1].getValue()[i] * (-scopesize / 2)
      );

      scope.vertices.push(p);
    }
    scope.noStroke();
    scope.fill = "#00ff00"; // realtime scope color
    scope.size = 2;
  } catch (err) {
    if (debug) {
      div.innerHTML = err.message;
    }
  }
};

function setupTwo() {
  // Make an instance of two and place it on the page.
  params = {
    type: Two.Types.SVG,
    autostart: true,
    width: Math.min(innerWidth, innerHeight),
    height: Math.min(innerWidth, innerHeight)
  };
  two = new Two(params).appendTo(cnv);

  window.onresize = (e) => {
    two.width = Math.min(innerWidth, innerHeight);
    two.height = Math.min(innerWidth, innerHeight);
    updateScope();
  };

  shape = two.makePath([], false, false, true);
  shape.noFill();
  shape.stroke = "#FFFFFF";
  shape.opacity = 0.1;
  shape.linewidth = 4;
  shape.join = "round"; // miter | round | bevel
  noVertices = JSON.parse(JSON.stringify(shape.vertices));
  scope = new Two.Points();
  for (
    let i = 0;
    i < Math.min(wave[0].getValue().length, wave[1].getValue().length);
    i++
  ) {
    let tmp = new Two.Vector(0, 0);
    scope.vertices.push(tmp);
  }
  scope.noStroke();
  scope.fill = "#00ff00";
  scope.size = 2;
  scope.join = "round"; // miter | round | bevel
  two.add(scope);

  pointerDown = (ev) => {
    mousedrag = true;
    if (
      ev.constructor.toString().search("Mouse") > -1 ||
      cnv.offsetHeight + controls.offsetHeight > innerHeight
    ) {
      controls.style["z-index"] = -10;
      controls.style["pointer-events"] = "none";
    }
    let x, y;
    if (ev.constructor.toString().search("Touch") > -1) {
      x =
        ev.changedTouches[ev.changedTouches.length - 1].clientX -
        (ev.target.parentNode.offsetLeft -
          ev.target.parentNode.offsetWidth / 2);
      y =
        ev.changedTouches[ev.changedTouches.length - 1].clientY -
        (ev.target.parentNode.offsetTop -
          ev.target.parentNode.offsetHeight / 2);
    } else {
      x = ev.offsetX;
      y = ev.offsetY;
    }
    if (debug) console.log(x, y);
    if (x > -1 && y > -1) {
      const mvert = new Two.Anchor(
        x - cnv.offsetWidth / 2,
        y - cnv.offsetHeight / 2
      );
      const newVert = shape.vertices[shape.vertices.length - 1] !== mvert;
      if (newVert) {
        shape.vertices.push(mvert);
        updateScope();
      }
    }
  };
  pointerUp = (ev) => {
    mousedrag = false;
    if (ev.constructor.toString().search("Mouse") > -1) {
      controls.style["z-index"] = 10;
      controls.style["pointer-events"] = "";
    }
  };
  pointerMove = (ev) => {
    debugdiv(ev);
    let x, y;
    if (ev.constructor.toString().search("Touch") > -1) {
      x =
        ev.changedTouches[ev.changedTouches.length - 1].clientX -
        (ev.target.parentNode.offsetLeft -
          ev.target.parentNode.offsetWidth / 2);
      y =
        ev.changedTouches[ev.changedTouches.length - 1].clientY -
        (ev.target.parentNode.offsetTop -
          ev.target.parentNode.offsetHeight / 2);
    } else {
      x = ev.offsetX;
      y = ev.offsetY;
    }
    if (x > -1 && y > -1) {
      if (mousedrag) {
        if (debug) console.log(x, y);
        if (
          ev.constructor.toString().search("Mouse") > -1 ||
          cnv.offsetHeight + controls.offsetHeight > innerHeight
        ) {
          controls.style["z-index"] = -10;
          controls.style["pointer-events"] = "none";
        }
        const mvert = new Two.Anchor(
          x - cnv.offsetWidth / 2,
          y - cnv.offsetHeight / 2
        );
        shape.vertices.push(mvert);
        updateScope();
      } else {
        if (ev.constructor.toString().search("Mouse") > -1) {
          controls.style["z-index"] = 10;
          controls.style["pointer-events"] = "";
        }
      }
    }
  };

  // two.renderer.domElement.addEventListener("click", pointerDown);

  two.renderer.domElement.addEventListener("mousedown", pointerDown);
  two.renderer.domElement.addEventListener("mouseup", pointerUp);
  two.renderer.domElement.addEventListener("mousemove", pointerMove);

  two.renderer.domElement.addEventListener("touchstart", pointerDown);
  two.renderer.domElement.addEventListener("touchend", pointerUp);
  two.renderer.domElement.addEventListener("touchmove", pointerMove);
  try {
    two.bind("update", twoDraw).play(); // start the animation loop
  } catch (err) {
    if (debug) console.log(err);
    drawloop = new Tone.Loop((time) => {
      Tone.Draw.schedule(() => {
        twoDraw();
        drawloop.set({ interval: "96n" });
        try {
          two.update();
        } catch (err) {
          div.innerHTML = err.message;
        }
      }, time);
    }, "96n");
    drawloop.start();
  }
}

function setupTone() {
  for (let w = 0; w < 2; w++) {
    wave[w] = new Tone.Waveform(128);
  }
  scope = new Tone.Split(2);
  master = new Tone.Channel({ channelCount: 2 });
  for (let ch = 0; ch < 3; ch++) {
    mixer[ch] = new Tone.Channel({ channelCount: 2 }).connect(master);
  }

  XL = (val, ind) => {
    let s, v = scale(val, [-1, 1], [0, 1]);
    if ( ind < wflength/2 ) {
      s = val;
    } else {
      s = -val;
    }
    if (shape) {
      if (shape.vertices.length > 0) {
        return shape.getPointAt(v).x / (innerMin() / 2);
      }
    }
    try {
      return Parser.evaluate(X, {
        i: ind,
        s: s,
        m: $("#freq")[0].value,
        f: sig.nal.frequency.value,
        u: v,
        v: val,
        θ: Parser.evaluate(T, {
          i: ind,
          s: s,
          m: $("#freq")[0].value,
          f: sig.nal.frequency.value,
          u: v,
          v: val,
          t: (val + 1.25) * Math.PI
        }),
        t: (val + 1.25) * Math.PI
      });
    } catch (err) {
      if (debug) console.error(err);
      return 0;
    }
  };

  YR = (val, ind) => {
    let v = scale(val, [-1, 1], [0, 1]);
    if ( ind < wflength/2 ) {
      s = val;
    } else {
      s = -val;
    }
    if (shape) {
      if (shape.vertices.length > 0) {
        return shape.getPointAt(v).y / (innerMin() / -2);
      }
    }
    try {
      return Parser.evaluate(Y, {
        i: ind,
        s: s,
        m: $("#freq")[0].value,
        f: sig.nal.frequency.value,
        u: v,
        v: val,
        θ: Parser.evaluate(T, {
          i: ind,
          s: s,
          m: $("#freq")[0].value,
          f: sig.nal.frequency.value,
          u: v,
          v: val,
          t: (val + 1.25) * Math.PI
        }),
        t: (val + 1.25) * Math.PI
      });
    } catch (err) {
      if (debug) console.error(err);
      return 0;
    }
  };
  sig = {
    nal: new Tone.Oscillator(
      Tone.mtof(Number($("#freq")[0].value)),
      "triangle"
    ),
    synth: new Tone.MonoSynth({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.01,
        // decay: 0.01,
        // sustain: 1.0,
        release: 0.01
      }
    }),
    panL: new Tone.Panner({ pan: -1 }).connect(master),
    L: new Tone.WaveShaper({length: wflength, mapping: XL}),
    panR: new Tone.Panner({ pan: 1 }).connect(master),
    R: new Tone.WaveShaper({length: wflength, mapping: YR})
  };
  sig.nal.fan(sig.L, sig.R);
  sig.synth.fan(sig.L, sig.R);
  sig.L.connect(sig.panL);
  sig.R.connect(sig.panR);
  micSplitter = new Tone.Split(2);
  mic = new Tone.UserMedia({
    channelCount: 2,
    numberOfOutputs: 2
  });
  // scope.connect(sig.L, 0);
  // scope.connect(sig.R, 1);
  scope.connect(wave[0], 0);
  scope.connect(wave[1], 1);
  master.fan(scope, Tone.Destination);
  $("#mic").on("click", (e) => {
    if (debug) console.log(mic.state);
    if (mic.state == "started") {
      $("#micvol")[0].hidden = true;
      $("#micmute")[0].hidden = true;
      mic.close();
      e.target.style["background"] = "#ff000069";
    } else {
      $("#micvol")[0].hidden = false;
      $("#micmute")[0].hidden = false;
      mic.open();
      e.target.style["background"] = "#00ff0069";
    }
  });
  $("#micmute").on("click", (e) => {
    if (debug) console.log(mic.state);
    try {
      mic.disconnect(Tone.Destination);
      e.target.style["background"] = "#00ff0069";
    } catch (err) {
      mic.connect(Tone.Destination);
      e.target.style["background"] = "#ff000069";
    }
  });
  // Tone.Transport.schedule((time) => {
  //     // use the time argument to schedule a callback with Draw
  //     Tone.Draw.schedule(tdraw, time);
  // }, "+0.5");
  sig.nal.start();

  updateScope = (ev) => {
    if (debug) console.log(!ev);
    T = finput.it.value.split("=")[finput.it.value.split("=").length - 1];
    if (fradio[0].checked) {
      if (!ev) {
        R = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
      }
      X = "(" + R + ") * cos(θ)";
      Y = "(" + R + ") * sin(θ)";
    }
    if (fradio[1].checked) {
      if (!ev) {
        X = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
        Y = finput.i1.value.split("=")[finput.i1.value.split("=").length - 1];
      }
    }
    try {
      sig.L.setMap(XL);
      sig.R.setMap(YR);
      // sig.L.set({length: wflength});
      // sig.R.set({length: wflength});
    } catch (err) {
      if (debug) console.error(err);
      return 0;
    }
  };
  setupTwo();
}

function setupMidi() {
  checkMidiDevices = (e) => {
    if (debug) console.log(e);
    midiDevices = 0;
    $("#mdevices")[0].innerHTML = '';
    // Display available MIDI input devices
    if (WebMidi.inputs.length < 1) {
      $("#mdevices")[0].innerHTML = '<option value="-1">No device detected.</option>'
    } else {
      midiDevices = WebMidi.inputs.length;
      WebMidi.inputs.forEach((device, index) => {
        $("#mdevices")[0].innerHTML+= `<option value="${index}">${device.name}</option>`;
      });
    }
  };
  if ( !WebMidi.enabled ) {
    WebMidi
    .enable()
    .then(checkMidiDevices)
    .catch(err => console.error(err));
  } else {
    checkMidiDevices();
  }
}

window.onload = (ev) => {
  let mmin = Number($("#freq")[0].min),
    mmax = Number($("#freq")[0].max),
    n0offset = 12 - Math.abs(Number(freq.min) % 12);
  for (let i = 0; i < mmax - mmin + 1 + n0offset; i++) {
    if (i % 12 == 0) {
      n = 0;
    }
    let note = String.fromCharCode(((n / 2 + 2) % 7) + 65);
    if (n % 2) {
      note = note + "#";
    }
    let ni = i + mmin - n0offset;
    notes[ni] = note + (Math.floor(ni / 12) - 1);
    n++;
    if (i % 12 == (4 || 11)) {
      n++;
    }
  }
  for ( tmp of Object.keys(templates) ){
    $("#templates")[0].innerHTML+= `<option value="${tmp}">${tmp}</option>`
  }
  clipboard = $("#clipboard")[0];
  div = $("#debug")[0];
  controls = $("#controls")[0];
  finput = {
    lt: $("#theta")[0],
    it: $("#finputt")[0],
    l0: $("#filabel0")[0],
    i0: $("#finput0")[0],
    l1: $("#filabel1")[0],
    i1: $("#finput1")[0]
  };

  fradio = $("#fradio")[0].getElementsByTagName("input");
  fp = (e) => {
    if (debug) console.log(e);
    if (!e) {
      fradio[0].checked = true;
      fradio[1].checked = false;
    }
    finput.i0.placeholder = " r(θ)";
    finput.l1.style["opacity"] = "0";
    finput.i1.style["opacity"] = "0";
    finput.i1.style["pointer-events"] = "none";
    finput.l0.innerHTML = "&nbsp;r =";
    finput.i0.value = R;
    updateScope();
  };
  fradio[0].addEventListener("click", fp);
  fc = (e) => {
    if (debug) console.log(e);
    if (!e) {
      fradio[1].checked = true;
      fradio[0].checked = false;
    }
    finput.i0.placeholder = " x(θ)";
    finput.l1.style["opacity"] = "1";
    finput.i1.style["opacity"] = "1";
    finput.i1.style["pointer-events"] = "";
    finput.l0.innerHTML = "&nbsp;x =";
    finput.i0.value = X;
    finput.i1.value = Y;
    updateScope();
  };
  fradio[1].addEventListener("click", fc);

  finput.i0.addEventListener("input", (e) => {
    if (fradio[0].checked) {
      R = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
    }
    if (fradio[1].checked) {
      X = finput.i0.value.split("=")[finput.i1.value.split("=").length - 1];
    }
    if (debug) console.log(R, X);
    efocus = e.target;
    updateScope(e);
  });
  finput.i0.addEventListener("propertychange", (e) => {
    if (fradio[0].checked) {
      R = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
    }
    if (fradio[1].checked) {
      X = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
    }
    if (debug) console.log(R, X);
    efocus = e.target;
    updateScope(e);
  });
  finput.i0.addEventListener("input", (e) => {
    if (fradio[0].checked) {
      R = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
    }
    if (fradio[1].checked) {
      X = finput.i0.value.split("=")[finput.i1.value.split("=").length - 1];
    }
    if (debug) console.log(R, X);
    efocus = e.target;
    updateScope(e);
  });
  finput.it.addEventListener("input", (e) => {
    T = finput.it.value.split("=")[finput.it.value.split("=").length - 1];
    if (debug) console.log(T);
    efocus = e.target;
    updateScope(e);
  });
  finput.it.addEventListener("propertychange", (e) => {
    T = finput.it.value;
    if (debug) console.log(T);
    efocus = e.target;
    updateScope(e);
  });
  finput.i0.addEventListener("propertychange", (e) => {
    if (fradio[0].checked) {
      R = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
    }
    if (fradio[1].checked) {
      X = finput.i0.value.split("=")[finput.i0.value.split("=").length - 1];
    }
    if (debug) console.log(R, X);
    efocus = e.target;
    updateScope(e);
  });
  finput.i1.addEventListener("input", (e) => {
    Y = finput.i1.value.split("=")[finput.i1.value.split("=").length - 1];
    if (debug) console.log(Y);
    efocus = e.target;
    updateScope(e);
  });
  finput.i1.addEventListener("propertychange", (e) => {
    Y = finput.i1.value;
    if (debug) console.log(Y);
    efocus = e.target;
    updateScope(e);
  });
  finput.i0.addEventListener("click", (e) => {
    efocus = e.target;
    if (debug) console.log(e, efocus);
  });
  finput.i1.addEventListener("click", (e) => {
    efocus = e.target;
    if (debug) console.log(e, efocus);
  });
  finput.lt.addEventListener("click", (e) => {
    if (efocus) {
      // make sure we have focus in the right input
      efocus.focus();
      // and just run the command
      document.execCommand("insertText", false /*no UI*/, e.target.value);
    }
    copyTextToClipboard(e.target.value);
  });
  controls.addEventListener("mouseenter", (e) => {
    if (!mousedrag) {
      e.srcElement.style.opacity = 1;
    } else {
      e.preventDefault();
    }
  });
  controls.addEventListener("mouseleave", (e) => {
    if (!mousedrag) {
      e.srcElement.style.opacity = 0.25;
    } else {
      e.preventDefault();
    }
  });
  fpointerDown = (ev) => {
    mousedrag = true;
  };
  fpointerUp = (ev) => {
    mousedrag = false;
  };
  fpointerMove = (ev) => {
    if (mousedrag && sig.nal.frequency.value != Tone.mtof(ev.target.value)) {
      sig.nal.set({ frequency: Tone.mtof(ev.target.value) });
      if (debug)
        console.log(
          sig.nal.frequency.value,
          ev.target.value,
          notes[ev.target.value]
        );
      updateScope();
      debugdiv(ev);
    }
  };
  $("#freq").on("mousedown", fpointerDown);
  $("#freq").on("mouseup", fpointerUp);
  $("#freq").on("mousemove", fpointerMove);
  $("#freq").on("touchstart", fpointerDown);
  $("#freq").on("touchend", fpointerUp);
  $("#freq").on("touchmove", fpointerMove);
  $("#freq").on("change", (ev) => {
    sig.nal.set({ frequency: Tone.mtof(Number(ev.target.value)) });
    updateScope();
    debugdiv(ev);
  });
  fdoubleClick = (e) => {
    $("#freq")[0].value = 69;
    sig.nal.set({ frequency: Tone.mtof($("#freq")[0].value) });
    if (debug)
      console.log(
        ev,
        sig.nal.frequency.value,
        ev.target.value,
        notes[ev.target.value]
      );
    updateScope();
    debugdiv(ev);
  };
  $("#freq").on("dblclick", fdoubleClick);
  $("#freq").on("doubletap", fdoubleClick);
  $("#vol").on("mousedown", fpointerDown);
  $("#vol").on("mouseup", fpointerUp);
  $("#vol").on("touchstart", fpointerDown);
  $("#vol").on("touchend", fpointerUp);
  vpointerMove = (ev) => {
    if (mousedrag) {
      Tone.Destination.set({
        volume:
          Math.round(
            (Math.log(Number(ev.target.value)) / Math.log(1.0699)) *
              Math.pow(10, 2)
          ) / Math.pow(10, 2)
      });
      if (debug) console.log(ev.target.value, Tone.Destination.volume.value);
      updateScope();
      debugdiv(ev);
    }
  };
  $("#vol").on("mousemove", vpointerMove);
  $("#vol").on("touchmove", vpointerMove);
  $("#vol").on("change", (ev) => {
    Tone.Destination.set({
      volume:
        Math.round(
          (Math.log(Number(ev.target.value)) / Math.log(1.0699)) *
            Math.pow(10, 2)
        ) / Math.pow(10, 2)
    });
    updateScope();
    debugdiv(ev);
  });
  vdoubleClick = (e) => {
    $("#vol")[0].value = 1;
    Tone.Destination.set({
      volume:
        Math.round(
          (Math.log(Number($("#vol")[0].value)) / Math.log(1.0699)) *
            Math.pow(10, 2)
        ) / Math.pow(10, 2)
    });
    if (debug) console.log(ev, ev.target.value, Tone.Destination.volume.value);
    updateScope();
    debugdiv(ev);
  };
  $("#vol").on("dblclick", vdoubleClick);
  $("#vol").on("doubletap", vdoubleClick);

  setFormulas = (eq = 0, t = T, r = R, x = X, y = Y) => {
    if (eq) {
      fc();
    } else {
      fp();
    }
    if (debug) console.log(t, t != T, T);
    if (t != T) finput.it.value = t;
    if (debug) console.log(r, r != R, R);
    if (r != R) {
      if (fradio[0].checked) {
        finput.i0.value = r;
      }
    }
    if (debug) console.log(x, x != X, X);
    if (x != X) {
      if (fradio[1].checked) {
        finput.i0.value = x;
      }
    }
    if (debug) console.log(y, y != Y, Y);
    if (y != Y) finput.i1.value = y;
    updateScope();
  };
  $("#mute").on("click", (e) => {
    Tone.Destination.mute = !Tone.Destination.mute;
    if (Tone.Destination.mute) {
      e.target.style["background"] = "#00ff0069";
    } else {
      e.target.style["background"] = "#ff000069";
    }
  });

  if (Tone.context.state != "running") {
    btn?.addEventListener("click", (e) => {
      if (Tone.context.state != "running") {
        Tone.start();
        if (debug) console.log("audio is ready");
        e.target.style["background"] = "#00ff0069";
        updateScope();
        debugdiv(e);
      }
      btn.value = "Clear";
      btn.removeEventListener("click", e);
      btn.addEventListener("click", (e) => {
        shape.vertices = noVertices;
        setFormulas(
          0,
          "t",
          "0",
          "(" + R + ") * cos(θ)",
          "(" + R + ") * sin(θ)"
        );
        debugdiv(e);
      });
    });
  } else {
    btn.style["background"] = "#00ff0069";
    btn.value = "Clear";
    btn.addEventListener("click", (e) => {
      shape.vertices = noVertices;
      setFormulas(0, "t", "0", "(" + R + ") * cos(θ)", "(" + R + ") * sin(θ)");
      updateScope();
      debugdiv(e);
    });
    updateScope();
  }
  window.addEventListener("click", (e) => {
    if (debug) console.log(e);
    if (Tone.context.state == "running") {
      btn.style["background"] = "#00ff0069";
      btn.value = "Clear";
      btn.addEventListener("click", (e) => {
        shape.vertices = noVertices;
        setFormulas(
          0,
          "t",
          "0",
          "(" + R + ") * cos(θ)",
          "(" + R + ") * sin(θ)"
        );
        updateScope();
        debugdiv(e);
      });
    }
  });
  setupTone();
  $("#micvol").on("mousedown", fpointerDown);
  $("#micvol").on("mouseup", fpointerUp);
  $("#micvol").on("touchstart", fpointerDown);
  $("#micvol").on("touchend", fpointerUp);
  mvpointerMove = (ev) => {
    if (mousedrag) {
      mic.set({
        volume:
          Math.round(
            (Math.log(Number(ev.target.value)) / Math.log(1.0699)) *
              Math.pow(10, 2)
          ) / Math.pow(10, 2)
      });
      if (debug) console.log(ev.target.value, mic.volume.value);
      updateScope();
      debugdiv(ev);
    }
  };
  $("#micvol").on("mousemove", mvpointerMove);
  $("#micvol").on("touchmove", mvpointerMove);
  $("#micvol").on("change", (ev) => {
    mic.set({
      volume:
        Math.round(
          (Math.log(Number(ev.target.value)) / Math.log(1.0699)) *
            Math.pow(10, 2)
        ) / Math.pow(10, 2)
    });
    updateScope();
    debugdiv(ev);
  });
  mvdoubleClick = (e) => {
    $("#micvol")[0].value = 1;
    mic.set({
      volume:
        Math.round(
          (Math.log(Number($("#vol")[0].value)) / Math.log(1.0699)) *
            Math.pow(10, 2)
        ) / Math.pow(10, 2)
    });
    if (debug) console.log(ev, ev.target.value, mic.volume.value);
    updateScope();
    debugdiv(ev);
  };
  $("#micvol").on("dblclick", mvdoubleClick);
  $("#micvol").on("doubletap", mvdoubleClick);
  setupMidi();
  noteon = (e) => {
    if (debug) console.log(e);
    if ( sig.nal.mute ){
      $("#freq")[0].value = e.note.number;
      sig.synth.volume.value = e.velocity;
      sig.synth.triggerAttack(Tone.mtof(e.note.number),e.velocity/100)
    }
  };
  $("#midi").on('click', (e) => {
    if (debug) console.log(e);
    sig.nal.mute = !sig.nal.mute;
    if ( sig.nal.mute ) {
      e.target.style["background"] = "#00ff0069";
      $("#freq")[0].style['pointer-events'] = 'none';
    } else {
      e.target.style["background"] = "#ff000069";
      $("#freq")[0].style['pointer-events'] = '';
    }
    setupMidi();
  });
  $("#mdevices").on('change',(e) => {
    if (debug) console.log(e);
    for ( i in WebMidi.inputs ) {
      if ( i == e.target.selectedIndex ) {
        WebMidi.inputs[i].addListener('noteon',noteon);
      } else {
        WebMidi.inputs[i].removeListener('noteon',noteon);
      }
    }
  });
};
