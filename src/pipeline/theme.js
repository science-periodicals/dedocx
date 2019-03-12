let { OFFICE_DOCUMENT_REL, THEME_REL } = require('../constants/relationships'),
  loadXML = require('../lib/load-xml'),
  xpath = require('../lib/xpath'),
  { string } = require('../lib/attribute-parsers');

// Extracts the themes. We
// We do this in a rather superficial manner
module.exports = function theme(ctx, callback) {
  try {
    let mainDoc =
      ctx.fileTree['/'] &&
      ctx.fileTree['/'].rels &&
      ctx.fileTree['/'].rels.find(rel => rel.type === OFFICE_DOCUMENT_REL);
    if (!mainDoc) return process.nextTick(callback);
    let mainDocPath = mainDoc.packagePath,
      themeRel =
        ctx.fileTree[mainDocPath] &&
        ctx.fileTree[mainDocPath].rels &&
        ctx.fileTree[mainDocPath].rels.find(rel => rel.type === THEME_REL);
    if (!themeRel) return process.nextTick(callback);
    loadXML(themeRel.fullPath, (err, doc) => {
      if (err) {
        ctx.log.error(err);
        return callback();
      }
      try {
        let select = xpath(doc),
          colors = {},
          fonts = {};
        select('/a:theme/a:themeElements/a:clrScheme/a:*').forEach(color => {
          let colorName = color.localName,
            specifier = color.firstChild;
          if (!specifier) return;
          let type = specifier.localName;
          if (type === 'scrgbClr') {
            colors[colorName] =
              'rgb(' +
              [
                string(specifier, 'r') || '0',
                string(specifier, 'g') || '0',
                string(specifier, 'b') || '0'
              ].join(', ') +
              ')';
          } else if (type === 'srgbClr') {
            colors[colorName] = `#${string(specifier)}`;
          } else if (type === 'hslClr') {
            colors[colorName] =
              'hsl(' +
              [
                string(specifier, 'hue') || '0',
                string(specifier, 'sat') || '0',
                string(specifier, 'lum') || '0'
              ].join(', ') +
              ')';
          } else if (type === 'sysClr') {
            colors[colorName] = `#${string(specifier, 'lastVal')}`;
          } else if (type === 'prstClr') {
            colors[colorName] = string(specifier);
          }
        });
        ['majorFont', 'minorFont'].forEach(fontType => {
          select(
            `/a:theme/a:themeElements/a:fontScheme[1]/a:${fontType}`
          ).forEach(font => {
            let latin = select('./a:latin', font)[0],
              eastAsia = select('./a:ea', font)[0],
              cs = select('./a:cs', font)[0];
            fonts[fontType.replace('Font', '')] = {
              latin: latin && latin.getAttribute('typeface'),
              eastAsia: eastAsia && eastAsia.getAttribute('typeface'),
              cs: cs && cs.getAttribute('typeface')
            };
          });
        });
        ctx.theme = { colors, fonts };
      } catch (e) {
        ctx.log.error(e);
      }
      callback();
    });
  } catch (e) {
    ctx.log.error(e);
    callback();
  }
};
