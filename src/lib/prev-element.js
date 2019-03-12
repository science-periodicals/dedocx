let { ELEMENT_NODE } = require('dom-node-types');

module.exports = function prevElement(el) {
  if (!el) return;
  while (el && el.previousSibling) {
    if (el.previousSibling.nodeType === ELEMENT_NODE) return el.previousSibling;
    el = el.previousSibling;
  }
};
