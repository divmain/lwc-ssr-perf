const { Bench } = require('tinybench');
require('./lwc/engine-server');
require('./lwc/async-yield');
require('./lwc/sync-yield');
require('./lwc/sync-no-yield');
require('./lwc/async-no-yield');


// This number represents the complexity of the component tree that's generated.
// Reduce this number for smaller outputs & faster completion times. Increase this
// number for the opposite effect. Increasing too high will result in a stack
// overflow.
const SIZE = 20;


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
    time: 5000,
    setup: withColdCache ? () => {
      for (const key of Object.keys(require.cache)) {
        delete require.cache[key];
      }
    } : undefined,
  });

  bench
    .add('lwc/engine-server', async () => {
      await require('./lwc/engine-server')(SIZE);
    })
    .add('lwc/async-yield', async () => {
      await require('./lwc/async-yield')(SIZE);
    })
    .add('lwc/sync-yield', async () => {
      await require('./lwc/sync-yield')(SIZE);
    })
    .add('lwc/sync-no-yield', async () => {
      await require('./lwc/sync-no-yield')(SIZE);
    })
    .add('lwc/async-no-yield', async () => {
      await require('./lwc/async-no-yield')(SIZE);
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
