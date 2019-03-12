let yauzl = require('yauzl'),
  { mkdirp, createWriteStream } = require('fs-extra'),
  { join, dirname } = require('path');

module.exports = function unzip(ctx, callback) {
  let seenError = false,
    error = err => {
      if (seenError) return;
      seenError = !!err;
      callback(err);
    };
  try {
    yauzl.open(
      ctx.sourcePath,
      { lazyEntries: true, autoClose: true },
      (err, zipFile) => {
        if (err) return error(err); // fatal
        zipFile.readEntry();
        zipFile.on('error', error); // fatal
        zipFile.on('entry', entry => {
          try {
            // directory
            if (/\/$/.test(entry.fileName)) {
              mkdirp(join(ctx.tmpPath, entry.fileName), err => {
                if (err) return error(err); // fatal
                try {
                  zipFile.readEntry();
                } catch (e) {
                  ctx.log.error(e);
                  error(e); // fatal
                }
              });
            } else {
              try {
                zipFile.openReadStream(entry, (err, readStream) => {
                  if (err) return error(err); // fatal
                  try {
                    let fileName = join(ctx.tmpPath, entry.fileName);
                    mkdirp(dirname(fileName), err => {
                      if (err) return error(err); // fatal
                      try {
                        readStream.pipe(createWriteStream(fileName));
                        readStream.on('end', () => zipFile.readEntry());
                        readStream.on('error', error);
                      } catch (e) {
                        ctx.log.error(e);
                        error(e);
                      }
                    });
                  } catch (e) {
                    ctx.log.error(e);
                    error(e);
                  }
                });
              } catch (e) {
                ctx.log.error(e);
                error(e);
              }
            }
          } catch (e) {
            ctx.log.error(e);
            error(e);
          }
        });
        zipFile.on('end', error);
      }
    );
  } catch (e) {
    ctx.log.error(e);
    error(e);
  }
};
