# OrganicPlus Harvest Booster

A buildless landing page for Harvest Booster, formerly Liquid Compost. The existing Vercel project can serve it directly; no package installation, framework change or build command is required.

## Files

- `index.html`: page sections and copy.
- `styles.css`: crimson-and-white identity, responsive layouts and reduced-motion settings. Neue Montreal is the preferred font when installed; Arial is the current fallback.
- `site.js`: navigation, harvest gallery and retailer finder. No third-party JavaScript dependencies.
- `assets/harvest-booster-5l.png`: the supplied pouch mockup, unchanged.
- `retailers.csv`: existing retailer directory. Update this file to maintain store information. The finder expects `Division,Province,CityTownVillage,Store Name,Phone`.
- Existing root-level photographs remain in use.

## Preview and checks

Run a static server from this directory, for example `python -m http.server 8000`, then open `http://localhost:8000`. Serve over HTTP so the retailer CSV can load; opening the HTML directly from disk does not support the store finder.

Run `node --check site.js` and `node --test tests/locator.test.cjs` for JavaScript and retailer-data checks.

## Review and deployment

Keep the work on `harvest-booster`. With Vercel's Git integration, a push to this branch should create a preview deployment when preview deployments are enabled. Review the mobile and desktop layouts, images, store filters, phone links and FAQ before merging to the production branch.

Existing farmer photos and Saiasi's original testimonial retain the Liquid Compost name. The page explains the change to Harvest Booster. Product application instructions defer to the approved pack and crop programme. Confirm retailer stock and any final application rates before publication.

Before launch, replace `logo.png` if a newer standalone OrganicPlus logo is available, add licensed webfont files if desired, and update the absolute `og:image` URL if the production domain changes from baywaterfiji.com. No analytics, tracking, forms or new data collection are included.
