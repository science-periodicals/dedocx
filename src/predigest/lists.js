/**
 * Lists in Word are just paragraphs styled as list items that follow one another,
 * with specific properties overriding their depth and style. This turns them
 * into properly nested structures.
 */

import extractProperties from '../lib/extract-properties';
import xpath from '../lib/xpath';
import { SA_NS, W_NS } from '../constants/ns';
import { ELEMENT_NODE } from 'dom-node-types';
// import serializeXML from '../lib/serialize-xml';
// import prettifyXml from 'prettify-xml';

//  select:    an XPath resolver contextualised to the document
//  numbering: the document numbering (for lists)

export default function predigestLists(ctx, callback) {
  try {
    let { select, docx, numbering } = ctx;
    if (!select) {
      return process.nextTick(callback);
    }
    // HOW THIS WORKS
    //  For Pass 1: create a sequence of all lists with each of their list items (list items are found in consecutive w:p paragraph tags with w:numPr children)

    let sequences = [];
    select(`//w:p[./w:pPr/w:numPr]`)
      .filter(p => !checkIfElementIsListParagraph(p.previousSibling))
      .forEach(p => {
        let seq = [
          {
            el: p,
            children: []
          }
        ];

        let next = p.nextSibling;
        while (next) {
          if (checkIfElementIsListParagraph(next)) {
            seq.push({
              el: next,
              children: []
            });
            next = next.nextSibling;
          } else if (next.nodeType !== ELEMENT_NODE) {
            seq.push({ node: next });
            next = next.nextSibling;
          } else {
            next = null;
          }
        }

        sequences.push(seq);
      });

    // list items in Word have a level ('ilvl') and numbering style definition ('numId')
    // Pass 2: walk each sequence to get the level and numbering style for each item and nest items according to their level

    // Be careful as a list can start at any level, not only 0 as might be expected (this is because MSWord allows to create custom lists starting at any level).
    const levels = [];
    sequences.forEach(seq => {
      seq.forEach(({ el }) => {
        const pPrElements = select('./w:pPr', el);

        const numPr =
          pPrElements &&
          pPrElements[0] &&
          extractProperties(pPrElements[0]) &&
          extractProperties(pPrElements[0]).numPr;

        if (numPr && numPr.ilvl != null) {
          levels.push(numPr.ilvl);
        }
      });
    });
    let minLevel = levels.length ? Math.min(...levels) : 0;

    // console.log('======= before ========');

    // console.log('======= first list ========');
    // console.log('======= level 0 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[0][0].el)));
    // console.log(prettifyXml(serializeXML(sequences[0][1].el)));
    // console.log('======= level 1 (1) ========');
    // console.log(prettifyXml(serializeXML(sequences[0][2].el)));
    // console.log(prettifyXml(serializeXML(sequences[0][3].el)));

    // console.log('======= second list ========');
    // console.log('======= level 0 (1) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][0].el)));
    // console.log('======= level 1 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][1].el)));
    // console.log('======= level 0 (2) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][2].el)));
    // console.log('======= level 1 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][3].el)));
    // console.log('======= level 1 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][4].el)));
    // console.log('======= level 2 (1) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][5].el)));
    // console.log('======= level 2 (2) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][6].el)));

    sequences = sequences.map(seq => {
      let prevLevel = minLevel;
      let parentStack = [[]];

      seq.forEach(({ el, node, children }) => {
        if (node) {
          parentStack[0].push({ node, children });
          return;
        }
        let pPr = extractProperties(select('./w:pPr', el)[0]);
        let { ilvl = prevLevel } = pPr.numPr;
        if (ilvl < prevLevel) {
          while (ilvl < prevLevel) {
            prevLevel--;
            parentStack.shift();
          }
        } else if (ilvl > prevLevel) {
          while (ilvl > prevLevel + 1) {
            let kids = [];
            parentStack[0].push({ children: kids });
            parentStack.unshift(kids);
          }
          parentStack.unshift(
            parentStack[0][parentStack[0].length - 1].children
          );
        }
        parentStack[0].push({ el, children });
        prevLevel = ilvl;
      });

      // console.log(`LENGTH AT END ${parentStack.length}`);
      return parentStack[parentStack.length - 1];
    });

    // console.log('======= after ========');
    // console.log('======= first list ========');
    // console.log('======= level 0 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[0][0].el)));
    // console.log(prettifyXml(serializeXML(sequences[0][1].el)));
    // console.log('======= level 1 (1) ========');
    // console.log(prettifyXml(serializeXML(sequences[0][1].children[0].el)));
    // console.log(prettifyXml(serializeXML(sequences[0][1].children[1].el)));

    // console.log('======= second list ========');
    // console.log('======= level 0 (1) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][0].el)));
    // console.log('======= level 1 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][0].children[0].el)));
    // console.log('======= level 0 (2) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][1].el)));
    // console.log('======= level 1 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][1].children[0].el)));
    // console.log('======= level 1 (.) ========');
    // console.log(prettifyXml(serializeXML(sequences[1][1].children[1].el)));
    // console.log('======= level 2 (1) ========');
    // console.log(
    //   prettifyXml(serializeXML(sequences[1][1].children[1].children[0].el))
    // );
    // console.log('======= level 2 (2) ========');
    // console.log(
    //   prettifyXml(serializeXML(sequences[1][1].children[1].children[1].el))
    // );

    // XXX ISSUE: consecutive lists with different numId should be split into different list types.
    // This could be done as part of this pass, or as a refinement on the pre-processed struct.

    // Pass 3: walk sequences to create nested HTML elements for each level
    // Consecutive lists with different numbering definitions (numId) should be split into different list types.

    let rec = (seqItem, parent, numId, ilvl) => {
      if (seqItem.node) {
        parent.appendChild(seqItem.node);
        return;
      }

      if (seqItem.el) {
        parent.appendChild(seqItem.el);
        let newProps =
          extractProperties(select('./w:pPr', seqItem.el)[0]).numPr || {};

        numId = newProps.numId;
        ilvl = newProps.ilvl;
      }

      let container = seqItem.el || createListParagraph(parent, numId, ilvl);

      if (seqItem.children && seqItem.children.length) {
        let newParent = docx.createElementNS(SA_NS, 'sans:list');

        //set child list type based on the type of the first child *not the parent*
        const firstChildProps =
          extractProperties(select('./w:pPr', seqItem.children[0].el)[0])
            .numPr || {};

        newParent.setAttribute(
          'type',
          getListType(numbering[firstChildProps.numId], firstChildProps.ilvl)
        );

        container.appendChild(newParent);

        seqItem.children.forEach(child => {
          rec(child, newParent, numId, ilvl);
        });
      }
    };

    sequences.forEach(seq => {
      let firstEl = (seq || []).find(item => !!item.el);
      if (!firstEl) {
        return;
      }

      firstEl = firstEl.el;

      let { numId, ilvl } =
        extractProperties(select('./w:pPr', firstEl)[0]).numPr || {};

      let parent = docx.createElementNS(SA_NS, 'sans:list');
      parent.setAttribute('type', getListType(numbering[numId], ilvl));
      firstEl.parentNode.insertBefore(parent, firstEl);

      seq.forEach(seqItem => rec(seqItem, parent, numId, ilvl));
    });
  } catch (e) {
    ctx.log.error(e);
  }

  process.nextTick(callback);
}

function getListType(levelFmt = [], level) {
  let abs = levelFmt.find(lvl => lvl.ilvl === parseInt(level, 10));
  if (!abs || !abs.numFmt || abs.numFmt === 'bullet' || abs.numFmt === 'none') {
    return 'ul';
  }
  return 'ol';
}

function createListParagraph(parent, numId, ilvl) {
  let doc = parent.ownerDocument;
  let wp = doc.createElementNS(W_NS, 'w:p');
  let wpPr = doc.createElementNS(W_NS, 'w:pPr');
  let wnumPr = doc.createElementNS(W_NS, 'w:numPr');
  let wilvl = doc.createElementNS(W_NS, 'w:ilvl');
  let wnumId = doc.createElementNS(W_NS, 'w:numId');

  wilvl.setAttributeNS(W_NS, 'w:val', ilvl);
  wnumId.setAttributeNS(W_NS, 'w:val', numId);
  wnumPr.appendChild(wilvl);
  wnumPr.appendChild(wnumId);
  wpPr.appendChild(wnumPr);
  wp.appendChild(wpPr);
  parent.appendChild(wp);

  return wp;
}

function checkIfElementIsListParagraph(el) {
  if (
    !el ||
    el.nodeType !== ELEMENT_NODE ||
    el.namespaceURI !== W_NS ||
    el.localName !== 'p' ||
    !xpath(el)('./w:pPr/w:numPr').length
  ) {
    return false;
  }
  return true;
}
