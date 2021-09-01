//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// https://gist.github.com/shovon/c3ca8e59a5cf277c947a

class ComplexNumber {
  constructor(r = 0, i = 0){
    this.real = new Number(r);
    this.imag = new Number(i);
  }
  set(r = this.real,i = this.imag) {
    try {
      if (r.toString().search("i") > -1) {
        i = Number(r.toString().replace("i",""));
        r = this.real;
      }
      this.real = new Number(r);
      this.imag = new Number(i);
      return true;
    } catch(err) {
      console.log(err);
      return false;
    }
  }
  get() {
    return new this.constructor(this.real.valueOf(),this.imag.valueOf());
  }
  getAngle() {
    return Math.atan2(this.imag.valueOf(),this.real.valueOf());
  }
  getMag() {
    return Math.sqrt(Math.pow(this.real.valueOf(),2)+Math.pow(this.imag.valueOf(),2));
  }
  getVector() {
    return {x: this.real.valueOf(), y: this.imag.valueOf(), t: this.getAngle(), m: this.getMag()};
  }
}

function shovonDFT(samples, inverse) {
  var len = samples.length;
  var arr = Array(len);
  var pi2 = inverse ? Math.PI * (2) : Math.PI * (-2);
  var invlen = 1 / len;
  for (var i = 0; i < len; i++) {
    arr[i] = new ComplexNumber();
    for (var n = 0; n < len; n++) {
      var theta = pi2 * i * n * invlen;
      var costheta = Math.cos(theta);
      var sintheta = Math.sin(theta);
      if (!isNaN(samples[n])){
        samples[n] = new Complex(samples[n]);
        console.log(samples[n]);
      }
      arr[i].real += samples[n].real * costheta - samples[n].imag * sintheta;
      arr[i].imag += samples[n].real * sintheta + samples[n].imag * costheta;
    }
    if (!inverse) {
      arr[i].real *= invlen;
      arr[i].imag *= invlen;
    }
  }
  return arr;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// https://github.com/CodingTrain/website/blob/8f07649feb73ad0add72d85eb6b4acc95435d935/CodingChallenges/CC_130_Fourier_Transform_3/P5/fourier.js
// Coding Challenge 130.3: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
// https://youtu.be/7_vKzcgpfvU
// https://editor.p5js.org/codingtrain/sketches/ldBlISrsQ

class Complex {
  constructor(a = 0, b = 0) {
    this.re = a;
    this.im = b;
  }

  add(c) {
    this.re += c.re;
    this.im += c.im;
  }

  mult(c) {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complex(re, im);
  }
}

function codingtrainDFT(x) {
  const X = [];
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let sum = new Complex(0, 0);
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;
      const c = new Complex(cos(phi), -sin(phi));
      sum.add(x[n].mult(c));
    }
    sum.re = sum.re / N;
    sum.im = sum.im / N;

    let freq = k;
    let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    let phase = atan2(sum.im, sum.re);
    X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
  }
  return X;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadCSS(ID,URL,doc=document){
  if (!doc.getElementById(ID)){
      let head   = doc.head;
      let link   = doc.createElement('link');
      link.id    = ID;
      link.rel   = 'stylesheet';
      link.type  = 'text/css';
      link.href  = URL;
      link.media = 'all';
      return head.appendChild(link);
  } else {
    return doc.getElementById(ID);
  }
}

function loadScript(ID,URL,doc=document){
  if (!doc.getElementById(ID)){
      let head   = doc.head;
      let script = doc.createElement('script');
      script.id  = ID;
      script.src = URL;
      return head.appendChild(script);
  } else {
    return doc.getElementById(ID);
  }
}

function loadJSscript(url, callback=null, doc=document){
    var script = doc.createElement("script")
    script.type = "text/javascript";
    // console.log(script);
    if (script.readyState){  //IE
        script.onreadystatechange = (e) => {
          console.log(e);
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback(e);
            }
        };
    } else {  //Others
        script.onload = callback;
    }
    script.src = url;
    doc.getElementsByTagName("head")[0].appendChild(script);
    return script;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const __ = undefined,
      TWO_PI = Math.PI*2,
      G = 6.67430*Math.pow(10,-11), // m/s2
      EARTH_M = 5.972*Math.pow(10,24), // kg
      EARTH_R = 6371000, // kg
      EVEREST_PEAK = 6382300, // m
      CHIMBORAZO_PEAK = 6384400, // m
      C_VACUUM = 299792458, // Lightspeed on Vacuum
      C_AIR = C_VACUUM/1.0003, // Lightspeed on Air
      C_WATER = C_VACUUM/1.33, // Lightspeed on Water
      NM = Math.pow(10,9), // 1 meter to nanometers
      TO40OCT = Math.pow(2,40); // freq to 40 octaves higher
var gx = 0, gy = planetGrav();
var curl = document.URL;
var or = {};

function sleep(miliseconds) {
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()){}
}

function planetGrav(mass=EARTH_M,atRadius=EARTH_R){
  return G*(mass/Math.pow(atRadius,2));
}

function copyObj(obj){
  return JSON.parse(JSON.stringify(obj));
}

function propsAsString(obj={},sep=" ") {
  return Object.keys(obj).map(function (k) {
    return k + ": " + obj[k];
  }).join(sep);
}

//   Object.prototype.isObjType = function (obj = "Object"){
//       return this.valueOf().objType() == obj;
//   }

function objType(obj) {
  if (obj != (undefined || null)) {
    return obj.constructor.toString().split(" ")[1].split("(")[0];
  } else {
    return null;
  }
}

function isNumber(obj) {
  if (obj != (undefined || null)) {
    if(objType(obj)=="Number"){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

Number.prototype.lmap = function (fromMin,fromMax,toMin,toMax) {
  let inmin, inmax, outmin, outmax;
  switch(arguments.length){
    case 0:
      inmin = 0;
      inmax = 1;
      outmin = -1;
      outmax = 1;
      break;
    case 1:
      inmin = 0;
      inmax = 1;
      outmin = 0;
      outmax = arguments[0];
      break;
    case 2:
      inmin = 0;
      inmax = 1;
      outmin = arguments[0];
      outmax = arguments[1];
      break;
    case 3:
      inmin = arguments[0];
      inmax = arguments[1];
      outmin = 0;
      outmax = arguments[2];
      break;
    case 4:
      inmin = arguments[0];
      inmax = arguments[1];
      outmin = arguments[2];
      outmax = arguments[3];
      break;
    default:
      inmin = arguments[0];
      inmax = arguments[1];
      outmin = arguments[2];
      outmax = arguments[3];
      break;
  }
  if (inmin!=inmax){
    const R = (outmax-outmin)/(inmax-inmin);
    return (this.valueOf()-inmin)*R+outmin;
  } else{
    return this.valueOf();
  }
};

Number.prototype.clip = function (mn=-1,mx=1) {
  if(arguments.length==1||arguments.length==2){
    if (arguments.length==1){
      mn = -Infinity;
      mx = arguments[0];
    } else{
      mn = arguments[0];
      mx = arguments[1];
    }
  }
  return Math.min(mx, Math.max(this.valueOf(), mn));
};

Number.prototype.toFixed = function (fixed = 1) {
  let decimals = Math.pow(10, fixed);
  return Math.round(this.valueOf() * decimals) / decimals;
};

function toFixed(obj, fixed) {
  if (objType(obj) == "Number") {
    return obj.toFixed(fixed);
  } else {
    return obj;
  }
}

function copyToClipboard(content) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = content;
    dummy.select();
    dummy.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

//   function random(min,max){
//     if(objType(min)=="Number" && objType(max)!="Number"){
//       max = min;
//       min = 0;
//     }
//     if(objType(max)=="Number" && objType(min)!="Number"){
//       min = 0;
//     }
//     if (objType(max)!="Number" && objType(max)!="Number"){
//       if(min!=undefined||max!=undefined){console.log("Invalid Random Values");}
//       return Math.random();
//     }else{
//       if (min>max){
//         return (Math.random()*(min-max))+max;
//       } else {
//         return (Math.random()*(max-min))+min;
//       }
//     }
//   }

//   window.addEventListener("hover", function (event) {
//       console.log(event);
//   });

//   window.addEventListener("mouseout", function (event) {
//     //   console.log(event);
//   });

window.addEventListener("deviceorientation",
//   window._ondeviceorientation =
  (event) => {
    //   console.log(event);
    or = {
      absolute: toFixed(event.absolute),
      alpha: toFixed(event.alpha),
      beta: toFixed(event.beta),
      gamma: toFixed(event.gamma),
      webkitCompassHeading: toFixed(event.webkitCompassHeading),
      webkitCompassAccuracy: toFixed(event.webkitCompassAccuracy),
    };
  }
);

//   function logx(value,base){
//     let b,v;
//     if(arguments.length==2){
//       v = arguments[0];
//       b = arguments[1];
//       if (isNumber(v)&&isNumber(b)){
//         return Math.log10(v)/Math.log10(b);
//       } else{
//         return null;
//       }
//     } else {
//       return null;
//     }
//   }

function ms2ftime(ms, ly = 0) {
  if (objType(ms)=="Number") {
    let s = ms / 1000.0;
    let m = (s - (s % 1)) / 60.0;
    let h = m / 60.0;
    let d = h / 24.0;
    let y = d / 365.0;
    return [
      Math.floor(y),
      Math.floor(d) % (365 + ly),
      Math.floor(h) % 24,
      Math.floor(m) % 60,
      s % 60,
    ];
  } else {
    return [0, 0, 0, 0];
  }
}

function vf(p0,p1,dt=1){
  // console.log(`${propsAsString(p0).join("\n")}\n${propsAsString(p1).join("\n")}\n${dt}\n`);
  let dx = p1.x-p0.x;
  let dy = p1.y-p0.y;
  // print(dx+"\n"+dy)
  // let d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
  let vx = dx/dt;
  let vy = (dy-0.5*9.8*Math.pow(dt,2))/dt;
  let v = Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2));
  t = Math.atan2(dy,dx);
  return {vel:v,ang:t};
}

function pol2car(pol={vel:0,ang:TWO_PI}){
  let car = {
      x:pol.vel*Math.cos(pol.ang),
      y:pol.vel*Math.sin(pol.ang)
  };
  return car;
}

function rgba2hex(orig) {
    var a,
      rgb = orig
        .replace(/\s/g, "")
        .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
      alpha = ((rgb && rgb[4]) || "").trim(),
      hex = rgb
        ? (Math.round(rgb[1]) | (1 << 8)).toString(16).slice(1) +
          (Math.round(rgb[2]) | (1 << 8)).toString(16).slice(1) +
          (Math.round(rgb[3]) | (1 << 8)).toString(16).slice(1)
        : orig;

    if (alpha !== "") {
      a = alpha;
    } else {
      a = 01;
    }
    // multiply before convert to HEX
    a = ((a * 255) | (1 << 8)).toString(16).slice(1);
    // hex = hex + a;

    return "#" + hex;
}

function rgb2rgba(src, a = 1) {
    if (src != undefined && objType(src) == "Array") {
      let is255,
        isFloat,
        rgb = Array.from(src);
      for (v of rgb) {
        // console.log(v);
        is255 = false;
        if (v > 1) {
          is255 = true;
        }
        isFloat = false;
        if (v % 1 > 0) {
          isFloat = true;
        }
      }
      // console.log(`255 = ${is255}`);
      // console.log(`Float = ${isFloat}`);
      if (!is255 && isFloat) {
        rgb.forEach((v, i, a) => {
          a[i] = (v * 255);
        });
      }
      return "rgba("+Math.round(rgb[0])+","+Math.round(rgb[1])+","+Math.round(rgb[2])+","+a+")";
    } else {
      return "rgba(0,0,0,0)";
    }
}

function freq2wavelength(freq=440,c=C_VACUUM){
    return (c/freq)*NM; // Wavelength in nanometers
}

function wavelength2freq(wavelength=freq2wavelength(440*TO40OCT),c=C_VACUUM){
    wl = wavelength/NM;
    return (c/wl);
}

// takes wavelength in nm and returns an rgba value
function wavelength2color(wavelength) {
    var R,
        G,
        B,
        alpha,
        colorSpace,
        wl = wavelength
        // ,gamma = 1
        ;

    if (wl >= 380 && wl < 440) {
        R = -1 * (wl - 440) / (440 - 380);
        G = 0;
        B = 1;
   } else if (wl >= 440 && wl < 490) {
        R = 0;
        G = (wl - 440) / (490 - 440);
        B = 1;
    } else if (wl >= 490 && wl < 510) {
        R = 0;
        G = 1;
        B = -1 * (wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
        R = (wl - 510) / (580 - 510);
        G = 1;
        B = 0;
    } else if (wl >= 580 && wl < 760) {
        R = 1;
        G = -1 * (wl - 760) / (760 - 580);
        B = 0;
    // } else if (wl >= 580 && wl < 645) {
    //     R = 1;
    //     G = -1 * (wl - 645) / (645 - 580);
    //     B = 0;
    // } else if (wl >= 645 && wl <= 760) { // Changed 780 to 760
    //     R = 1;
    //     G = 0;
    //     B = 0;
    } else {
        R = 0;
        G = 0;
        B = 0;
    }

    // intensty is lower at the edges of the visible spectrum.
    if (wl > 780 || wl < 380) {
        alpha = 0;
    } else if (wl > 700) {
        alpha = (780 - wl) / (780 - 700);
    } else if (wl < 420) {
        alpha = (wl - 380) / (420 - 380);
    } else {
        alpha = 1;
    }

    colorSpace = ["rgba(" + Math.round(R * 255) + "," + Math.round(G * 255) + "," + Math.round(B * 255) + ", " + alpha + ")", R, G, B, alpha]

    // colorSpace is an array with 5 elements.
    // The first element is the complete code as a string.
    // Use colorSpace[0] as is to display the desired color.
    // use the last four elements alone or together to access each of the individual r, g, b and a channels.

    return colorSpace;

}

function freq2color(freq=440){
    return wavelength2color(freq2wavelength(freq*TO40OCT));
}

function midi2color (midi=69) {
    let f,d;
    if (midi >= 66 && midi <= 77){
        d = 0;
    } else if (midi < 66) {
        d = -(Math.ceil((66-midi)/12))
    } else if (midi > 77) {
        d = Math.ceil((midi-77)/12)
    }
    f = midiToFreq(midi-(12*d));
    let rgba = freq2color(f)[0]
    let hue = chroma(rgba).hsl()[0];
    let light = Math.map(d,-5,5,0,1);
    let hsl = [hue,1,light];
    console.log(d,f,rgba,hsl);
    return chroma(hsl,"hsl");
}
