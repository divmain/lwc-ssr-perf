const lwcEngineServer = require('@lwc/engine-server');
const compiledModule = require('./compiled');

module.exports = async (remaining) => lwcEngineServer.renderComponent(
  compiledModule.tagName,
  compiledModule.default,
  { remaining },
);

if (typeof BUNDLE === 'undefined') {
  const { isMainThread, workerData, parentPort } = require('node:worker_threads');
  if (!isMainThread) {
    (async function () {
      await module.exports(workerData.size);
    })().then(
      () => parentPort.postMessage('ok'),
      (err) => parentPort.postMessage(err.stack),
    );
  } else if (require.main === module) {
    module.exports(20);
  }
}
