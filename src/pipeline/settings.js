// Extracts the settings as they apply to the Main Document.
// NOTE: we ignore a lot of stuff at this point, see http://www.datypic.com/sc/ooxml/e-w_settings.html
// The one that might be worth doing is http://www.datypic.com/sc/ooxml/e-m_mathPr.html
// We should do autHyphenation (goes with suppressAutoHyphens).
module.exports = function settings(ctx, callback) {
  return process.nextTick(callback);
};
