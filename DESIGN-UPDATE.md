# Shorna Portfolio — Coffee Editorial Theme Update

- Replaced the shared profile portrait at `frontend/web/public/assets/profile.png` with the newly supplied 2048×2048 studio portrait.
- Updated the home hero headline to `Researcher, Programmer & Developer.`
- Rebuilt the hero treatment as a full-height editorial split composition: copy on the left, clear studio portrait on the right, with a soft edge blend rather than blur or washed-out filters.
- Unified the public website around espresso, warm ivory, cocoa and champagne tones.
- Reworked dark and light theme variables and shared styles for navigation, buttons, page headers, cards, forms, resume, footer, loaders and interactive accents.
- Updated the admin panel accent palette to match the public portfolio.
- Preserved the existing React routes, Firebase content sync, API integration, admin editing workflow and portfolio sections.

## Run locally

From the repository root:

```bash
npm run install:all
npm run dev:web
```

In separate terminals, use `npm run dev:admin` and `npm run dev:api` when needed.


## Final palette revision
The previous espresso/copper color scheme has been replaced with a restrained
Midnight Plum + Dusty Rose palette. Dark mode uses plum-charcoal surfaces and
soft rose accents; light mode uses pale mauve/ivory surfaces with muted berry
accents. The supplied portrait image is not color-filtered or recolored.
