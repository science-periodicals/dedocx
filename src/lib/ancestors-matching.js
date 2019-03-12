let ancestors = require('./ancestors');

module.exports = function ancestorsMatching(el, sel) {
  return ancestors(el).filter(p => p && p.matches(sel));
};
