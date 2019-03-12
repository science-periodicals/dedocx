let nodeOffset = require('./node-offset');

module.exports = function nodePosition(n) {
  let position = [],
    curNode = n;
  while (curNode) {
    position.unshift(nodeOffset(curNode));
    curNode = curNode.parentNode;
  }
  return position;
};
