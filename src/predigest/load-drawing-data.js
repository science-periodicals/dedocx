import asyncEach from 'async/each';
import loadXML from '../lib/load-xml';
import { SA_NS, R_NS } from '../constants/ns';

// This part is very much incomplete. We support extracting one kind
// of drawing data. The principles are likely relatively easy to extend to more types given that we
// have already done the work of stepping through all the relationship indirections.
// This supports the "Picture Grid", as found in Word under Smart Art > Picture > Picture Grid.
// The sheer volume of XML that even the simplest picture grid produces is mind-boggling. Adding one
// grid (or presumably any other "Smart Art") add four documents under "diagrams" totally almost
// 3000 lines, plus two additional rels files (with the exact same content) and several extra relationships on the main document.
// Nothing here is particularly complex, but the volume of content and the level of
// indirection make it a bit involved.
// The Main Document will have an a:graphic with a:graphicData containing a dgm:relIds element. The
// latter points to four relationships of the Main Document, the one of which we want is the r:dm.
// This `diagramData` document contains *almost* all the information about the layout (all the text
// and images are there) but… they are not paired (at least not in a manner in which I have been
// able to infer). Because of that, all we get from this document is a dsp:dataModelExt element.
// That element has a relationship which is *not* is the diagramData document's relationships
// but rather in the Main Document's relationships (or, presumably, in whichever
// document imported the diagramData).
// We now load that "drawing" document. In it we find dsp:sp elements that are
// in a flat list but correctly interleaved so that we can use the content for our purposes.
// We conver the w:p that was holding the dgm:relIds into a sans:picture-grid with
// sans:picture-grid-item elements inside.
export default function loadDrawingData(ctx, callback) {
  let { select, docx, log, mainDocumentRels, fileTree } = ctx;

  asyncEach(
    select('//w:p[.//w:drawing//a:graphic//dgm:relIds]'),
    (multiFigWP, cb) => {
      try {
        let dgm = select('.//w:drawing//a:graphic//dgm:relIds', multiFigWP)[0],
          dataRelId = dgm.getAttributeNS(R_NS, 'dm');
        if (!dataRelId) {
          log.error(new Error('No diagram information found'));
          return cb();
        }
        let dataRel = mainDocumentRels.find(rel => rel.id === dataRelId);
        if (!dataRel) {
          log.error(new Error(`No diagram data relationship "${dataRelId}"`));
          return cb();
        }
        loadXML(dataRel.fullPath, (err, dataDoc) => {
          if (err) {
            log.error(err, 'Failed to load diagram data document');
            return cb();
          }
          try {
            // we now have data*.xml; we use it for one thing: the relationship to the
            // drawing*.xml
            let dme = select(
              '/dgm:dataModel/dgm:extLst/a:ext/dsp:dataModelExt',
              dataDoc
            )[0];
            if (!dme) {
              log.error(new Error('Cannot find drawing pointer in data file'));
              return cb();
            }
            // Word's indirection model for relationships is not intuitive. The relationship ID we just obtained should be in the
            // rels for the data file (which exists), but instead it's in the rels for the
            // file that links to the drawing.
            let drawRelId = dme.getAttribute('relId'),
              drawRel = mainDocumentRels.find(rel => rel.id === drawRelId);
            if (!drawRel) {
              log.error(new Error('Cannot find drawing relationship'));
              return cb();
            }
            // so let's go to another file, yolo!
            loadXML(drawRel.fullPath, (err, drawDoc) => {
              if (err) {
                log.error(err, 'Failed to load other docx XML');
                return cb();
              }
              try {
                let data = [],
                  curItem;
                // here the labels and images are interleaved in a flat dsp:sp list
                select('/dsp:drawing/dsp:spTree/dsp:sp', drawDoc).forEach(
                  sp => {
                    let txtBody = select('./dsp:txBody', sp)[0],
                      blip = select('.//a:blip', sp)[0],
                      ext = select('.//dsp:spPr/a:xfrm/a:ext', sp)[0],
                      hadCurItem = !!curItem;
                    if (!hadCurItem) curItem = {};
                    if (txtBody) curItem.label = txtBody.textContent;
                    else if (blip) {
                      curItem.imgId = blip.getAttributeNS(R_NS, 'embed');
                      if (ext) {
                        let cx = parseInt(ext.getAttribute('cx') || '0', 10),
                          cy = parseInt(ext.getAttribute('cy') || '0', 10);
                        if (cx) curItem.width = `${(cx / 360000).toFixed(2)}cm`;
                        if (cy)
                          curItem.height = `${(cy / 360000).toFixed(2)}cm`;
                      }
                    } else {
                      return log.warn(
                        new Error('Failed to parse dsp:* structure')
                      );
                    }
                    if (hadCurItem) {
                      data.push(curItem);
                      curItem = null;
                    }
                  }
                );
                // if there is a curItem after the processing, we had an unexpected structure
                if (curItem) log.warn(new Error('Unexpected dsp element'));

                // We now need to resolve the image rels. We need the rels for the drawing doc.
                let drawDocRels = fileTree[drawRel.packagePath].rels,
                  pictureGrid = docx.createElementNS(
                    SA_NS,
                    'sans:picture-grid'
                  );
                data.forEach(item => {
                  let imageRel = drawDocRels.find(rel => rel.id === item.imgId);
                  if (!imageRel) return;
                  let pgi = docx.createElementNS(
                    SA_NS,
                    'sans:picture-grid-item'
                  );
                  // NOTE: this replacement is a hack, we should be smarter about path resolution
                  pgi.setAttribute(
                    'src',
                    imageRel.target.replace(/.*?media\//, 'media/')
                  );
                  pgi.setAttribute('full-path', imageRel.fullPath);
                  pgi.setAttribute('package-path', imageRel.packagePath);
                  pgi.setAttribute('label', item.label);
                  if (item.width) pgi.setAttribute('width', item.width);
                  if (item.height) pgi.setAttribute('width', item.height);
                  pictureGrid.appendChild(pgi);
                });
                multiFigWP.parentNode.replaceChild(pictureGrid, multiFigWP);
              } catch (e) {
                ctx.log.error(e);
              }
              cb();
            });
          } catch (e) {
            ctx.log.error(e);
          }
        });
      } catch (e) {
        ctx.log.error(e);
      }
    },
    err => {
      if (err) log.error(err);
      callback();
    }
  );
}
