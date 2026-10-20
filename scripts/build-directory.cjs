const { readFileSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { parseCSV, uniqueValues, telephoneLink } = require('../site.js');
const root = resolve(__dirname, '..');
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderDirectory(stores) {
  const sections = uniqueValues(stores, 'division').map(division => {
    const entries = stores.filter(store => store.division === division).sort((a,b) => a.town.localeCompare(b.town) || a.name.localeCompare(b.name));
    return `<section class="directory-region"><h4>${escapeHTML(division)}</h4>\n${entries.map(store => {
      const phone = telephoneLink(store.phone);
      return `<article class="directory-store"><div><h5>${escapeHTML(store.name)}</h5><p>${escapeHTML(store.town)} · ${escapeHTML(store.province)}</p></div>${phone ? `<a class="phone" href="${phone}" data-directory-phone data-store-name="${escapeHTML(store.name)}" data-town="${escapeHTML(store.town)}" data-province="${escapeHTML(store.province)}" data-division="${escapeHTML(store.division)}" aria-label="Call ${escapeHTML(store.name)} on ${escapeHTML(store.phone)}">Call ${escapeHTML(store.phone)} ↗</a>` : ''}</article>`;
    }).join('\n')}\n</section>`;
  });
  return `<details class="stockist-directory"><summary>View the full Fiji stockist directory</summary><p class="directory-note">${stores.length} listed OrganicPlus stockists. Harvest Booster was formerly called Liquid Compost. Call ahead to confirm stock, pack sizes and price.</p>\n${sections.join('\n')}\n</details>`;
}
const start = '<!-- STOCKIST-DIRECTORY:START -->';
const end = '<!-- STOCKIST-DIRECTORY:END -->';
if (require.main === module) {
  const index = resolve(root, 'index.html');
  const html = readFileSync(index, 'utf8');
  const from = html.indexOf(start), to = html.indexOf(end);
  if (from < 0 || to <= from) throw new Error('Stockist directory markers missing or invalid.');
  const stores = parseCSV(readFileSync(resolve(root, 'retailers.csv'), 'utf8'));
  if (!stores.length) throw new Error('Retailer directory is empty.');
  writeFileSync(index, html.slice(0, from + start.length) + '\n' + renderDirectory(stores) + '\n' + html.slice(to));
  console.log(`Updated crawlable directory: ${stores.length} stockists.`);
}
module.exports = { renderDirectory, start, end };
