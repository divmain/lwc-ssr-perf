const compiledModule = require('./compiled');

function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';

  for (const segment of compiledGenerateMarkup(tagName, props, null, null)) {
    markup += segment;
  }

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
