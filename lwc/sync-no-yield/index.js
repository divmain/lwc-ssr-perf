const compiledModule = require('./compiled');

function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';
  const emit = (segment) => markup += segment;
  compiledGenerateMarkup(emit, tagName, props, null, null);
  return markup;
}

module.exports = (remaining) => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
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
  } else if (typeof require === 'function' && require.main === module) {
    module.exports(20);
  }
}
