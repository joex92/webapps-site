var mouseIsMoved = false;
var tfactor = 1;

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
