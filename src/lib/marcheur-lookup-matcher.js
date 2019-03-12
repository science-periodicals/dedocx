let qname = require('./marcheur-qname'),
  lc = str => str.toLowerCase();

module.exports = class LookupMatcher {
  constructor(ns = {}, caseInsensitive = false) {
    this.ns = ns;
    this.ci = caseInsensitive;
  }
  text() {
    return { nt: 'text' };
  }
  document() {
    return { nt: 'document' };
  }
  el(name) {
    let n = qname(name, this.ns),
      ret = { nt: 'element' };
    if (n.ns) {
      ret.ns = this.ci ? lc(n.ns) : n.ns;
      ret.ln = this.ci ? lc(n.ln) : n.ln;
    } else {
      ret.ns = '';
      ret.ln = this.ci ? lc(n.qn) : n.qn;
    }
    return ret;
  }
};
