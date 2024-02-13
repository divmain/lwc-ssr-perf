const lwcEngineServer = require('@lwc/engine-server');
const compiledModule = require('./compiled');

module.exports = async (remaining) => lwcEngineServer.renderComponent(
  compiledModule.tagName,
  compiledModule.default,
  { remaining },
);

if (require.main === module) {
  module.exports(20).catch(console.error);
}
