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

if (require.main === module) {
  module.exports(20).catch(console.error);
}
