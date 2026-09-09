# NYC to DC walk — site files

Nine files, no build step, no dependencies. Drop them in the repo root next to your
existing images and GitHub Pages serves them as they are.

| File | What it is |
|---|---|
| `index.html` | The home page. Also the news digest (`#news`) and the blog's three cards (`#blog`). |
| `walk.html` | The article. Links out to the interviews, both games, and the home page. |
| `blog.html` | **Back.** The original blog page, whole — reached from "See all blog posts". |
| `interviews.html` | The fourteen conversations, and the player they open in. |
| `challenges.html` | The two games. |
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

## The blog, folded into the home page

`index.html#blog` is the old blog front page: the same three cards, in the home page's
own light palette instead of the blog's dark one. Every card is a plain anchor that leaves
for a page of its own — no script, no panel, and middle-click and cmd-click behave.

- **Card 1** → `walk.html`, as it did before.
- **Card 2** → `interviews.html`. Clicking a portrait there opens the clip over the page.
- **Card 3** → `challenges.html`. The tiles are real links now — `quiz.html` and
  `letters.html`.

**To add a fifteenth interview:** add a row to `INTERVIEWS` in the script at the foot of
`interviews.html` — name, title, mile, date, cover, poster, video, srt — and nothing else.
The wall builds itself from that list and the player reads it.

**Captions** are the same `CC_CUES` block the blog carried, moved across word for word, so
the clips caption exactly as they did and exactly as they do on `walk.html`. A clip with no
entry in `CC_CUES` falls back to fetching its `.srt` from the CDN, which works only if the
CDN sends `Access-Control-Allow-Origin` for `.srt` files.

**Old post links still land.** `interviews.html#post-hikaru` and the rest are the same
anchors `blog.html` used, so a link to one conversation still opens that conversation.

What did not come across: the blog's custom video curtain, its share sheet, and its
poster-hover animation. The player is the browser's own, which is what makes the CC button
appear in the control bar and survive full screen.

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
- `quiz.html`: the Interviews chip points at `interviews.html`.
- `walk.html`: the "Blogs" pill points at `interviews.html`. `walk-WRITE.html` got the
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
- The hero is a gradient rather than a flat navy — deep navy at the top left, where the name
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

The dashboard still asks for the `blog` key. The page is gone, so the number stops climbing,
but the views it took before the merge are still there and dropping the name is the one way
to lose them.

## About that "private" link

`stats-7f3a9c21.html` is unlisted, not private. Nothing links to it, it asks search
engines to skip it, and the filename is unguessable — but it sits in a public repo on a
public host, so anyone who learns the URL can open it. Real privacy needs a login, which
needs a server.

## Uploading

Upload the files, not the folder, or everything lands one directory deep. And delete the old
`blog.html` from the repo — nothing points at it any more, but it will keep serving itself to
anyone with the address.
