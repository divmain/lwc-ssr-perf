const { Worker } = require('node:worker_threads');
const path = require('node:path');
const { Bench } = require('tinybench');
require('./lwc/engine-server');
require('./lwc/async-yield');
require('./lwc/sync-yield');
require('./lwc/sync-no-yield');
require('./lwc/async-no-yield');
require('./react');


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
    })
    .add('react', async () => {
      await require('./react')(SIZE);
    });

  await bench.run();

  return bench.table().map((entry) => {
    if (withColdCache) {
      entry['Task Name'] = entry['Task Name'] + ' (cold)';
    }
    return entry;
  });
}

async function spinUpWorker(modulePath) {
  const absModulePath = path.resolve(__dirname, modulePath);
  const worker = new Worker(absModulePath, {
    workerData: {
      size: SIZE,
    },
  });
  return new Promise((resolve, reject) => {
    worker.on('message', (result) => {
      if (result === 'ok') {
        resolve('ok');
      } else {
        reject(data);
      }
    });
    worker.on('error', (err) => {
      reject(err.stack);
    });
  })
}

async function workerBenchmark() {
  const bench = new Bench({
    time: 2500,
    setup: () => {
      for (const key of Object.keys(require.cache)) {
        delete require.cache[key];
      }
    },
  });

  bench
    .add('lwc/engine-server', async () => {
      await spinUpWorker('./lwc/engine-server');
    })
    .add('lwc/async-yield', async () => {
      await spinUpWorker('./lwc/async-yield');
    })
    .add('lwc/sync-yield', async () => {
      await spinUpWorker('./lwc/sync-yield');
    })
    .add('lwc/async-no-yield', async () => {
      await spinUpWorker('./lwc/async-no-yield');
    })
    .add('lwc/sync-no-yield', async () => {
      await spinUpWorker('./lwc/sync-no-yield');
    })
    .add('react', async () => {
      await spinUpWorker('./react');
    });

  await bench.run();


  return bench.table().map((entry) => {
    entry['Task Name'] = entry['Task Name'] + ' (worker)';
    return entry;
  });
}

(async () => {
  const warmResults = await benchmark(false);
  console.table(transformTable(warmResults));

  const coldResults = await benchmark(true);
  console.table(transformTable(coldResults));

  const workerResults = await workerBenchmark();
  console.table(transformTable(workerResults));
})().catch(console.error);
