const { Worker } = require('node:worker_threads');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { Bench } = require('tinybench');

require('./lwc/engine-server');
require('./lwc/async-yield');
require('./lwc/sync-yield');
require('./lwc/sync-no-yield');
require('./lwc/async-no-yield');
require('./react');

const BUNDLE_ENGINE_SERVER = fs.readFileSync('./lwc/engine-server/bundle.js', 'utf8');
const BUNDLE_ASYNC_YIELD = fs.readFileSync('./lwc/async-yield/bundle.js', 'utf8');
const BUNDLE_SYNC_YIELD = fs.readFileSync('./lwc/sync-yield/bundle.js', 'utf8');
const BUNDLE_SYNC_NO_YIELD = fs.readFileSync('./lwc/sync-no-yield/bundle.js', 'utf8');
const BUNDLE_ASYNC_NO_YIELD = fs.readFileSync('./lwc/async-no-yield/bundle.js', 'utf8');
const BUNDLE_REACT = fs.readFileSync('./react/dist/index.js', 'utf8');


// This number represents the complexity of the component tree that's generated.
// Reduce this number for smaller outputs & faster completion times. Increase this
// number for the opposite effect. Increasing too high will result in a stack
// overflow.
const SIZE = 20;

// Alternately, you can do multiple runs of all benchmarks, each run with a
// different complexity.
// const SIZE = [2, 5, 8, 11, 14, 17, 20, 23];


const gcPause = () => {
  gc(true);
  return new Promise(resolve => setTimeout(resolve, 1000));
};

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

async function benchmarkWarm(size) {
  const bench = new Bench({
    time: 5000,
  });

  bench
    .add('lwc/engine-server', async () => {
      await require('./lwc/engine-server')(size);
    })
    .add('lwc/async-yield', async () => {
      await require('./lwc/async-yield')(size);
    })
    .add('lwc/sync-yield', async () => {
      await require('./lwc/sync-yield')(size);
    })
    .add('lwc/sync-no-yield', async () => {
      await require('./lwc/sync-no-yield')(size);
    })
    .add('lwc/async-no-yield', async () => {
      await require('./lwc/async-no-yield')(size);
    })
    .add('react', async () => {
      await require('./react')(size);
    });

  await bench.run();

  return bench.table();
}

function generateNonce() {
  return crypto.randomBytes(32).toString('hex');
}

function coldRequire(bundleSource) {
  const nonce = generateNonce();
  const fnBody = `
    const exports = {};
    const module = { exports };
    /* ${nonce} */
    ${bundleSource}
    ;return module.exports`;
  return new Function('require', fnBody)(require);
}

async function benchmarkCold(size) {
  const bench = new Bench({
    time: 5000,
    setup: () => gc(false),
  });

  bench
    .add('lwc/engine-server', async () => {
      await coldRequire(BUNDLE_ENGINE_SERVER)(size);
    })
    .add('lwc/async-yield', async () => {
      await coldRequire(BUNDLE_ASYNC_YIELD)(size);
    })
    .add('lwc/sync-yield', async () => {
      await coldRequire(BUNDLE_SYNC_YIELD)(size);
    })
    .add('lwc/sync-no-yield', async () => {
      await coldRequire(BUNDLE_SYNC_NO_YIELD)(size);
    })
    .add('lwc/async-no-yield', async () => {
      await coldRequire(BUNDLE_ASYNC_NO_YIELD)(size);
    })
    .add('react', async () => {
      await coldRequire(BUNDLE_REACT)(size);
    });

  await bench.run();

  return bench.table().map((entry) => {
    entry['Task Name'] = entry['Task Name'] + ' (cold)';
    return entry;
  });
}

async function spinUpWorker(modulePath, size) {
  const absModulePath = path.resolve(__dirname, modulePath);
  const worker = new Worker(absModulePath, {
    workerData: {
      size,
    },
  });
  return new Promise((resolve, reject) => {
    worker.on('message', (result) => {
      if (result === 'ok') {
        resolve('ok');
      } else {
        reject(result);
      }
    });
    worker.on('error', (err) => {
      reject(err.stack);
    });
  })
}

async function benchmarkWorker(size) {
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
      await spinUpWorker('./lwc/engine-server', size);
    })
    .add('lwc/async-yield', async () => {
      await spinUpWorker('./lwc/async-yield', size);
    })
    .add('lwc/sync-yield', async () => {
      await spinUpWorker('./lwc/sync-yield', size);
    })
    .add('lwc/sync-no-yield', async () => {
      await spinUpWorker('./lwc/sync-no-yield', size);
    })
    .add('lwc/async-no-yield', async () => {
      await spinUpWorker('./lwc/async-no-yield', size);
    })
    .add('react', async () => {
      await spinUpWorker('./react', size);
    });

  await bench.run();

  return bench.table().map((entry) => {
    entry['Task Name'] = entry['Task Name'] + ' (worker)';
    return entry;
  });
}

async function run(size) {
  console.log(`=== RUNNING BENCHMARKS WITH COMPLEXITY ${size} ===`);
  const targetOutput = await require('./lwc/engine-server')(size);
  console.log(`markup size in bytes: ${targetOutput.length}\n`);

  await gcPause();
  const warmResults = await benchmarkWarm(size);
  console.table(transformTable(warmResults));

  await gcPause();
  const coldResults = await benchmarkCold(size);
  console.table(transformTable(coldResults));

  await gcPause();
  const workerResults = await benchmarkWorker(size);
  console.table(transformTable(workerResults));
}

if (!global.gc) {
  console.log('To get stable results, it is necessary to trigger the V8 garbage collector between runs.');
  console.log('Please run `node --expose-gc ./bench.js`')
  process.exit(1);
}

(async () => {
  if (typeof SIZE === 'number') {
    await run(SIZE);
  } else if (typeof SIZE === 'object') {
    for (const size of SIZE) {
      await run(size);
    }
  } else {
    console.error('Benchmark script is misconfigured: please set SIZE to a number of array of numbers.');
  }
})().catch(console.error);
