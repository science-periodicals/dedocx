let normalizeText = require('./normalize-text');

// parses a Word field
// This is not a real parser for Word fields, by any margin. That's a language on its own to
// implement. But it's enough for the fields that we know we will parse for now.
module.exports = function parseField(txt) {
  let fld = {},
    content = () => {
      let ret, rx;
      txt = txt.trim();
      // we don't have lookbehinds, at this point we don't try to handle escapes
      if (txt.indexOf('\\') === 0) return;
      else if (txt.indexOf('"') === 0) rx = /^"([^"]+)"\s*/;
      else rx = /^(\S+)\s*/;
      txt = txt.replace(rx, (_, p1) => {
        ret = p1;
        return '';
      });
      return ret;
    };
  txt = normalizeText(txt);
  txt = txt.replace(/^(ADDIN\s+)?([a-z\._]+)\s*/i, (_, p1, p2) => {
    fld.type = p2.toUpperCase(); // this is case-insensitive
    fld.addin = !!p1;
    return '';
  });
  if (!fld.type) return; // parse failure
  if (txt.indexOf('\\') !== 0) fld.argument = content();
  // ADDIN types can contain any old crap
  if (fld.addin) {
    fld.data = txt;
    return fld;
  }
  // TODO:
  // It is possible for fields to be completely screwed up by user editing; Word does not seem to
  // mind too much. Notably, one can insert unescaped quotes and they'll pretty much work.
  // the strategy is that instead of failing when we can't parse a key, just append to the last
  // parsed field.
  while (txt) {
    let key;
    txt = txt.replace(/^\\([a-z\*])\s*/i, (_, p1) => {
      key = p1.toLowerCase();
      return '';
    });
    if (!key) return; // parse failure
    let value = content() || true; // if there is no content it's a boolean
    if (/^\d+$/.test(value)) value = parseInt(value, 10);
    if (!fld[key]) fld[key] = value;
    else if (Array.isArray(fld[key])) fld[key].push(value);
    else fld[key] = [fld[key], value];
  }
  return fld;
};
