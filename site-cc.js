/* ===== site-cc.js -- every caption language is a real <track> on the clip ==============
   A page's caption code hands a clip its English cues once:
       window.__ccTracks(video, englishCues, clipKey)
   and this adds six <track>s to it -- English, Español, Français, Tiếng Việt, 中文, Malagasy.
   That is the whole trick: a desktop browser's own captions menu (the three dots on the
   control bar, or the CC button) lists a clip's tracks, so the languages appear there, in the
   place a viewer already looks, with no pill or menu of ours over the picture.

   The five translated tracks start EMPTY. A language's cues arrive with its language file
   (walk-i18n-<lang>.js on the walk, site-i18n-<lang>.js everywhere else), which is fetched
   the first time a viewer picks that language -- from the captions menu or from the site
   bar -- and the chosen track's source is swapped for a VTT built from the translation at
   the same timings. Nothing is fetched for a language nobody picks.

   ONE TRACK ON AT A TIME. Both painters on this site (the blog's strip and the walk's phone
   strip) show the first track that is on, so when a track turns on the others are turned
   off. Changing the site's language (window.__ccSetPageLang) moves the ON track to that
   language on every clip that has captions on, and leaves clips with captions off alone.
   On a phone, where the page draws its own controls and there is no captions menu, the
   caption language simply follows the site language. */
(function(){
  var LANGS = window.siteLangs || { en:'English', es:'Español', fr:'Français', vi:'Tiếng Việt', zh:'中文', mg:'Malagasy' };
  var ORDER = ['en','es','fr','vi','zh','mg'];

  function ts(x){ x = Math.max(0, +x || 0); var h = Math.floor(x / 3600), m = Math.floor(x % 3600 / 60), s = x % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s.toFixed(3); }
  function toVTT(cues){ var out = ['WEBVTT', '']; cues.forEach(function(c, i){ out.push(String(i + 1), ts(c[0]) + ' --> ' + ts(c[1]), c[2], ''); }); return out.join('\n'); }
  function pageLang(){ var l = (window.siteLang && window.siteLang()) || document.documentElement.lang || 'en'; return LANGS[l] ? l : 'en'; }
  function fetchLang(l, cb){ if(l === 'en'){ cb(null); return; } var f = window.__i18nFetch || window.siteLangFetch; if(!f){ cb(null); return; } f(l, cb); }
  function cuesFor(v, l, d){
    var en = v._ccEn;
    if(l === 'en' || !d || !d.cues) return en;
    var t = d.cues[v._ccKey]; if(!t || t.length !== en.length) return en;   // no translation for this clip: English
    return en.map(function(c, i){ return [c[0], c[1], t[i] || c[2]]; });
  }
  function setSrc(el, cues){
    if(el._blob){ try{ URL.revokeObjectURL(el._blob); }catch(e){} }
    el._blob = URL.createObjectURL(new Blob([toVTT(cues)], {type:'text/vtt'}));
    el.src = el._blob;
  }
  function ensure(v, l, cb){
    var el = v._ccEls && v._ccEls[l]; if(!el){ cb && cb(); return; }
    if(el._loaded){ cb && cb(); return; }
    if(l === 'en'){ setSrc(el, v._ccEn); el._loaded = true; cb && cb(); return; }
    if(el._pending){ el._pending.push(cb); return; }
    el._pending = [cb];
    fetchLang(l, function(d){
      setSrc(el, cuesFor(v, l, d)); el._loaded = true;
      var q = el._pending; el._pending = null; q.forEach(function(f){ f && f(); });
    });
  }
  function onTrack(v){ var tt = v.textTracks; for(var i = 0; tt && i < tt.length; i++) if(tt[i].mode !== 'disabled') return tt[i]; return null; }

  /* Turn language l on for this clip, in the given mode ('showing' by default; the walk's
     phone controls use 'hidden' and mark the track, so that mode is carried over). */
  window.__ccShow = function(v, l, mode){
    if(!v._ccEls) return;
    if(!LANGS[l]) l = 'en';
    var was = onTrack(v);
    mode = mode || (was ? was.mode : 'showing');
    v._ccBusy = true;
    ensure(v, l, function(){
      var tt = v.textTracks;
      for(var i = 0; tt && i < tt.length; i++){
        var t = tt[i], mine = (t.language || '') === l;
        if(mine){ t.mode = mode; if(mode === 'hidden') t._vcapTook = true; }
        else if(t.mode !== 'disabled') t.mode = 'disabled';
      }
      v._ccBusy = false;
    });
  };
  window.__ccOff = function(v){ var tt = v.textTracks; for(var i = 0; tt && i < tt.length; i++) tt[i].mode = 'disabled'; };
  window.__ccLangOf = function(v){ var t = onTrack(v); return t ? (t.language || 'en') : null; };

  window.__ccTracks = function(v, enCues, key){
    if(!v || v._ccEls || !enCues || !enCues.length) return;
    v._ccEn = enCues; v._ccKey = key || ''; v._ccEls = {};
    ORDER.forEach(function(l){
      var el = document.createElement('track');
      el.kind = 'captions'; el.label = LANGS[l]; el.srclang = l; el.setAttribute('data-cc', l);
      if(l === 'en'){ setSrc(el, enCues); el._loaded = true; }
      else { el.src = URL.createObjectURL(new Blob(['WEBVTT\n\n'], {type:'text/vtt'})); }   // filled on first pick
      v.appendChild(el); v._ccEls[l] = el;
    });
    /* The browser's captions menu turns a track on: load its cues, and turn the others off. */
    var tt = v.textTracks;
    if(tt && tt.addEventListener) tt.addEventListener('change', function(){
      if(v._ccBusy) return;
      var on = null;
      for(var i = 0; i < tt.length; i++) if(tt[i].mode === 'showing'){ on = tt[i]; break; }
      if(!on) return;
      ensure(v, on.language || 'en');
      v._ccBusy = true;
      for(var j = 0; j < tt.length; j++) if(tt[j] !== on && tt[j].mode !== 'disabled') tt[j].mode = 'disabled';
      v._ccBusy = false;
    });
    /* As the single English track always did: captions on from the start, in the site's language.
       default="" is only read while markup is parsed, so a track added afterwards starts disabled --
       and not in this tick either: the TextTrack object does not exist until the browser has
       taken the element in. */
    requestAnimationFrame(function(){ window.__ccShow(v, pageLang(), 'showing'); });
  };

  /* Clips captioned before this file had run (the walk captions at parse time) queued up. */
  (window.__ccQueue || []).forEach(function(q){ window.__ccTracks.apply(null, q); });
  window.__ccQueue = null;
  window.__ccQueued = false;

  /* The site's language changed: every clip whose captions are on follows it. */
  window.__ccSetPageLang = function(l){
    /* A few clips per frame. Forty clips each swapping six track modes and a source in one
       synchronous pass is a lot of media-element work in one task; spread out it is nothing. */
    var vs = [].slice.call(document.querySelectorAll('video')).filter(function(v){ return !!v._ccEls; }), i = 0;
    (function step(){
      var end = Math.min(vs.length, i + 4);
      for(; i < end; i++){ var on = onTrack(vs[i]); if(on) window.__ccShow(vs[i], l, on.mode); }
      if(i < vs.length) requestAnimationFrame(step);
    })();
  };
})();
