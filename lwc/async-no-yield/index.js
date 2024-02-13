const compiledModule = require('./compiled');

async function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';
  const emit = (segment) => markup += segment;
  await compiledGenerateMarkup(emit, tagName, props, null, null);
  return markup;
}

module.exports = () => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  { remaining: 10 },
);

if (require.main === module) {
  module.exports().catch(console.error);
}
