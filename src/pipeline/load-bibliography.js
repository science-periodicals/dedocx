import pipeline from '../lib/pipeline';
import word from '../bibliography/word';
// import endnote from '../bibliography/endnote';
// import zotero from '../bibliography/zotero';

export default function loadBibliography(ctx, callback) {
  try {
    pipeline([word], ctx, err => {
      if (err) {
        ctx.log.error(err);
      }
      callback(null, ctx);
    });
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
}
