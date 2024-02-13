const { Bench } = require('tinybench');
require('./lwc/engine-server');
require('./lwc/async-yield');
require('./lwc/sync-yield');
require('./lwc/sync-no-yield');
require('./lwc/async-no-yield');


function transformTable(rows) {
  const worstOpsPerSec = rows.reduce((memo, row) => {
    const opsPerSec = row['ops/sec'] = Number.parseInt(row['ops/sec'].replace(/,/g, ''));
    return opsPerSec < memo ? opsPerSec : memo
  }, Infinity);

  console.log('worstOpsPerSec', worstOpsPerSec);

  return rows.reduce((memo, row) => {
    const {
      ['Task Name']: taskName,
      ['ops/sec']: opsPerSec,
      ['Average Time (ns)']: avgTimeNs,
      ['Margin']: margin,
    } = row;

    memo[taskName] = {
      ['ops/sec']: opsPerSec,
      ['avg time (ns)']: avgTimeNs | 0,
      margin,
      ['throughput']: `${((10 * opsPerSec / worstOpsPerSec) | 0) / 10}x`,
    };

    return memo;
  }, {});
}

async function benchmark(withColdCache) {
  const bench = new Bench({
    time: 2500,
    setup: withColdCache ? () => {
      for (const key of Object.keys(require.cache)) {
        delete require.cache[key];
      }
    } : undefined,
  });

  bench
    .add('lwc/engine-server', async () => {
      await require('./lwc/engine-server')();
    })
    .add('lwc/async-yield', async () => {
      await require('./lwc/async-yield')();
    })
    .add('lwc/sync-yield', async () => {
      await require('./lwc/sync-yield')();
    })
    .add('lwc/sync-no-yield', async () => {
      await require('./lwc/sync-no-yield')();
    })
    .add('lwc/async-no-yield', async () => {
      await require('./lwc/async-no-yield')();
    });

  await bench.run();

  return bench.table().map((entry) => {
    if (withColdCache) {
      entry['Task Name'] = entry['Task Name'] + ' (cold)';
    }
    return entry;
  });
}

(async () => {
  const warmResults = await benchmark(false);
  console.table(transformTable(warmResults));

  const coldResults = await benchmark(true);
  console.table(transformTable(coldResults));
})().catch(console.error);
