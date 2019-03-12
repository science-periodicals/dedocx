import pipeline from '../lib/pipeline';
import fields from './fields';
import bookmarkIds from './bookmark-ids';
import textboxBookmarks from './textbox-bookmarks';
import lists from './lists';
import captions from './captions';
import reparentBookmarks from './reparent-bookmarks';
import loadDrawingData from './load-drawing-data';
import embedRelationships from './embed-relationships';
import applyBookmarks from './apply-bookmark';
import defaultStyleMap from '../lib/default-style-map';

// CONTEXT
//  Pre-digestion should use its own, simplified context. The idea is that different documents can
//  be pre-digested but this step does not need to know, always relying on the same parts.
//  {
//    docx:                 the document
//    select:               an XPath resolver contextualised to the document
//    styleMap:             the styles for this document (defaulted)
//    numbering:            the numbering for this document
//    log:                  optional logging
//    currentDocumentRels:  rels applicable to the document being digested
//  }
export default function predigest(ctx = {}, callback) {
  try {
    if (!ctx.log) ctx.log = console;
    if (!ctx.styleMap) ctx.styleMap = defaultStyleMap;
    pipeline(
      [
        fields,
        bookmarkIds,
        textboxBookmarks,
        loadDrawingData,
        embedRelationships,
        lists,
        captions,
        reparentBookmarks,
        applyBookmarks
      ],
      ctx,
      err => {
        if (err) ctx.log.error(err);
        callback(err, ctx);
      }
    );
  } catch (e) {
    ctx.log.error(e);
  }
}
