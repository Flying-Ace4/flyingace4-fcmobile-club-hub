# M4CROPHAGE Club Hub v0.2

A mobile-first static football club dashboard for the M4CROPHAGE FC Mobile H2H archive.

## Included

- Home dashboard
- Bottom navigation
- Match archive
- Tappable match detail dialogs
- Player statistics
- Formation analytics
- Goalkeeper Centre
- Captaincy records
- Verified club news
- Central `data.json`
- GitHub Pages-ready static structure

## Run locally

Because the app loads `data.json` with `fetch`, serve the folder through a small local web server.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

1. Upload all project files to the root of a GitHub repository.
2. Open repository **Settings → Pages**.
3. Set the source to **Deploy from a branch**.
4. Choose the `main` branch and `/root`.
5. Save and open the generated Pages URL.

## Updating archive data

Edit only `data.json` for match, player, formation, goalkeeper, captaincy, and news records. The interface reads from that central source.

Do not invent missing assists or other match details. In S1-M002, assist names are recorded without scorer-assist mapping.

## Rebranding

Change the `branding` object in `data.json`:

- `clubName`
- `crestText`
- `primary`
- `secondary`
- `background`
- `surface`
- `accent`

## Version

v0.2.0
