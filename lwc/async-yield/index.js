const compiledModule = require('./compiled');

async function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';

  for await (const segment of compiledGenerateMarkup(tagName, props, null, null)) {
    markup += segment;
  }

  return markup;
}

module.exports = async (remaining) => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  { remaining },
);

if (require.main === module) {
  module.exports(20).catch(console.error);
}
