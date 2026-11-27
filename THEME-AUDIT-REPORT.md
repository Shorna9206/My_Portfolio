# Portfolio Visual & Theme Audit

Audit date: 2026-11-27

## Scope
- Full web frontend source, styles, theme toggle, SVG artwork, favicon assets, and hero portrait wiring
- Admin frontend styling and theme setup reviewed separately
- Backend routes/config reviewed for UI theme impact (none; backend does not render UI)

## Changes applied to the web frontend
1. Consolidated the website's theme tokens into one coffee/champagne palette:
   - Dark: espresso `#160F0C`, chocolate `#211611`, champagne `#C99A70`
   - Light: warm ivory `#F5F0E9`, warm surface `#FFFAF4`, coffee accent `#94613F`
2. Removed remaining green/teal tokens and tints from web CSS and SVG placeholders/project artwork.
3. Replaced the old green-tinted research orb with a theme-aware champagne/coffee orb.
4. Reworked fixed dark-green sections and footer backgrounds to use theme variables.
5. Updated resume sheet colors to warm paper/coffee tones, including print styles.
6. Updated favicon SVG, 16px/32px PNG, and Apple touch icon.
7. Improved theme behavior:
   - Saved light/dark choice is applied before React mounts to avoid a flash of the wrong theme.
   - localStorage access has safe fallbacks.
   - Browser color-scheme and mobile browser theme-color follow the selected theme.
   - Theme toggle has an explicit accessible label.
8. Added `profile.heroImage` to the default web/admin profile data so the hero portrait can be changed through the admin profile JSON later.

## Contrast checks
Ratios calculated for the core text/accent combinations (WCAG AA normal-text target: 4.5:1):
- Dark body text: 16.48:1
- Dark muted text: 8.13:1
- Dark accent text: 7.53:1
- Dark button text: 7.37:1
- Light body text: 15.15:1
- Light muted text: 4.81:1
- Light accent text: 4.58:1
- Light button text: 5.01:1

All listed combinations meet or exceed 4.5:1.

## Admin panel findings — intentionally not redesigned yet
The admin panel has a separate stylesheet (`frontend/admin/src/style.css`) and does not inherit the website's CSS variables. It still uses the previous lime/green accent (`#D4F17B`, `#A8C65B`) and forest-green login artwork. No admin visual redesign was made in this pass, as the admin update is the next separate step. The `heroImage` profile field is present in its default profile data for future editing.

## Validation performed
- Web CSS parse: 0 errors
- Admin CSS parse: 0 errors
- Node syntax checks for `.js` files: 16 passed, 0 failed
- Previous green palette tokens in web source/assets: 0 remaining
- ZIP integrity: verified after packaging

## Not run
A full Vite production build/browser visual regression was not run because this project copy does not include `node_modules`. After installing dependencies, run `npm install` and then `npm run build` from the relevant frontend directory(s).

## Files changed
- `frontend/web/src/styles/global.css`
- `frontend/web/src/App.jsx`
- `frontend/web/src/components/Navbar.jsx`
- `frontend/web/src/components/ThreeOrb.jsx`
- `frontend/web/src/data/portfolio.js`
- `frontend/web/index.html`
- `frontend/web/public/assets/*` (theme-related SVG and favicon assets)
- `frontend/admin/src/data/portfolio.js` (default profile field only)

Backend files and admin styling were left unchanged.
