// Provide your token, username and channel. You can generate a token here:
// https://twitchtokengenerator.com

const { Chat } = window.TwitchJs, 
  ClientID = 'e5oxica32mzuttvzgkiib3wos2v0gu', 
  TScopes = [ // https://dev.twitch.tv/docs/authentication/scopes#twitch-access-token-scopes
    'analytics:read:extensions', 
    'analytics:read:games', 
    'bits:read', 
    // 'channel:edit:commercial', 
    // 'channel:manage:broadcast', 
    'channel:read:charity', 
    // 'channel:manage:extensions', 
    // 'channel:manage:moderators', 
    // 'channel:manage:polls', 
    // 'channel:manage:predictions', 
    // 'channel:manage:raids', 
    // 'channel:manage:redemptions', 
    // 'channel:manage:schedule', 
    // 'channel:manage:videos', 
    'channel:read:editors', 
    'channel:read:goals', 
    'channel:read:hype_train', 
    'channel:read:polls', 
    'channel:read:predictions', 
    'channel:read:redemptions', 
    // 'channel:read:stream_key', 
    'channel:read:subscriptions', 
    'channel:read:vips', 
    // 'channel:manage:vips', 
    // 'clips:edit', 
    'moderation:read', 
    // 'moderator:manage:announcements', 
    // 'moderator:manage:automod', 
    'moderator:read:automod_settings', 
    // 'moderator:manage:automod_settings', 
    // 'moderator:manage:banned_users', 
    'moderator:read:blocked_terms', 
    // 'moderator:manage:blocked_terms', 
    // 'moderator:manage:chat_messages', 
    'moderator:read:chat_settings', 
    // 'moderator:manage:chat_settings', 
    // 'user:edit', 
    // 'user:edit:follows', 
    // 'user:manage:blocked_users', 
    'user:read:blocked_users', 
    'user:read:broadcast', 
    // 'user:manage:chat_color', 
    'user:read:email', 
    'user:read:follows', 
    'user:read:subscriptions', 
    'user:manage:whispers', 
    // 'channel:moderate', 
    'chat:edit', 
    'chat:read', 
    'whispers:read', 
    'whispers:edit'
  ], 
  AuthURL = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${ClientID}&scope=${TScopes.join('+')}&redirect_uri=${location.origin+location.pathname}`;
let clientid = undefined,
  tchat,
  recCount = 0,
  maxReconnects = 5,
  encToken,
  args = window.location.search.substr(1).split('&'),
  hash = window.location.hash.substr(1).split('&'),
  chinput = $('#channel')[0],
  ttscb = $('#tts')[0],
  vsel = $('#voices')[0],
  vvol = $('#vol')[0],
  vspd = $('#spd')[0],
  vpitch = $('#pitch')[0],
  voices, tts, ttsenabled = false,
  username = undefined,
  channel = [],
  enabledEvents = ['CHEERS'],
  evFilters = [],
  ignoredUsers = ['streamelements','nightbot','moobot'],
  humanUsers = ['joex92'],
  ircev = [], msgs = [], shiftedMsgs = [],
  nmsgs = 0, prevmsg= '',
  whileSpeaking = true,
  autoscroll = true,
  fitchat = false,
  maxMsg = 100,
  bcmsgs = [], bcmsgi = 0,
  bcmsg = $('#broadcast')[0],
  bcbtn = $('#sendbc')[0],
  chat = $('#chat')[0],
  mouse = new MouseEvent({});
  
function newPopup(url,w=400,h=600) {
  popupWindow = window.open(url,url.split('://')[1],`width=${w},height=${h},left=${mouse.screenX},top=${mouse.screenY},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=yes`)
}

function setCookie(name,value,days=30) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getVoice() {
  for ( i = 0; i < vsel.length; i++){
      if ( vsel[i].innerHTML == getCookie('voice') ) {
          vsel.selectedIndex = i;
          vsel.value = i.toString();
          return;
      }
  }
}

function getVoices(){
  vsel.innerHTML = `<optgroup label="Local Voices" id='localV'></optgroup><optgroup label="Online Voices" id='onlineV'></optgroup>`;
  voices = speechSynthesis.getVoices();
  voices.forEach((v,i,a) => {
    op = '';
    if ( v.default ) op = `<option value="${i}" selected>[${v.lang}] ${v.name}</option>`;
    else op = `<option value="${i}">[${v.lang}] ${v.name}</option>`;
    if ( v.localService ) $('#localV')[0].innerHTML += op;
    else $('#onlineV')[0].innerHTML += op;
  });
  $('#localV')[0].label += ` (${$('#localV')[0].getElementsByTagName('option').length})`;
  $('#onlineV')[0].label += ` (${$('#onlineV')[0].getElementsByTagName('option').length})`;
  getVoice();
}

function reload() {
  window.location.href = location.origin+location.pathname+window.location.search;
}

function logout() {
  eraseCookie('login');
  eraseCookie('token');
  reload();
}

const twitch = async () => {
  let token = undefined;
  if ( hash.length > 0 && (hash.findIndex(e => e.search('token=') > -1)) > -1 ) {
    fetch(
      'https://api.twitch.tv/helix/users',
      {
        "headers": {
          "Client-ID": ClientID,
          "Authorization": "Bearer " + (hash[hash.findIndex((e,i,a) => e.search('token') > -1)].split('=')[1]) 
        }
      }
    ).then( r => {return r.json();} ).then((r) => {
      username = r.data[0].login;
      token = (hash[hash.findIndex((e,i,a) => e.search('token') > -1)].split('=')[1]);
      setCookie('login', username);
      setCookie('token', CryptoJS.AES.encrypt(token,username).toString());
      reload();
      if (debugging) console.log(username,token);
    }).catch((err) => {
      if (debugging) console.error(err);
      alert("Couldn't fetch username, try again.");
    });
  } else if ( encToken && username ) {
    let t = (CryptoJS.AES.decrypt(encToken, username).toString().match(/.{1,2}/g));
    if (debugging) console.log(Array.isArray(t),encToken,username);
    if ( Array.isArray(t) ) {
      t.forEach((v,i,a) => { a[i] = (String.fromCharCode(parseInt(v,16)))});
        token = t.join('');
      if (debugging) console.log(t.join(''));
    }
  }
  if (debugging) console.log(username,clientid,token);
  
  let topt = {}
  if ( username && token ) {
    topt = {
      username: username,
      clientid: clientid,
      token: token,
      log: { level: "warn" }
    }
  }
  
  tchat = new Chat(topt);
  // $('#events_ms')[0].hidden = true;
  
  updateHistory = () => {
    while ( msgs.length < maxMsg && shiftedMsgs.length > 0 ){
      msgs.unshift(shiftedMsgs.pop());
    }
    while ( msgs.length > maxMsg ){
      shiftedMsgs.push(msgs.shift());
    }
    chat.innerHTML = msgs.join('\n');
  };
  
  let onevent = (irc) => {
    if (debugging) console.log(irc);
    ircev.push(irc);
    nmsgs = ircev.length;
    irc.id = nmsgs;
    const time = irc.timestamp.toString();
    const event = irc.command + ' / ' + irc.event;
    let username = irc.username;
    if ( irc.username && irc.username.match(/^([_]|[0-9]|[a-z])+([_0-9a-z]+)$/i) ) {
      username = `<a href="JavaScript:newPopup('https://twitch.tv/${irc.username}')" style="color: ${irc.tags.color}">@${irc.tags.displayName || irc.username}</a>`;
    }
    let channel = irc.channel;
    if ( irc.channel && irc.channel[0] == '#' ) {
      channel = `<a href="JavaScript:newPopup('https://www.twitch.tv/popout/${irc.channel.replace('#','')}/chat?popout=')">${irc.channel}</a>`;
    }
    let msg = irc.message || "";
    if (irc.tags.systemMsg) msg = irc.tags.systemMsg.replace(irc.username,'');
    switch (event.split(' / ')[1]) {
      case 'USER_BANNED':
        msg = `has been banned from ${channel} chat`;
        break;
      case 'JOIN':
        msg = `joined ${channel} chat`;
        break;
      case 'PART':
        msg = `left ${channel} chat`;
        break;
      case 'USERSTATE':
        msg = bcmsgs[bcmsgs.length-1] || '';
        break;
      case 'SUBSCRIPTION':
        msg = `just subscribed ${irc.tags.msgParamSubPlan} for ${irc.tags.msgParamCumulativeMonths} month(s)`;
        break;
      case 'CHEER':
        msg = `has donated ${irc.tags.bits} bits: ${irc.message.replace(/(Cheer|anon)(\d+)/g,'')}`;
        break;
      default:
        break;
    }
  
    const speakMsg = (irc,username,msg) => {
      if (debugging) console.log('tts',ttsenabled, (enabledEvents.findIndex(e => ( e == irc.event || e == irc.command ) ) > -1) && !(ignoredUsers.findIndex(e => e == username) > -1));
      if ( /* (enabledEvents.findIndex(e => ( e == irc.event || e == irc.command ) ) > -1) && */ (ignoredUsers.findIndex(e => e == irc.username) < 0) ) {
        tts = new SpeechSynthesisUtterance();
        tts.index = irc.id;
        tts.cssIndex = document.styleSheets[0].cssRules.length;
        tts.voice = voices[vsel.selectedIndex]; 
        tts.volume = vvol.value; // From 0 to 1
        tts.rate = vspd.value; // From 0.1 to 10
        tts.pitch = vpitch.value; // From 0 to 2
        tts.lang = voices[vsel.selectedIndex].lang;
        if (debugging) console.log(prevmsg.split(': ')[0] == username);
        if ( prevmsg.split(': ')[0] == '@' + irc.username ) {
          tts.text = msg;
        } else {
          tts.text = irc.username + ': ' + msg;
        }
        if ( irc.command == 'JOIN' ) tts.text = '';
        if ( irc.command == 'PART' ) tts.text = '';
        if ( irc.command == 'USERSTATE' ) tts.text = '';
        tts.onstart = (e) => {
          if (debugging) console.log(e);
          document.styleSheets[0].cssRules[e.target.cssIndex].style.background = `#ffff0069`;
        } 
        tts.onend = (e) => {
          if (debugging) console.log(e);
          document.styleSheets[0].cssRules[e.target.cssIndex].style.background = `#00ff0069`;
          if (!ttsenabled) speechSynthesis.cancel();
        }
        if ( whileSpeaking ) {
          document.styleSheets[0].insertRule(`#message${tts.index} {background: #ff000069 }`,tts.cssIndex);
          speechSynthesis.speak(tts);
          prevmsg = username + ': ' + msg;
        } else {
          if ( !speechSynthesis.speaking ) {
            document.styleSheets[0].insertRule(`#message${tts.index} {background: #ff000069 }`,tts.cssIndex);
            speechSynthesis.speak(tts);
            prevmsg = username + ': ' + msg;
          }
        }
        if (debugging) console.log('tts',speechSynthesis.speaking,prevmsg,msg);
      }
    };
    
    const checkFilter = (irc,username,msg) => {
      if (ttsenabled) {
        if (debugging) console.log(Object.keys(evFilters).length);
        if ( Object.keys(evFilters).length > 0 ) {
          let filters = 0;
          for ( id of Object.keys(evFilters) ) {
            if (enabledEvents.findIndex(e => ( e == irc.event || e == irc.command ) ) > -1) {
              if ( (id == irc.event || id == irc.command) ) {
                if ( evFilters[id].findIndex(v => ( irc.tags.msgId != undefined ) && ( v == irc.tags.msgId )) > -1 ) filters++;
              } else {
                if ( evFilters[id].findIndex(v => ( irc.tags[id] != undefined ) && ( v == irc.tags[id] || Object.keys(irc.tags[id]).findIndex(b => b == v ) > -1 ) ) > -1 ) filters++;
              }
            }
          }
          if ( filters > 0 /* == vsel.selectedOptions.length */ ) speakMsg(irc,username,msg);
        } else {
          if (debugging) console.log(irc,username,msg);
          // speakMsg(irc,username,msg);
        };
      };
    }
    
    const updateChat = () => {
      msgs.push(
        `<span id='time${nmsgs}' class='time'>&nbsp;${time}&nbsp;</span>
        <span id='event${nmsgs}' class='event'><strong>&nbsp;${event}&nbsp;</strong></span>
        <span id='channel${nmsgs}' class='channel'>&nbsp;[${channel}]&nbsp;</span>
        <span id='message${nmsgs}' class='message'>&nbsp;${username}: ${msg}&nbsp;</span><br />`
      );
      chat.innerHTML += msgs[msgs.length-1];
      if (autoscroll) chat.scrollTo(chat.getElementsByTagName('span')[chat.getElementsByTagName('span').length-2].offsetLeft,chat.scrollHeight);
      if (fitchat) {
        while ( $('#chat')[0].scrollHeight / (innerHeight - $('#header')[0].offsetHeight) > 1 ) {
          maxMsg--;
          $('#maxHistory')[0].value = maxMsg.toString();
          updateHistory();
        }
        while ( ($('#chat')[0].scrollHeight / (innerHeight - $('#header')[0].offsetHeight) ) < 1 && maxMsg < nmsgs ) {
          maxMsg++;
          $('#maxHistory')[0].value = maxMsg.toString();
          updateHistory();
        }
      }
      updateHistory();
      checkFilter(irc,username,msg);
    }
    if ( irc.tags.userId && (ignoredUsers.findIndex(e => e == irc.username) < 0) && (humanUsers.findIndex(e => e == irc.username)) < 0 ) {
      botreq = $.ajax( {url: "https://api.twitchbots.info/v2/bot/" + irc.tags.userId, dataType: 'json'});
      botreq.then(( data, textStatus, jqXHR ) => {
        if ( (ignoredUsers.findIndex(e => e == data.username)) < 0 ) ignoredUsers.push(data.username);
        if (debugging) console.log(data, textStatus, jqXHR, ignoredUsers);
      }, ( jqXHR, textStatus, errorThrown ) => {
        if ( (humanUsers.findIndex(e => e == irc.username)) < 0 ) humanUsers.push(irc.username);
        if (debugging) console.error(jqXHR, textStatus, errorThrown);
      }).then(()=>{
        updateChat();
      });
    } else {
      updateChat();
    }
    if (debugging) console.log(tchat._isAuthenticated,irc);
  }
  
  tchat.on("*", onevent);

  // Conenct to twitch
  await tchat.connect().then((c) => {
    if (debugging) console.log('Connection',tchat._isAuthenticated,tchat,c);
    if ( tchat._isAuthenticated ) {
      setCookie('login', username);
      setCookie('token', CryptoJS.AES.encrypt(token,username).toString());
      if ( ( chinput.value = getCookie('channel') ) == null || ( chinput.value = getCookie('channel') ) == '' ) setCookie('channel', username);
      $('#events')[0].hidden = false;
      $('#footer')[0].hidden = false;
      bcbtn.onclick = (e) => {
        if (debugging) console.log(e);
        if ( bcmsgs[bcmsgs.length-1] != bcmsg.value ) tchat.broadcast(bcmsg.value);
        bcmsg.value = '';
      };
      bcmsg.onkeydown = (e) => {
        if ( e.key == "Enter" ) {
          if (debugging) console.log(bcmsgs, e.srcElement.value);
          if ( bcmsgs[bcmsgs.length-1] != e.srcElement.value ) {
            bcmsgs.push(e.srcElement.value);
            tchat.broadcast(bcmsgs[bcmsgs.length-1]);
            bcmsgi = bcmsgs.length-1;
          };
        } else if ( e.key == "ArrowUp" ) {
          if (debugging) console.log(bcmsgi);
          bcmsgi = ( ( bcmsgi + bcmsgs.length - 1 ) % ( bcmsgs.length ) );
          if (debugging) console.log(bcmsgi);
          if ( bcmsgi < bcmsgs.length ) e.srcElement.value = bcmsgs[bcmsgi];
          else e.srcElement.value = '';
        } else if ( e.key == "ArrowDown" ) {
          if (debugging) console.log(bcmsgi);
          bcmsgi = ( bcmsgi + 1 ) % ( bcmsgs.length + 1 );
          if (debugging) console.log(bcmsgi);
          if ( bcmsgi < bcmsgs.length ) e.srcElement.value = bcmsgs[bcmsgi];
          else e.srcElement.value = '';
        }
      }
      bcmsg.onkeyup = (e) => {
        if ( e.key == "Enter" ) e.srcElement.value = '';
      }
      $('#bauth')[0].value = ` Log out (${username}) `;
      $('#bauth')[0].onclick = (e) => {
        logout();
      };
      // $('#events_ms')[0].hidden = false;
    };
  }).catch((err) => {
    if (debugging) console.error(err);
    // if ( recCount <= maxReconnects ){
      // recCount++;
      // console.log(`Reconnecting... ${recCount}/${maxReconnects}`)
      // tchat.connect();
    // } else {
      // if ( token ){
        alert("Couldn't login");
      // }
      logout();
    // }
  });
  
  // Join channel(s)
  if ( args.length > 0 && (args.findIndex(e => e.search('channel=') > -1) > -1) ) {
    chinput.value = decodeURIComponent(args[args.findIndex((e,i,a) => e.search('channel') > -1)].split('=')[1]);
    channel = chinput.value.split(',');
    setCookie('channel', chinput.value)
    for ( ch of channel ) await tchat.join(ch);
  } else if ( chinput.value = getCookie('channel') ) {
    if (debugging) console.log(chinput.value);
    channel = chinput.value.split(',');
    for ( ch of channel ) await tchat.join(ch);
  }
};
function disconnectAll() {
  if (tchat && tchat._readyState == 3) {
    tchat.disconnect();
  }
}
window.onload = (e) => {
  window.addEventListener('mousemove',(e)=>{
    if (debugging) console.log('MouseEvent',e);
    mouse = e;
    $(':root')[0].style.setProperty('--mousex', mouse.screenX);
    $(':root')[0].style.setProperty('--mousey', mouse.screenY);
  });
  window.addEventListener('resize', (e)=>{
    $(':root')[0].style.setProperty('--100w', innerWidth);
    $(':root')[0].style.setProperty('--100h', innerHeight);
  });
  $(':root')[0].style.setProperty('--100w', innerWidth);
  $(':root')[0].style.setProperty('--100h', innerHeight);
  if ( 'speechSynthesis' in window ) {
    window.speechSynthesis.onvoiceschanged = (e) => {
      getVoices();
      getVoice();
      tts = new SpeechSynthesisUtterance();
      vvol.onchange = (e) => {
        if (debugging) console.log(e);
        tts.volume = e.target.value;
        $('#lvol')[0].innerHTML = Math.round(tts.volume*100)/100;
      };
      vvol.addEventListener('mousemove',vvol.onchange)
      vvol.addEventListener('touchmove',vvol.onchange)
      vspd.onchange = (e) => {
        if (debugging) console.log(e);
        tts.rate = e.target.value;
        $('#lspd')[0].innerHTML = Math.round(tts.rate*100)/100;
      };
      vspd.addEventListener('mousemove',vspd.onchange)
      vspd.addEventListener('touchmove',vspd.onchange)
      vpitch.onchange = (e) => {
        if (debugging) console.log(e);
        tts.pitch = e.target.value;
        $('#lpitch')[0].innerHTML = Math.round(tts.pitch*100)/100;
      };
      vpitch.addEventListener('mousemove',vpitch.onchange);
      vpitch.addEventListener('touchmove',vpitch.onchange);
      $("#vol").on("dblclick", (e) => {
        if (debugging) console.log(e);
        tts.volume = 1;
        vvol.value = tts.volume;
        $('#lvol')[0].innerHTML = Math.round(tts.volume*100)/100;
      });
      $("#spd").on("dblclick", (e) => {
        if (debugging) console.log(e);
        tts.rate = 1;
        vspd.value = tts.rate;
        $('#lspd')[0].innerHTML = Math.round(tts.rate*100)/100;
      });
      $("#pitch").on("dblclick", (e) => {
        if (debugging) console.log(e);
        tts.pitch = 1;
        vpitch.value = tts.pitch;
        $('#lpitch')[0].innerHTML = Math.round(tts.pitch*100)/100;
      });
      $('#cancel').on('click', (e) => {
        speechSynthesis.cancel();
        // setTimeout(() => { speechSynthesis.speak(tts); }, 250);
      });
      $('#pause').on('click', (e) => {
        if ( speechSynthesis.paused == speechSynthesis.speaking ){
          speechSynthesis.resume();
          e.target.value = 'Pause'
        } else {
          speechSynthesis.pause();
          e.target.value = 'Resume'
        }
      });
      vsel.onchange = (e) => {
        if (debugging) console.log(e);
        setCookie('voice',vsel.selectedOptions[0].innerHTML);
        tts.voice = voices[vsel.selectedIndex]; 
        tts.volume = vvol.value; // From 0 to 1
        tts.rate = vspd.value; // From 0.1 to 10
        tts.pitch = vpitch.value; // From 0 to 2
        tts.lang = voices[vsel.selectedIndex].lang;
      };
    };
  } else {
    // Speech Synthesis Not Supported 😣
    ttscb.style['pointer-events'] = 'none';
    alert("Sorry, your browser doesn't support text to speech!");
  }
  $('#autoscroll')[0].onchange = (e) => {
    if (debugging) console.log(e);
    autoscroll = e.target.checked;
  };
  $('#fitchat')[0].onchange = (e) => {
    if (debugging) console.log(e);
    fitchat = e.target.checked;
    $('#maxHistory')[0].disabled = e.target.checked;
  };
  $('#queue')[0].onchange = (e) => {
    if (debugging) console.log(e);
    whileSpeaking = !e.target.checked;
  };
  chinput.onchange = (e) => {
    if (debugging) console.log(e);
    channel = chinput.value.split(',');
    setCookie('channel', chinput.value);
  }
  ttscb.onchange = (e) => {
    if (debugging) console.log(e);
    ttsenabled = e.target.checked;
    if ( !( 'speechSynthesis' in window ) ) return;
    if ( e.target.checked ) {
      getVoice();
      $('#ttscontrols')[0].hidden = false;
    } else {
      $('#ttscontrols')[0].hidden = true;
    }
  };
  $('#maxHistory').on('change', (e) => {
    if (debugging) console.log(e);
    maxMsg = e.target.value;
    updateHistory();
  });
  $("#service").multiselect({
    buttonWidth: '6em',
    menuHeight: 'auto',
    menuWidth: 'auto',
    header: false,
    noneSelectedText: ' Off ',
    selectedText: ' # of # On '
  });
  $('#service').on('change',(e) => {
    if (debugging) console.log(e.target.selectedOptions);
    services = [];
    for ( op of e.target.selectedOptions ) {
      services.push(op.value);
      switch ( op.value ) {
        case 'ttv':
          twitch();
          break;
        case 'ytl':
          // youtube();
          break;
        case 'fbl':
          // facebook();
          break;
        default:
          break;
      }
    }
    if ( services.length == 0 ) disconnectAll();
    if (debugging) console.log(services);
  });
  $("#events").multiselect({
    buttonWidth: '15em',
    // menuHeight: 'auto',
    // menuWidth: 'auto',
    noneSelectedText: ' Select events to listen ',
    selectedText: ' Listening to # of # events '
  });
  $('#events').on('change',(e) => {
    if (debugging) console.log(e.target.selectedOptions);
    enabledEvents = [];
    for ( op of e.target.selectedOptions ) {
      enabledEvents.push(op.value);
    }
    if (debugging) console.log(enabledEvents);
  });
  $("#eventsFilter").multiselect({
    buttonWidth: '15em',
    // menuHeight: 'calc( var(--100h) / 2 )',// 'calc(100vh - var(--eventsFilter_ms) - 20px)',
    // menuWidth: 'auto',
    noneSelectedText: ' No filters ',
    selectedText: ' Selected # of # filters '
  });
  $('#eventsFilter').on('change',(e) => {
    if (debugging) console.log(e.target.selectedOptions);
    evFilters = [];
    for ( op of e.target.selectedOptions ) {
      if ( op.parentNode.nodeName == 'OPTGROUP' ) {
        if ( !evFilters[op.parentNode.label] ) evFilters[op.parentNode.id] = [];
        evFilters[op.parentNode.id].push(op.value);
      } else evFilters.push(op.value);
    }
    if (debugging) console.log(evFilters);
  });
  evFilters.userType = [''];
  $('#eventsFilter_ms')[0].addEventListener('click', (e) => {
    console.log(e);
    $(':root')[0].style.setProperty('--eventsFilter_ms',$('#eventsFilter_ms')[0].offsetTop + 'px');
  });
  // $(".multiselect").multiselect();
  $('#bauth')[0].onclick = (e) => {
      window.location.href = AuthURL;
  };
  if ( username = getCookie('login') ) {
    if (debugging) console.log(username);
    // $("#username")[0].value = username;
  }
  if ( encToken = getCookie('token') ) if (debugging) console.log(encToken);
  if ( args.length == 0 && hash.length == 0 ) {
    eraseCookie('login');
    eraseCookie('channel');
  } else {
    clientid = ClientID;
  }
  if ( username && encToken ) {
    clientid = ClientID;
  }
  if ( args.length > 0 && (args.findIndex(e => e.search('maxHistory=') > -1) > -1) ) {
    maxMsg = Number(decodeURIComponent(args[args.findIndex((e,i,a) => e.search('maxHistory') > -1)].split('=')[1]));
    $('#maxHistory')[0].value = maxMsg.toString();
  }
  for ( s of $("#service")[0].selectedOptions ) {
    switch ( s.value ) {
      case 'ttv':
        twitch();
        break;
      case 'ytl':
        // youtube();
        break;
      case 'fbl':
        // facebook();
        break;
      default:
        break;
    }
  }
};