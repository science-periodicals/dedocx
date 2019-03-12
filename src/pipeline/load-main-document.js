import loadXML from '../lib/load-xml';
import xpath from '../lib/xpath';
import { OFFICE_DOCUMENT_REL } from '../constants/relationships';
import predigest from '../predigest';

export default function loadMainDocument(ctx, callback) {
  try {
    let mainDoc =
      ctx.fileTree['/'] &&
      ctx.fileTree['/'].rels &&
      ctx.fileTree['/'].rels.find(rel => rel.type === OFFICE_DOCUMENT_REL);
    if (!mainDoc) return process.nextTick(callback);
    loadXML(mainDoc.fullPath, (err, doc) => {
      if (err) {
        ctx.log.error(err);
        return callback();
      }
      try {
        ctx.docx = doc;
        ctx.mainDocumentRels =
          (ctx.fileTree[mainDoc.packagePath] &&
            ctx.fileTree[mainDoc.packagePath].rels) ||
          [];
        ctx.select = xpath(doc);
        predigest(
          Object.assign({}, ctx, { currentDocumentRels: ctx.mainDocumentRels }),
          callback
        );
      } catch (e) {
        ctx.log.error(e);
        callback();
      }
    });
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
}
