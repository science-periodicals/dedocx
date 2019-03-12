// returns all of the ancestors of start up to stop (exclusive)
module.exports = function ancestorsToNode(start, stop) {
  let anc = [],
    parent = start.parentNode;
  while (parent && parent !== stop) {
    anc.push(parent);
    parent = parent.parentNode;
  }
  return anc;
};
