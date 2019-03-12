let { W_NS } = require('../constants/ns');

// Word seems to treat the content of textboxes as somehow separate documents. This can wreak havoc
// in that it will reuse existing IDs inside of the same document.  Also applies to permissions.
module.exports = function predigestTextboxBookmarks(ctx, callback) {
  try {
    let { select } = ctx,
      txId = 0;
    if (!select) return process.nextTick(callback);
    select('//w:txbxContent').forEach(tx => {
      txId++;
      select(
        './/w:bookmarkStart | .//w:bookmarkEnd | .//w:permStart | .//w:permEnd | .//w:commentRangeStart | .//w:commentRangeEnd | .//w:commentReference',
        tx
      ).forEach(bm => {
        bm.setAttributeNS(
          W_NS,
          'w:id',
          `${txId}_${bm.getAttributeNS(W_NS, 'id')}`
        );
      });
    });
  } catch (e) {
    ctx.log.error(e);
  }
  process.nextTick(callback);
};
