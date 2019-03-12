import { R_NS, SA_NS } from '../constants/ns';

// DOCX has a horrible indirection of links (hyperlinks, images, etc.) that goes through a rels
// file. And that rels file is not the same for every document that we process. For added fun, the
// IDs are reused. Anyway, it's simpler to pre-digest so as to have the information ready when we
// actually transform
export default function embedRelationships(ctx, callback) {
  try {
    const { select, currentDocumentRels } = ctx;
    if (!select) {
      return process.nextTick(callback);
    }

    //a:blip are matched by r:embed
    select('//a:blip').forEach(blip => {
      let embed = blip.getAttributeNS(R_NS, 'embed');
      if (!embed) {
        return;
      }
      let imgRel = currentDocumentRels.find(rel => rel.id === embed);
      blip.setAttributeNS(SA_NS, 'sans:rel', JSON.stringify(imgRel));
    });

    //anchored images in tables are v:imagedata (not a:blip)
    //v:imagedata are matched by r:id
    select('//v:imagedata').forEach(imagedata => {
      let rid = imagedata.getAttributeNS(R_NS, 'id');

      if (!rid) {
        return;
      }
      let imgRel = currentDocumentRels.find(rel => rel.id === rid);
      imagedata.setAttributeNS(SA_NS, 'sans:rel', JSON.stringify(imgRel));
    });

    select('//w:hyperlink').forEach(hyper => {
      let rid = hyper.getAttributeNS(R_NS, 'id');
      if (!rid) {
        return;
      }
      let linkRel = currentDocumentRels.find(rel => rel.id === rid);
      hyper.setAttributeNS(SA_NS, 'sans:rel', JSON.stringify(linkRel));
    });
  } catch (e) {
    ctx.log.error(e);
  }

  process.nextTick(callback);
}
