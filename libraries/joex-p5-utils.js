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
var or = {};
var curl = document.URL;
var mouseIsMoved = false;
var tfactor = 1;

function sleep(miliseconds) {
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()){}
}

function getWordPoints(word,x=10-width/2,y=height/2-10,size=100,space=size/10,font=digital){
  if (typeof word != "string"){
      word = word.toString();
  }
  let pword = new Array(word.length);
  let xoff = 0, yoff = 0;
  for (let i = 0; i < word.length; i++){
      let xmx = -Infinity, ymx = -Infinity;
      let xmn = Infinity, ymn = Infinity;
      // if (word[i] == "e"){size += 4}
      // if (word[i] == "S"|word[i] == "O"){size -= 1}
      if (word[i] != " "){
          pword[i] = font.textToPoints(
              word[i],
              // (i*2+1)*w/(word.length*2)-width/2, 0,
              // (i)*w/(word.length)-width/2, s/2,
              0,0,
              size,
              {
                  sampleFactor: tfactor
      	    }
  	    );
  	    for (let l of pword[i]){
  	        if (l.x < xmn){
  	            xmn = l.x;
  	        }
  	        if (l.y < ymn){
  	            ymn = l.y;
  	        }
  	        if (l.x > xmx){
  	            xmx = l.x;
  	        }
  	        if (l.y > ymx){
  	            ymx = l.y;
  	        }
  	    }
  	   // console.log(xmn,xmx,ymn,ymx);
          if ((ymx-ymn) > yoff){
              yoff = ymx-ymn;
          }
          pword[i] = font.textToPoints(
              word[i],
              // (i*2+1)*w/(word.length*2)-width/2, 0,
              // (i)*w/(word.length)-width/2, s/2,
              x+xoff-xmn,y-ymx,
              size,
              {
                  sampleFactor: tfactor
      	    }
  	    );
  	    if (i == word.length-1){
  	        xoff += (xmx-xmn);
  	    } else {
  	        xoff += (xmx-xmn) + space;
  	    }
      } else {
        xoff += space*2;//(xoff/i+1)/2;
        pword[i] = new Array();
      }
      // if (word[i] == "e"){size -= 4}
      // if (word[i] == "S"|word[i] == "O"){size += 1}
  }
  return {
      points: pword,
      x: x,
      y: y,
      width: xoff,
      height:yoff
  };
}

function planetGrav(mass=EARTH_M,atRadius=EARTH_R){
  return G*(mass/Math.pow(atRadius,2));
}

function sliderVolume(cnv = p5.instance._renderer,x,y,gray = 50,alpha = 100,w = innerHeight/60,h = innerHeight/10){
  if(x === undefined){x = innerWidth - (w + 5);}
  if(y === undefined){y = 5;}
	let slider = cnv.createSliderV("vol",x,y,w,h);
  let rgb = gray;
	slider._style.rounding = 0;
	slider._style.fillBg.setRed(rgb+0);
	slider._style.fillBg.setGreen(rgb+0);
	slider._style.fillBg.setBlue(rgb+0);
	slider._style.fillBg.setAlpha(alpha);
	slider._style.fillBgHover.setRed(rgb+25);
	slider._style.fillBgHover.setGreen(rgb+25);
	slider._style.fillBgHover.setBlue(rgb+25);
	slider._style.fillBgHover.setAlpha(alpha);
	slider._style.fillBgActive.setRed(rgb+50);
	slider._style.fillBgActive.setGreen(rgb+50);
	slider._style.fillBgActive.setBlue(rgb+50);
	slider._style.fillBgActive.setAlpha(alpha);
	slider._style.fillTrack.setRed(rgb+50);
	slider._style.fillTrack.setGreen(rgb+50);
	slider._style.fillTrack.setBlue(rgb+50);
	slider._style.fillTrack.setAlpha(alpha);
	slider._style.fillTrackHover.setRed(rgb+75);
	slider._style.fillTrackHover.setGreen(rgb+75);
	slider._style.fillTrackHover.setBlue(rgb+75);
	slider._style.fillTrackHover.setAlpha(alpha);
	slider._style.fillTrackActive.setRed(rgb+100);
	slider._style.fillTrackActive.setGreen(rgb+100);
	slider._style.fillTrackActive.setBlue(rgb+100);
	slider._style.fillTrackActive.setAlpha(alpha);
	slider._style.fillHandle.setRed(rgb+100);
	slider._style.fillHandle.setGreen(rgb+100);
	slider._style.fillHandle.setBlue(rgb+100);
	slider._style.fillHandle.setAlpha(alpha);
	slider._style.fillHandleHover.setRed(rgb+125);
	slider._style.fillHandleHover.setGreen(rgb+125);
	slider._style.fillHandleHover.setBlue(rgb+125);
	slider._style.fillHandleHover.setAlpha(alpha);
	slider._style.fillHandleActive.setRed(rgb+150);
	slider._style.fillHandleActive.setGreen(rgb+150);
	slider._style.fillHandleActive.setBlue(rgb+150);
	slider._style.fillHandleActive.setAlpha(alpha);
	slider._style.strokeBg.setAlpha(alpha);
	slider._style.strokeBgHover.setAlpha(alpha);
	slider._style.strokeBgActive.setAlpha(alpha);
	slider._style.strokeTrack.setAlpha(0);
	slider._style.strokeTrackHover.setAlpha(0);
	slider._style.strokeTrackActive.setAlpha(0);
	slider._style.strokeHandle.setRed(255);
	slider._style.strokeHandle.setGreen(255);
	slider._style.strokeHandle.setBlue(255);
	slider._style.strokeHandle.setAlpha(alpha);
	slider._style.strokeHandleHover.setRed(255);
	slider._style.strokeHandleHover.setGreen(255);
	slider._style.strokeHandleHover.setBlue(255);
	slider._style.strokeHandleHover.setAlpha(alpha);
	slider._style.strokeHandleActive.setRed(255);
	slider._style.strokeHandleActive.setGreen(255);
	slider._style.strokeHandleActive.setBlue(255);
	slider._style.strokeHandleActive.setAlpha(alpha*2);
	return slider;
}

function copyObj(obj){
  return JSON.parse(JSON.stringify(obj));
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

//   function log(value,base){
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
return min(mx, max(this.valueOf(), mn));
};

Number.prototype.toFixed = function (fixed = 1) {
  let decimals = wasm.pow(10, fixed);
  return wasm.round(this.valueOf() * decimals) / decimals;
};

function toFixed(obj, fixed) {
if (objType(obj) == "Number") {
  return obj.toFixed(fixed);
} else {
  return obj;
}
}

function ms2ftime(ms, ly = 0) {
if (objType(ms)=="Number") {
  let s = ms / 1000.0;
  let m = (s - (s % 1)) / 60.0;
  let h = m / 60.0;
  let d = h / 24.0;
  let y = d / 365.0;
  return [
    wasm.floor(y),
    wasm.floor(d) % (365 + ly),
    wasm.floor(h) % 24,
    wasm.floor(m) % 60,
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
    let d = wasm.sqrt(wasm.pow(dx,2)+wasm.pow(dy,2));
    let vx = dx/dt;
    let vy = (dy-0.5*9.8*wasm.pow(dt,2))/dt;
    let v = wasm.sqrt(wasm.pow(vx,2)+wasm.pow(vy,2));
    t = wasm.atan2(dy,dx);
    return {vel:v,ang:t};
    }

    function pol2car(pol={vel:0,ang:TWO_PI}){
      let car = {
          x:pol.vel*wasm.cos(pol.ang),
          y:pol.vel*wasm.sin(pol.ang)
      };
    return car;
}

function rgba2hex(orig) {
    var a,
      isPercent,
      rgb = orig
        .replace(/\s/g, "")
        .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
      alpha = ((rgb && rgb[4]) || "").trim(),
      hex = rgb
        ? (wasm.round(rgb[1]) | (1 << 8)).toString(16).slice(1) +
          (wasm.round(rgb[2]) | (1 << 8)).toString(16).slice(1) +
          (wasm.round(rgb[3]) | (1 << 8)).toString(16).slice(1)
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
      return "rgba("+wasm.round(rgb[0])+","+wasm.round(rgb[1])+","+wasm.round(rgb[2])+","+a+")";
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
        wl = wavelength,
        gamma = 1;

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

    colorSpace = ["rgba(" + wasm.round(R * 255) + "," + wasm.round(G * 255) + "," + wasm.round(B * 255) + ", " + alpha + ")", R, G, B, alpha]

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
    let f,m,d;
    if (midi >= 66 && midi <= 77){
        d = 0;
    } else if (midi < 66) {
        d = -(wasm.ceil((66-midi)/12))
    } else if (midi > 77) {
        d = wasm.ceil((midi-77)/12)
    }
    f = midiToFreq(midi-(12*d));
    let rgba = freq2color(f)[0]
    let hue = chroma(rgba).hsl()[0];
    let light = wasm.map(d,-5,5,0,1);
    let hsl = [hue,1,light];
    console.log(d,f,rgba,hsl);
    return chroma(hsl,"hsl");
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
