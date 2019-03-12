//This is a small utility, imported on its own, that provides an element creator and attribute remapping for a given context document and set of namespaces.

let qname = require('./marcheur-qname');

module.exports = function nodal(doc, attrMap = {}, nsMap = {}) {
  return {
    el: (name, attr = {}, parent) => {
      let n = qname(name, nsMap),
        el = n.ns ? doc.createElementNS(n.ns, name) : doc.createElement(name);
      Object.keys(attr).forEach(at => {
        if (attr[at] == null || attr[at] === '') return;
        let atn = qname(at, nsMap);
        if (atn.ns) el.setAttributeNS(atn.ns, at, attr[at]);
        else el.setAttribute(at, attr[at]);
      });
      if (parent) parent.appendChild(el);
      return el;
    },
    amap: (src, ret = {}) => {
      Object.keys(attrMap).forEach(at => {
        let n = qname(at, nsMap);
        if (n.ns && src.hasAttributeNS(n.ns, n.ln)) {
          ret[attrMap[at]] = src.getAttributeNS(n.ns, n.ln);
        } else if (n.qn && src.hasAttribute(at))
          ret[attrMap[at]] = src.getAttribute(at);
      });
      return ret;
    }
  };
};
