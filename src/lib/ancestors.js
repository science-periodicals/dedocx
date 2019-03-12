// NOTE: not sure why this doesn't just use XPath
module.exports = function ancestors(el) {
  if (!el) return [];
  let parents = [],
    pn = el.parentNode;
  while (pn && pn.nodeType === 1) {
    parents.push(pn);
    pn = pn.parentNode;
  }
  return parents;
};
