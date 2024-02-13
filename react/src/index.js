import { isMainThread, workerData, parentPort } from 'node:worker_threads';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Component from './Component';


export default (remaining) => ReactDOMServer.renderToString(<Component remaining={remaining} />);

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
