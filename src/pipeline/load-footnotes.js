import asyncMap from 'async/map';
import loadXML from '../lib/load-xml';
import xpath from '../lib/xpath';
import { FOOTNOTES_REL, ENDNOTES_REL } from '../constants/relationships';
import predigest from '../predigest';

export default function loadFootnotes(ctx, callback) {
  try {
    let { mainDocumentRels, docx, select } = ctx;
    if (!mainDocumentRels || !docx) return process.nextTick(callback);
    let fnRel = mainDocumentRels.find(rel => rel.type === FOOTNOTES_REL),
      enRel = mainDocumentRels.find(rel => rel.type === ENDNOTES_REL),
      sources = [fnRel, enRel];
    asyncMap(
      sources,
      (noteRel, cb) => {
        if (!noteRel) return cb(null, null);
        loadXML(noteRel.fullPath, (err, doc) => {
          if (err) {
            ctx.log.error(err);
            return cb();
          }
          try {
            let currentDocumentRels =
              (ctx.fileTree[noteRel.packagePath] &&
                ctx.fileTree[noteRel.packagePath].rels) ||
              [];

            predigest(
              {
                docx: doc,
                select: xpath(doc),
                // the numbering for ancillary docs is inherited from the primary one (it seems)
                numbering: ctx.numbering,
                currentDocumentRels
              },
              () => cb(null, doc)
            );
          } catch (e) {
            ctx.log.error(e);
            cb(null, doc);
          }
        });
      },
      (err, [footnotesDocx, endnotesDocx]) => {
        if (err) {
          ctx.log.error(err);
          return callback();
        }
        try {
          ctx.footnotesDocx = footnotesDocx;
          ctx.endnotesDocx = endnotesDocx;
          let body = select('//w:body')[0];
          if (!body) return callback();
          if (footnotesDocx)
            body.appendChild(
              docx.importNode(footnotesDocx.documentElement, true)
            );
          if (endnotesDocx)
            body.appendChild(
              docx.importNode(endnotesDocx.documentElement, true)
            );
        } catch (e) {
          ctx.log.error(e);
        }
        callback();
      }
    );
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
}
