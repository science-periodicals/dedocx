let { W_NS, SA_NS } = require('../constants/ns'),
  elementInTree = require('../lib/element-in-tree'),
  fieldDetails = require('../lib/field-details'),
  nextElement = require('../lib/prev-element'),
  normalizeText = require('../lib/normalize-text');

// Citation: ADDIN ZOTERO_ITEM BIBLIOGRAPHY_CITATION JSON (maybe over several fields)
// Bibliography: ADDIN ZOTERO_BIBL {"custom":[]} BIBLIOGRAPHY_BIBLIOGRAPHY
module.exports = function zotero(ctx, callback) {
  let { select, log, docx } = ctx,
    curGroup = [],
    curCites = [];

  select('//w:fldSimple | //sans:field').forEach(fld => {
    if (!elementInTree(fld)) return;
    let { wholeInstr } = fieldDetails(fld);
    if (!/^\s*ADDIN\s+ZOTERO_ITEM\s+BIBLIOGRAPHY_CITATION\s*/i.test(wholeInstr))
      return;

    try {
      let data = JSON.parse(
          wholeInstr.replace(/.*?BIBLIOGRAPHY_CITATION\s*/, '')
        ),
        localCites = [];
      (data.citationItems || []).forEach(({ itemData }) => {
        itemData.id = `Zotero-${itemData.id}`;
        localCites.push(itemData.id);
        ctx.bibliography[itemData.id] = itemData;
      });
      let nextRun = nextElement(fld),
        nextCite = nextElement(nextRun);
      curGroup.push(fld);
      curCites = curCites.concat(localCites);
      if (
        nextRun &&
        nextRun.namespaceURI === W_NS &&
        nextRun.localName === 'r' &&
        /^[\s-;,]?$/.test(normalizeText(nextRun.textContent)) &&
        nextCite &&
        ((nextCite.namespaceURI === W_NS &&
          nextCite.localName === 'fldSimple') ||
          (nextCite.namespaceURI === SA_NS &&
            nextCite.localName === 'field')) &&
        /BIBLIOGRAPHY_CITATION/.test(fieldDetails(nextCite))
      ) {
        curGroup.push(nextRun);
      } else {
        let group = docx.createElementNS(SA_NS, 'sans:citation-group');
        group.setAttribute('cites', JSON.stringify(curCites));
        curGroup[0].parentNode.insertBefore(group, curGroup[0]);
        curGroup.forEach(el => group.appendChild(el));
        curGroup = [];
        curCites = [];
      }
    } catch (err) {
      log.error(err, 'Failed to extract Zotero bibliography');
    }
  });

  process.nextTick(callback);
};
