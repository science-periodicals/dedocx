let tmp = require('tmp');

// Picks the tmpPath if one has not been specified
module.exports = function pickTmp(ctx, callback) {
  if (ctx.tmpPath) return process.nextTick(callback);
  tmp.dir({ unsafeCleanup: true }, (err, root) => {
    if (err) return callback(err); // fatal
    ctx.tmpPath = root;
    callback();
  });
};
