let { W_NS } = require('../constants/ns'),
  xpath = require('./xpath');

module.exports = function nodeContains(container, content) {
  if (
    container.namespaceURI === W_NS &&
    /^(document|body)$/.test(container.localName)
  )
    return true;
  return !!xpath(container)('.//*').filter(c => c === content).length;
};
