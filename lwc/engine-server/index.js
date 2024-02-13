const lwcEngineServer = require('@lwc/engine-server');
const compiledModule = require('./compiled');

module.exports = async () => lwcEngineServer.renderComponent(
  compiledModule.tagName,
  compiledModule.default,
  { remaining: 10 },
);

if (require.main === module) {
  module.exports().catch(console.error);
}
