const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { parseCSV, filterStores, uniqueValues, telephoneLink } = require('../site.js');
const stores = parseCSV(readFileSync(resolve(__dirname, '../retailers.csv'), 'utf8'));

test('the supplied retailer directory loads every complete row and all five regions', () => {
  assert.equal(stores.length, 65);
  assert.deepEqual(uniqueValues(stores, 'division'), ['Central', 'Eastern', 'Northern', 'Rotuma', 'Western']);
  assert.ok(stores.every(store => telephoneLink(store.phone)));
});
test('quoted store names, escaped quotes, BOM and CRLF survive CSV parsing', () => {
  const input = '\uFEFFDivision,Province,CityTownVillage,Store Name,Phone\r\nCentral,Rewa,Suva,"Farm, \"\"Seed\"\" & Supply",3300875\r\n\r\n';
  assert.equal(parseCSV(input)[0].name, 'Farm, "Seed" & Supply');
});
test('invalid headers and truncated quoted fields produce a usable error path', () => {
  assert.throws(() => parseCSV('Division,Store Name\nCentral,Shop'), /headers/);
  assert.throws(() => parseCSV('"unterminated'), /unclosed/);
  assert.deepEqual(parseCSV(''), []);
});
test('cascading location filters do not include a similarly named place in another region', () => {
  const island = filterStores(stores, { division: 'Eastern', province: 'Lau', town: 'Lakeba Island' });
  const village = filterStores(stores, { division: 'Northern', province: 'Macuata', town: 'Lakeba Village' });
  assert.equal(island.length, 1);
  assert.equal(village.length, 1);
  assert.notEqual(island[0].name, village[0].name);
  assert.equal(filterStores(stores, { division: 'Central', town: 'Labasa' }).length, 0);
});
test('search is case-insensitive, trims whitespace, and combines with location filters', () => {
  assert.equal(filterStores(stores, { query: ' HOP TIY ' })[0].phone, '3300875');
  assert.equal(filterStores(stores, { division: 'Central', query: 'labasa' }).length, 0);
  assert.ok(filterStores(stores, { query: 'labasa' }).length > 0);
  assert.equal(filterStores(stores, { query: 'no such store' }).length, 0);
  assert.equal(filterStores(stores).length, stores.length);
});
test('telephone links use Fiji international format and reject incomplete or foreign numbers', () => {
  assert.equal(telephoneLink('330 0875'), 'tel:+6793300875');
  assert.equal(telephoneLink('+679 330 0875'), 'tel:+6793300875');
  assert.equal(telephoneLink(''), null);
  assert.equal(telephoneLink('123'), null);
  assert.equal(telephoneLink('+64 21 1234567'), null);
});
