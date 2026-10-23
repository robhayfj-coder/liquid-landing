const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { parseCSV, telephoneLink } = require('../site.js');
const { renderDirectory, start, end } = require('../scripts/build-directory.cjs');
const read = path => readFileSync(resolve(__dirname, '..', path), 'utf8');
const decode = text => text.replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
test('every CSV retailer has one matching crawlable call link and location, without JavaScript', () => {
  const html = read('harvest-booster/index.html');
  const directory = html.slice(html.indexOf(start), html.indexOf(end));
  const links = [...directory.matchAll(/<a\b[^>]*data-directory-phone[^>]*>/g)].map(match => Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(([,k,v])=>[k,decode(v)])));
  const expected = parseCSV(read('retailers.csv')).map(s => [s.name,s.town,s.province,s.division,telephoneLink(s.phone)].join('|')).sort();
  const actual = links.map(a => [a['data-store-name'],a['data-town'],a['data-province'],a['data-division'],a.href].join('|')).sort();
  assert.deepEqual(actual, expected);
  assert.equal((directory.match(/<details\b/g)||[]).length,1);
  assert.ok(!directory.includes(' hidden'));
});
test('retailer names and areas cannot inject HTML or attributes into the static directory', () => {
  const html = renderDirectory([{name:'Farm <script>alert(1)</script> " & Supply',town:'Town" onclick="bad',province:'A&B',division:'Western',phone:'3300875'}]);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('Town&quot; onclick=&quot;bad'));
  assert.ok(!html.includes(' onclick="bad'));
  assert.ok(html.includes('href="tel:+6793300875"'));
});
