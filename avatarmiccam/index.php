<html>
    <head>
        <title>Joe X!'s Avatar Mic-Cam</title>
        <script src="https://github.com/processing/p5.js/releases/download/1.2.0/p5.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/p5.wasm@0.2.1/dist/p5.wasm.js"></script>
        <script>
            // var LN = LibNoise();
            // This is to stop global mode from starting automatically
            p5.instance = true;
        </script>
        <script src="https://github.com/processing/p5.js/releases/download/1.2.0/p5.sound.js"></script>
        <script>
          // Wait for promise to resolve then start p5 sketch
          
            // LN.then((lN)=>{
                window.p5WasmReady.then(() => {
                    new p5();
                });
            // });
        </script>
    </head>
    <body bgcolor="black" style="-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" unselectable="on" onselectstart="return false;" onmousedown="return false;">
        <img id="avatarimg" src="../joex-logo.png" style="position: fixed; transform: translate(-50%,-50%); top: 50%; left: 50%; zoom: 10; max-width: 75%; max-height: 75%;">
        <div id="avatardiv" style="position: fixed; top: 0%; left: 0%; width: auto; height: auto; z-index: 0; opacity: 0%; background-color: rgba(255,255,255,0.255);">
            <!--<form action="" nocontrols="true">-->
            <!--    <input type="file" id="img" name="img" accept="image/*">-->
            <!--    <input type="submit">-->
            <!--</form>-->
        </div>
        <script>
            window.addEventListener("keydown", function(e) {
                e.preventDefault();
            }, false);
            
            window.addEventListener("mousedown", function(e) {
                e.preventDefault();
            }, false);
            
            let img, div, mic, micLevel, minMicLevel = 0, minAvatarSize = 75, http = new XMLHttpRequest(), debugging = false;
            
            function setup(){
                img = document.getElementById('avatarimg');
                div = document.getElementById('avatardiv');
                // let cnv = createCanvas(innerWidth,innerHeight);
                // cnv.parent('avatardiv');
                // cnv.mousePressed(userStartAudio);
                // textAlign(CENTER);
                mic = new p5.AudioIn();
                mic.start();
                img.ondblclick = (e) => {
                    changeIMG();
                };
                img.onclick = userStartAudio;
            }
            
            function draw(){
                // background(0);
                // fill(255);
                // text('tap to start', width/2, 20);
                
                micLevel = mic.getLevel(1);
                // let w = micLevel * width/2;
                // let h = micLevel * height/2;
                // ellipse(width/2, height/2, w, h);
                
                keyControl();
                minMicLevel = wasm.constrain(minMicLevel,0,1);
                minAvatarSize = wasm.constrain(minAvatarSize,0,100);
                if (debugging){
                    div.textContent = `${minAvatarSize}% | ${minMicLevel} | ${micLevel}`;
                }
                img.style.maxWidth = img.style.maxHeight = `${wasm.map(wasm.log((wasm.map(wasm.constrain(micLevel,minMicLevel,1),minMicLevel,1,0.1,100)))/wasm.log(10),-1,2,minAvatarSize,100)}%`;
            }
            
            function keyControl(){
                if (keyIsDown(UP_ARROW)){
                    minAvatarSize = minAvatarSize + 0.5;
                }
                if (keyIsDown(DOWN_ARROW)){
                    minAvatarSize = minAvatarSize - 0.5;
                }
                if (keyIsDown(LEFT_ARROW)){
                    minMicLevel = minMicLevel - 0.0025;
                }
                if (keyIsDown(RIGHT_ARROW)){
                    minMicLevel = minMicLevel + 0.0025;
                }
            }
            
            function keyPressed(){
                // console.log(keyIsDown(17),keyIsDown(79))
                if (keyIsDown(17) && keyIsDown(79)) {
                    changeIMG();
                } else if (keyIsDown(82)) { // [R]ed
                    document.bgColor = "#F00";
                } else if (keyIsDown(71)) { // [G]reen
                    document.bgColor = "#0F0";
                } else if (keyIsDown(66)) { // [B]lue
                    document.bgColor = "#00F";
                } else if (keyIsDown(89)) { // [Y]ellow
                    document.bgColor = "#FF0";
                } else if (keyIsDown(67)) { // [C]yan
                    document.bgColor = "#0FF";
                } else if (keyIsDown(77)) { // [M]agenta
                    document.bgColor = "#F0F";
                } else if (keyIsDown(48) || keyIsDown(75)) { // [W]hite
                    document.bgColor = "#000";
                } else if (keyIsDown(49) || keyIsDown(87)) { // blac[K]
                    document.bgColor = "#FFF";
                } else if (keyIsDown(112)) {
                    if (debugging) {
                        div.style.opacity = "0";
                        debugging = false;
                    } else {
                        div.style.opacity = "1";
                        debugging = true;
                    }
                }
            }
            
            function changeIMG(){
                let imglink = prompt("Enter a valid image link", img.src);
                if (imglink !== null) {
                    if (imageExists(imglink)) {
                        img.src = imglink;
                    } else {
                        alert('Invalid image link');
                    }
                }
            }
            
            function imageExists(image_url){
                http.open('HEAD', "https://cors-anywhere.herokuapp.com/"+image_url, false);
                http.send();
                console.log(http);
                let res;
                // testImage(image_url).then((r) => {res = r});
                return http.status != 404 && image_url != null;// && res === "success";
            }
            
            function testImage(url, timeoutT) {
                return new Promise(function(resolve, reject) {
                    var timeout = timeoutT || 5000;
                    var timer, img = new Image();
                    img.onerror = img.onabort = function() {
                        clearTimeout(timer);
                        reject("error");
                    };
                    img.onload = function() {
                        clearTimeout(timer);
                        resolve("success");
                    };
                    timer = setTimeout(function() {
                        // reset .src to invalid URL so it stops previous
                        // loading, but doens't trigger new load
                        img.src = "//!!!!/noexist.jpg";
                        reject("timeout");
                    }, timeout); 
                    img.src = url;
                });
            }
        </script>
    </body>
</html>