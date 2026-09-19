/* ===== site-i18n.js -- one language button and one translation engine for the whole site ===
   Included at the foot of every page (walk.html has its own engine and only takes the
   button from here). Three jobs:

   1. THE BUTTON. A globe pill is appended to the site bar (.nav-links) and a row of language
      pills to the phone menu (.nav-mobile-menu). Choosing a language stores it as
      localStorage 'site-lang' -- the same key walk.html has always used -- so one choice
      follows the reader across every page.

   2. THE ENGINE. Every text node in <body> is translated from a dictionary keyed by the
      English string itself (whitespace collapsed), so nothing in the markup is tagged and a
      string the dictionary lacks simply stays English. Text nodes are what is written to,
      never innerHTML, so links, emphasis and handlers keep their place. A MutationObserver
      catches nodes the page's own scripts add later (the quiz's questions, the letter game's
      overlays, the blog's cloned posts) and text those scripts change, and translates them
      the same way. Same design as walk.html's engine, so a reader sees one behaviour.

   3. THE FILES. One file per language for the whole site: site-i18n-<lang>.js, fetched the
      first time that language is chosen, setting
        window.SITE_I18N.<lang> = { label, text:{ English: translation }, cues:{ clip:[...] } }
      cues are the caption lines for the interview clips (the same clips walk.html carries);
      a page with captioned video exposes window.__ccApply(lang, cues) and this calls it.

   EVERY TRANSLATION IS MACHINE-DRAFTED AND UNCHECKED, which is what the "(in development)"
   beside each language means. Corrections go in the language file, keyed by the English. */
(function(){
  var LANGS = { en:'English', es:'Español', fr:'Français', vi:'Tiếng Việt', zh:'中文', mg:'Malagasy' };
  var VERSION = '20260919c';   /* bumped with every release of the language files, so a reader's browser never keeps an old one */
  var FILE = window.SITE_I18N_FILE || 'site-i18n-{lang}.js';
  var OWN_ENGINE = typeof window.__i18nApply === 'function';   // walk.html: it has its own
  var SKIP = { SCRIPT:1, STYLE:1, NOSCRIPT:1, CODE:1, TITLE:1, TEXTAREA:1, PRE:1, SVG:1, MATH:1, INPUT:1 };
  window.SITE_I18N = window.SITE_I18N || {};

  /* ---------- the button ------------------------------------------------------ */
  var css = ''
   + '.nav-links{align-items:center}'   /* the pill is taller than the links; without this the links sit high beside it */
   + '.lang-pick{position:relative;display:inline-flex;align-items:center;align-self:center;flex:0 0 auto}'
   + '.lang-btn{display:inline-flex;align-items:center;gap:.4rem;font:500 .74rem "DM Sans",sans-serif;letter-spacing:.06em;text-transform:uppercase;'
   + 'color:var(--nav-ink,#fff);background:rgba(255,255,255,.08);border:1px solid currentColor;border-radius:999px;padding:.32rem .72rem;cursor:pointer;opacity:.92;white-space:nowrap;transition:.2s}'
   + '.lang-btn:hover{opacity:1;background:rgba(255,255,255,.18)}'
   + '.lang-btn .g{font-size:.95rem;line-height:1}'
   + '.lang-btn .c{font-size:.6rem;opacity:.8}'
   + '.lang-pop{display:none;position:absolute;top:calc(100% + 8px);right:0;background:#fff;color:#111;border:1px solid #e9e9e9;border-radius:10px;'
   + 'box-shadow:0 10px 30px -10px rgba(0,0,0,.35);padding:.35rem;min-width:200px;z-index:300;text-transform:none;letter-spacing:0}'
   + '.lang-pop.open{display:block}'
   + '.lang-pop.fixed{position:fixed;right:auto;transform:none;z-index:9000}'
   + '.lang-pop button{display:block;width:100%;text-align:left;font:400 .88rem "DM Sans",sans-serif;background:none;border:0;border-radius:6px;padding:.5rem .7rem;color:#111;cursor:pointer}'
   + '.lang-pop button:hover{background:#f2f2f2}'
   + '.lang-pop button.active{font-weight:700;background:#f6f6f6}'
   + '.lang-pop small{font-size:.72em;opacity:.6;white-space:nowrap;margin-left:.3rem}'
   + '.lang-row{display:flex;flex-wrap:wrap;gap:.4rem;padding:.7rem 1.25rem;border-bottom:1px solid var(--nav-rule,rgba(255,255,255,.3))}'
   + '.lang-row span{font:500 .72rem "DM Sans",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--nav-ink,#fff);opacity:.7;width:100%}'
   + '.lang-row button{font:500 .8rem "DM Sans",sans-serif;color:var(--nav-ink,#fff);background:none;border:1px solid currentColor;border-radius:999px;padding:.28rem .7rem;cursor:pointer;opacity:.85}'
   + '.lang-row button.active{background:var(--nav-ink,#fff);color:var(--nav-sheet,#0a1426);opacity:1}'
   + '@media(min-width:701px) and (max-width:1100px){.lang-pick{margin-left:.4rem}}'
   /* the same dropdown in a slot: centred under a game's Play button, under the interviews
      masthead, and compact under an open interview's date line */
   + '.lang-title{display:flex;justify-content:center;margin-top:1.2rem;position:relative;z-index:50;min-height:2.2rem}'   /* above a clip's curtain (6), under the site bar (100); the height is reserved so the page does not shift when the button lands */
   + '.lang-title .lang-btn{color:#fff;font-size:.72rem;padding:.36rem .8rem}'
   + '.lang-title .lang-pop{right:auto;left:50%;transform:translateX(-50%)}'
   + '.lang-title.compact{justify-content:flex-start;margin:-.35rem 0 .9rem;min-height:1.7rem}'
   + '.lang-title.compact .lang-btn{font-size:.64rem;padding:.26rem .62rem;opacity:.85}'
   + '.lang-title.compact .lang-pop{left:0;transform:none}'
   + '.lang-title.compact.centred{justify-content:center;margin:-.6rem 0 1.1rem}'
   + '.lang-title.compact.centred .lang-pop{left:50%;transform:translateX(-50%)}'
   + '.blog-head .lang-title{margin:.2rem 0 1rem}'
   + '.page-head .lang-title{margin-top:1.1rem}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var cur = 'en';
  function label(l){ return LANGS[l] || l; }
  /* The same dropdown everywhere: the bar, the games' title screens, the interviews page's
     masthead and each open interview. A globe, the current language, a chevron; the six
     languages in a small panel that opens below -- or above, when there is no room below. */
  function makePick(){
      var pick = document.createElement('div'); pick.className = 'lang-pick';
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'lang-btn'; btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span class="g" aria-hidden="true">&#127760;</span><span class="l"></span><span class="c" aria-hidden="true">&#9660;</span>';
      btn.setAttribute('aria-label', 'Language');
      var pop = document.createElement('div'); pop.className = 'lang-pop'; pop.setAttribute('role', 'menu');
      Object.keys(LANGS).forEach(function(l){
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem'); b.dataset.lang = l;
        b.textContent = LANGS[l];
        if(l !== 'en'){ var sm = document.createElement('small'); sm.textContent = '(in development)'; b.appendChild(sm); }
        b.addEventListener('click', function(){ setLang(l); close(); });
        pop.appendChild(b);
      });
      function close(){ pop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
      btn.addEventListener('click', function(e){ e.stopPropagation(); var o = pop.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
      document.addEventListener('click', function(e){ if(!pick.contains(e.target)) close(); });
      document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
      btn.addEventListener('click', function(){
        /* The panel is placed from the button's position on screen, always BELOW it, so it
           opens under the button wherever the button is -- never up into the site bar, and
           never clipped by a scrolling container around it. In the bar the panel stays where
           the stylesheet puts it. */
        if(!pick.closest('.nav-links')){
          var r = btn.getBoundingClientRect();
          pop.classList.add('fixed');
          pop.style.top = (r.bottom + 8) + 'px';
          pop.style.left = Math.max(8, Math.min(window.innerWidth - 208, r.left + r.width / 2 - 100)) + 'px';
        }
      });
      pick.appendChild(btn); pick.appendChild(pop);
      return pick;
  }
  function buildButton(){
    var links = document.querySelector('nav .nav-links, .site-nav .nav-links');
    if(links && !links.querySelector('.lang-pick')) links.appendChild(makePick());
    var menu = document.querySelector('.nav-mobile-menu');
    if(menu && !menu.querySelector('.lang-row')){
      var row = document.createElement('div'); row.className = 'lang-row';
      var t = document.createElement('span'); t.textContent = 'Language'; row.appendChild(t);
      Object.keys(LANGS).forEach(function(l){
        var b = document.createElement('button'); b.type = 'button'; b.dataset.lang = l; b.textContent = LANGS[l];
        b.addEventListener('click', function(){ setLang(l); });
        row.appendChild(b);
      });
      menu.insertBefore(row, menu.firstChild);
    }
    mountRows();
    paintButton();
  }
  /* Anywhere a page has left a slot for one -- the games' title screens, the interviews page's
     masthead, the open interview -- a row of pills. Slots that appear later (an interview is
     built when it is opened) are filled when the page calls window.siteLangMount(). */
  function mountRows(){
    [].forEach.call(document.querySelectorAll('[data-lang-row]'), function(slot){
      if(slot.querySelector('.lang-pick')) return;
      slot.appendChild(makePick());
    });
    paintButton();
  }
  window.siteLangMount = mountRows;
  function paintButton(){
    [].forEach.call(document.querySelectorAll('.lang-btn'), function(btn){ var l = btn.querySelector('.l'); if(l) l.textContent = label(cur); btn.title = 'Language: ' + label(cur) + (cur !== 'en' ? ' (in development)' : ''); });
    [].forEach.call(document.querySelectorAll('.lang-pop button, .lang-row button'), function(b){ b.classList.toggle('active', b.dataset.lang === cur); });
    document.documentElement.lang = cur;
  }

  /* ---------- the engine (skipped on walk.html, which has its own) ----------- */
  var PENDING = {}, dict = null, mo = null;
  function norm(t){ return String(t).replace(/\s+/g, ' ').trim(); }
  function fetchLang(lang, cb){
    if(window.SITE_I18N[lang]){ cb(window.SITE_I18N[lang]); return; }
    if(PENDING[lang]){ PENDING[lang].push(cb); return; }
    PENDING[lang] = [cb];
    var el = document.createElement('script'); el.src = FILE.replace('{lang}', lang) + '?v=' + VERSION; el.async = true;
    function done(){ var d = window.SITE_I18N[lang] || null, q = PENDING[lang] || []; delete PENDING[lang]; q.forEach(function(f){ f(d); }); }
    el.onload = done; el.onerror = done;
    document.head.appendChild(el);
  }
  function skipEl(el){
    for(var p = el; p && p.nodeType === 1; p = p.parentNode){
      if(SKIP[(p.tagName || '').toUpperCase()]) return true;
      if(p.classList && (p.classList.contains('lang-pick') || p.classList.contains('lang-row') || p.classList.contains('lang-title'))) return true;
      if(p.getAttribute && p.getAttribute('translate') === 'no') return true;
    }
    return false;
  }
  /* Exact match first. Then two shapes the games build at run time:
       "3 INTERVIEWS STILL TO RECORD", "57% WATER"  -- a number in front of a known phrase
       "The water caught you — back to the start"   -- two known phrases joined with a dash
     A part with no translation stays English, so a half-known line still reads. */
  /* One phrase: exact, or with every number swapped for {n} -- so "until all 3 interviews are
     recorded" is found under "until all {n} interviews are recorded" and the 3 is put back. */
  function hit(T, q){
    if(Object.prototype.hasOwnProperty.call(T, q)) return T[q];
    var nums = [], k2 = q.replace(/\d+(?:[.,]\d+)?/g, function(m){ nums.push(m); return '{n}'; });
    if(nums.length && Object.prototype.hasOwnProperty.call(T, k2)){ var i = 0; return T[k2].replace(/\{n\}/g, function(){ return nums[i++] || ''; }); }
    /* "AIR CLARITY" is keyed as "air clarity": the games upper-case their labels on the way to
       the screen, so try the lower case, and hand the translation back in capitals. */
    if(q !== q.toLowerCase() && q === q.toUpperCase()){
      if(!T.__lc){ T.__lc = {}; for(var k in T) if(k !== '__lc' && Object.prototype.hasOwnProperty.call(T, k)) T.__lc[k.toLowerCase()] = T[k]; }
      var lc = q.toLowerCase();
      if(Object.prototype.hasOwnProperty.call(T.__lc, lc)) return String(T.__lc[lc]).toUpperCase();
      var nums2 = [], k3 = lc.replace(/\d+(?:[.,]\d+)?/g, function(m){ nums2.push(m); return '{n}'; });
      if(nums2.length && Object.prototype.hasOwnProperty.call(T.__lc, k3)){ var j = 0; return String(T.__lc[k3]).toUpperCase().replace(/\{N\}/g, function(){ return nums2[j++] || ''; }); }
    }
    return null;
  }
  function lookup(en){
    if(!dict) return null;
    var k = norm(en); if(!k) return null;
    var T = dict.text || {};
    var r = hit(T, k); if(r != null) return r;
    var m = k.match(/^([\d][\d.,%°+\-–\s]*)(.+)$/);
    if(m){
      /* "57% WATER" is keyed as "% WATER", "3 INTERVIEWS…" as "INTERVIEWS…": hand the symbols
         after the digits back to the phrase one at a time until something matches. */
      var pre = m[1], rest = m[2];
      for(;;){
        var q = rest.replace(/^\s+/, ''), t = hit(T, q);
        if(t != null) return pre + (rest.slice(0, rest.length - q.length)) + t;
        if(!pre.length || /[\d]$/.test(pre)) break;
        rest = pre.slice(-1) + rest; pre = pre.slice(0, -1);
      }
    }
    if(/ — | · /.test(k)){
      var parts = k.split(/( — | · )/), any = false;
      var out = parts.map(function(p, i){
        if(i % 2) return p;                        // the joiner itself
        var q = p.replace(/^— /, ''), t = hit(T, q); if(t == null) t = hit(T, p);
        if(t == null){ var m2 = q.match(/^(\d[\d.,%]*\s+)(.+)$/); if(m2){ var t2 = hit(T, m2[2]); if(t2 != null) t = m2[1] + t2; } }
        if(t != null){ any = true; return t; } return p;
      });
      if(any) return out.join('');
    }
    return null;
  }
  /* For a page's own scripts: translate a string (or the text inside an HTML string) before
     they type it out or wrap it -- the letter game's typewriter and speech bubbles. */
  window.siteT = function(t){ if(cur === 'en' || !dict || typeof t !== 'string') return t; var r = lookup(t); return r == null ? t : r; };
  window.siteTHTML = function(html){
    if(cur === 'en' || !dict || typeof html !== 'string') return html;
    var d = document.createElement('div'); d.innerHTML = html;
    var w = document.createTreeWalker(d, NodeFilter.SHOW_TEXT, null, false), n;
    while((n = w.nextNode())){ var r = lookup(n.nodeValue); if(r != null){ var v = n.nodeValue, lead = v.match(/^\s*/)[0], tail = v.match(/\s*$/)[0]; n.nodeValue = lead + r + tail; } }
    return d.innerHTML;
  };
  /* ---------- canvas text ----------------------------------------------------
     The letter game draws its HUD and signs on a canvas, where there are no text nodes to
     rewrite. The three text calls are wrapped once, page-wide: what the game asks to draw
     is looked up in the same dictionary on the way to the screen, and measured the same way
     so its layout matches. In English the wrappers pass everything straight through. */
  (function(){
    var P = window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype; if(!P || P.__i18n) return;
    P.__i18n = true;
    function tr(t){ if(cur === 'en' || !dict || typeof t !== 'string') return t; var r = lookup(t); return r == null ? t : r; }
    ['fillText','strokeText','measureText'].forEach(function(fn){
      var orig = P[fn]; if(!orig) return;
      P[fn] = function(t){ var a = Array.prototype.slice.call(arguments); a[0] = tr(t); return orig.apply(this, a); };
    });
  })();
  function write(n, s){
    var v = n.nodeValue, lead = v.match(/^\s*/)[0], tail = v.match(/\s*$/)[0], out = lead + s + tail;
    if(n.nodeValue !== out){ n.__set = out; n.nodeValue = out; } else n.__set = out;
  }
  function doNode(n){
    try{ doNode2(n); }catch(e){}
  }
  function doNode2(n){
    if(!n.parentNode || skipEl(n.parentNode)) return;
    var v = n.nodeValue; if(!norm(v)) return;
    if(n.__set == null || v !== n.__set) n.__en = v;
    if(cur === 'en'){ if(n.__set != null && v === n.__set){ n.__set = null; n.nodeValue = n.__en; } return; }
    var t = lookup(n.__en);
    if(t != null) write(n, t);
    else if(n.__set != null && v === n.__set){ n.__set = null; n.nodeValue = n.__en; }
  }
  function walk(root){
    if(root.nodeType === 3){ doNode(root); return; }
    if(root.nodeType !== 1 && root.nodeType !== 9) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n, list = [];
    while((n = w.nextNode())) list.push(n);
    for(var i = 0; i < list.length; i++) doNode(list[i]);
  }
  /* Attributes the reader can see: placeholders and the odd title. */
  function attrs(root){
    [].forEach.call((root.querySelectorAll ? root.querySelectorAll('[placeholder],[data-peek]') : []), function(el){
      ['placeholder','data-peek'].forEach(function(a){
        var v = el.getAttribute(a); if(!v) return;
        if(el['__en_' + a] == null) el['__en_' + a] = v;
        var en = el['__en_' + a];
        var t = (cur === 'en') ? en : (lookup(en) != null ? lookup(en) : en);
        if(el.getAttribute(a) !== t) el.setAttribute(a, t);
      });
    });
  }
  /* Added nodes are handled once per frame, in a batch, and character data is not watched at
     all: scripts that change a label do it with textContent, which replaces the node and is
     caught as a child-list change. Answering every text write in a microtask is how an
     observer becomes a second main-thread loop on a busy page. */
  var _pend = [], _flushQ = false;
  function flush(){
    _flushQ = false;
    var q = _pend; _pend = [];
    if(cur === 'en') return;
    for(var i = 0; i < q.length; i++){ try{ walk(q[i]); if(q[i].nodeType === 1) attrs(q[i]); }catch(e){} }
  }
  function watch(){
    if(mo || !window.MutationObserver) return;
    mo = new MutationObserver(function(recs){
      if(cur === 'en') return;
      for(var i = 0; i < recs.length; i++){
        var a = recs[i].addedNodes;
        for(var j = 0; a && j < a.length; j++) _pend.push(a[j]);
      }
      if(_pend.length && !_flushQ){ _flushQ = true; requestAnimationFrame(flush); }
    });
    mo.observe(document.body, { childList:true, subtree:true });
  }
  var seq = 0;
  function apply(lang){
    var my = ++seq;
    if(lang === 'en'){ cur = 'en'; dict = null; walk(document.body); attrs(document.body); paintButton(); if(window.__ccApply) window.__ccApply('en', null); return; }
    fetchLang(lang, function(d){
      if(my !== seq) return;
      cur = lang; dict = d || { text:{} };
      watch(); walk(document.body); attrs(document.body); paintButton();
      if(window.__ccApply) window.__ccApply(lang, dict.cues || null);
    });
  }

  function setLang(lang){
    if(!LANGS[lang]) lang = 'en';
    try{ localStorage.setItem('site-lang', lang); }catch(e){}
    cur = lang; paintButton();
    if(OWN_ENGINE && typeof window.setLang === 'function' && window.setLang !== setLang){ window.setLang(lang); return; }   // walk.html
    apply(lang);
  }
  window.siteSetLang = setLang;
  window.siteLang = function(){ return cur; };
  window.siteLangs = LANGS;
  window.siteLangFetch = function(lang, cb){ if(lang === 'en'){ cb(null); return; } fetchLang(lang, cb); };

  function start(){
    buildButton();
    /* Every page starts in English, every time (19 Sep 2026). A language chosen on one page
       is not carried to the next or to the next visit; the reader picks it where they want it. */
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
