module.exports = function nodeOffset(n) {
  let offset = 0,
    ps = n.previousSibling;
  while (ps) {
    offset++;
    ps = ps.previousSibling;
  }
  return offset;
};
