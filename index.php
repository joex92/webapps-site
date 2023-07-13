<?php
    require('./vendor/autoload.php');
    $dotenv = Dotenv\Dotenv::createImmutable('./');
    $dotenv->load();
    $cookie_name = "JoeXwebApps";
    $cookieset = true;
    if(!isset($_COOKIE[$cookie_name])) {
        setcookie($cookie_name, "viewer", time() + 3600, '/');
        $_COOKIE[$cookie_name] = 'viewer';
        $cookieset = false;
    }
?>
<html>
    <head>
        <title>Joe X!'s Portfolio</title>
        <meta property="og:title" content="Joe X!'s Portfolio" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://joex.apps.dj/" />
        <meta property="og:image" content="https://joex.apps.dj/joex-logo.png" />
        <meta property="og:description" content="Hey! Check out my portfolio!" />
        <meta property="fb:app_id" content="238843577785477" />
        <meta property='og:image:width' content='600' />
        <meta property='og:image:height' content='600' />
        <style>
            html {
            }
            body {
                background-color: black;
                color: white;
                font-family: "Lucida Console", "Courier New", monospace;
                padding: 0;
                margin: 0;
                /* overflow-x: hidden; */
                /* overflow-y: hidden; */
            }
            a {
                background-color: #00000066;
                color: white;
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo-link.cur)";
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo-link.cur), auto";
            }
            a:hover {
                filter: invert();
            }
            a.text:hover {
                filter: none;
                background-color: #CCCCCC66;
                mix-blend-mode: difference;
            }
            .clear {
                clear: both;
            }
            .dtoggle {
                display: flex;
                width: fit-content;
                cursor: pointer;
                padding: 1px;
                background-color: #000000CC;
                white-space: nowrap;
            }
            .dtoggle:hover {
                filter: invert();
            }
            .description {
                overflow: hidden;
                background-color: #33333333;
                padding: 0;
                width: 10%;
                height: 2em;
            }
            .commission {
                text-decoration: underline;
                font-size: 0.5em;
            }
            #cnvbg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                /* pointer-events: none; */
                z-index: -10;
                cursor: crosshair;
            }
            #fg {
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo.cur)";
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo.cur), auto";
                /* position: fixed; */
                /* top: 0; */
                /* left: 0; */
                background-color: #000000CC;
                padding: 1em;
                margin: 0;
                /* overflow-x: auto; */
                /* overflow-y: auto; */
            }
            #hi {
                margin: 1em;
            }
            #logo {
                float: left;
                text-align: center;
                cursor: crosshair;
                /* font-size: 1vw; */
                /* font-family: "Lucida Console", "Courier New", monospace;  */
                /* z-index: 100; */
            }
            #logo .bgcolor {
                color: #660000;
            }
            #logo .fgcolor {
                color: #FFFFFF;
            }
            #logo .nocolor {
                opacity: 0%;
            }
            #fb-comments {
                background-color: rgba(255, 255, 255, 0.255);
                position: -webkit-sticky; /* Safari */
                position: sticky;
                width: 100%;
                height: auto;
                left: 0px;
                bottom: 0px;
                transform: translateY(calc(100% - 69px));
            }
            #views {
                background-color: rgba(255,255,255,0.255);
                position: fixed;
                top: 1%;
                right: 1%;
                width: auto;
                height: auto;
                z-index: 10;
                color: #fff;
                text-align: right;
                text-shadow: 2px 2px #000;
                font-size: 10px;
                font-family: "Lucida Console", "Courier New", monospace;
            }
        </style>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script>
            let canvas, ctx, currentScroll = { x: 0, y: 0};
            var effect;
            
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL}, 'google_translate_element');
            }

						// jQuery('.lang-select').click(function() {
								// var theLang = jQuery(this).attr('data-lang');
								// jQuery('.goog-te-combo').val(theLang);

								// //alert(jQuery(this).attr('href'));
								// window.location = jQuery(this).attr('href');
								// location.reload();

						// });
            
            function openWebApp(name,w=256,h=256){
                window.open(name,"_blank",`name=${name.replace(/[^a-zA-Z0-9]/g,'')},directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,width=w,height=h` );
            }

            window.addEventListener("keydown", function(e) {
                // console.log("onkeydown",e);
                if (e.keyCode === 27) {
                    // ESCAPE
                    e.preventDefault();
                }
            }, false);

            window.onload = (e) => {
                // console.log("onload",e);

                document.styleSheets[0].rules[0].style["cursor"] = "url(cursor/joex-logo.cur), auto";
                document.styleSheets[0].rules[2].style["cursor"] = "url(cursor/joex-logo-link-2.cur), auto";
                let ctoggleclick = (e)=>{
                    if ( document.getElementById("fg").hidden ) document.getElementById("fg").hidden = false;
                    else document.getElementById("fg").hidden = true;
                };
                document.getElementById("logo").addEventListener("click",ctoggleclick);
                // document.getElementById("logo").addEventListener("touchend",ctoggleclick);
                // document.getElementById("google_translate_element").addEventListener("touchstart",(e)=>{
                    // e.target.dispatchEvent(new Event('click'));
                // })

                for (let desc of document.getElementsByClassName('description')) {
                    let el = desc.getElementsByClassName('dtoggle')[0];
                    let dtoggleclick = (e) => {
                        if (desc.style["height"] === "") {
                            el.innerHTML = "█&nbsp;<sup>collapse</sup>&nbsp;";
                            desc.style["width"] = "100%";
                            desc.style["height"] = "auto";
                        } else {
                            el.innerHTML = "▀&nbsp;<sup>expand</sup>&nbsp;";
                            desc.style["width"] = "calc(" + document.getElementsByClassName("dtoggle")[0].clientWidth + "px + 1em)";
                            desc.style["height"] = "";
                        }
                    };
                    el.addEventListener("click", dtoggleclick);
                    // el.addEventListener("touchend", dtoggleclick);
                    // el.dispatchEvent(new Event('click'));
                }                
                
                ///////////////////////////////////////////////////////////////////////////
                // Original particle effect code by https://codepen.io/franksLaboratory
                
                canvas = document.getElementById('cnvbg');
                ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                class Particle {
                constructor(effect, x, y, color){
                    this.effect = effect;
                    this.centerX = this.effect.centerX;
                    this.centerY = this.effect.centerY;
                    this.x = this.originX = x;
                    this.y = this.originY = y;
                    this.color = color;
                    this.dx = this.x - this.effect.centerX;
                    this.dy = this.y - this.effect.centerY;
                    this.distance = (this.dx * this.dx + this.dy * this.dy);
                    this.force = -Math.min(innerWidth * this.effect.image.width, innerHeight * this.effect.image.height) / this.distance;
                    this.angle = Math.atan2(this.dy, this.dx);
                    this.vx = this.force * Math.cos(this.angle);
                    this.vy = this.force * Math.sin(this.angle);
                }
                update(){
                    if ( this.centerX != (innerWidth / 2) ) {
                        this.originX -= this.centerX - (innerWidth / 2);
                        this.centerX = innerWidth / 2;
                    }
                    if ( this.centerY != (innerHeight / 2) ) {
                        this.originY -= this.centerY - (innerHeight / 2);
                        this.centerY = innerHeight / 2;
                    }
                    this.dx = this.effect.mouse.x - this.x;
                    this.dy = this.effect.mouse.y - this.y;
                    this.distance = (this.dx * this.dx + this.dy * this.dy);
                    this.force = -this.effect.mouse.radius / this.distance;
                    if(this.distance < this.effect.mouse.radius) {
                        this.angle = Math.atan2(this.dy, this.dx);
                        this.vx += this.force * Math.cos(this.angle) * this.effect.acceleration;
                        this.vy += this.force * Math.sin(this.angle) * this.effect.acceleration;
                    }
                    this.x += (this.vx *= this.effect.friction) + (this.originX - this.x) * this.effect.ease;
                    this.y += (this.vy *= this.effect.friction) + (this.originY - this.y) * this.effect.ease;
										this.x += this.effect.width;
										this.y += this.effect.height;
										this.x %= this.effect.width;
										this.y %= this.effect.height;
                    }
                }

                class Effect {
                    constructor(width, height, context){
                        this.context = context;
                        this.width = width;
                        this.height = height;
                        this.image = document.getElementById('logo');
                        this.centerX = this.width / 2;
                        this.centerY = this.height / 2;
                        this.x = this.centerX - this.image.width / 2;
                        this.y = this.centerY - this.image.height / 2;
                        this.particles = [];
                        this.size = <?php
                            $size = 30;
                            if ( isset($_GET['size']) ) {
                                $size = abs(intval($_GET['size']));
                            } 
                            echo $size;
                        ?>;
                        this.friction = 0.99;
                        this.ease = 0.001;
                        this.acceleration = 0.1;
                        this.alpha = 0.8;
                        this.mouse = {
                            radius: Math.max(this.image.width,this.image.height) / ( this.size  / 100 ),
                            x: this.centerX,
                            y: this.centerY
                        }
                        window.addEventListener("mousemove", event => {
                            this.mouse.x = event.x;
                            this.mouse.y = event.y;
                        });
                        
                        window.addEventListener("touchstart", event => {
                            this.mouse.x = event.changedTouches[0].clientX;
                            this.mouse.y = event.changedTouches[0].clientY;
                        }, false);
                        
                        window.addEventListener("touchmove", event => {
                            this.mouse.x = event.targetTouches[0].clientX;
                            this.mouse.y = event.targetTouches[0].clientY;
                            // event.preventDefault();
                        }, false);
                        
                        window.addEventListener("touchend", event => {
                            this.mouse.x = 0;
                            this.mouse.y = 0;
                            // event.preventDefault();
                        }, false);
                        window.addEventListener("resize", event => {
                            this.width = innerWidth;
                            this.height = innerHeight;
                            this.centerX - this.image.width / 2;
                            this.centerY - this.image.height / 2;
                            this.mouse.radius = Math.max(this.image.width,this.image.height) / ( this.size  / 100 );
                            canvas.width = window.innerWidth;
                            canvas.height = window.innerHeight;
                        }, false);
                    }
                    init(){
                        this.context.drawImage(this.image,this.x, this.y);
                        var pixels = this.context.getImageData(0, 0, this.width, this.height).data;
                        var index;
                        for(var y = this.height - 1; y >= 0 ; y -= this.size) {
                            for(var x = this.width - 1; x >= 0 ; x -= this.size) {
                                index = (y * this.width + x) * 4;
                                const red = pixels[index];
                                const green = pixels[index + 1];
                                const blue = pixels[index + 2];
                                const alpha = pixels[index + 3];
                                const color = { r: red, g: green, b: blue, a: alpha / 255 };
                                if(alpha > 0) {
                                    this.particles.push(new Particle(this, x, y, color));
                                }
                            }
                        }
                        this.context.clearRect(0, 0, this.width, this.height);
                    }
                    update(){
                        for(var i = 0; i < this.particles.length; i++) {
                            this.particles[i].update();
                        }
                    }
                    render(){
                        this.context.clearRect(0, 0, this.width, this.height);
                        for(var i = 0; i < this.particles.length; i++) {
                            var p = this.particles[i];
                            this.context.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + (this.alpha * p.color.a) + ')';
                            this.context.fillRect(p.x-(this.size/2), p.y-(this.size/2), this.size, this.size);
                        }
                    }
                }

                effect = new Effect(canvas.width, canvas.height, ctx);
                effect.init();

                function animate() {
                    effect.update();
                    effect.render();
                    requestAnimationFrame(animate);
                }
                animate();
                
                ///////////////////////////////////////////////////////////////////////////
                
                document.body.onscroll = (e) => {
                    // console.log("onscroll",e);
                    
                    if ( currentScroll.x != document.body.scrollLeft ) {
                        effect.mouse.x -= ( document.body.scrollLeft - currentScroll.x ) / 2;
                        currentScroll.x = document.body.scrollLeft;
                    }
                    
                    if ( currentScroll.y != document.body.scrollTop ) {
                        effect.mouse.y -= ( document.body.scrollTop - currentScroll.y ) / 2;
                        currentScroll.y = document.body.scrollTop;
                    }
                    
                    if (document.body.scrollTop + window.visualViewport.height > (document.body.scrollHeight - (document.getElementById("fb-comments").scrollHeight - 69))) {
                        document.getElementById("fb-comments").style["transform"] = "translateY(calc(100% - "+((document.body.scrollTop + window.visualViewport.height) - (document.body.scrollHeight - document.getElementById("fb-comments").scrollHeight))+"px))";
                    } else {
                        document.getElementById("fb-comments").style["transform"] = "translateY(calc(100% - 69px))";
                    }
                    try {
                        document.getElementsByClassName("fb-comments")[0].childNodes[0].childNodes[0].style["width"] = "100%";
                    } catch(err) {
                        console.log(err);
                    }
                }
                
                if ( location.hash.search('#logo') < 0 ) document.getElementById("fg").hidden = false;
								                
                console.clear();
                console.log(`Hey! I see you are curious!
well then, if you want to experiment with the background, just check the "effect" object.
you can change:
    - size
    - friction
    - ease
    - acceleration
    - alpha value

You can also hide/unhide the content by clicking on the logo.
You can set the size of the squares for initialization as search params in the URL, just add "?size=" and a number (negative numbers will just use the absolute value).
you can keep the content hidden on loading the page by adding the hash "#logo" to the URL.

Happy experimenting! 👍🏼`);
            };
        </script>
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    </head>
    <body>
				<canvas id="cnvbg"></canvas>
        <!-- <pre id="logo"><font color="black">▓▓▓▓▓▓▓▓▓</font><font color="#292929">▓</font><font color="#666666">▓▓▓</font><font color="#7a7676">▓</font><font color="#d1bcbc">▓</font><font color="#d0bbbc">▓</font><font color="#d0bbbb">▓▓▓▓▓▓▓▓▓▓</font><font color="#968e8e">▓</font><font color="#666666">▓▓▓</font><font color="#373737">▓</font><font color="black">▓▓▓▓▓▓▓▓▓</font><br><font color="black">▓▓▓▓▓▓▓</font><font color="#262626">▓</font><font color="#7a7a7a">▓</font><font color="#a9a2a2">▓</font><font color="#b19394">▓▓▓</font><font color="#a88383">▓</font><font color="#460000">▓</font><font color="#450000">▓▓▓▓▓▓▓▓▓▓▓</font><font color="#916362">▓</font><font color="#b29394">▓▓▓</font><font color="#a39394">▓</font><font color="#7b7a7b">▓</font><font color="#313031">▓</font><font color="black">▓▓▓▓▓▓▓</font><br><font color="black">▓▓▓</font><font color="#010101">▓</font><font color="#030303">▓</font><font color="#292929">▓</font><font color="#939393">▓</font><font color="#a79d9d">▓</font><font color="#9b7272">▓</font><font color="#8d5e5e">▓</font><font color="#4a0101">▓▓▓▓</font><font color="#490101">▓</font><font color="#5a1515">▓</font><font color="#b08d8e">▓</font><font color="#a88180">▓</font><font color="#450000">▓▓▓▓▓▓▓▓▓▓</font><font color="#460101">▓▓</font><font color="#7b4545">▓</font><font color="#9b7272">▓</font><font color="#9a8988">▓</font><font color="#949393">▓</font><font color="#3a393a">▓</font><font color="#030303">▓</font><font color="#020202">▓</font><font color="black">▓▓▓</font><br><font color="black">▓</font><font color="#070707">▓</font><font color="#171717">▓</font><font color="#3a3838">▓</font><font color="#bdb9b9">▓</font><font color="#b7a6a6">▓</font><font color="#8a5b5b">▓</font><font color="#986a69">▓</font><font color="#c0a6a6">▓</font><font color="#c1a6a6">▓▓</font><font color="#c2a7a8">▓</font><font color="#c8b0b0">▓</font><font color="#c8afaf">▓</font><font color="#c2a6a6">▓</font><font color="#bd9c9c">▓</font><font color="#825050">▓</font><font color="#804a49">▓</font><font color="#4f0b0b">▓▓▓▓</font><font color="#490304">▓</font><font color="#460000">▓▓▓</font><font color="#4b0707">▓</font><font color="#4e0b0b">▓</font><font color="#9b6c6d">▓</font><font color="#c2a5a5">▓▓▓</font><font color="#a37979">▓</font><font color="#8a5b5b">▓</font><font color="#a68e8f">▓</font><font color="#bebaba">▓</font><font color="#898686">▓</font><font color="#181818">▓</font><font color="#101010">▓</font><font color="black">▓</font><br><font color="black">▓</font><font color="#6a6a6a">▓</font><font color="#e0e0e0">▓</font><font color="#c5b3b4">▓</font><font color="#693131">▓</font><font color="#844f4e">▓</font><font color="#d2bfbf">▓</font><font color="#c5a8a8">▓</font><font color="#693131">▓▓▓</font><font color="#825253">▓</font><font color="white">▓</font><font color="#f2e8e9">▓</font><font color="#6d3131">▓</font><font color="#6b2c2d">▓</font><font color="#561111">▓</font><font color="#642322">▓</font><font color="#d3bfbf">▓▓▓</font><font color="#d3bfbe">▓</font><font color="#804949">▓</font><font color="#551111">▓</font><font color="#4d0606">▓</font><font color="#480000">▓</font><font color="#b08b8a">▓</font><font color="#ddcfcf">▓</font><font color="#a27777">▓</font><font color="#7a4242">▓▓▓</font><font color="#b3908e">▓</font><font color="#d2bfbe">▓</font><font color="#976e6d">▓</font><font color="#6d3131">▓</font><font color="#af9393">▓</font><font color="#e1e1e1">▓</font><font color="#8f8e8e">▓</font><font color="black">▓</font><br><font color="#222222">▓</font><font color="#8a8787">▓</font><font color="#eae2e2">▓</font><font color="#c9acad">▓</font><font color="#460000">▓</font><font color="#490404">▓</font><font color="#541514">▓</font><font color="#521111">▓</font><font color="#450000">▓▓▓</font><font color="#682929">▓</font><font color="white">▓</font><font color="#eee2e3">▓</font><font color="#4a0000">▓</font><font color="#632020">▓</font><font color="#f1ebeb">▓</font><font color="#e5d8d7">▓</font><font color="#531515">▓</font><font color="#541514">▓▓</font><font color="#551515">▓</font><font color="#c6a9a8">▓</font><font color="#f1ebeb">▓</font><font color="#865455">▓</font><font color="#480000">▓</font><font color="#c7acaa">▓</font><font color="white">▓</font><font color="#eae1e1">▓</font><font color="#dccdcd">▓▓▓</font><font color="#905d5d">▓</font><font color="#561514">▓</font><font color="#4e0909">▓</font><font color="#490000">▓</font><font color="#a37c7b">▓</font><font color="#ebe2e2">▓</font><font color="#a39c9d">▓</font><font color="#222222">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓</font><font color="#470000">▓▓</font><font color="#510c0c">▓</font><font color="#7a4747">▓▓▓</font><font color="#8a5a5a">▓</font><font color="#cfb9b9">▓</font><font color="#c2a5a5">▓</font><font color="#4a0000">▓</font><font color="#5e1919">▓</font><font color="#cfb9b9">▓</font><font color="#ccb0b0">▓</font><font color="#794747">▓▓▓</font><font color="#7a4747">▓</font><font color="#ba9797">▓</font><font color="#cfb9ba">▓</font><font color="#794242">▓</font><font color="#480000">▓</font><font color="#a57c7c">▓</font><font color="#ceb9b9">▓</font><font color="#9c7373">▓</font><font color="#784747">▓</font><font color="#794747">▓▓</font><font color="#5c1b1b">▓</font><font color="#480000">▓</font><font color="#490000">▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓</font><font color="#632021">▓</font><font color="#d0bdbe">▓▓▓</font><font color="#bda2a1">▓</font><font color="#490000">▓</font><font color="#4f0808">▓</font><font color="#7a4343">▓</font><font color="#753a3a">▓</font><font color="#470000">▓</font><font color="#591313">▓</font><font color="#d1bdbd">▓▓▓▓</font><font color="#763d3d">▓</font><font color="#450000">▓</font><font color="#662c2c">▓</font><font color="#7a4343">▓</font><font color="#581616">▓</font><font color="#480000">▓</font><font color="#a27777">▓</font><font color="#d1bdbd">▓</font><font color="#d1bdbe">▓▓</font><font color="#824949">▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓</font><font color="#490101">▓</font><font color="#4b0505">▓</font><font color="#4a0505">▓▓</font><font color="#4a0404">▓</font><font color="#480000">▓</font><font color="#621e1e">▓</font><font color="#fcfafa">▓</font><font color="#efe7e7">▓</font><font color="#8d6060">▓</font><font color="#895858">▓</font><font color="#4c0505">▓▓▓▓</font><font color="#7c4443">▓</font><font color="#8e6160">▓</font><font color="#d4c6c6">▓</font><font color="#fcfafa">▓</font><font color="#865453">▓</font><font color="#480000">▓</font><font color="#4b0303">▓</font><font color="#4c0505">▓▓▓</font><font color="#4a0202">▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓▓▓▓▓▓▓</font><font color="#550e0e">▓</font><font color="#9f7878">▓</font><font color="#ae8b8b">▓</font><font color="white">▓</font><font color="#f9f5f4">▓</font><font color="#ac8888">▓▓▓▓</font><font color="#e8dbda">▓</font><font color="white">▓</font><font color="#c3a8a9">▓</font><font color="#9d7878">▓</font><font color="#652828">▓</font><font color="#480000">▓▓▓▓▓▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓▓▓▓▓▓▓▓▓</font><font color="#520c0b">▓</font><font color="#875656">▓</font><font color="#966768">▓</font><font color="white">▓▓▓▓</font><font color="#ad8d8c">▓</font><font color="#845656">▓</font><font color="#5d1f1f">▓</font><font color="#450000">▓</font><font color="#470000">▓</font><font color="#480000">▓▓▓▓▓▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="#2e2e2e">▓</font><font color="#898484">▓</font><font color="#dfd2d3">▓</font><font color="#bda1a2">▓</font><font color="#470000">▓</font><font color="#480000">▓▓▓▓▓▓▓▓</font><font color="#4a0202">▓</font><font color="#541111">▓</font><font color="#6a2b2b">▓</font><font color="#e0d2d3">▓</font><font color="#e3d6d6">▓</font><font color="#f3eeee">▓▓▓▓</font><font color="#e7dcdc">▓</font><font color="#e0d3d3">▓</font><font color="#865656">▓</font><font color="#521111">▓</font><font color="#4b0606">▓</font><font color="#480000">▓▓▓▓▓</font><font color="#490000">▓▓▓▓</font><font color="#9d7473">▓</font><font color="#dfd2d3">▓</font><font color="#a29b9a">▓</font><font color="#2e2d2d">▓</font><br><font color="black">▓</font><font color="#6f6f6f">▓</font><font color="#e2e2e2">▓</font><font color="#c6b4b5">▓</font><font color="#632829">▓</font><font color="#602020">▓</font><font color="#470000">▓</font><font color="#480000">▓▓▓▓</font><font color="#4c0606">▓</font><font color="#652828">▓</font><font color="#783f3f">▓</font><font color="#ece4e4">▓</font><font color="#ebe3e3">▓</font><font color="#e3d7d7">▓</font><font color="#d9c7c6">▓</font><font color="#5f1c1c">▓</font><font color="#5e1c1c">▓▓</font><font color="#5f1c1c">▓</font><font color="#bf9d9d">▓</font><font color="#e4d7d7">▓</font><font color="#e9e1e0">▓</font><font color="#ece3e3">▓</font><font color="#936868">▓</font><font color="#652929">▓</font><font color="#530f0f">▓</font><font color="#470000">▓</font><font color="#480000">▓▓</font><font color="#490000">▓▓</font><font color="#5a1818">▓</font><font color="#662929">▓</font><font color="#b09392">▓</font><font color="#e2e2e2">▓</font><font color="#8f8f8e">▓</font><font color="black">▓</font><br><font color="black">▓</font><font color="#0b0b0b">▓</font><font color="#191919">▓</font><font color="#3b3939">▓</font><font color="#b8b3b3">▓</font><font color="#b19e9f">▓</font><font color="#774242">▓</font><font color="#713737">▓</font><font color="#480000">▓▓▓</font><font color="#622626">▓</font><font color="#f3efef">▓</font><font color="#f1eae9">▓</font><font color="#d2bebe">▓</font><font color="#c5a8a9">▓</font><font color="#521111">▓</font><font color="#520f0f">▓</font><font color="#490000">▓▓▓</font><font color="#480000">▓</font><font color="#510c0b">▓</font><font color="#551111">▓</font><font color="#a78383">▓</font><font color="#d3bebe">▓</font><font color="#e9e0e0">▓</font><font color="#f3efef">▓</font><font color="#895a5a">▓</font><font color="#450000">▓</font><font color="#480000">▓▓</font><font color="#672928">▓</font><font color="#794242">▓</font><font color="#9f8383">▓</font><font color="#b8b4b3">▓</font><font color="#8b8987">▓</font><font color="#181818">▓</font><font color="#101010">▓</font><font color="black">▓</font><br><font color="black">▓▓▓</font><font color="#010101">▓</font><font color="#030303">▓</font><font color="#2b2a2a">▓</font><font color="#a2a0a1">▓</font><font color="#aea2a2">▓</font><font color="#8e6262">▓</font><font color="#835050">▓</font><font color="#480000">▓</font><font color="#5b1919">▓</font><font color="#ba9f9f">▓</font><font color="#ae8d8d">▓</font><font color="#4a0202">▓▓</font><font color="#490000">▓▓▓▓▓</font><font color="#480000">▓▓▓</font><font color="#4a0102">▓</font><font color="#4a0202">▓</font><font color="#976b6b">▓</font><font color="#ba9f9f">▓</font><font color="#743b3b">▓</font><font color="#470000">▓</font><font color="#743a3b">▓</font><font color="#8f6262">▓</font><font color="#9e8b8a">▓</font><font color="#a2a1a1">▓</font><font color="#403f40">▓</font><font color="#030303">▓</font><font color="#020202">▓</font><font color="black">▓▓▓</font><br><font color="black">▓▓▓▓▓▓▓</font><font color="#353434">▓</font><font color="#9d9c9d">▓</font><font color="#b8b0b0">▓</font><font color="#a78484">▓</font><font color="#a88484">▓▓</font><font color="#9f7575">▓</font><font color="#480000">▓</font><font color="#490000">▓▓▓▓▓▓</font><font color="#480000">▓▓▓</font><font color="#490000">▓</font><font color="#480000">▓</font><font color="#8c5958">▓</font><font color="#a98484">▓▓▓</font><font color="#ad9b9b">▓</font><font color="#9e9e9e">▓</font><font color="#434243">▓</font><font color="black">▓▓▓▓▓▓▓</font><br><font color="black">▓▓▓▓▓▓▓▓▓</font><font color="#353434">▓</font><font color="#6e6d6d">▓▓▓</font><font color="#7f7b7a">▓</font><font color="#c6acad">▓</font><font color="#c6acac">▓▓▓▓▓▓▓▓▓▓▓</font><font color="#9c918f">▓</font><font color="#6e6d6d">▓</font><font color="#6e6d6e">▓</font><font color="#6d6c6d">▓</font><font color="#3d3c3d">▓</font><font color="black">▓▓▓▓▓▓▓▓▓</font><br></pre> -->
				<!-- <pre id="logo"><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="nocolor">▓▓</span><br><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="nocolor">▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓</span><br><span class="nocolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span></pre> -->
				<img id="logo" src="joex-logo.png" style="float: left; zoom: 0.25; padding: 5em; margin: 0" title="Click me!">
				<!-- <img id="logo" src="joex-logo.png" style="float: left; width: max(10vw,10vh); padding: 2em; margin: 0" title="Click me!"> -->
        <div id="fg" hidden>
            <p id="hi"><br>Hi, I'm<b class='notranslate' style="color: #C00;"> Joe X!</b>, my real name is <i>José Andrés Medina O.</i> and I'm from<font class='notranslate' style='color: #FF0;'> Ecu</font><font class='notranslate' style='color: #88F;'>ad</font><font class='notranslate' style='color: #F00;'>or</font><br>
            I'm a Music Producer, Audiovisual experimental artist, Geek and Gamer!<br>
            In this minimalistic website I'll be posting my portfolio, which includes apps and projects developed by me as well as events where I have participated.<br>
            This website itself is one of my projects too, you can check its source code <a href="https://github.com/joex92/webapps-site" target="_blank" style="color: #AAA;">here in my Github page.</a></p>
            <p class="clear" id="links">You can follow me on my social media accounts to be up-to-date on new stuff I'll be doing:</p>
            <ul class="clear">
                <li><a href="https://twitch.com/joex92" class="text notranslate" target="_blank" style="color: indigo;">&nbsp;Twitch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></li>
                <li><a href="https://youtube.com/c/joex92" class="text notranslate" target="_blank" style="color: red;">&nbsp;Youtube&nbsp;&nbsp;&nbsp;&nbsp;</a></li>
                <li><a href="https://twitter.com/joex92" class="text notranslate" target="_blank" style="color: cyan;">&nbsp;&nbsp;Twitter&nbsp;&nbsp;&nbsp;</a></li>
                <li><a href="https://facebook.com/joex92" class="text notranslate" target="_blank" style="color: blue;">&nbsp;&nbsp;Facebook&nbsp;&nbsp;</a></li>
                <li><a href="https://instagram.com/J03X92" class="text notranslate" target="_blank" style="color: darkorchid;">&nbsp;&nbsp;Instagram&nbsp;</a></li>
                <li><a href="https://www.threads.net/@j03x92" class="text notranslate" target="_blank" style="color: indigo;">&nbsp;&nbsp;&nbsp;&nbsp;Threads&nbsp;</a></li>
            </ul>
            <div id="google_translate_element"></div>
            <hr>
            <div id="portfolio" class="clear">
                <?php
                    $file = fopen("apps.csv", "r");
                    // Fetching data from csv file row by row
                    while (($data = fgetcsv($file)) !== false) {
                        if ( $data[0] != "ID" ) {
                            printf("\n<h3 class='notranslate'>→ <a href=\"javascript:openWebApp(%s)\">%s</a></h3>", $data[1], $data[2]);
                            printf("\n<div id='%s' class='description'><div class='dtoggle'>▀&nbsp;<sup>expand</sup>&nbsp;</div><br>%s</div>\n<hr>\n",$data[0],$data[3]);
                        }
                    }
                    // Closing the file
                    fclose($file);
                ?>
            </div>
						<div id="fb-root"></div>
						<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v9.0&appId=238843577785477&autoLogAppEvents=1" nonce="q0iP3Qki"></script>
            <div id="fb-comments"><div class="fb-comments" data-href="https://joex.apps.dj/" data-width="100%" data-numposts="5" data-order-by="time" data-colorscheme="dark" style="background-color: rgba(255, 255, 255, 0.255);"></div></div>
        </div>
        <div id="views"><?php
            function getUserIpAddr(){
                if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                    $ip = $_SERVER['HTTP_CLIENT_IP'];
                } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
                } else {
                    $ip = $_SERVER['REMOTE_ADDR'];
                }
                return $ip;
            }
            function console_log($output, $with_script_tags = true) {
                $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) .
            ');';
                if ($with_script_tags) {
                    $js_code = '<script>' . $js_code . '</script>';
                }
                echo $js_code;
            }
            // Connects to your Database
            $con = mysqli_connect($_SERVER["HTTP_MYSQL_HOST"], $_SERVER["HTTP_MYSQL_USER"], $_SERVER["HTTP_MYSQL_PASS"], $_SERVER["HTTP_MYSQL_DB"]);

            if (!$con) {
                console_log("Error: Unable to connect to MySQL." . PHP_EOL);
                console_log("Debugging errno: " . mysqli_connect_errno() . PHP_EOL);
                console_log("Debugging error: " . mysqli_connect_error() . PHP_EOL);
                exit;
            }

            if (!$cookieset){
                if ($con->query("UPDATE counter SET `global` = `global` + 1") === TRUE) {
                    console_log("Global counter updated");

                } else {
                    console_log("Global counter not Updated");
                }
            } else {
                console_log("Cookie hasn't expired");
            }

            if ($result = $con->query("SELECT global FROM counter")) {
                /* fetch object array */
                while ($row = $result->fetch_row()) {
                    printf ("&nbsp;Views:&nbsp;<br>&nbsp;Total = %s&nbsp;", $row[0]);
                }
                /* free result set */
                $result->close();
            }

            $ip = getUserIpAddr();
            $ipstack = json_decode(file_get_contents("http://api.ipstack.com/{$ip}?access_key=af2b95ab303f4f5033c14f73b96629cf"));

            if ($con->query("SHOW COLUMNS FROM `counter` LIKE '{$ipstack->location->geoname_id}'")->fetch_row()[0] == $ipstack->location->geoname_id){
                console_log("Geoname ID {$ipstack->location->geoname_id} found");
            } else {
                console_log("Geoname ID {$ipstack->location->geoname_id} not found");
                if ($con->query("ALTER TABLE `counter` ADD `{$ipstack->location->geoname_id}` INT(20) NOT NULL ;")){
                    console_log("Geoname ID {$ipstack->location->geoname_id} created");
                }
            }

            if (!$cookieset){
                if ($con->query("UPDATE counter SET `{$ipstack->location->geoname_id}` = `{$ipstack->location->geoname_id}` + 1") === TRUE) {
                    console_log("{$ipstack->location->geoname_id} counter updated");

                } else {
                    console_log("{$ipstack->location->geoname_id} counter not updated");
                }
            } else {
                console_log("Cookie hasn't expired");
            }

            // if($ipstack->success==""){
                // $ipstack->location->country_flag = str_replace("http:","https:",$ipstack->location->country_flag);
                // if ($result = $con->query("SELECT `{$ipstack->location->geoname_id}` FROM counter")) {
                    // /* fetch object array */
                    // while ($row = $result->fetch_row()) {
                        // printf ("<br>&nbsp;%s, %s, %s = %s&nbsp;\n", $ipstack->city, $ipstack->region_name, $ipstack->country_code, $row[0]);
                    // }
                    // /* free result set */
                    // $result->close();
                // }
            // }
            mysqli_close($con);
        ?></div>
    </body>
</html>
