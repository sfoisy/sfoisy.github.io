# NYC to DC walk — site files

Eight files, no build step, no dependencies. Drop them in the repo root next to your
existing images and GitHub Pages serves them as they are.

| File | What it is |
|---|---|
| `index.html` | The home page. Also the news digest (`#news`) and the blog's front page (`#blog`). |
| `walk.html` | The article. Links out to the interviews, both games, and the home page. |
| `interviews.html` | **New.** The fourteen conversations, and the player they open in. |
| `challenges.html` | **New.** The two games. |
| `news.html` | The full dated list. Add entries at the top of the `<ul>`. |
| `letters.html` | The Letter Collection Game. |
| `quiz.html` | Quiz Time: Climate Walk Trivia. |
| `stats-7f3a9c21.html` | Your visit counter. Unlisted, not linked from anywhere. |

`blog.html` is gone. Its front page is the `#blog` section of `index.html`; its two inner
views are `interviews.html` and `challenges.html`.

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

- Both games have "Back to the walk" now, top left under the bar, same pill in both.
  `letters.html`'s moved there from the bottom right corner; `quiz.html` had none.
  "Call your reps" stays bottom left on the letter game.
- **The back link goes BACK, not to a fresh copy of the walk.** If you reached the game from
  `walk.html` in the same tab, `backToWalk()` calls `history.back()` — so the browser restores
  the article at the scroll position you left it at, and does not refetch 1.9 MB. A shared
  link, a bookmark, or a game opened in a new tab has nothing behind it, so the press falls
  through and follows the href as before.
- The livestream logo in the bottom right of both games is at 60% — every number in the rule,
  phone sizes included.
- `quiz.html`: the Interviews chip points at `interviews.html`.
- `walk.html`: the "Blogs" pill points at `interviews.html`. `walk-WRITE.html` got the
  same link edits, so the two stay in step for the merge tool.
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
