# Harvest Booster landing page

Static HTML, CSS and JavaScript for OrganicPlus Fiji. The `main` branch publishes the production site at https://www.baywaterfiji.com/. The `harvest-booster` branch is the review preview.

The page follows the OrganicPlus marketing playbook: “More flowers. More fruit. More to harvest.” For flowering and fruiting crops, start at first flowers, repeat every 7 days and continue until harvesting finishes. Harvest Booster complements normal fertiliser or manure. Printed packaging retains its supplied artwork; the standalone logo uses the newly supplied lockup. “Better farming made simple.” appears in the surrounding brand copy.

## Run checks

```sh
node --test tests/*.test.cjs
node --check site.js
node --check analytics.js
```

Deploy the repository as a static Vercel site: no framework, build command or dependencies. The output directory is the repository root. Git updates to `main` create production deployments. Updates to `harvest-booster` create preview deployments. The existing custom domain is already connected to Vercel; baywaterfiji.com redirects to www.baywaterfiji.com.

## Store directory

After changing the directory, run `node scripts/build-directory.cjs` to refresh the expandable HTML directory, then run the tests. The committed HTML must match the CSV so search engines and visitors without JavaScript can read the same stores.

Edit `retailers.csv`, preserving headers `Division,Province,CityTownVillage,Store Name,Phone`. Town/store search is the first step, with optional cascading area filters. The directory is not live stock information. Telephone links use Fiji country code +679. No distance rankings or unverified directions are presented.

## Brand and images

The supplied 500px logo is preserved exactly in `assets/organicplus-logo-source.png`; CSS displays the visible horizontal lockup without its transparent margins. Neue Montreal WOFF files are converted from the supplied brand fonts. The hero uses a transparent cutout of the supplied pouch, staged with CSS, with the original mockup also retained. Farmer photographs are existing supplied assets, optimised as WebP; they remain attributed to the earlier Liquid Compost name. No simulated farmer testimonials are used.

The former-name mentions are temporary transition copy. Keep label dilution directions as the source of mixing rates. Prices, live stock availability and new results must be confirmed before adding them.

## Responsive review

On the `harvest-booster` preview branch, `/qa/responsive.html` is an unlinked, noindex review page that renders the real landing page at 360, 390, 430 and 1280 CSS-pixel widths. It supports narrow-viewport visual testing; it does not emulate an actual phone, Facebook in-app browser or mobile network. Check those on physical devices before campaign launch. The review page is excluded from production. Keep it on the preview branch for future review.

## Preview verification

The October 2026 preview passed all six Node retailer tests and the JavaScript syntax check. Live browser review covered 360, 390 and 430px iframe viewports and a 1280px desktop iframe. No horizontal document overflow was found; all displayed images loaded. Checked store search (Hop Tiy and its +679 call link), no-results handling, reset, browsing all 65 stores, loading 6 then 12, and Central → Serua → Navua filtering (4 results). Also checked mobile navigation, the weekly-use FAQ and the photo-gallery arrows. Browser extension metadata errors were excluded from app results.

Physical phone, iOS/Android keyboard and Facebook in-app browser testing remain before campaign launch.

## Website tracking

`analytics.js` loads Google Analytics 4 (`G-L75K1MQ8L3`) and Meta Pixel (`2387761571964957`) asynchronously, only on `www.baywaterfiji.com` or `baywaterfiji.com`. Localhost and Vercel preview domains send no analytics. It runs before `site.js`; page views are initialized once, with subsequent interactions sent as GA4 events and Meta custom events using the same names. The IDs are public identifiers, not credentials. No server-side Conversions API is installed.

| Event | Trigger | Parameters |
| --- | --- | --- |
| `find_store_click` | A link to the store finder is tapped | `placement` (hero, header, mobile_sticky, closing, faq) |
| `store_search` | Search/filter settles for 800ms, or text search is committed by blur/Enter; pending state is flushed before a retailer call or page hide | `search_method`, `result_count`, selected directory-backed `division`, `province`, `town` |
| `retailer_call_click` | A retailer telephone link is tapped | `store_name`, `town`, `province`, `division` |
| `store_browse` | Browse all stores is tapped | `result_count` |

Free-text queries and retailer phone numbers are not included in custom event parameters. Repeated identical searches are deduplicated until the criteria change or Reset is pressed. Initial directory loading and Show more do not generate search events. A search with zero matches is still measured. A telephone tap measures intent, not a completed call or purchase; do not assign purchase revenue to it. Use consistently tagged campaign URLs to distinguish testimonial and still-image ads.

Verify delivery in Meta Events Manager's Test Events and GA4 Realtime. Mark the chosen events as key events in GA4 and configure Meta custom conversions separately in those accounts if needed; website installation does not change account settings. Tracking requires JavaScript and may be blocked by browser privacy settings or ad blockers. Keep the site's privacy disclosures and consent configuration aligned with how these tools are used.

## Search visibility

The production homepage uses a Fiji-specific title and description, a self-referencing canonical URL, matching share metadata, and Organization/WebSite/WebPage JSON-LD. The approved campaign heading and usage guidance are retained. Retailer names, towns and call links are present in a native expandable HTML directory; the interactive finder remains the primary journey. Retailers are independent stockists and are not marked up as OrganicPlus-owned branches. There are no fabricated prices, ratings, certifications or stock claims, and no FAQ/Product rich-result eligibility claims.

`robots.txt` allows crawling and points to `sitemap.xml`, which lists only the canonical homepage. When materially updating the page, keep the sitemap's lastmod accurate. A sitemap helps discovery but does not guarantee indexing or rankings. There are no separate town/crop pages yet; do not create duplicated location pages for every town.

Use Google Search Console to verify `https://www.baywaterfiji.com/` (or verify the full domain via DNS). Submit `sitemap.xml` and inspect/request indexing of the homepage. GA4 ownership verification may be available for an account with the necessary Analytics permissions; otherwise add Google's exact verification tag when supplied by the site owner. No Search Console verification token or account change is included in this release. Monitor impressions, clicks, queries and mobile performance there; the GA4/Meta events measure the subsequent store-finder journey.
