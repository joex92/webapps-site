<html>
	<head>
		<title>Stream Chat to Text-To-Speech</title>
		<script src="//unpkg.com/twitch-js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.3/socket.io.js" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.finger/0.1.6/jquery.finger.min.js" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js" crossorigin="anonymous"></script>
		<link href="https://ehynds.github.io/jquery-ui-multiselect-widget/css/jquery.multiselect.css" rel="stylesheet" crossorigin="anonymous"/>
		<script src="https://ehynds.github.io/jquery-ui-multiselect-widget/js/widget.min.js" crossorigin="anonymous"></script>
		<script>debugging = <?
			if ( isset($_GET['debug']) ){
				echo 'true';
			} else {
				echo 'false';
			}
		?>;</script>
		<link rel="stylesheet" href="style.css">
	</head>
	<body>
		<div id='header' class='noselect'>
			<h2>&nbsp;Stream Chat to Text-To-Speech [beta 1.5]&nbsp;</h2>
			<form>
				&nbsp;<select id='service' name="service" value='ttv' multiple class='multiselect' hidden>
					<option value='ttv' selected>&nbsp;Twitch</option>
					<!-- <option value='ytl'>&nbsp;Youtube</option> -->
					<!-- <option value='fbl'>&nbsp;FB Live</option> -->
				</select>&nbsp;<input type='text' id='channel' name="channel" placeholder=' channel1,channel2,...(etc) '>&nbsp;<input type="submit">&nbsp;<br>
				&nbsp;Max chats:&nbsp;<input type="number" id="maxHistory" name="maxHistory" min="15" value='100'>&nbsp;<input type="checkbox" id="fitchat">&nbsp;Fit Chat&nbsp;<input type="checkbox" id="autoscroll" checked>&nbsp;Autoscroll&nbsp;&nbsp;<input type="checkbox" id="tts">&nbsp;Enable TTS&nbsp;<br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id='bauth' type="button" value='&nbsp;Login on Twitch for private Events&nbsp;' ><br>
			</form><br>
			<fieldset id='ttscontrols' class='noselect' hidden>
				&nbsp;<input type="button" id='pause' value='Pause' >&nbsp;&nbsp;&nbsp;<select id='voices' name='voice' >
					<optgroup label="Local Voices" id='localV'></optgroup>
					<optgroup label="Online Voices" id='onlineV'></optgroup>
				</select><br>
				&nbsp;<input type="button" id='cancel' value='Stop' >&nbsp;&nbsp;&nbsp;<select data-placeholder=' Choose events ' multiple class='multiselect' id='events' style='margin:0;padding:0;' hidden >
					<option value="CHEER" selected >&nbsp;Bits&nbsp;</option>
					<option value="CLEARCHAT">&nbsp;Chat Cleared&nbsp;</option>
					<option value="CLEARMSG">&nbsp;Message Deleted&nbsp;</option>
					<option value="GLOBALUSERSTATE">&nbsp;Authenticated&nbsp;</option>
					<option value="JOIN" >&nbsp;Joined Channel&nbsp;</option>
					<option value="NOTICE" selected>&nbsp;Channel Action&nbsp;</option>
					<option value="PART">&nbsp;Left Channel&nbsp;</option>
					<option value="PRIVMSG">&nbsp;User Message&nbsp;</option>
					<option value="ROOMSTATE">&nbsp;Channel Changed&nbsp;</option>
					<option value="USERNOTICE" selected>&nbsp;User Action&nbsp;</option>
					<option value="USERSTATE">&nbsp;Broadcast Sent&nbsp;</option>
					<option value="WHISPER">&nbsp;Whisper&nbsp;</option>
				</select>&nbsp;<select data-placeholder=' Choose Event Filters ' multiple class='multiselect' id='eventsFilter' style='margin:0;padding:0;' hidden >
					<optgroup label="User Actions" id='USERNOTICE'>
					  <option value="sub">&nbsp;Subscriptions&nbsp;</option>
					  <option value="resub">&nbsp;Re-Subscriptions&nbsp;</option>
					  <option value="subgift">&nbsp;Subscription Gifts&nbsp;</option>
					  <option value="submysterygift">&nbsp;Subscription Mistery Gift&nbsp;</option>
					  <option value="giftpaidupgrade">&nbsp;Gift&nbsp;</option>
					  <option value="rewardgift">&nbsp;Reward Gifts&nbsp;</option>
					  <option value="anongiftpaidupgrade">&nbsp;Anonymous Gift&nbsp;</option>
					  <option value="standardpayforward">&nbsp;Sub Gifts&nbsp;</option>
					  <option value="communitypayforward">&nbsp;Random Sub Gift&nbsp;</option>
					  <option value="raid">&nbsp;Raids&nbsp;</option>
					  <option value="unraid">&nbsp;Un-Raids&nbsp;</option>
					  <option value="ritual">&nbsp;Rituals&nbsp;</option>
					  <option value="bitsbadgetier">&nbsp;Bit Tiers&nbsp;</option>
					</optgroup>
					<optgroup label="User Messages" id='PRIVMSG'>
					  <option value="announcement">&nbsp;Announcements&nbsp;</option>
					  <option value="highlighted-message">&nbsp;Highlights&nbsp;</option>
					</optgroup>
					<optgroup label="Channel Messages" id='NOTICE'>
					  <option value="autohost_receive">&nbsp;Auto Hosts&nbsp;</option>
					  <option value="host_receive">&nbsp;Hosts&nbsp;</option>
					  <option value="host_receive_no_count">&nbsp;Hosts (No count)&nbsp;</option>
					</optgroup>
					<optgroup label="User Types" id='userType'>
					  <option value="" selected>&nbsp;Normal User&nbsp;</option>
					  <option value="admin">&nbsp;Twitch Administrator&nbsp;</option>
					  <option value="moderator">&nbsp;Global Moderator&nbsp;</option>
					  <option value="staff">&nbsp;Twitch employee&nbsp;</option>
					</optgroup>
					<optgroup label="Badges" id='badges'>
					  <option value="admin">&nbsp;Administrators&nbsp;</option>
					  <option value="bits">&nbsp;Bits > 0&nbsp;</option>
					  <option value="broadcaster">&nbsp;Broadcaster&nbsp;</option>
					  <option value="moderator">&nbsp;Mods&nbsp;</option>
					  <option value="premium">&nbsp;Premium&nbsp;</option>
					  <option value="subscriber">&nbsp;Subscribers&nbsp;</option>
					  <option value="staff">&nbsp;Staff&nbsp;</option>
					  <option value="turbo">&nbsp;Turbo&nbsp;</option>
					</optgroup>
				</select><br>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="queue" name='queue'>&nbsp;Don't queue while speaking&nbsp;<br>
				&nbsp;Volume:&nbsp;&nbsp;&nbsp;&nbsp;<input type="range" id="vol" name="volume" min="0" max="1" value='1' step=0.01 ><label id='lvol' >1</label><br>
				&nbsp;Speed:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="range" id="spd" name="rate" min="0.1" max="10" value='1' step=0.1 ><label id='lspd' >1</label><br>
				&nbsp;Pitch:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="range" id="pitch" name="pitch" min="0" max="2" value='1' step=0.02 ><label id='lpitch' >1</label>
			</fieldset>
		</div>
		<div id='chat'></div>
		<div id='footer' hidden>
			<input type='text' id='broadcast' placeholder=' Send message to all channels ' >
			<input type="button" id='sendbc' value='/\' >
		</div>
		<script src="main.js"></script>
	</body>
</html>