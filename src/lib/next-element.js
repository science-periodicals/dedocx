let { ELEMENT_NODE } = require('dom-node-types');

module.exports = function nextElement(el) {
  if (!el) return;
  while (el && el.nextSibling) {
    if (el.nextSibling.nodeType === ELEMENT_NODE) return el.nextSibling;
    el = el.nextSibling;
  }
};
