let { join, extname, basename } = require('path'),
  xpath = require('../lib/xpath'),
  loadXML = require('../lib/load-xml'),
  packagePath = require('../lib/package-path');

module.exports = function contentTypes(ctx, callback) {
  try {
    let { tmpPath, log } = ctx;
    loadXML(join(tmpPath, '[Content_Types].xml'), (err, doc) => {
      if (err) {
        log.error(err);
        return callback();
      }
      try {
        // This file contains two types of elements
        //  <Default Extension="xml" ContentType="application/xml"/>
        //  <Override PartName="/word/document.xml" ContentType="application/vnd...+xml"/>
        let select = xpath(doc),
          extensions = {},
          paths = {},
          defaultType = 'application/octet-stream';
        select('//ct:Default').forEach(
          def =>
            (extensions[def.getAttribute('Extension')] = def.getAttribute(
              'ContentType'
            ))
        );
        select('//ct:Override').forEach(
          def =>
            (paths[def.getAttribute('PartName')] = def.getAttribute(
              'ContentType'
            ))
        );
        ctx.resolveFileType = fileName => {
          if (!fileName) return defaultType;
          fileName = packagePath(ctx, fileName);
          if (paths[fileName]) return paths[fileName];
          let ext;
          if (/^\.\w+$/.test(basename(fileName)))
            ext = basename(fileName).replace(/^\./, '');
          else ext = (extname(fileName) || '').replace(/^\./, '');
          if (extensions[ext]) return extensions[ext];
          return defaultType;
        };
      } catch (e) {
        ctx.log.error(e);
      }
      callback();
    });
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
};
