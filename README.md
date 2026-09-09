# NYC to DC walk — site files

Five files, no build step, no dependencies. Drop them in the repo root next to your
existing `index.html` and GitHub Pages serves them as they are.

| File | What it is |
|---|---|
| `index.html` | The home page. |
| `walk.html` | The article. Links out to the blog, both games, and the home page. |
| `blog.html` | The interview blog. `walk.html#games` sends readers here via `blog.html#hub`. |
| `news.html` | A dated list of what you have been up to. Add entries at the top of the `<ul>`. |
| `letters.html` | The Letter Collection Game. |
| `quiz.html` | Quiz Time: Climate Walk Trivia. |
| `stats-7f3a9c21.html` | Your visit counter. Unlisted, not linked from anywhere. |

## What was connected

- The two game tiles above the comments on `walk.html` were `<button>`s with nowhere to
  go. They are `<a href>` now, pointing at `quiz.html` and `letters.html` — so they open
  in a new tab on a middle click and can be copied like any other link.
- `letters.html` had no way back to the site at all. It has a quiet "Back to the walk"
  link in the corner, mirroring the "Call your reps" link opposite it.
- `walk.html` linked home with root-relative `href="/"` and `href="/#about"`. Those only
  work if the site is at the root of a domain. They are `index.html` and `index.html#about`
  now, which is what `blog.html` already used and which works either way — user site,
  project site under `/reponame/`, or a custom domain.

**The bar is the same six items on all four pages that have one** -- About, Music, Blog,
News, Contact, CV. On `index.html` the two hash links are bare fragments (`#about`); on the
other three they carry the file name (`index.html#about`), because from those pages they are
pointing home rather than at themselves. The two games have no bar.

**`index.html` needs its images.** Twenty files it references -- `aurora.png` is gone but
`photo.jpg`, `favicon.png`, `animation_fixed.mp4`, `snow1`-`snow7.png` and the rest are not
in this folder. They should already be in the repo; only the HTML changed.

## The visit counter

All six pages carry a small snippet at the very bottom that records one view, plus the host
the visitor arrived from. No cookies, no identifiers, nothing written to the reader's
machine — so no consent banner and nothing to click past.

It needs somewhere to keep the tally, because GitHub Pages has no server of its own. Until
you give it one, every page records nothing and breaks nothing: the request is wrapped and
fails silently.

**To switch it on:** pick a counter service, then set `COUNTER` to its base URL in two
places — the snippet at the foot of each of the six pages, and the top of the script in
`stats-7f3a9c21.html`. That is the only edit.

What you get: views per page, referring hosts, and a 30-day chart. What you do not get:
unique visitors, sessions, or where anyone went next — those need an identifier, which is
the thing this deliberately does not mint.

## About that "private" link

`stats-7f3a9c21.html` is unlisted, not private. Nothing links to it, it asks search
engines to skip it, and the filename is unguessable — but it sits in a public repo on a
public host, so anyone who learns the URL can open it. Real privacy needs a login, which
needs a server.
