let xmldom = require('xmldom'),
  shortid = require('shortid'),
  { W_NS, SA_NS } = require('../constants/ns'),
  remove = require('../lib/remove'),
  elementInTree = require('../lib/element-in-tree'),
  ancestors = require('../lib/ancestors'),
  fieldDetails = require('../lib/field-details'),
  parseField = require('../lib/parse-field'),
  // XXX this can be improved with more data
  // The type is currently problematic: we have only seen so many
  // It appears that types have a numeric identifier (which is stable) and a label (which users can
  // override). So we trust the numeric identifier, but we list the common label below for
  // clarity.
  en2type = {
    17: 'article-journal', // 'Journal Article'
    12: 'webpage', // 'Web Page'
    6: 'book', // 'Book'
    27: 'report', // 'Report'
    28: 'book' // 'Edited Book'
  };

// IMPORTANT NOTE: See the DTD in info/. There is a lot that we can fix from following that.

// EndNote - http://endnote.com/
// This is our reverse-engineering of the format that this software embeds in DOCX files. As far as
// we can tell it is not documented (and possibly subject to change at any time). The XML format is
// not particularly bad, but does feel somewhat cobbled together with limited integrity; the manner
// in which it gets embedded in DOCX is unpleasant (to put things mildly).
// As a result, we don't recommend using this format for any long-term persistence.
// NOTE: This may work (kindly provided by Curtis Smith)
// 1. Go to http://endnote.com/support
// 2. At the bottom, in the Search the Knowledgebase section, simply click
// "search"
// 3. Go to http://kbportal.thomson.com/display/2/kb/article.aspx?aid=122577&n=1&docid=1276611

// NOTE:
//  The record number (rec-number), which we also use as the bibliographic entry id
//  (as EndNote-${rec-number}) is *distinct* from the anchor that the hyperlinks under
//  a citation and the bookmark used in the bibliography (initially also called _ENREF_\d+). The
//  #\d+ that sometimes appears in the tooltip is the rec-number (but we can know from the
//  citation data anyway).
module.exports = function endnote(ctx, callback) {
  let { select, log, docx } = ctx;

  let seenRecNum = {},
    bmMap = {},
    insideCite = false;
  select('//w:fldSimple | //sans:field').forEach(fld => {
    if (!elementInTree(fld)) return;
    let { instr, data, content } = fieldDetails(fld);
    if (!/^\s*ADDIN\s+EN\.CITE(?:\.DATA)?\s*/i.test(instr)) return;

    // look for those that start with ADDIN EN.CITE
    let match = /^\s*ADDIN\s+(EN\.CITE(?:\.DATA)?)\s+(.*)/i.exec(instr),
      enDoc;
    // kill EN.CITE.DATA if it's inside an EN.CITE (but we still parse it in case it has data that
    // the parent does not)
    if (match && match[1] && /data/i.test(match[1])) {
      insideCite = !!ancestors(fld).find(
        el => el.localName === 'field' || el.localName === 'fldSimple'
      );
    }
    if (data) enDoc = attemptParse(data);
    if (!enDoc && match && match[2]) enDoc = attemptParse(match[2]);
    if (!enDoc) return;

    // process XML, add to bibEntries
    let localCites = [];
    select('//Cite', enDoc).forEach(cite => {
      try {
        let xpathText = (xp, el) => {
            let res = select(xp, el);
            if (!res || !res.length) return;
            let txt = res[0].textContent;
            if (/^\d+$/.test(txt)) return parseInt(txt, 10);
            return txt;
          },
          recNumber = xpathText('./record/rec-number', cite),
          type = xpathText('./record/ref-type', cite),
          item = {
            id: recNumber ? `EndNote-${recNumber}` : shortid.generate(),
            type: type && en2type[type] ? en2type[type] : 'article',
            title: xpathText('./record/titles/title', cite),
            volume: xpathText('./record/volume', cite),
            page: xpathText('./record/pages', cite),
            journalName: xpathText('./record/periodical/full-title', cite),
            URL: xpathText('./record/urls//url', cite),
            issue: xpathText('./record/number', cite)
          };
        let y = xpathText('./record/dates/year', cite);
        if (y) {
          let date = [y];
          let m = xpathText('./record/dates/month', cite);
          if (m) {
            date.push(m);
            let d = xpathText('./record/dates/day', cite); // this is hypothetical, not found in content
            if (d) date.push(d);
          }
          item.issued = { 'date-parts': [date] };
        }
        // WTF ISI pseudo-scheme for WOS
        if (/<Go\s+to\s+ISI>:/.test(item.URL)) delete item.URL;
        item.author = select('./record/contributors/authors/author', cite).map(
          x => ({ literal: x.textContent })
        );

        // duplicates are *normal* with EndNote so we don't report an error
        localCites.push(item.id);
        if (seenRecNum[item.id]) return;
        seenRecNum[item.id] = true;
        ctx.bibliography[item.id] = item;
      } catch (err) {
        log.error(err, 'Failed to extract EndNote bibliography');
      }
    });
    if (insideCite) return remove(fld);
    let hypers = select('.//w:hyperlink', content),
      hyperman = (hyper, idx) => {
        let id = localCites[idx];
        if (!id) return;
        let anchor = hyper.getAttributeNS(W_NS, 'anchor');
        if (anchor) bmMap[anchor] = id;
        hyper.setAttributeNS(W_NS, 'w:anchor', id);
        hyper.setAttributeNS(SA_NS, 'sans:citation', 'true');
      };
    if (hypers.length) {
      hypers.forEach(hyperman);
    } else {
      let parentHyper = select('ancestor::w:hyperlink', content)[0];
      if (!parentHyper) {
        let field,
          parentContent,
          parentField = select(
            'ancestor::w:fldSimple | ancestor::sans:field',
            content
          ).find(pf => {
            let { instr: parentInstr, content: parentCnt } = fieldDetails(pf);
            field = parseField(parentInstr);
            parentContent = parentCnt;
            if (field.type === 'HYPERLINK') return true;
            return false;
          });
        if (parentField) {
          parentHyper = docx.createElementNS(W_NS, 'w:hyperlink');
          parentHyper.setAttributeNS(W_NS, 'w:anchor', field.argument);
          if (field.t || field.n) {
            parentHyper.setAttributeNS(
              W_NS,
              'w:target',
              field.t || (field.n && '_blank')
            );
          }
          if (field.o) parentHyper.setAttributeNS(W_NS, 'w:tooltip', field.o);
          while (parentContent.hasChildNodes())
            parentHyper.appendChild(parentContent.firstChild);
          parentField.parentNode.replaceChild(parentHyper, parentField);
        }
      }
      if (parentHyper) {
        let cloneHyper = parentHyper.cloneNode();
        while (content.hasChildNodes())
          cloneHyper.appendChild(content.firstChild);
        content.appendChild(cloneHyper);
        hyperman(cloneHyper, 0);
        parentHyper.parentNode.replaceChild(fld, parentHyper);
      }
    }
  });

  select(`//*[@sans:id]`).forEach(el => {
    let old = el.getAttributeNS(SA_NS, 'id');
    if (bmMap[old]) el.setAttributeNS(SA_NS, 'sans:id', bmMap[old]);
  });
  select(`//sans:id`).forEach(el => {
    let old = el.getAttribute('id');
    if (bmMap[old]) el.setAttribute('id', bmMap[old]);
  });
  select(`//w:hyperlink[@w:anchor]`).forEach(el => {
    let old = el.getAttributeNS(W_NS, 'anchor');
    if (bmMap[old]) el.setAttributeNS(W_NS, 'w:anchor', bmMap[old]);
  });

  process.nextTick(callback);
};

function attemptParse(str, log) {
  // Base64 cannot contain `<` but XML has to, so we use this as a canari.
  if (!/</.test(str)) {
    try {
      str = new Buffer(str, 'base64').toString('utf8');
    } catch (err) {
      log.error(err, 'Failed to decode EndNote base64 data');
      return;
    }
  }
  try {
    return new xmldom.DOMParser().parseFromString(str);
  } catch (err) {
    log.error(err, `Failed to parse embedded EndNote`);
  }
}
