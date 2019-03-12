let { DOCUMENT_NODE, DOCUMENT_FRAGMENT_NODE } = require('dom-node-types');

module.exports = function elementInTree(el) {
  let parent = el.parentNode;
  while (parent) {
    let type = parent.nodeType;
    if (type === DOCUMENT_NODE) return true;
    if (type === DOCUMENT_FRAGMENT_NODE) return false;
    parent = parent.parentNode;
  }
  return false;
};
