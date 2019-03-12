module.exports = function childrenMatching($el, selector) {
  if (!$el || !$el.children) return [];
  return Array.from($el.children).filter($child => $child.matches(selector));
};
