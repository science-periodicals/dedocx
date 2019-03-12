module.exports = function remove(el) {
  if (!el || !el.parentNode) return;
  el.parentNode.removeChild(el);
  return el;
};
