let shortid = require('shortid'),
  { W_NS } = require('../constants/ns');

// Bookmark IDs are reused inside a container, which causes trouble when we put together a document
// from several parts. We just rename them all, with a unique ID prefix per doc.
// Also applies to permissions.
module.exports = function bookmarkIds(ctx, callback) {
  try {
    let { select } = ctx,
      prefix = shortid.generate();
    if (!select) return process.nextTick(callback);
    select(
      '//w:bookmarkStart | //w:bookmarkEnd | //w:permStart | //w:permEnd | //w:commentRangeStart | //w:commentRangeEnd | //w:commentReference'
    ).forEach(bm => {
      bm.setAttributeNS(
        W_NS,
        'w:id',
        `${prefix}_${bm.getAttributeNS(W_NS, 'id')}`
      );
    });
  } catch (e) {
    ctx.log.error(e);
  }
  process.nextTick(callback);
};
