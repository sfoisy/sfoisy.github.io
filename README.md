# NYC to DC walk — site files

No build step, no dependencies. Everything goes in the repo root, next to the images that are
already there, and GitHub Pages serves it as it is. **Upload the files, not the folder**, or
everything lands one directory deep.

## Pages

| File | What it is |
|---|---|
| `index.html` | The home page. Also the news digest (`#news`) and the blog's three cards (`#blog`). |
| `walk.html` | The article — the map, the stops, the clips, the comments. |
| `walk_write.html` | The same article for the merge tool. Every edit to `walk.html` is applied here too. |
| `blog.html` | The blog: its own front page, the wall of fourteen (`#hub`), every post. |
| `interviews.html` | The fourteen interviews as a wall of thumbnails, each opening in a player. |
| `news.html` | The full dated list. Add entries at the top of the `<ul>`. |
| `challenges.html` | The two games' front door. |
| `letters.html` | The Letter Collection Game. |
| `quiz.html` | Quiz Time: Climate Walk Trivia. |
| `translate.html` | The translators' review tool. Unlisted — send the link to a reviewer. |
| `stats-7f3a9c21.html` | Your visit counter. Unlisted, not linked from anywhere. |

## Shared scripts

Two small files every page loads at its foot. They are asked for by version
(`site-i18n.js?v=…`), so a reader's browser drops its old copy on the next visit; bump the
stamp in the pages *and* in `VERSION` at the top of `site-i18n.js` whenever either script
or a language file changes.

| File | What it does |
|---|---|
| `site-i18n.js` | The language button on every page, and the engine that rewrites the page in the chosen language. |
| `site-cc.js` | Gives every captioned clip one subtitle track per language, listed in the player's own captions menu. |

## Languages

The site reads in six: English, Spanish, French, Vietnamese, Chinese and Malagasy. **Every
page starts in English, every visit.** A reader picks a language where they want it, and the
choice is not carried to the next page or the next visit.

**Where the chooser is.** A "🌐 English ▾" dropdown at the right end of the bar on every page,
and a row of pills at the top of the phone menu. The same dropdown also sits under the Play
button on both games' title screens (the bar is gone in full screen), under the "Scientist
Interviews" heading on the blog's wall and on the interviews page, and inside every opened
interview under its date line. The walk keeps its own dropdown in the byline as well.

**How it works.** Nothing in the markup is tagged. Each language file is a dictionary keyed
by the English string exactly as it appears on the page; the engine walks every text node and
swaps in the translation, catching text the pages' own scripts add later (the quiz's
questions, the letter game's screens, the blog's cloned posts). A string missing from the
dictionary simply stays English, which is the safe failure. The letter game draws its HUD on a
canvas, so the engine also translates the three canvas text calls page-wide, and it understands
the shapes the games build at run time — a number in front of a phrase, a number inside one
(`{n}` in the key), phrases joined with `—` or `·`, and labels upper-cased on the way to the
screen.

| File | Covers |
|---|---|
| `walk-i18n-<lang>.js` | The walk: the article, the cards, and all 889 caption cues across its 32 clips. |
| `site-i18n-<lang>.js` | Every other page: the seven pages' text, the quiz bank, the interview blurbs, the whole letter game, and the fourteen interview clips' captions. |
| `walk-i18n-en.js`, `site-i18n-en.js` | The English side, for the review tool. Regenerate when the article or a page changes. |

Language files are fetched the first time a language is chosen, never before.

**Subtitles.** Every captioned clip — on the walk, the blog and the interviews page — carries
six real `<track>`s, so the browser's own captions menu (the three dots on the control bar)
lists the languages. The five translated tracks start empty and fill the first time one is
picked. Changing the site's language moves the on-track to that language on every clip whose
captions are on. On a phone, where the page draws its own player, the caption language follows
the site language.

**Every translation is machine-drafted and unchecked** — which is what the "(in development)"
beside each language means. Spanish and French are the strongest, Malagasy the weakest.

### Reviewing a language

Send a reviewer `https://www.sylfoisy.com/translate.html?lang=es` (or `fr`, `vi`, `zh`, `mg`).
One page for the whole site: sections down the left (the walk's article, the walk's captions,
then every other page and game grouped by where its text appears), one section on screen at a
time, English on the left and the draft in a box on the right, a tick per line, Ctrl+Enter to
tick. About 2,100 lines and 22,000 words per language; a fluent speaker needs roughly 15–30
hours. Their work autosaves in their browser.

When they press **Download corrected files** they get two files, `walk-i18n-<lang>.js` and
`site-i18n-<lang>.js`, in exactly the shape the site loads, with their tick-progress inside.
Drop both in the repo root over the old ones (and bump the version stamp). Captions are
edited once, in the walk's section, and go to both files.

## Loading

`walk.html` and `index.html` open under a sheet — the pixel earth over the night sky — while
the page assembles; the walk's says "Save our forecasts", the home page's says "Loading…". It
lifts when the page and its two above-the-fold pictures are ready (0.9 s at least, 4.2 s at
most). The bar rides over it.

What made a cold load slow was seventy images fetched at once — every clip's title card (a
`<video poster>` loads even inside a closed stop) and every folded card's photograph — with
the two pictures that mattered queued behind them. Title cards now load when their stop
opens; card photographs when the card comes within a screen of the viewport; and the sky and
hero are preloaded at high priority. Same pictures, better order.

**Full screen on a phone.** Coming out of page full screen, the page reloads itself at the
stop you were on (it writes `#stop-…` into the address first) — the layout is measured by
sixty scripts against the window, and some measurement from the full-screen layout always
survived the exit. A clip's own "full screen" inside page full screen is a CSS stage rather
than a second browser full screen, so closing the clip never drops the page out of it.

## The blog

`index.html#blog` is three cards and a button, and every one of them leaves the page. The
cards are the same cards `blog.html` sets on its own front page, to the number.

- **Card 1** → `walk.html`
- **Card 2** → `blog.html#hub`, the wall of fourteen
- **Card 3** → `blog.html#post-games`, the challenges post
- **The button** → `blog.html`, the front page

The blog's Back pill appears only inside a single conversation, where it returns you to the
wall; the front page and the wall have none. Its three screens push history entries, so the
browser's own Back walks out the way you walked in.

## News in two places

`news.html` is the record — the full list, newest first. The `#news` section on the home
page is a digest of the newest few and a link to the page. **To add an entry:** put it at the
top of the `<ul>` in `news.html` first, then copy the same `<li>` to the top of the list in
the News section of `index.html` and drop the oldest one off the bottom.

## The bar

The same six items on every page that has one — About, Music, Blog, News, Contact, CV — plus
the language dropdown at the right end. From the home page the four sections are bare
fragments (`#about`); from every other page they carry the file name (`index.html#blog`).
Between 701 and 1100px the row scrolls sideways inside its own box; below 701 the hamburger
takes over. In landscape on a phone the bar stands down in the games and in the walk's full
screen. The bar rides over the loading sheet on the two pages that have one.

## `index.html` needs its images

`photo.jpg`, `favicon.png`, `animation_fixed.mp4`, `aerosol_photos.png`, `sky_composite.png`,
`new_break.png`, `hour_0.png`, `speech.png`, `origami.png`, `snow1`–`snow7.png`, `back_new.png`
and the rest are not in this folder; they should already be in the repo. The walk's pictures,
the blog artwork and the clips come from the CDN.

## The visit counter

Every page carries a small snippet at the very bottom that records one view plus the host the
visitor arrived from. No cookies, no identifiers, nothing written to the reader's machine. It
needs somewhere to keep the tally; until `COUNTER` is set (at the foot of each page and at the
top of `stats-7f3a9c21.html`) it records nothing and breaks nothing.

`stats-7f3a9c21.html` and `translate.html` are unlisted, not private: nothing links to them
and they ask search engines to skip them, but anyone with the address can open them.
