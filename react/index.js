const { isMainThread, workerData, parentPort } = require('node:worker_threads');
const renderReactApp = require('./dist');

module.exports = renderReactApp;

if (!isMainThread) {
  (async function () {
    await renderReactApp(workerData.size);
  })().then(
    () => parentPort.postMessage('ok'),
    (err) => parentPort.postMessage(err.stack),
  );
} else if (require.main === module) {
  renderReactApp(20);
}
