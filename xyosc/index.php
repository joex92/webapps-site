<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>XY Oscilloscope</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.finger/0.1.6/jquery.finger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/two.js/0.8.10/two.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.42/Tone.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/webmidi@latest/dist/iife/webmidi.iife.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Colors.js/1.2.4/colors.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/expr-eval/2.0.2/bundle.min.js"></script>
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <input type="text" value="θ" id='clipboard'>
    <div id='Oscilloscope'></div>
    <div id='controls'>
      <input id='button' type="button" value='Start' bgcolor='red' />
      <select id='templates' name="Templates" style='background: #0000ff69;' ></select>
      <br />
      <input id='midi' type="button" value='Synth' bgcolor='red' />
      <select id='mdevices' name="Midi Devices" style='background: #0000ff69;' ></select>
      <br />
      <fieldset id='fradio'>
      &nbsp;
        <input type="radio" name="formula" value="p" checked />
        <label for="parametric">Parametric</label>
        <input type="radio" name="formula" value="c" />
        <label for="cartesian">Cartesian</label><br />
        <input id='theta' type="button" value='θ' style='background: #ffff0069;' /><label id='filabelt' for="finput0">=</label>
        <input id='finputt' type="text" autocapitalize="off" placeholder=' θ(t)' value='t' /><br />
        <label id='filabel0' for="finput0">&nbsp;r =</label>
        <input id='finput0' type="text" autocapitalize="off" placeholder=' r(θ)' value='0' /><br />
        <label id='filabel1' for="finput1" style='opacity: 0; pointer-events: none;'>&nbsp;y =</label>
        <input id='finput1' type="text" autocapitalize="off" placeholder=' y(θ)' value='(0) * sin(θ)' style='opacity: 0; pointer-events: none;' /><br />
      </fieldset>
      <input id='mic' type="button" value='Mic' />
      <input type="range" id="micvol" name="Mic Volume" min="0" max="1.5" value='1' step=0.01 hidden>
      <input id='micmute' type="button" value='Mute' style='background: #00ff0069;' hidden />
      <br />
      <label for="finput0">&nbsp;Static Variables: m(midi), f(frequency),<br />&nbsp;Dynamic Variables: i[0,1024], u[0,1], v[-1,1], t[PI/4,9PI/4]&nbsp;</label><br />
      <center>
      <label for="frequency">Frequency:</label>
      <input type="range" id="freq" name="frequency" min="-101" max="139" value='69' step=1>
      <label for="volume">Volume:</label>
      <input type="range" id="vol" name="volume" min="0" max="1.5" value='1' step=0.01>
      <input id='mute' type="button" value='Mute' />
      </center>
    </div>
    <div id='debug'></div>
    <script src="main.js"></script>
  </body>

</html>
