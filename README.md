# OrganicPlus website — review preview

This branch (`organicplus-site-preview`) is a review of the OrganicPlus website structure. Production remains on `main` at https://www.baywaterfiji.com/. Do not promote this branch until the review is complete.

## Pages

- `/`: OrganicPlus Fiji homepage and product family.
- `/harvest-booster/`: the existing Harvest Booster landing page, preserving the approved promise, exact introduction, farmer attribution, gallery, weekly routine and inline store finder.
- `/growth-booster/`: supplied Growth Booster packaging and a clear Coming soon status. No launch date, dosage, price, waitlist or in-store availability is promised.
- `/stockists/`: Harvest Booster retailer finder and the full HTML directory. Growth Booster is explicitly not yet listed as available.
- `/about/` and `/about/#contact`: concise company introduction and OrganicPlus Fiji Facebook contact. No invented email, phone, address or company history.

The current brand, tagline, fonts and lime accent are retained. Red remains a Harvest Booster cue. Farmer stories and photos refer to Liquid Compost/Harvest Booster; they are not presented as Growth Booster evidence. Supplied packaging artwork is unchanged; WebP files are format-optimised for web use. Growth Booster's printed mockup retains its supplied legacy wording.

## Development

Static HTML/CSS/JS with no runtime framework or build dependencies. The files are committed so Vercel can serve the repository root without a build command.

```sh
node scripts/build-preview.cjs
node --check site.js
node --check analytics.js
node --test tests/*.test.cjs
```

Edit shared page content/layout in `scripts/build-preview.cjs`; the existing product content lives in `templates/harvest-body.html`. Editing the generated HTML directly will be overwritten by the generator. After updating `retailers.csv`, rebuild to regenerate matching directories on both the product and stockist pages. Directory rows stay readable without JavaScript. Data, parsing and international phone formats are shared across the finders.

## Review and mobile checks

`/qa/responsive.html` displays the actual pages at 360, 390, 430 and 1280 CSS pixels. It is a layout review harness, not physical iOS/Android or Facebook browser emulation. Test menu navigation, product links, search, filters, reset, browse, pagination, phone destinations and Coming soon handling. No tracking should load on the Vercel preview host.

## Tracking and launch readiness

Existing GA4 and Meta IDs are retained. The hostname guard in `analytics.js` restricts tracking to the live baywaterfiji.com hostnames. Shared events include page type and product context; product links add `product_view_click`. Product calls and searches retain the existing event names. Free-text searches are excluded from custom event parameters.

This is a deliberately non-indexable preview: generated pages have `noindex,follow`, and robots.txt disallows crawling. The canonical URLs and draft sitemap describe the proposed production paths. BEFORE LAUNCH, replace preview indexing directives with production rules, update the sitemap's modification date, remove the QA harness from production, check canonical/OG URLs, validate existing ad/QR/bookmark destinations, and keep the Google verification tag. Do not redirect the homepage away from the brand homepage; explicitly update product campaign links to `/harvest-booster/`. The old homepage's `#locator` anchor remains a route to store-finding on the proposed homepage.

Confirm Growth Booster's final product promise, trigger, application programme and launch availability before publishing fuller product guidance. Confirm future contact information before adding channels beyond the verified OrganicPlus Fiji Facebook page.

A later OrganicPlus Pacific domain migration is a separate release and is not included in this preview.
