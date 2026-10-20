const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');
const source = readFileSync(join(__dirname, '../analytics.js'), 'utf8');
function environment(hostname) {
  const scripts = [];
  const context = {
    window: { location: { hostname } },
    document: {
      createElement: () => ({}),
      head: { append: script => scripts.push(script) },
      getElementsByTagName: () => [{ parentNode: { insertBefore: script => scripts.push(script) } }]
    }
  };
  vm.createContext(context);
  return { context, scripts, run: () => vm.runInContext(source, context) };
}
test('preview and development hosts cannot load tracking or initialize queues', () => {
  for (const host of ['localhost', '127.0.0.1', 'liquid-landing.vercel.app', 'www.baywaterfiji.com.evil.example']) {
    const env = environment(host); env.run();
    assert.equal(env.scripts.length, 0);
    assert.equal(env.context.window.HarvestAnalytics, undefined);
  }
});
test('both live hostnames initialize each provider and page view only once', () => {
  for (const host of ['www.baywaterfiji.com', 'baywaterfiji.com']) {
    const env = environment(host); env.run(); env.run();
    const w = env.context.window;
    assert.equal(env.scripts.length, 2);
    assert.ok(env.scripts.every(s => s.async));
    assert.equal(w.dataLayer.filter(args => args[0] === 'config' && args[1] === 'G-L75K1MQ8L3').length, 1);
    assert.equal(w.fbq.queue.filter(args => args[0] === 'init' && args[1] === '2387761571964957').length, 1);
    assert.equal(w.fbq.queue.filter(args => args[0] === 'track' && args[1] === 'PageView').length, 1);
  }
});
test('custom events reach both providers, and one blocked provider cannot break the other', () => {
  const env = environment('www.baywaterfiji.com'); env.run();
  const w = env.context.window;
  w.HarvestAnalytics.track('store_search', { result_count: 1 });
  assert.equal(w.dataLayer.at(-1)[1], 'store_search');
  assert.equal(w.fbq.queue.at(-1)[0], 'trackCustom');
  w.gtag = () => { throw new Error('blocked'); };
  assert.doesNotThrow(() => w.HarvestAnalytics.track('retailer_call_click', { town: 'Suva' }));
  assert.equal(w.fbq.queue.at(-1)[1], 'retailer_call_click');
  w.fbq = () => { throw new Error('blocked'); };
  assert.doesNotThrow(() => w.HarvestAnalytics.track('find_store_click', {}));
});
