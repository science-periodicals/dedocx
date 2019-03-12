let findit = require('findit'),
  packagePath = require('../lib/package-path');

module.exports = function fileTree(ctx, callback) {
  try {
    let finder = findit(ctx.tmpPath),
      files = {};
    finder.on('error', err => ctx.log.error(err));
    finder.on('file', fullPath => {
      try {
        let relPath = packagePath(ctx, fullPath);
        files[relPath] = {
          fullPath,
          packagePath: relPath,
          mediaType: ctx.resolveFileType(relPath)
        };
      } catch (e) {
        ctx.log.error(e);
      }
    });
    finder.on('end', () => {
      try {
        ctx.fileTree = files;
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
