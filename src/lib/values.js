module.exports = function values(object) {
  return Object.keys(object).map(k => object[k]);
};
