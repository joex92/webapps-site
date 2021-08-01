var font, pointer, pointerOver = false, cnv, woff = 0, hoff = 0;
var song = [],daw,notReady = true, mvec, svec, svel = 10, sacc = 1;
var fsize = 10;
var fsoff = 0;

let pos = { left: 0, top: 0, x: 0, y: 0 };

function preload() {
  font = loadFont('../fonts/RobotoMono-VariableFont_wght.ttf');
  pointer = loadImage('../tests/metaldetector.png');
  for (let i = 0; i < stems.length; i++){
    // song[i] = new Wad({source : stems[i]});
    song[i] = new SoundSource(
            stems[i],
            (innerHeight/stems.length),
            "cnv",
            wasm.round(random(0+woff,innerWidth+woff)),
            // wasm.round(wasm.noise2d(i*1000,Date.now()/10000)*innerWidth),
            wasm.round(random(0+hoff,innerHeight+hoff))
            // (i*innerHeight/stems.length)+(wasm.noise2d(Date.now()/10000,i*10)*(innerHeight/stems.length))
            // wasm.round(wasm.noise2d(Date.now()/10000,i*1000)*innerHeight)
        )
  }
  // song[0] = new Wad({source : 'assets/texture.mp3'});
  // song[1] = new Wad({source : 'assets/hats.mp3'});
  // song[2] = new Wad({source : 'assets/snare.mp3'});
  // song[3] = new Wad({source : 'assets/kick.mp3'});
  // song[4] = new Wad({source : 'assets/bass.mp3'});
  // song[5] = new Wad({source : 'assets/arp.mp3'});
  // song[6] = new Wad({source : 'assets/arp2.mp3'});
  daw = new Wad.Poly();
}

function mouseMoved(e) {
    console.log(e);
    pos = {
        // The current scroll 
        left: document.body.scrollLeft,
        top: document.body.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };
};
function mouseDragged(e) {
    // Change the cursor and prevent user from selecting the text
    // document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    console.log(pos);
    // Scroll the element
    document.body.scrollLeft = pos.left - dx;
    document.body.scrollTop = pos.top - dy;
};
function mouseReleased(e) {
    // document.body.style.cursor = 'grab';
    e.target.style.removeProperty('user-select');
};

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
  cnv = createCanvas(innerWidth, innerHeight, WEBGL);
  cnv.parent(document.body);
  cnv.mouseOver(mousePointerOn);
  cnv.touchMoved(touchPointerOn);
  cnv.mouseOut(mousePointerOff);
  cnv.touchEnded(touchPointerOff);


  window.onresize = (e) =>{
    cnv.resize(innerWidth, innerHeight);
  }

  for (s of song){
    daw.add(s.wad);
  }

  mvec = wasm.create_vector_3d(mouseX,mouseY,0);
  svec = wasm.create_vector_2d(0,0);
}

function keyScroll(k){
    if (k === "ArrowUp") {
        svec.y = -svel;
        // svec.y -= sacc;
    }
    if (k === "ArrowDown") {
        svec.y = svel;
        // svec.y += sacc;
    }
    if (k === "ArrowRight") {
        svec.x = svel;
        // svec.x += sacc;
    }
    if (k === "ArrowLeft") {
        svec.x = -svel;
        // svec.x -= svel;
    }
    document.body.scrollLeft += svec.x;
    document.body.scrollTop += svec.y;
    // scrollBy(svec.x,svec.y);
}

function keyActivateClip(k){
    if (Number(k) > 0 && Number(k) < 8) {
        console.log(k,song[k-1].wad.defaultVolume);
        for (let i = 0; i < song.length; i++){
            if (Number(k)-1 === i){
                if (song[i].wad.defaultVolume > 0){
                    song[i].activated = false;
                    song[i].wad.setVolume(0);
                } else {
                    song[i].activated = true;
                    song[i].wad.setVolume(1);
                    song[i].wad.setPanning([0,0,0]);
                }
                console.log(song[i]);
            }
        }
    } else {
        keyScroll(k);
    }

    if  (k === 'Escape') {
        for (s of song){
            if (s.wad.defaultVolume > 0){s.activated = false;s.wad.setVolume(0);}
            else{s.activated = true;s.wad.setVolume(1);s.wad.setPanning([0,0,0]);}
        }
    }
}

function mouseActivateClip(mv){
    for (let i = 0; i < song.length; i++){
        if (song[i].p5GetDistance(mv) < song[i].radius/2){
            if (song[i].activated){
                song[i].activated = false;
                song[i].wad.setVolume(0);
            } else {
                song[i].activated = true;
                song[i].wad.setVolume(1);
                song[i].wad.setPanning([0,0,0]);
            }
        }
    }
}

function keyPressed(e) {
    console.log(e);
    keyActivateClip(key);
}

function touchStarted(e){
    // if (notReady) {
    //     daw.play({loop: true});
    //     notReady = false;
    // }
    console.log(e);
    mouseActivateClip(mvec);
}

function draw() {
    svec.x = 0;
    svec.y = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) {
        keyScroll(key);
    }
    textFont(font);
    textSize((fsize+fsoff)*0.7)
    if (notReady) {
        let allReady = 0;
        let loading = "";
        for (s of song){
            allReady += s.wad.playable;
            if (s.wad.playable){
                loading = "|" + loading;
            } else {
                loading = loading + "-";
            }
        }
        loading = "["+loading+"]";
        if (allReady === 0){
            loading = loading + "\r\n loading stems... ";
        } else {
            loading = loading + "\r\n " + allReady+" stem(s) ready. ";
        }
        if (allReady === song.length){
            loading = loading + "\r\n ready to play! \r\n Click here! ";
            daw.play({loop: true});
            document.getElementById('loading').onclick = (e)=>{
                document.getElementById('loading').hidden=true;
                document.getElementById('loading').style["opacity"] = "0%";
                document.getElementById('loading').style["zIndex"] = "-1";
                notReady=false;
            }
        }
        console.log(loading);
        document.getElementById("loading").textContent = loading;
    } else {
        mvec.x = mouseX;
        mvec.y = mouseY;
    
    
        if (cnv.isP3D){
            woff = -innerWidth/2;
            hoff = -innerHeight/2;
        } else {
            woff = 0;
            hoff = 0;
        }
    
        fsize = wasm.floor((innerHeight/song.length));
        clear();
        textAlign(LEFT,TOP)
        for (let i = 0; i < song.length; i++){
            if (!song[i].activated){
                song[i].p5SetPanning(mvec);
                song[i].p5SetVolume(mvec);
            }
    
            strokeWeight(1);
            if (song[i].wad.defaultVolume > 0){
                fill(128,255,128);
            } else {
                fill(255,128,128);
            }
            stroke(255);
            text("["+(i+1)+"]"+song[i].wad.source.split("/")[2].split(".")[0]
            // +"|"+song[i].pan.toString()+"|"+song[i].vol
            ,woff,(fsize*i)+hoff);//,innerWidth,innerHeight/song.length);
            noFill();
            rect(woff,(fsize*(i))+hoff,innerWidth,fsize);
    
            strokeWeight(song.length);
            song[i].p5Draw();
        }
        imageMode(CENTER);
        if (pointerOver){
            image(pointer,mouseX+woff,mouseY+(pointer.height*(4/10))+hoff);
        }
        // image(pointer,innerWidth/2+woff,innerHeight/2+(pointer.height*(4/10))+hoff);
    }
}
