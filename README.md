# Harvest Booster landing page

Static HTML, CSS and JavaScript for OrganicPlus Fiji. The `harvest-booster` branch is the review preview; keep `main` as the existing production site until approval.

The page follows the OrganicPlus marketing playbook: “More flowers. More fruit. More to harvest.” For flowering and fruiting crops, start at first flowers, repeat every 7 days and continue until harvesting finishes. Harvest Booster complements normal fertiliser or manure. Printed packaging retains its supplied artwork; the standalone logo has no tagline. “Better farming made simple.” appears in the surrounding brand copy.

## Run checks

```sh
node --test tests/locator.test.cjs
node --check site.js
```

Deploy the repository as a static Vercel site: no framework, build command or dependencies. The output directory is the repository root. Git updates to the preview branch should create a new preview deployment.

## Store directory

Edit `retailers.csv`, preserving headers `Division,Province,CityTownVillage,Store Name,Phone`. Town/store search is the first step, with optional cascading area filters. The directory is not live stock information. Telephone links use Fiji country code +679. No distance rankings or unverified directions are presented.

## Brand and images

The supplied 500px logo is preserved exactly in `assets/organicplus-logo-source.png`; CSS displays the visible horizontal lockup without its transparent margins. Neue Montreal WOFF files are converted from the supplied brand fonts. The hero uses a transparent cutout of the supplied pouch, staged with CSS, with the original mockup also retained. Farmer photographs are existing supplied assets, optimised as WebP; they remain attributed to the earlier Liquid Compost name. No simulated farmer testimonials are used.

The former-name mentions are temporary transition copy. Keep label dilution directions as the source of mixing rates. Prices, live stock availability and new results must be confirmed before adding them.

## Responsive review

`/qa/responsive.html` is an unlinked, noindex review page that renders the real landing page at 360, 390, 430 and 1280 CSS-pixel widths. It supports narrow-viewport visual testing; it does not emulate an actual phone, Facebook in-app browser or mobile network. Check those on physical devices before campaign launch. Do not promote the QA page to production when the preview is approved.
