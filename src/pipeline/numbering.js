import { OFFICE_DOCUMENT_REL, NUMBERING_REL } from '../constants/relationships';
import loadXML from '../lib/load-xml';
import xpath from '../lib/xpath';
import { string, number } from '../lib/attribute-parsers';

// Extracts the numbering as they apply to the Main Document.
// It is possible there may be numbering for other documents as well.
// NOTE: we ignore w:numPicBullet and w:numIdMacAtCleanup, and in general we do not at this time
// process enough of this file to do much more than decide between `ul` and `ol`. It's easy to add
// support for more, though.
export default function numbering(ctx, callback) {
  try {
    const mainDoc =
      ctx.fileTree['/'] &&
      ctx.fileTree['/'].rels &&
      ctx.fileTree['/'].rels.find(rel => rel.type === OFFICE_DOCUMENT_REL);

    if (!mainDoc) {
      return process.nextTick(callback);
    }

    const mainDocPath = mainDoc.packagePath;
    const numberingRel =
      ctx.fileTree[mainDocPath] &&
      ctx.fileTree[mainDocPath].rels &&
      ctx.fileTree[mainDocPath].rels.find(rel => rel.type === NUMBERING_REL);

    if (!numberingRel) {
      return process.nextTick(callback);
    }

    loadXML(numberingRel.fullPath, (err, doc) => {
      if (err) {
        ctx.log.error(err);
        return callback();
      }
      try {
        let select = xpath(doc);
        const abstractNums = {};
        ctx.numbering = {};

        select('/w:numbering/w:abstractNum').forEach(abNum => {
          let abNumId = string(abNum, 'abstractNumId');
          if (!abNumId) return;
          abstractNums[abNumId] = select('./w:lvl', abNum).map(lvl => ({
            ilvl: number(lvl, 'ilvl'),
            numFmt: select('./w:numFmt', lvl).map(el => string(el))[0]
          }));
        });
        select('/w:numbering/w:num').forEach(num => {
          let numId = string(num, 'numId');
          let abNumId = select('./w:abstractNumId', num).map(el =>
            string(el)
          )[0];

          if (!numId || !abNumId || !abstractNums[abNumId]) return;
          ctx.numbering[numId] = abstractNums[abNumId];
        });
      } catch (e) {
        ctx.log.error(e);
      }
      callback();
    });
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
}
