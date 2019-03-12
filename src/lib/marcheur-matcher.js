// marcheur can match using any kind of condition. `Matcher` exposes a really simple set of matching conditions that are commonly needed.

let {
    ELEMENT_NODE,
    TEXT_NODE,
    CDATA_SECTION_NODE,
    DOCUMENT_NODE
  } = require('dom-node-types'),
  qname = require('./marcheur-qname'),
  lc = str => str.toLowerCase();

module.exports = class Matcher {
  constructor(ns = {}, caseInsensitive = false) {
    this.ns = ns;
    this.ci = caseInsensitive;
  }
  text() {
    return node =>
      node.nodeType === TEXT_NODE || node.nodeType === CDATA_SECTION_NODE;
  }
  document() {
    return node => node.nodeType === DOCUMENT_NODE;
  }
  el(name) {
    let n = qname(name, this.ns);
    if (n.ns) {
      return node =>
        node.nodeType === ELEMENT_NODE &&
        (node.namespaceURI === n.ns || n.ns === '*') &&
        ((this.ci
          ? lc(node.localName) === lc(n.ln)
          : node.localName === n.ln) ||
          n.ln === '*');
    }
    return node =>
      node.nodeType === ELEMENT_NODE &&
      ((this.ci ? lc(node.nodeName) === lc(name) : node.nodeName === name) ||
        name === '*');
  }
};
