let SPACE =
    '[ \\f\\n\\r\\t\\v​\u00a0\\u1680​\\u180e\\u2000-\\u200a​\\u2028\\u2029\\u202f\\u205f​\\u3000\\ufeff]',
  RE_SPACES_GLOBAL = new RegExp(SPACE + '+', 'g'),
  RE_TRIM = new RegExp('^' + SPACE + '*|' + SPACE + '*$', 'g'),
  trim = str => String(str || '').replace(RE_TRIM, '');

module.exports = function normalizeText(text) {
  return trim(text || '').replace(RE_SPACES_GLOBAL, ' ');
};
