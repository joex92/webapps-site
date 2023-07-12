let debugging = false, voices = [], languages = {}, vsel, tts = new SpeechSynthesisUtterance(), app, loaded = false, selectedVoice = '';
const dnDialect = new Intl.DisplayNames('en', {type: 'language', languageDisplay: 'dialect'});

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

function filterVoices(e) {
  if ( debugging ) console.log('Filter Voice', e);
  for ( op of vsel ) {
    op.hidden = true;
    for ( s of $('#lang')[0].selectedOptions ) if ( s.value == voices[op.value].lang ) op.hidden = false;
  };
}

function getVoice(v) {
  let voice = ( v == undefined ) ? getCookie('voice') : v ;
  vsel.value = -1;
    console.log(voice, vsel.length, vsel.options.length, vsel.options, voices.length, selectedVoice.length);
  for ( i = 0; i < voices.length; i++){
    console.log(i, v, voice, voices[i].name);
    if ( voices[i].name == voice ) {
      vsel.value = i.toString();
      selectedVoice = Number(vsel.options.value);
      return;
    }
    if ( vsel.options[i].attributes.selected ) {
      vsel.value = i.toString();
    }
  }
}

function getVoices(e) {
  if ( debugging ) console.log(e);
  vsel = ( vsel == undefined ) ? $('#voice')[0] : vsel;
  vsel.innerHTML = `<optgroup label="Local Voices" id='localV'></optgroup><optgroup label="Online Voices" id='onlineV'></optgroup>`;
  voices = speechSynthesis.getVoices();
  voices.forEach((v,i,a) => {
    if ( languages[v.lang.split(/[_-]/)[0]] == undefined ) languages[v.lang.split(/[_-]/)[0]] = [];
    languages[v.lang.split(/[_-]/)[0]].push(v.lang);
    op = `<option value="${i}"${v.default ? ' selected' : ' ' }>${v.name}</option>`;
    if ( v.localService ) {
      $('#localV')[0].innerHTML += op;
    } else {
      $('#onlineV')[0].innerHTML += op;
    }
  });
  $('#localV')[0].label += ` (${$('#localV')[0].getElementsByTagName('option').length})`;
  $('#onlineV')[0].label += ` (${$('#onlineV')[0].getElementsByTagName('option').length})`;
  $('#lang')[0].innerHTML = '';
  Object.keys(languages).forEach((V,I,A)=>{
    languages[V] = [...new Set(languages[V])];
    languages[V].sort();
    if (languages[V].length > 1) {
      $('#lang')[0].innerHTML += `<optgroup label='${dnDialect.of(V)} (${languages[V].length})' id='${V}'></optgroup>`;
      languages[V].forEach((v,i,a) => {
        $(`#${V}`)[0].innerHTML += `<option value="${v}" selected>${dnDialect.of( ( v.split('_').length == 3 ) ? ( `${v.split('_')[0]}-${v.split('_')[2]}-${v.split('_')[1]}` ).replaceAll('#','') : ( v.replaceAll('_','-') ) )}</option>`;
      });
    } else $(`#lang`)[0].innerHTML += `<option value="${languages[V][0]}" selected>${dnDialect.of( ( languages[V][0].split('_').length == 3 ) ? ( `${languages[V][0].split('_')[0]}-${languages[V][0].split('_')[2]}-${languages[V][0].split('_')[1]}` ).replaceAll('#','') : ( languages[V][0].replaceAll('_','-') ) ) }</option>`;
  })
  if ( selectedVoice == '' ) getVoice();
  if ( selectedVoice != '' || !loaded ) {
    if ( location.search.length > 0 ) {
      const vals = location.search.substr(1).split('&');
      for ( v of vals ){
        if ( v.length > 1 ){
          const val = v.split('=');
          if ( val.length > 1 ) {
            if ( val[0] == 'voice' ) {
              getVoice(decodeURI(val[1]));
            } else {
              if ( val[0] == 'lang' ) {
                const lang = val[1].split(',');
                for ( ls of $('#lang')[0].options ) {
                  ls.selected = false;
                  for ( l of lang ) {
                    if ( ls.text == l ) ls.selected = true;
                  }
                }
              } else $('#'+val[0])[0].value = decodeURI(val[1]);
            }
            if ( $('#l'+val[0]).length > 0 ) $('#l'+val[0])[0].innerHTML = $('#'+val[0])[0].value;
          } else {
            switch (val[0]) {
              case 'speak':
                setTimeout(()=>$('#speak').trigger('click'),1000);
                break;
              default:
                break;
            }
          }
        }
      }
    }
    $("#lang").multiselect({
      buttonWidth: '50%',
      menuHeight: 'auto',
      menuWidth: 'auto',
      noneSelectedText: `Lang. Filter`,
      selectedText: `#/# Lang.`,
      classes: 'noselect',
      groupsSelectable: true,
      groupsCollapsable: true,
    });
    $('#lang').on('change', filterVoices);
  }
  $('#lang').multiselect('refresh');
  $('#lang').multiselect('collapseAll');
  $('#lang').trigger('change');
  loaded = true;
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, 99999); // For mobile devices

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    if ( debugging ) console.log("Fallback: Copying text command was " + msg);
    return msg;
  } catch (err) {
    if ( debugging ) console.error("Fallback: Oops, unable to copy", err);
    return err;
  }
}
function copyTextToClipboard(t) {
  let text = t.toString();
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  return navigator.clipboard.writeText(text).then(
    function () {
      if ( debugging ) console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      if ( debugging ) console.error("Async: Could not copy text: ", err);
      return fallbackCopyTextToClipboard(text);
    }
  );
}

function formVals(formElement) {
  if ( formElement.tagName == 'FORM' ) {
    const formData = new FormData(formElement)
    if ( debugging ) console.log(...formData.entries());
    const allEntries = [...formData.entries()]
      .reduce((all, entry) => {
        if ( all[entry[0]] ) all[entry[0]] += ',' + entry[1];
        else all[entry[0]] = entry[1]
        return all
      }, {})
    return allEntries;
  }
  return {};
}

$(document).ready((e) => {
  if ( location.search.match('debug') != null ) debugging = true;
  if ( debugging ) console.log('Loaded', e());
  
  $(document).on('mousemove',(e)=>{
    if ( debugging ) console.log('Mouse Event',e);
    document.styleSheets[3].cssRules[0].style.setProperty("--pointerX", e.clientX);
    document.styleSheets[3].cssRules[0].style.setProperty("--pointerY", e.clientY);
  })
  
  app = $('#app');
  
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = getVoices;
    speechSynthesis.dispatchEvent(new Event('voiceschanged'));
  } else {
    alert(`Sorry, your browser doesn't support TTS.`);
    app[0].remove()
    return;
  }
  
  let ttsev = (e) => {
    if ( debugging ) console.log(e);
    if ( e.type == 'dblclick' ) e.target.value = 1;
    if ($(`#l${e.target.id}`)[0]) {
      $(`#l${e.target.id}`)[0].innerHTML = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 1, minimumFractionDigits: 2}).format(e.target.value);
      // tts[e.target.id] = e.target.value;
    } else {
      tts[e.target.id] = isNaN(e.target.value) ? e.target.value : voices[e.target.value];
      if ( e.target.id == 'voice' ) selectedVoice = e.target.value;
    }
    if ( debugging ) console.log(tts);
  }
  
  $('input[type=range]').on('input',ttsev);
  $('#voice').on('change',ttsev);
  $('#text').on('input',ttsev);
  $('input[type=range]').on('dblclick',ttsev);
  
  app.submit((e) => {
    if (e.preventDefault) e.preventDefault();
    fv = formVals(e.target);
    let v = '?';
    for ( k of Object.keys(fv) ) {
      v += k.toLowerCase() + '=';
      if ( debugging ) console.log(v);
      switch (k) {
        case 'voice':
          v += encodeURI(voices[fv[k]].name);
          break;
        default:
          v += encodeURI(fv[k]);
          break;
      }
      v += '&';
    }
    const url = location.origin + location.pathname + v + 'speak';
    if ( debugging ) console.log(e,fv,url);
    copyTextToClipboard(url);
    $('#toast')[0].innerHTML = 'Link copied!'
    setTimeout(() => { $('#toast')[0].innerHTML = '' }, 3000);
    // You must return false to prevent the default form behavior
    return false;
  });
  
  $('#speak').on('click',(e)=>{
    if ( debugging ) console.log(e);
    selectedVoice = vsel.value;
    tts = new SpeechSynthesisUtterance();
    tts.onstart = (e) => {
      if ( debugging ) console.log(e);
      $('#speak')[0].value = ' Stop! ';
      $('#text')[0].style.background = '#00ff0069';
    };
    tts.onend = (e) => {
      if ( debugging ) console.log(e);
      $('#speak')[0].value = ' Speak! ';
      $('#text')[0].style.background = '';
    };
    if ( !speechSynthesis.speaking ) {
      fv = formVals(app[0]);
      if ( debugging ) console.log(fv);
      for ( k of Object.keys(fv) ) {
        let v;
        switch (k) {
          case 'voice':
            v = voices[fv[k]];
            break;
          case 'lang':
            v = tts.voice[k];
            break;
          default:
            v = fv[k];
            break;
        }
        tts[k] = v;
      }
      speechSynthesis.speak(tts);
    } else {
      speechSynthesis.cancel();
    }
    if ( debugging ) console.log(tts);
  });
});