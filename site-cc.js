/* ===== site-cc.js -- a subtitle-language pill on every captioned clip =================
   A page's caption code calls window.__ccPill(video) once a clip has a track. The pill sits
   in the clip's top-right corner: "CC · English ▾". Opening it lists the six languages;
   choosing one fetches that language's file (if it is not already here) and repaints THAT
   clip's track through window.__ccApplyVideo(video, lang, cues), leaving the rest of the
   page alone. Changing the page's language from the site bar re-captions every clip and
   clears these per-clip choices (the page calls window.__ccPillRefresh).

   The pill is only a picker: the captions' on/off switch stays where it is -- the browser's
   own CC control on a desktop, the page's own on a phone. */
(function(){
  var LANGS = window.siteLangs || { en:'English', es:'Español', fr:'Français', vi:'Tiếng Việt', zh:'中文', mg:'Malagasy' };
  var css = ''
   + '.cc-pick{position:absolute;top:8px;right:8px;z-index:30;line-height:1;font-family:"DM Sans",sans-serif}'
   + '.cc-btn{display:inline-flex;align-items:center;gap:.35rem;font:600 .68rem/1 "DM Sans",sans-serif;letter-spacing:.06em;text-transform:uppercase;'
   + 'color:#fff;background:rgba(10,14,24,.62);border:1px solid rgba(255,255,255,.45);border-radius:999px;padding:.32rem .6rem;cursor:pointer;'
   + 'opacity:0;transition:opacity .2s;backdrop-filter:blur(6px)}'
   + '.cc-btn .c{font-size:.55rem;opacity:.8}'
   + '.video-share-wrap:hover .cc-btn,.vp-wrap:hover .cc-btn,.cc-pick.open .cc-btn,.cc-btn:focus-visible{opacity:1}'
   + '@media(hover:none){.cc-btn{opacity:.85}}'
   + '.cc-pop{display:none;position:absolute;top:calc(100% + 6px);right:0;background:#fff;color:#111;border:1px solid #e6e6e6;border-radius:10px;'
   + 'box-shadow:0 10px 30px -10px rgba(0,0,0,.45);padding:.3rem;min-width:190px;text-transform:none;letter-spacing:0}'
   + '.cc-pick.open .cc-pop{display:block}'
   + '.cc-pop b{display:block;font:600 .66rem "DM Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#777;padding:.35rem .6rem .2rem}'
   + '.cc-pop button{display:block;width:100%;text-align:left;font:400 .84rem "DM Sans",sans-serif;background:none;border:0;border-radius:6px;padding:.42rem .6rem;color:#111;cursor:pointer}'
   + '.cc-pop button:hover{background:#f2f2f2}'
   + '.cc-pop button.active{font-weight:700;background:#f6f6f6}'
   + '.cc-pop small{font-size:.72em;opacity:.6;margin-left:.3rem;white-space:nowrap}'
   + '.cc-pop .loading{opacity:.5;pointer-events:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function pageLang(){ return (window.siteLang && window.siteLang()) || document.documentElement.lang || 'en'; }
  function langOf(v){ return v._ccLang || pageLang(); }
  function short(l){ return ({en:'EN',es:'ES',fr:'FR',vi:'VI',zh:'中文',mg:'MG'})[l] || l.toUpperCase(); }

  function fetchLang(lang, cb){
    if(lang === 'en'){ cb(null); return; }
    var f = window.__i18nFetch || window.siteLangFetch;
    if(!f){ cb(null); return; }
    f(lang, cb);
  }

  window.__ccPill = function(v, tries){
    if(!v || v._ccPill) return;
    /* The clip's wrapper is what the pill sits in. On walk.html the wrap is put round the
       clip by a later script than the one that captions it, so on a first call it may not be
       there yet: try again for a few seconds, then give up quietly. */
    var wrap = v.closest ? v.closest('.video-share-wrap, .vp-wrap') : null;
    if(!wrap){ tries = tries || 0; if(tries < 20) setTimeout(function(){ window.__ccPill(v, tries + 1); }, 400); return; }
    if(getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
    v._ccPill = true;
    var pick = document.createElement('div'); pick.className = 'cc-pick';
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'cc-btn'; btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = 'CC · <span class="l"></span> <span class="c" aria-hidden="true">&#9660;</span>';
    var pop = document.createElement('div'); pop.className = 'cc-pop'; pop.setAttribute('role', 'menu');
    var head = document.createElement('b'); head.textContent = 'Subtitles'; pop.appendChild(head);
    Object.keys(LANGS).forEach(function(l){
      var b = document.createElement('button'); b.type = 'button'; b.dataset.lang = l; b.setAttribute('role', 'menuitem'); b.textContent = LANGS[l];
      if(l !== 'en'){ var sm = document.createElement('small'); sm.textContent = '(in development)'; b.appendChild(sm); }
      b.addEventListener('click', function(e){
        e.stopPropagation(); close();
        b.classList.add('loading');
        fetchLang(l, function(d){
          b.classList.remove('loading');
          if(window.__ccApplyVideo) window.__ccApplyVideo(v, l, d && d.cues ? d.cues : null);
          paint();
        });
      });
      pop.appendChild(b);
    });
    function paint(){
      var l = langOf(v);
      btn.querySelector('.l').textContent = short(l);
      btn.title = 'Subtitles: ' + (LANGS[l] || l) + (l !== 'en' ? ' (in development)' : '');
      [].forEach.call(pop.querySelectorAll('button'), function(b){ b.classList.toggle('active', b.dataset.lang === l); });
    }
    function close(){ pick.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function(e){ e.stopPropagation(); e.preventDefault(); var o = pick.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    // a click on the pill must not reach the clip (which would play/pause it) or the card behind it
    ['pointerdown','touchstart','mousedown'].forEach(function(ev){ pick.addEventListener(ev, function(e){ e.stopPropagation(); }, {passive:true}); });
    document.addEventListener('click', function(e){ if(!pick.contains(e.target)) close(); });
    pick.appendChild(btn); pick.appendChild(pop); wrap.appendChild(pick);
    v._ccPaintPill = paint; paint();
  };
  window.__ccPillRefresh = function(){
    [].forEach.call(document.querySelectorAll('video'), function(v){ if(v._ccPaintPill) v._ccPaintPill(); });
  };
})();
