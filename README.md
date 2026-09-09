# NYC to DC walk — site files

Seven files, no build step, no dependencies. Drop them in the repo root next to your
existing images and GitHub Pages serves them as they are.

| File | What it is |
|---|---|
| `index.html` | The home page. Also the news digest (`#news`) and the blog's three cards (`#blog`). |
| `walk.html` | The article. Links out to the interviews, both games, and the home page. |
| `blog.html` | The blog page, whole — reached from "See all blog posts". |
| `news.html` | The full dated list. Add entries at the top of the `<ul>`. |
| `letters.html` | The Letter Collection Game. |
| `quiz.html` | Quiz Time: Climate Walk Trivia. |
| `stats-7f3a9c21.html` | Your visit counter. Unlisted, not linked from anywhere. |

**`blog.html` is on the site again**, unchanged in look and behaviour — its own front page,
the wall of fourteen behind it, and every post in one place. Three things were reconnected:
the bar's Blog link points home to `index.html#blog` like every other page's does, the two
game tiles in the Challenges post are real links to `quiz.html` and `letters.html` instead of
the dead `<button>`s they were written as, and the bar picked up the 701–1100 squeeze the
rest of the site uses. The home page's `#blog` section is the shop window; this is the shelf,
and the "See all blog posts" button under the three cards is the way to it.

## The blog

`index.html#blog` is three cards and a button, and **every one of them leaves the page**.
The cards are the same cards `blog.html` sets on its own front page — to the number: three
across in an 850px lane, 1.125rem gaps, a .6rem corner on the thumbnail, a drop shadow rather
than a border, a 2px lift on hover with an even dark wash and one uppercase word centred on
it, and the date centred underneath at .78rem / .12em. The only difference is the date's
colour: white over there because the blog sits on a dark photograph, the page's own grey here.
That is the point of copying it rather than drawing it again — press "See all blog posts" and
you should arrive somewhere that looks like where you pressed it.

- **Card 1** → `walk.html`
- **Card 2** → `blog.html#hub`, the wall of fourteen
- **Card 3** → `blog.html#post-games`, the challenges post
- **The button** → `blog.html`, the front page

`blog.html` reads those anchors on load and opens straight onto the right view, so a card is
one press with nothing in between. There is no script behind any of this on the home page:
three anchors that work with JavaScript off, and middle-click, cmd-click and the status bar
all behave.

## Back works on the blog

`blog.html`'s three screens used to swap with `history.replaceState`, which rewrites the entry
you are standing on instead of adding one — so the browser's Back went straight out of the
page from wherever you had got to, and three clicks into the wall was the same single entry as
the front page.

They **push** now. Front page → wall → a conversation is three entries: Back walks out the way
you walked in and Forward walks back down, and the address bar is honest at every step. The
on-page Back controls hand the press to `history.back()`, so they and the browser's own Back
do exactly the same thing. `depth` counts how many entries behind us are ours; at zero — you
followed a link straight to `#hub` — a Back control draws the front page itself rather than
leaving the site. `popstate` is the only place a view is drawn in response to history, and
every call from it passes `push=false` so a press of Back cannot push a new entry.

## News in two places

`news.html` is the record — the full list, newest first. The `#news` section on the home
page is a digest of the newest few and a link to the page.

**To add an entry:** put it at the top of the `<ul>` in `news.html` first, then copy the
same `<li>` to the top of the list in the News section of `index.html` and drop the oldest
one off the bottom. Two edits, deliberately — a home page that grows a news column is a home
page nobody reaches the bottom of.

## The bar

**The same six items on every page that has one** — About, Music, Blog, News, Contact, CV.
Four of them are sections of `index.html`, so from the home page they are bare fragments
(`#about`, `#blog`); from every other page they carry the file name (`index.html#blog`),
because from there they point home rather than at themselves. News is the exception: it
points at `news.html` from the other pages and at the `#news` digest from the home page, so
each one lands on the fullest version of that thing available from where you are.

**The two games have the bar now.** Same six items, same dark glass, fixed to the top. It
stands down in landscape on a phone, where 58px out of about 400 is a seventh of the frame
and the game needs the room more than the bar does.

**Spacing is walk.html's on every page.** The home page used to inset its bar 3rem and drop
the link row at 900px while the walk inset 5.25rem and held the row to 701px. Both are the
walk's numbers now, at both breakpoints: between 701 and 1100 the row scrolls sideways
inside its own box with a tighter 1.6rem gap, and below 701 the hamburger takes over.

## Other changes in this round

- Both games have a **Back** button, top left under the bar, same pill in both.
  `letters.html`'s moved there from the bottom right corner; `quiz.html` had none.
  "Call your reps" stays bottom left on the letter game.
- **Back means back.** `goBack()` calls `history.back()` — one step in this tab, wherever you
  came from, restored at the scroll position you left it at and with nothing refetched. It
  used to insist the previous page was the walk and navigate there otherwise, which said "back
  to the walk" to people who had never been on it. The only condition left is
  `history.length > 1`, false when the game was opened in a new tab; there the press follows
  the href, which still points at `walk.html` as the sensible place to land.
- **`walk.html` keeps its menu up while the loading sheet is down.** The article is 1.9 MB and
  the sheet can hold for several seconds; someone who only wanted the blog should not have to
  watch a progress bar finish first. Over the sheet the bar is lighter (`.62` rather than `.72`
  alpha, so the pale sky shows through instead of a black stripe), its hairline goes soft
  white, and it arrives once with a short rise. It settles back to the ordinary bar on the same
  half second the sheet fades.
- The livestream logo in the bottom right of both games is at 60% — every number in the rule,
  phone sizes included.
- `quiz.html`: the Interviews chip points at `blog.html#hub`.
- `walk.html`: the "Blogs" pill points at `blog.html#hub`. `walk-WRITE.html` got the
  same link edits, so the two stay in step for the merge tool.
- **The middle of the page is one gradient cut into four.** The cloud chamber, News, Blog and
  Publications used to be flat blocks with hard edges between them; each now carries a
  gradient from the colour the section above it ended on to its own end colour, so the page
  cools from an almost-white lavender into the pale blue Publications already wore without a
  visible seam anywhere. Five stops, listed above `.chamber` — change one and change it in
  both places it appears or a seam opens.
- The short rules under the centred headings are gone. Six of them down one page read as six
  horizontal marks, and the tone change between sections does that job without drawing a line.
- The footer's two lines are white. They were at half and a fifth alpha on a near-black bar,
  which put the credit at about 1.6:1.
- **Smooth scrolling is back, on `index.html` only.** The home page is one long page with a
  bar pointing at four parts of it, so a menu click is travel between two parts of the same
  thing and the glide says so. `scroll-padding-top:58px` is the other half — without it every
  glide parks the heading under the sticky bar. Reduced motion gets the jump.
- **The hero is the photograph** `back_new.png`, with an angled scrim over it — heaviest at
  the left where the name and both paragraphs sit (.72), lightest at the right where there is
  nothing but sky (.30). White lands around 13:1 behind the headline. A flat navy sits under
  the image as the floor, so a slow fetch or a 404 reads as a plain dark hero rather than a
  broken one, and there is a `<link rel="preload" as="image">` in the head. The hero is pulled
  up 58px behind the sticky bar and gives the same 58px back as top padding, so the sky starts
  at pixel zero and the bar floats on it as a smoked strip.
- **Nothing under the bar flickers.** A sticky, semi-transparent strip with a backdrop blur
  re-samples that blur as the page scrolls under it, and a browser that has not given it a
  layer of its own re-rasterises the strip on frames it cannot keep up with — seen as the bar
  flashing or the sections tearing across it. An identity 3D transform on the bar, the mobile
  menu and the hero puts each on its own layer. Not `will-change`: that is the right hint for
  something about to animate and the wrong one for something that sits still for a whole visit.
- Three links became buttons, matching "See all blog posts": "See all news", "View full list
  on Google Scholar" and "More on the Koehler•Foisy Films page". The arrows came off, since
  the button they are matching has none.
- The hero was a gradient for a round rather than a flat navy — deep navy at the top left, where the name
  and both paragraphs sit, opening to the blue the buttons use by the far corner. Three
  knobs: `--hero-1`, `--hero-2`, `--hero-3` on `.hero`.
- The middle of the home page had grown eyebrow-plus-headline pairs that said the same thing
  twice ("News" over "What's new"). Those sections — News, Blog, Publications, Music, TikTok,
  Photo Gallery — now carry one centred `.sec-hd` heading with a short rule under it, and the
  standfirst lines under Music and TikTok are gone.
- The standing bio paragraph under the interviews is justified — both edges straight — and
  falls back to left-aligned below 600px, where there is no measure to justify against.

## `index.html` needs its images

The files it references — `photo.jpg`, `favicon.png`, `animation_fixed.mp4`,
`aerosol_photos.png`, `sky_composite.png`, `new_break.png`, `hour_0.png`, `speech.png`,
`origami.png`, `snow1`–`snow7.png` and the rest — are not in this folder. They should already
be in the repo; only the HTML changed. The blog artwork and the interview clips come from the
CDN and need nothing local.

## The visit counter

All seven pages carry a small snippet at the very bottom that records one view, plus the host
the visitor arrived from. No cookies, no identifiers, nothing written to the reader's
machine — so no consent banner and nothing to click past.

It needs somewhere to keep the tally, because GitHub Pages has no server of its own. Until
you give it one, every page records nothing and breaks nothing: the request is wrapped and
fails silently.

**To switch it on:** pick a counter service, then set `COUNTER` to its base URL in two
places — the snippet at the foot of each of the seven pages, and the top of the script in
`stats-7f3a9c21.html`. That is the only edit.

What you get: views per page, referring hosts, and a 30-day chart. What you do not get:
unique visitors, sessions, or where anyone went next — those need an identifier, which is
the thing this deliberately does not mint.

`blog` is in the dashboard's list and is a live page again; its tally is unbroken across the
round it spent off the site, because the key was never dropped from that list.

## About that "private" link

`stats-7f3a9c21.html` is unlisted, not private. Nothing links to it, it asks search
engines to skip it, and the filename is unguessable — but it sits in a public repo on a
public host, so anyone who learns the URL can open it. Real privacy needs a login, which
needs a server.

## Uploading

Upload the files, not the folder, or everything lands one directory deep. And delete the old
`blog.html` from the repo — nothing points at it any more, but it will keep serving itself to
anyone with the address.
