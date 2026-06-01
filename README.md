# KPIH Deal Room — Osnat & Erez

Private, mobile-first, cinematic one-pager presenting 4 Koh Phangan villas.
`noindex`. Static (HTML + CSS + vanilla JS), zero build step. Deploys to GitHub Pages.
Design prototype that graduates into the KPIH (Next.js) Project Detail Page system.

## Structure
```
kpih-deal-room/
├─ index.html              ← page (copy is hardcoded HE; English project names)
├─ assets/
│  ├─ js/app.js            ← media loader + lightbox + parallax + reveals
│  └─ data/media.js        ← THE MEDIA DB (Cowork fills this)
├─ images/<slug>/          ← hero, srithanu, nai-wok, red-sunset, koma
└─ videos/<slug>/          ← per-project video
```
Project order is fixed: Srithanu → Nai Wok → Red Sunset → Koma.

## How it works
`index.html` has empty slots (`data-hero`, `data-cover="<slug>"`, `data-gallery="<slug>"`).
`app.js` reads `window.MEDIA` from `media.js` and injects covers + builds galleries.
Empty galleries render a labelled placeholder so missing media is obvious.

## Phase 1 — Cowork (media curation)
Drop curated assets into `images/<slug>/` + `videos/<slug>/`, then fill `assets/data/media.js`
(schema + rules are documented inside that file). Hero = best sea/island/sunset/drone frame.

## Phase 2 — Claude Code (build + deploy)
Verify media.js, polish gallery/transitions, local check
(`python3 -m http.server 8765`), then `gh repo create` + GitHub Pages → return URL.

## Phase 3 — Claude in Chrome (QA)
Mobile 375px: covers, parallax, gallery → lightbox swipe, WhatsApp CTAs.

WhatsApp routes to `wa.me/972507308658` with per-project prefilled messages.
