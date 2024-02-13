const compiledModule = require('./compiled');

function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';
  const emit = (segment) => markup += segment;
  compiledGenerateMarkup(emit, tagName, props, null, null);
  return markup;
}

module.exports = () => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  {},
);

if (require.main === module) {
  module.exports();
}
