<html>
  <head>
		<title>JoeX's TTS</title>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.finger/0.1.6/jquery.finger.min.js" crossorigin="anonymous"></script>
		<!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/vader/theme.min.css" crossorigin="anonymous"/> -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/vader/jquery-ui.min.css" crossorigin="anonymous"/>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js" crossorigin="anonymous"></script>
		<link href="../libraries/jquery-ui-multiselect-widget/css/jquery.multiselect.css" rel="stylesheet" crossorigin="anonymous"/>
		<link href="../libraries/jquery-ui-multiselect-widget/css/jquery.multiselect.filter.css" rel="stylesheet" crossorigin="anonymous"/>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-multiselect-widget/3.0.1/jquery.multiselect.min.js" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ui-multiselect-widget/3.0.1/jquery.multiselect.filter.min.js" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="style.css">
  </head>
  <body>
		<form id="app" class='noselect' >
			<br>
			<span class='col'>&nbsp;&nbsp;<select class='fitflex' id='voice' name='voice' ></select>&nbsp;&nbsp;<select data-placeholder=' Filter by Languages ' multiple class='multiselect' id='lang' hidden></select>&nbsp;&nbsp;</span>
			<br>
			<span class='col fitflex' style='flex-grow: 1;'>&nbsp;&nbsp;<textarea id='text' name="text" placeholder=' [Text to Speech Text here]'></textarea>&nbsp;&nbsp;</span>
			<br>
			<span class='col'>&nbsp;&nbsp;Volume:&nbsp;<input class='controls' type="range" id="volume" name="volume" min="0" max="1" value='1' step=0.01 >&nbsp;<label id='lvolume' >1.00</label>&nbsp;&nbsp;</span>
			<br>
			<span class='col'>&nbsp;&nbsp;Speed:&nbsp;&nbsp;<input class='controls' type="range" id="rate" name="rate" min="0.1" max="10" value='1' step=0.1 >&nbsp;<label id='lrate' >1.00</label>&nbsp;&nbsp;</span>
			<br>
			<span class='col'>&nbsp;&nbsp;Pitch:&nbsp;&nbsp;<input class='controls' type="range" id="pitch" name="pitch" min="0" max="2" value='1' step=0.02 >&nbsp;<label id='lpitch' >1.00</label>&nbsp;&nbsp;</span>
			<br>
			<span class='col'>&nbsp;&nbsp;<input type='button' id='speak' name='speak' value=' Speak! '><span id='toast'></span><input id='share' type='submit' value=' Share ' >&nbsp;&nbsp;</span>
			<br>
		</form>
    <script src="app.js"></script>
  </body>
</html>		