<?php
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
        <title>Joe X!'s Web Apps</title>
        <meta property="og:title" content="Joe X! Web Apps" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://joex.apps.dj/" />
        <meta property="og:image" content="joex-logo.png" />
        <meta property="og:description" content="" />
        <meta property="fb:app_id" content="238843577785477" />
        <style>
            html {
            }
            body {
                background-color: black;
                color: white;
                font-family: "Lucida Console", "Courier New", monospace;
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo.cur)";
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo.cur), auto";
            }
            a {
                background-color: black;
                color: white;
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo-link.cur)";
                cursor: "url(https://<? echo $_SERVER['HTTP_HOST'] ?>/cursor/joex-logo-link.cur), auto";
            }
            a:hover {
                filter: invert();
            }
            a.text:hover {
                filter: none;
                background-color: lightgray;
                mix-blend-mode: difference;
            }
            .clear {
                clear: both;
            }
            .dtoggle {
                cursor: pointer;
                padding: 0;
                /*NO SELECT*/
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
            }
            .description {
                overflow: hidden;
                padding: 0;
                width: 10%;
                height: 20px;
            }
            .commission {
                text-decoration: underline;
                font-size: 0.5em;
                /*NO SELECT*/
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
            }
            #logo {
                float: left;
                cursor: crosshair;
                text-align: center;
                font-size: 1vw;
                font-family: "Lucida Console", "Courier New", monospace;
                /*NO SELECT*/
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
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
        <script>
            function openWebApp(name,w=256,h=256){
                window.open(name,name,'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,width=w,height=h');
            }

            // window.onresize = (e) => {
            //     try {
            //         document.getElementsByClassName("fb-comments")[0].childNodes[0].childNodes[0].style["width"] = "100%";
            //     } catch(err) {
            //         console.log(err);
            //     }
            // };

            window.addEventListener("keydown", function(e) {
                console.log("onkeydown",e);
                if (e.keyCode === 27) {
                    // ESCAPE
                    // if (document.getElementById("fb-comments").style["height"] === "") {
                    //     document.getElementById("fb-comments").style["height"] = "80%";
                    // } else {
                    //     document.getElementById("fb-comments").style["height"] = "";
                    // }
                }
                e.preventDefault();
            }, false);

            window.onload = (e) => {
                console.log("onload",e);

                document.styleSheets[0].rules[0].style["cursor"] = "url(cursor/joex-logo.cur), auto"
                document.styleSheets[0].rules[2].style["cursor"] = "url(cursor/joex-logo-link-2.cur), auto"

                document.body.onscroll = (e) => {
                    console.log("onscroll",e);
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
                
                for (let desc of document.getElementsByClassName('description')) {
                    let el = desc.getElementsByClassName('dtoggle')[0];
                    el.addEventListener("click", (e) => {
                        if (desc.style["height"] === "") {
                            el.textContent = `█ ʰⁱᵈᵉ`;
                            desc.style["width"] = "100%";
                            desc.style["height"] = "auto";
                        } else {
                            el.textContent = `▀ ˢʰᵒʷ`;
                            desc.style["width"] = "10%";
                            desc.style["height"] = "";
                        }
                    });
                }

                // do {
                //     try {
                //         document.getElementsByClassName("fb-comments")[0].childNodes[0].childNodes[0].style["width"] = "100%";
                //     } catch(err) {
                //         console.log(err);
                //     }
                // } while (document.getElementsByTagName("iframe").length === 0)
            };

            // window.onloadeddata =  (e) => {
            //     console.log("onloadeddata",e,document.getElementsByTagName("iframe"));
            // };

            // window.onloadedmetadata = (e) => {
            //     console.log("onloadedmetadata",e,document.getElementsByTagName("iframe"));
            // };
        </script>
    </head>
    <body>
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v9.0&appId=238843577785477&autoLogAppEvents=1" nonce="q0iP3Qki"></script>
        <!-- <pre id="logo"><font color="black">▓▓▓▓▓▓▓▓▓</font><font color="#292929">▓</font><font color="#666666">▓▓▓</font><font color="#7a7676">▓</font><font color="#d1bcbc">▓</font><font color="#d0bbbc">▓</font><font color="#d0bbbb">▓▓▓▓▓▓▓▓▓▓</font><font color="#968e8e">▓</font><font color="#666666">▓▓▓</font><font color="#373737">▓</font><font color="black">▓▓▓▓▓▓▓▓▓</font><br><font color="black">▓▓▓▓▓▓▓</font><font color="#262626">▓</font><font color="#7a7a7a">▓</font><font color="#a9a2a2">▓</font><font color="#b19394">▓▓▓</font><font color="#a88383">▓</font><font color="#460000">▓</font><font color="#450000">▓▓▓▓▓▓▓▓▓▓▓</font><font color="#916362">▓</font><font color="#b29394">▓▓▓</font><font color="#a39394">▓</font><font color="#7b7a7b">▓</font><font color="#313031">▓</font><font color="black">▓▓▓▓▓▓▓</font><br><font color="black">▓▓▓</font><font color="#010101">▓</font><font color="#030303">▓</font><font color="#292929">▓</font><font color="#939393">▓</font><font color="#a79d9d">▓</font><font color="#9b7272">▓</font><font color="#8d5e5e">▓</font><font color="#4a0101">▓▓▓▓</font><font color="#490101">▓</font><font color="#5a1515">▓</font><font color="#b08d8e">▓</font><font color="#a88180">▓</font><font color="#450000">▓▓▓▓▓▓▓▓▓▓</font><font color="#460101">▓▓</font><font color="#7b4545">▓</font><font color="#9b7272">▓</font><font color="#9a8988">▓</font><font color="#949393">▓</font><font color="#3a393a">▓</font><font color="#030303">▓</font><font color="#020202">▓</font><font color="black">▓▓▓</font><br><font color="black">▓</font><font color="#070707">▓</font><font color="#171717">▓</font><font color="#3a3838">▓</font><font color="#bdb9b9">▓</font><font color="#b7a6a6">▓</font><font color="#8a5b5b">▓</font><font color="#986a69">▓</font><font color="#c0a6a6">▓</font><font color="#c1a6a6">▓▓</font><font color="#c2a7a8">▓</font><font color="#c8b0b0">▓</font><font color="#c8afaf">▓</font><font color="#c2a6a6">▓</font><font color="#bd9c9c">▓</font><font color="#825050">▓</font><font color="#804a49">▓</font><font color="#4f0b0b">▓▓▓▓</font><font color="#490304">▓</font><font color="#460000">▓▓▓</font><font color="#4b0707">▓</font><font color="#4e0b0b">▓</font><font color="#9b6c6d">▓</font><font color="#c2a5a5">▓▓▓</font><font color="#a37979">▓</font><font color="#8a5b5b">▓</font><font color="#a68e8f">▓</font><font color="#bebaba">▓</font><font color="#898686">▓</font><font color="#181818">▓</font><font color="#101010">▓</font><font color="black">▓</font><br><font color="black">▓</font><font color="#6a6a6a">▓</font><font color="#e0e0e0">▓</font><font color="#c5b3b4">▓</font><font color="#693131">▓</font><font color="#844f4e">▓</font><font color="#d2bfbf">▓</font><font color="#c5a8a8">▓</font><font color="#693131">▓▓▓</font><font color="#825253">▓</font><font color="white">▓</font><font color="#f2e8e9">▓</font><font color="#6d3131">▓</font><font color="#6b2c2d">▓</font><font color="#561111">▓</font><font color="#642322">▓</font><font color="#d3bfbf">▓▓▓</font><font color="#d3bfbe">▓</font><font color="#804949">▓</font><font color="#551111">▓</font><font color="#4d0606">▓</font><font color="#480000">▓</font><font color="#b08b8a">▓</font><font color="#ddcfcf">▓</font><font color="#a27777">▓</font><font color="#7a4242">▓▓▓</font><font color="#b3908e">▓</font><font color="#d2bfbe">▓</font><font color="#976e6d">▓</font><font color="#6d3131">▓</font><font color="#af9393">▓</font><font color="#e1e1e1">▓</font><font color="#8f8e8e">▓</font><font color="black">▓</font><br><font color="#222222">▓</font><font color="#8a8787">▓</font><font color="#eae2e2">▓</font><font color="#c9acad">▓</font><font color="#460000">▓</font><font color="#490404">▓</font><font color="#541514">▓</font><font color="#521111">▓</font><font color="#450000">▓▓▓</font><font color="#682929">▓</font><font color="white">▓</font><font color="#eee2e3">▓</font><font color="#4a0000">▓</font><font color="#632020">▓</font><font color="#f1ebeb">▓</font><font color="#e5d8d7">▓</font><font color="#531515">▓</font><font color="#541514">▓▓</font><font color="#551515">▓</font><font color="#c6a9a8">▓</font><font color="#f1ebeb">▓</font><font color="#865455">▓</font><font color="#480000">▓</font><font color="#c7acaa">▓</font><font color="white">▓</font><font color="#eae1e1">▓</font><font color="#dccdcd">▓▓▓</font><font color="#905d5d">▓</font><font color="#561514">▓</font><font color="#4e0909">▓</font><font color="#490000">▓</font><font color="#a37c7b">▓</font><font color="#ebe2e2">▓</font><font color="#a39c9d">▓</font><font color="#222222">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓</font><font color="#470000">▓▓</font><font color="#510c0c">▓</font><font color="#7a4747">▓▓▓</font><font color="#8a5a5a">▓</font><font color="#cfb9b9">▓</font><font color="#c2a5a5">▓</font><font color="#4a0000">▓</font><font color="#5e1919">▓</font><font color="#cfb9b9">▓</font><font color="#ccb0b0">▓</font><font color="#794747">▓▓▓</font><font color="#7a4747">▓</font><font color="#ba9797">▓</font><font color="#cfb9ba">▓</font><font color="#794242">▓</font><font color="#480000">▓</font><font color="#a57c7c">▓</font><font color="#ceb9b9">▓</font><font color="#9c7373">▓</font><font color="#784747">▓</font><font color="#794747">▓▓</font><font color="#5c1b1b">▓</font><font color="#480000">▓</font><font color="#490000">▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓</font><font color="#632021">▓</font><font color="#d0bdbe">▓▓▓</font><font color="#bda2a1">▓</font><font color="#490000">▓</font><font color="#4f0808">▓</font><font color="#7a4343">▓</font><font color="#753a3a">▓</font><font color="#470000">▓</font><font color="#591313">▓</font><font color="#d1bdbd">▓▓▓▓</font><font color="#763d3d">▓</font><font color="#450000">▓</font><font color="#662c2c">▓</font><font color="#7a4343">▓</font><font color="#581616">▓</font><font color="#480000">▓</font><font color="#a27777">▓</font><font color="#d1bdbd">▓</font><font color="#d1bdbe">▓▓</font><font color="#824949">▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓</font><font color="#490101">▓</font><font color="#4b0505">▓</font><font color="#4a0505">▓▓</font><font color="#4a0404">▓</font><font color="#480000">▓</font><font color="#621e1e">▓</font><font color="#fcfafa">▓</font><font color="#efe7e7">▓</font><font color="#8d6060">▓</font><font color="#895858">▓</font><font color="#4c0505">▓▓▓▓</font><font color="#7c4443">▓</font><font color="#8e6160">▓</font><font color="#d4c6c6">▓</font><font color="#fcfafa">▓</font><font color="#865453">▓</font><font color="#480000">▓</font><font color="#4b0303">▓</font><font color="#4c0505">▓▓▓</font><font color="#4a0202">▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓▓▓▓▓▓▓</font><font color="#550e0e">▓</font><font color="#9f7878">▓</font><font color="#ae8b8b">▓</font><font color="white">▓</font><font color="#f9f5f4">▓</font><font color="#ac8888">▓▓▓▓</font><font color="#e8dbda">▓</font><font color="white">▓</font><font color="#c3a8a9">▓</font><font color="#9d7878">▓</font><font color="#652828">▓</font><font color="#480000">▓▓▓▓▓▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="white">▓</font><font color="#dbc6c6">▓</font><font color="#450000">▓</font><font color="#460000">▓</font><font color="#480000">▓▓▓▓▓▓▓▓▓▓▓</font><font color="#520c0b">▓</font><font color="#875656">▓</font><font color="#966768">▓</font><font color="white">▓▓▓▓</font><font color="#ad8d8c">▓</font><font color="#845656">▓</font><font color="#5d1f1f">▓</font><font color="#450000">▓</font><font color="#470000">▓</font><font color="#480000">▓▓▓▓▓▓</font><font color="#490000">▓▓▓▓▓</font><font color="#b49190">▓</font><font color="white">▓</font><br><font color="#2e2e2e">▓</font><font color="#898484">▓</font><font color="#dfd2d3">▓</font><font color="#bda1a2">▓</font><font color="#470000">▓</font><font color="#480000">▓▓▓▓▓▓▓▓</font><font color="#4a0202">▓</font><font color="#541111">▓</font><font color="#6a2b2b">▓</font><font color="#e0d2d3">▓</font><font color="#e3d6d6">▓</font><font color="#f3eeee">▓▓▓▓</font><font color="#e7dcdc">▓</font><font color="#e0d3d3">▓</font><font color="#865656">▓</font><font color="#521111">▓</font><font color="#4b0606">▓</font><font color="#480000">▓▓▓▓▓</font><font color="#490000">▓▓▓▓</font><font color="#9d7473">▓</font><font color="#dfd2d3">▓</font><font color="#a29b9a">▓</font><font color="#2e2d2d">▓</font><br><font color="black">▓</font><font color="#6f6f6f">▓</font><font color="#e2e2e2">▓</font><font color="#c6b4b5">▓</font><font color="#632829">▓</font><font color="#602020">▓</font><font color="#470000">▓</font><font color="#480000">▓▓▓▓</font><font color="#4c0606">▓</font><font color="#652828">▓</font><font color="#783f3f">▓</font><font color="#ece4e4">▓</font><font color="#ebe3e3">▓</font><font color="#e3d7d7">▓</font><font color="#d9c7c6">▓</font><font color="#5f1c1c">▓</font><font color="#5e1c1c">▓▓</font><font color="#5f1c1c">▓</font><font color="#bf9d9d">▓</font><font color="#e4d7d7">▓</font><font color="#e9e1e0">▓</font><font color="#ece3e3">▓</font><font color="#936868">▓</font><font color="#652929">▓</font><font color="#530f0f">▓</font><font color="#470000">▓</font><font color="#480000">▓▓</font><font color="#490000">▓▓</font><font color="#5a1818">▓</font><font color="#662929">▓</font><font color="#b09392">▓</font><font color="#e2e2e2">▓</font><font color="#8f8f8e">▓</font><font color="black">▓</font><br><font color="black">▓</font><font color="#0b0b0b">▓</font><font color="#191919">▓</font><font color="#3b3939">▓</font><font color="#b8b3b3">▓</font><font color="#b19e9f">▓</font><font color="#774242">▓</font><font color="#713737">▓</font><font color="#480000">▓▓▓</font><font color="#622626">▓</font><font color="#f3efef">▓</font><font color="#f1eae9">▓</font><font color="#d2bebe">▓</font><font color="#c5a8a9">▓</font><font color="#521111">▓</font><font color="#520f0f">▓</font><font color="#490000">▓▓▓</font><font color="#480000">▓</font><font color="#510c0b">▓</font><font color="#551111">▓</font><font color="#a78383">▓</font><font color="#d3bebe">▓</font><font color="#e9e0e0">▓</font><font color="#f3efef">▓</font><font color="#895a5a">▓</font><font color="#450000">▓</font><font color="#480000">▓▓</font><font color="#672928">▓</font><font color="#794242">▓</font><font color="#9f8383">▓</font><font color="#b8b4b3">▓</font><font color="#8b8987">▓</font><font color="#181818">▓</font><font color="#101010">▓</font><font color="black">▓</font><br><font color="black">▓▓▓</font><font color="#010101">▓</font><font color="#030303">▓</font><font color="#2b2a2a">▓</font><font color="#a2a0a1">▓</font><font color="#aea2a2">▓</font><font color="#8e6262">▓</font><font color="#835050">▓</font><font color="#480000">▓</font><font color="#5b1919">▓</font><font color="#ba9f9f">▓</font><font color="#ae8d8d">▓</font><font color="#4a0202">▓▓</font><font color="#490000">▓▓▓▓▓</font><font color="#480000">▓▓▓</font><font color="#4a0102">▓</font><font color="#4a0202">▓</font><font color="#976b6b">▓</font><font color="#ba9f9f">▓</font><font color="#743b3b">▓</font><font color="#470000">▓</font><font color="#743a3b">▓</font><font color="#8f6262">▓</font><font color="#9e8b8a">▓</font><font color="#a2a1a1">▓</font><font color="#403f40">▓</font><font color="#030303">▓</font><font color="#020202">▓</font><font color="black">▓▓▓</font><br><font color="black">▓▓▓▓▓▓▓</font><font color="#353434">▓</font><font color="#9d9c9d">▓</font><font color="#b8b0b0">▓</font><font color="#a78484">▓</font><font color="#a88484">▓▓</font><font color="#9f7575">▓</font><font color="#480000">▓</font><font color="#490000">▓▓▓▓▓▓</font><font color="#480000">▓▓▓</font><font color="#490000">▓</font><font color="#480000">▓</font><font color="#8c5958">▓</font><font color="#a98484">▓▓▓</font><font color="#ad9b9b">▓</font><font color="#9e9e9e">▓</font><font color="#434243">▓</font><font color="black">▓▓▓▓▓▓▓</font><br><font color="black">▓▓▓▓▓▓▓▓▓</font><font color="#353434">▓</font><font color="#6e6d6d">▓▓▓</font><font color="#7f7b7a">▓</font><font color="#c6acad">▓</font><font color="#c6acac">▓▓▓▓▓▓▓▓▓▓▓</font><font color="#9c918f">▓</font><font color="#6e6d6d">▓</font><font color="#6e6d6e">▓</font><font color="#6d6c6d">▓</font><font color="#3d3c3d">▓</font><font color="black">▓▓▓▓▓▓▓▓▓</font><br></pre> -->
        <pre id="logo"><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="nocolor">▓▓</span><br><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><br><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="nocolor">▓▓</span><br><span class="nocolor">▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓</span><br><span class="nocolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓</span><span class="bgcolor">▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="bgcolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓</span><br><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="fgcolor">▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓</span><span class="nocolor">▓▓▓▓▓▓▓▓▓▓▓▓</span></pre>
        <!--<img src="joex-logo.png" style="float: left; zoom: 0.1; padding: 2px;">-->
        <p id="hi"><br>Hi, I'm <b style="color: #C00;">Joe X!</b><br>
        In this minimalistic website I'll be posting my light webapps.<br>
        Also you can check the code on my <a href="https://github.com/joex92" target="_blank" style="color: #AAA;">Github page.</a>(If i haven't forgotten to upload there)</p>
        <p class="clear"><u id="links">Don't forget to follow me on social media for more "webapps"</u>:</p>
        <ul class="clear">
            <li><a href="https://twitch.com/joex92" class="text" target="_blank" style="color: indigo;">&nbsp;Twitch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></li>
            <li><a href="https://youtube.com/c/joex92" class="text" target="_blank" style="color: red;">&nbsp;&nbsp;Youtube&nbsp;&nbsp;&nbsp;&nbsp;</a></li>
            <li><a href="https://twitter.com/joex92" class="text" target="_blank" style="color: cyan;">&nbsp;&nbsp;&nbsp;Twitter&nbsp;&nbsp;&nbsp;</a></li>
            <li><a href="https://facebook.com/joex92" class="text" target="_blank" style="color: blue;">&nbsp;&nbsp;&nbsp;Facebook&nbsp;&nbsp;</a></li>
            <li><a href="https://instagram.com/J03X92" class="text" target="_blank" style="color: darkorchid;">&nbsp;&nbsp;&nbsp;Instagram&nbsp;</a></li>
        </ul>
        <hr>
        <div class="clear">
            <h3>→ <a href="javascript:openWebApp('PerlinMelodica',window.screen.availWidth,window.screen.availHeight)">Perlin Melodica</a> v1.8beta</h3>
            <div id="PerlinMelodica" class="description">
                <div class="dtoggle">▀ ˢʰᵒʷ</div><br>
                This is a Digital Audiovisual Instrument that uses the Perlin algorithm to generate a texture were you can draw on it at a set pace (BPM) and, while drawing, it will generate a note where is being drawn according to the selected root-note and scale. At the same time the drawn color is given by the note that is generated.<br>
                Here's the <a href="http://www.keyboard-layout-editor.com/#/gists/4619eacffc071da0797cb8f9762c0a24" target="_blank">Keyboard Layout</a>:
                <ul>
                    <img src="keyboard-layout.png" style="float: right; max-width: 80%; zoom: 10;">
                    <li>[Q] = C4</li>
                    <li>[2] = C#4</li>
                    <li>[W] = D4</li>
                    <li>[3] = D#4</li>
                    <li>[E] = E4</li>
                    <li>[R] = F4</li>
                    <li>[5] = F#4</li>
                    <li>[T] = G4</li>
                    <li>[6] = G#4</li>
                    <li>[Y] = A4</li>
                    <li>[7] = A#4</li>
                    <li>[U] = B4</li>
                    <li>[A]/[Z] = Minor Scales</li>
                    <li>[S]/[X] = Scales</li>
                    <li>[D]/[C] = Major Scales</li>
                    <li>[←]/[→] = BPM</li>
                    <li>[V]/[F] = Halve/Dup BPM</li>
                    <li>[↑]/[↓] = Volume</li>
                    <li>[Ctrl]+[S] = Save As PNG image</li>
                    <li>[-]/[=] = Zoom</li>
                    <li>[TAB] = Switch Algorithms</li>
                    <li>[`] = Generate a new texture</li>
                    <li>[ESC] = Toggle controls</li>
                    <li>[BACKSPACE] = Hide Texture</li>
                </ul>
            </div>
            <hr>
            <h3>→ <a href="javascript:openWebApp('avatarmiccam',256,256)">Avatar Mic-Cam</a> v1.0</h3>
            <div id="AvatarMicCam" class="description">
                <div class="dtoggle">▀ ˢʰᵒʷ</div><br>
                This is a little <i>"webapp"</i> I made for using when, livestreaming, you don't want to use (or don't have) a webcam.<br>
                Anyways, it's easy to use. Just start by clicking <a href="javascript:openWebApp('avatarmiccam',256,256)">here</a> (or the app's name), give it permission to use the microphone and click the image to start (don't  worry, you can change the image) and change the background color for the chroma key.<br>
                Then you go to your streaming app, add the pop-up window as a Window Capture, crop it and voilá! you have your avatar, for your livestream, reacting to your microphone.<br><br>
                Controls:
                <ul>
                    <li>[F1] = Debugging</li>
                    <li>(single click the image) = Start!</li>
                    <li>[Ctrl]+[O] | (Double click the image) = Change image's link</li>
                    <li>[↑]/[↓] = Increase/Decrease Avatar's Size</li>
                    <li>[←]/[→] = Increase/Decrease Mic Treshold</li>
                    <li><font style="color: #F00;">[R] = Red background</font></li>
                    <li><font style="color: #0F0;">[G] = Green background</font></li>
                    <li><font style="color: #00F;">[B] = Blue background</font></li>
                    <li><font style="color: #0FF;">[C] = Cyan background</font></li>
                    <li><font style="color: #F0F;">[M] = Magenta background</font></li>
                    <li><font style="color: #FF0;">[Y] = Yellow background</font></li>
                    <li><font style="color: #777;">[K] | [0] = blacK background</font></li>
                    <li><font style="color: #FFF;">[W] | [1] = White background</font></li>
                </ul>
            </div>
            <hr>
            <h3>→ <a href="javascript:openWebApp('https://www.proyectohomes.com',window.screen.availWidth,window.screen.availHeight)">Proyecto HOMeS</a> (Spanish)</h3>
            <div id="HOMeS" class="description">
                <div class="dtoggle">▀ ˢʰᵒʷ</div><br>
                <i class="commission">This was a commission</i><br>The webpage is a virtual performance about the political situation of Beirut and the migration of many of Beirut citizens to Ecuador.<br>
                Going through the page you'll see information about the issue (in Spanish) and the artist's performance.
            </div>
            <hr>
            <h3>→ <a href="javascript:openWebApp('https://laemece.com',window.screen.availWidth,window.screen.availHeight)">laemece.com</a> (Spanish)</h3>
            <div id="laemece" class="description">
                <div class="dtoggle">▀ ˢʰᵒʷ</div><br>
                <i class="commission">This was a commission</i><br>This is the main page of the Ecuadorian band <a href="https://instagram.com/lamaquinacamaleon"><i>La Máquina Camaleón</i></a>. It was created as a way to <i>pre-release</i> their last single <b>MARI4</b> (2021/07/23).<br>
                The goal of the game is to find all the stems of the new single scattered through a beach, and when you get all the stems, you'll get to download the single.<br>
                All platform should be supported. if you find anything like a bug or error, please leave a comment here or a comment or DM on <a href="#links">my socials</a>.
            </div>
        </div>
        <hr>
        <div id="fb-comments"><div class="fb-comments" data-href="https://joex.apps.dj/" data-width="100%" data-numposts="5" data-order-by="time" data-colorscheme="dark" style="background-color: rgba(255, 255, 255, 0.255);"></div></div>
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
            
            if($ipstack->success==""){
                $ipstack->location->country_flag = str_replace("http:","https:",$ipstack->location->country_flag);
                if ($result = $con->query("SELECT `{$ipstack->location->geoname_id}` FROM counter")) {
                    /* fetch object array */
                    while ($row = $result->fetch_row()) {
                        printf ("<br>&nbsp;%s, %s, %s = %s&nbsp;\n", $ipstack->city, $ipstack->region_name, $ipstack->country_code, $row[0]);
                    }
                    /* free result set */
                    $result->close();
                }
            }
            mysqli_close($con);
        ?></div>
    </body>
</html>