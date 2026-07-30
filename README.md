# M4CROPHAGE Club Hub v0.3

## What changed
- Complete match-driven data model through S1-M004
- Dashboard totals derived automatically from match records
- Player goals, assists, GVA, captaincy, and timelines derived automatically
- Tappable player dossiers
- Formation analytics calculated from matches
- Goalkeeper Centre calculated from match logs
- Captaincy records calculated from matches
- Club records
- Archive-generated news
- Clean SVG bottom-navigation icons
- Conservative appearance tracking when full lineups are unavailable

## Updating after a match
Add one complete match object to `data.json`, update:
- `meta.dataThrough`
- `current.nextMatch`
- `current.formation`
- `current.captain`

The app recalculates record, points, GF, GA, GD, player production, formations, goalkeeper totals, captaincy, records, and news in the browser.

## GitHub Pages update
Upload and replace these files in the repository root:
- index.html
- 404.html
- styles.css
- app.js
- data.json
- manifest.webmanifest
- README.md

Commit directly to `main`. GitHub Pages will republish automatically.
