let nodePosition = require('./node-position');

module.exports = function compareNodePositions(a, b) {
  let posA = nodePosition(a),
    posB = nodePosition(b),
    iterator = posA.length >= posB.length ? posA : posB;
  for (let i = 0; i < iterator.length; i++) {
    if ((posA[i] || -1) < (posB[i] || -1)) return 'before';
    if ((posA[i] || -1) > (posB[i] || -1)) return 'after';
  }
  return 'identical';
};
