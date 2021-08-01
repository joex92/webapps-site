
var font, pointer, pointerOver = false, cnv, dom, woff = 0, hoff = 0;
var loopStartTime = 0;
var loopOffset = 0;
var firstLoop = true;
var song = [];
var fsize = 10;
var fsoff = 0;


function preload() {
  font = loadFont('../fonts/RobotoMono-VariableFont_wght.ttf');
  pointer = loadImage('../tests/metaldetector.png');
  song[0] = loadSound('assets/texture.mp3');
  song[1] = loadSound('assets/hats.mp3');
  song[2] = loadSound('assets/snare.mp3');
  song[3] = loadSound('assets/kick.mp3');
  song[4] = loadSound('assets/bass.mp3');
  song[5] = loadSound('assets/arp.mp3');
  song[6] = loadSound('assets/arp2.mp3');

}

function mousePointerOn(){
    pointerOver = true;
}

function touchPointerOn(){
    pointerOver = true;
}

function mousePointerOff(){
    pointerOver = false;
}

function touchPointerOff(){
    pointerOver = false;
}

function setup() {
  noCursor();
  cnv = createCanvas(innerWidth, innerHeight);
  cnv.parent(document.body);
  cnv.mouseOver(mousePointerOn);
  cnv.touchMoved(touchPointerOn);
  cnv.mouseOut(mousePointerOff);
  cnv.touchEnded(touchPointerOff);

  window.onresize = (e) =>{
    cnv.resize(innerWidth, innerHeight);
  }

  for (s of song){
    s.output.gain.value = 1;
  }
}

function songStem(k){
    console.log(k);
    if (Number(k) > 0 && Number(k) < 8) {
        if (firstLoop){
            loopOffset = -(millis());
        }
        let allStoped = true;
        for (let i = 0; i < song.length; i++){
            if (Number(k)-1 === i){
                if (song[i].isPlaying()){
                    song[i].stop();
                } else {
                    song[i].playMode('restart');
                    song[i].loop(loopStartTime, 1, 1, 0, song[3].duration()/3);
                }
            } else {
                if (song[i].isPlaying()){song[i].playMode('restart');song[i].loop(loopStartTime, 1, 1, 0, song[3].duration()/3);}
            }
            if (song[i].isPlaying()){
                allStoped = false;
            }
        }
        if (allStoped){
            firstLoop = true;
        }
    }

    if  (k === 'Escape') {
        for (s of song){
            if (s.isPlaying()){s.stop()}else{s.playMode('restart');s.loop(loopStartTime, 1, 1, 0, song[3].duration()/3);}
        }
    }
}

function keyPressed(e) {
    console.log(e);
    songStem(key);
}

function touchStarted(e){
    console.log(e);
    let k = Math.ceil(e.clientY/(innerHeight/song.length));
    songStem(k);
}

function draw() {
    // loopStartTime = (((millis()+loopOffset)/1000)%(song[3].duration()/3))+1/frameRate();


    if (cnv.isP3D){
        woff = -innerWidth/2;
        hoff = -innerHeight/2;
    } else {
        woff = 0;
        hoff = 0;
    }

    fsize = Math.floor((innerHeight/song.length));
    clear();
    textAlign(LEFT,TOP)
    textFont(font);
    textSize((fsize+fsoff)*0.7)
    for (let i = 0; i < song.length; i++){
        if (song[i].isPlaying()){
            fill("green");
        } else {
            fill("red");
        }
        stroke(255);
        text("["+(i+1)+"]"+song[i].file.split("/")[1].split(".")[0],woff,(fsize*i)+hoff);//,innerWidth,innerHeight/song.length);
        noFill();
        rect(woff,(fsize*(i))+hoff,innerWidth,fsize);
    }

    if (pointerOver){
        image(pointer,mouseX-(pointer.width/2),mouseY-(pointer.height/5));
    }
}