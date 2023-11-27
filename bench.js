const { Bench } = require('tinybench');
const testEngineServer = require('./test-engine-server');
const testExperimental = require('./test-experimental');
const testExperimentalSync = require('./test-experimental-sync');

(async () => {
  const bench = new Bench({
    time: 5000,
  });

  bench
    .add('@lwc/engine-server', async () => {
      await testEngineServer();
    })
    .add('experimental SSR', async () => {
      await testExperimental();
    })
    .add('experimental SSR (sync)', async () => {
      await testExperimentalSync();
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
      await require('./test-engine-server')();
    })
    .add('experimental SSR (cold)', async () => {
      await require('./test-experimental')();
    })
    .add('experimental SSR (sync)(cold)', async () => {
      await require('./test-experimental-sync')();
    });

  await coldBench.run();

  console.table(coldBench.table());
})().catch(console.error);
