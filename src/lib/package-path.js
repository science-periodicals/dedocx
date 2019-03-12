// Paths in OOXML packaging, stripped of the tmpPath and with a leading /
module.exports = function packagePath(ctx, fileName) {
  fileName = fileName.replace(ctx.tmpPath, '');
  if (!/^\//.test(fileName)) fileName = `/${fileName}`;
  return fileName;
};
