const { Bench } = require('tinybench');
require('./lwc/engine-server');
require('./lwc/async-yield');
require('./lwc/sync-yield');
require('./lwc/sync-no-yield');
require('./lwc/async-no-yield');


async function benchmark(withColdCache) {
  const bench = new Bench({
    time: withColdCache ? 2000 : 1000,
    // time: withColdCache ? 10000 : 5000,
    setup: withColdCache ? () => {
      for (const key of Object.keys(require.cache)) {
        delete require.cache[key];
      }
    } : undefined,
  });

  bench
    .add('@lwc/engine-server', async () => {
      await require('./lwc/engine-server')();
    })
    .add('experimental SSR (async)', async () => {
      await require('./lwc/async-yield')();
    })
    .add('experimental SSR (sync)', async () => {
      await require('./lwc/sync-yield')();
    })
    .add('experimental SSR (sync, no yield)', async () => {
      await require('./lwc/sync-no-yield')();
    })
    .add('experimental SSR (async, no yield)', async () => {
      await require('./lwc/async-no-yield')();
    });

  await bench.run();

  return bench.table().map((entry) => {
    if (withColdCache) {
      entry['Task Name'] = entry['Task Name'] + '(cold)';
    }
    return entry;
  });
}

(async () => {
  const warmResults = await benchmark(false);
  console.table(warmResults);

  const coldResults = await benchmark(true);
  console.table(coldResults);
})().catch(console.error);
