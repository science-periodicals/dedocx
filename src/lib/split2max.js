module.exports = function splitMax2(str, re) {
  let match = (typeof re === 'string' ? new RegExp(re) : re).exec(str);
  if (!match) return [str];
  let idx = str.indexOf(match[0]);
  return [str.substring(0, idx), str.substring(idx + match[0].length)];
};
