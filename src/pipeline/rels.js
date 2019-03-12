let asyncEach = require('async/each'),
  { join, dirname, basename, resolve, sep } = require('path'),
  { RELS } = require('../constants/media-types'),
  loadXML = require('../lib/load-xml'),
  xpath = require('../lib/xpath'),
  values = require('../lib/values'),
  packagePath = require('../lib/package-path');

module.exports = function rels(ctx, callback) {
  try {
    asyncEach(
      values(ctx.fileTree).filter(f => f.mediaType === RELS),
      (rel, cb) => {
        loadXML(rel.fullPath, (err, doc) => {
          if (err) {
            ctx.log.error(err);
            return cb();
          }
          try {
            let select = xpath(doc),
              relationships = [];
            select('//rels:Relationship').forEach(relEl => {
              // targetMode is 'internal' for things inside DOCX, 'external' otherwise
              relationships.push({
                id: relEl.getAttribute('Id'),
                type: relEl.getAttribute('Type'),
                target: relEl.getAttribute('Target'),
                targetMode: (
                  relEl.getAttribute('TargetMode') || ''
                ).toLowerCase()
              });
            });
            // find the file path: remove the _rels directory and the .rels extensions
            let filePath = join(
                dirname(rel.packagePath),
                '..',
                /^\.\w+$/.test(basename(rel.packagePath))
                  ? ''
                  : basename(rel.packagePath, '.rels')
              ),
              fullPath = join(ctx.tmpPath, filePath);
            if (!ctx.fileTree[filePath]) ctx.fileTree[filePath] = { fullPath };
            relationships.forEach(r => {
              if (!r.target) return;
              r.fullPath = resolve(
                fullPath.slice(-1) === sep ? fullPath : dirname(fullPath),
                r.target
              );
              r.packagePath = packagePath(ctx, r.fullPath);
            });
            ctx.fileTree[filePath].rels = relationships;
          } catch (e) {
            ctx.log.error(e);
          }
          cb();
        });
      },
      err => {
        if (err) ctx.log.error(err);
        callback();
      }
    );
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
};
