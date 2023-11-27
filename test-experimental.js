const compiledModule = require('./compiled-experimental-ssr');

async function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';

  for await (const segment of compiledGenerateMarkup(tagName, props, null, null)) {
    markup += segment;
  }

  return markup;
}

module.exports = async () => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  {},
);

if (require.main === module) {
  module.exports().catch(console.error);
}
