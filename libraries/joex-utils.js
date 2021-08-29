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
