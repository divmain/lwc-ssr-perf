const compiledModule = require('./compiled-experimental-ssr-sync');

function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';

  for (const segment of compiledGenerateMarkup(tagName, props, null, null)) {
    markup += segment;
  }

  return markup;
}

module.exports = () => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  {},
);

if (require.main === module) {
  module.exports().catch(console.error);
}
