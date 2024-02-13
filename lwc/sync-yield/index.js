const compiledModule = require('./compiled');

function serverSideRenderComponent(tagName, compiledGenerateMarkup, props) {
  let markup = '';

  for (const segment of compiledGenerateMarkup(tagName, props, null, null)) {
    markup += segment;
  }

  return markup;
}

module.exports = (remaining) => serverSideRenderComponent(
  compiledModule.tagName,
  compiledModule.generateMarkup,
  { remaining },
);

if (require.main === module) {
  module.exports(20);
}
