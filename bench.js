const { Bench } = require('tinybench');
const testEngineServer = require('./lwc/engine-server');
const testExperimental = require('./lwc/async-yield');
const testExperimentalSync = require('./lwc/sync-yield');
const testExperimentalSyncNoYield = require('./lwc/sync-no-yield');
const testExperimentalSyncNoYieldAsync = require('./lwc/async-no-yield');


(async () => {
  const bench = new Bench({
    time: 5000,
  });

  bench
    .add('@lwc/engine-server', async () => {
      await testEngineServer();
    })
    .add('experimental SSR (async)', async () => {
      await testExperimental();
    })
    .add('experimental SSR (sync)', async () => {
      await testExperimentalSync();
    })
    .add('experimental SSR (sync, no yield)', async () => {
      await testExperimentalSyncNoYield();
    })
    .add('experimental SSR (async, no yield)', async () => {
      await testExperimentalSyncNoYieldAsync();
    });

  await bench.run();

  console.table(bench.table());

  const coldBench = new Bench({
    time: 10000,
    setup: () => {
      for (const key of Object.keys(require.cache)) {
        delete require.cache[key];
      }
    }
  });

  coldBench
    .add('@lwc/engine-server (cold)', async () => {
      await require('./lwc/engine-server')();
    })
    .add('experimental SSR (async)(cold)', async () => {
      await require('./lwc/async-yield')();
    })
    .add('experimental SSR (sync)(cold)', async () => {
      await require('./lwc/sync-yield')();
    })
    .add('experimental SSR (sync, no yield)(cold)', async () => {
      await require('./lwc/sync-no-yield')();
    })
    .add('experimental SSR (async, no yield)(cold)', async () => {
      await require('./lwc/async-no-yield')();
    });

  await coldBench.run();

  console.table(coldBench.table());
})().catch(console.error);
