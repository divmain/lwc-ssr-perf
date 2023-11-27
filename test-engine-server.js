const lwcEngineServer = require('@lwc/engine-server');
const compiledModule = require('./compiled');

module.exports = async () => {
  return lwcEngineServer.renderComponent(
    compiledModule.tagName,
    compiledModule.default,
    {},
  );
}

if (require.main === module) {
  module.exports().catch(console.error);
}
