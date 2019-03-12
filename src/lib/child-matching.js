module.exports = function childMatching($el, selector) {
  return Array.from($el.children).find($child => $child.matches(selector));
};
