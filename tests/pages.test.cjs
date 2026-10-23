const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve, join } = require('node:path');
const root = resolve(__dirname,'..');
const pages=['index.html','harvest-booster/index.html','growth-booster/index.html','stockists/index.html','about/index.html'];
const read=p=>readFileSync(join(root,p),'utf8');
test('internal page links, anchors, images and scripts resolve from every generated page',()=>{
 for(const page of pages){
  const html=read(page); const base=new URL(page.endsWith('index.html')?page.replace(/index\.html$/,''):'/','https://preview.example/');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,page+' has one main heading');
  assert.match(html,/<meta name="robots" content="noindex,follow">/);
  for(const [,attribute,value] of html.matchAll(/\b(href|src)="([^"]+)"/g)){
   if(/^(https?:|tel:|mailto:)/.test(value))continue;
   const url=new URL(value,base); const path=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
   assert.ok(existsSync(join(root,path)),`${page}: ${attribute} ${value}`);
   if(url.hash&&path.endsWith('.html'))assert.ok(read(path).includes(`id="${url.hash.slice(1)}"`),`${page}: anchor ${value}`);
  }
 }
});
test('the original Harvest Booster introduction, routine and farmer attribution survive the move',()=>{
 const html=read('harvest-booster/index.html');
 assert.ok(html.includes('When your crop starts flowering, give it Harvest Booster. Use every 7 days until your harvest is finished. Harvest Booster works alongside your normal fertiliser or manure to support flowering and fruiting.'));
 assert.ok(html.includes('Abdul Shahid'));
 assert.ok(html.includes('Chilli farmer — Baulevu, Naitasiri'));
 assert.ok(html.includes('Continue every 7 days until harvesting finishes.'));
 assert.equal((html.match(/data-directory-phone/g)||[]).length,65);
 assert.equal((read('stockists/index.html').match(/data-directory-phone/g)||[]).length,65);
});
test('the Coming soon page cannot imply stock availability or present a buying form',()=>{
 const html=read('growth-booster/index.html');
 assert.match(html,/COMING SOON/);
 assert.match(html,/Growth Booster is coming soon/);
 assert.ok(!html.includes('class="mobile-store-bar"'));
 assert.ok(!html.includes('<form'));
 assert.ok(!html.includes('Use every 7 days'));
 assert.ok(!html.includes('Abdul Shahid'));
 assert.match(read('index.html'),/availability availability-soon">Coming soon/);
});
