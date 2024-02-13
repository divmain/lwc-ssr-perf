const { isMainThread, workerData, parentPort } = require('node:worker_threads');
const compiledModule = require('./compiled');

async function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';
  const emit = (segment) => markup += segment;
  await compiledGenerateMarkup(emit, tagName, props, null, null);
  return markup;
}

module.exports = (remaining) => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  { remaining },
);

module.exports = async (remaining) => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  { remaining },
);

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
