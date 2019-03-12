let nodeContains = require('./node-contains');

module.exports = function commonAncestor(start, end) {
  let container = start;
  while (container && !nodeContains(container, end))
    container = container.parentNode;
  return container;
};
