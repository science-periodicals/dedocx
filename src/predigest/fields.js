/* eslint no-loop-func:0 */

let { ELEMENT_NODE } = require('dom-node-types'),
  extractProperties = require('../lib/extract-properties'),
  // , elementInTree = require('../lib/element-in-tree')
  { W_NS, SA_NS } = require('../constants/ns'),
  remove = require('../lib/remove'),
  serializeXML = require('../lib/serialize-xml'),
  xpath = require('../lib/xpath');

// This takes all fldChar[fldCharType="begin"]/instrText+/fldChar[separate]/flcChar[end] and turns
// them into fldSimple. A single field expression is built, and a single default fallback is
// accumulated for cases in which nesting happens.
// This approach has limitations. Most notably, if different styles apply to different parts of the
// field, these will be lost.
// This also assumes that all fldChar sequences share a common parent. Sometimes that's not the
// case. A typical example is in the generation of a bibliography.
module.exports = function predigestFields(
  { select, docx, log } = {},
  callback
) {
  try {
    if (!select) return process.nextTick(callback);

    // This is relatively inefficient, but it is probably correct.
    // The problem is that the ranges expressed by fields are potentially complex, and they nest in
    // bizarre ways, in addition to always being specified at the run level even when they apply to
    // groups of paragraphs.
    // Because of those structures, in order to map fields into a more readily processable form, we
    // process only those with no subfield (maxDepth=1) in any given turn. Once those have been
    // done, we start the process again. Those that were maxDepth=2 should now be maxDepth=1, and
    // get processed — until we've done everything.
    let maxestDepth = 0,
      iterations = 0,
      fields = select('//w:fldChar[@w:fldCharType="begin"]')
        .map(begin => {
          let fp = new FieldProcessor(begin, select, docx);
          fp.run();
          if (fp.maxDepth > maxestDepth) maxestDepth = fp.maxDepth;
          return fp;
        })
        .filter(fp => fp.maxDepth === 1);
    while (fields.length) {
      fields.forEach(fld => {
        // fld.dump(); // XXX
        if (fld.invalid) {
          fld.allRuns().forEach(remove);
          if (fld.paragraphMode) {
            fld.currentParagraphs.shift();
            fld.currentParagraphs.forEach(remove);
          }
          return;
        }
        // if we have just one instruction and it's instrText, then we can have a fldSimple
        if (
          fld.instructions.length === 1 &&
          select('./w:instrText', fld.instructions[0])[0]
        ) {
          let fldSimple = docx.createElementNS(W_NS, 'w:fldSimple');
          fldSimple.setAttributeNS(
            W_NS,
            'w:instr',
            select('./w:instrText', fld.instructions[0])[0].textContent
          );
          if (fld.data) fldSimple.setAttributeNS(SA_NS, 'sans:data', fld.data);
          fieldWrapAndReplace(fld, fldSimple, fldSimple);
        } else {
          let sansField = docx.createElementNS(SA_NS, 'sans:field'),
            sansInstructions = docx.createElementNS(SA_NS, 'sans:instructions'),
            sansContent = docx.createElementNS(SA_NS, 'sans:content');
          if (fld.data) sansField.setAttribute('data', fld.data);
          sansField.appendChild(sansInstructions);
          sansField.appendChild(sansContent);
          fld.instructions.forEach(r => {
            // if (!elementInTree(r)) return; // This check probably not needed
            let rPr = select('./w:rPr', r)[0],
              instrText = select('./w:instrText', r)[0],
              sf = select('self::w:fldSimple | self::sans:field', r)[0],
              sansInstruction = docx.createElementNS(SA_NS, 'sans:instruction');
            sansInstructions.appendChild(sansInstruction);
            if (rPr)
              sansInstruction.setAttribute(
                'props',
                JSON.stringify(extractProperties(rPr))
              );
            if (instrText)
              sansInstruction.setAttribute('text', instrText.textContent);
            else if (sf) {
              if (sf.localName === 'fldSimple' && !sf.childNodes.length) {
                let txt = sf.getAttributeNS(W_NS, 'instr'),
                  data = sf.getAttributeNS(SA_NS, 'data');
                if (txt) sansInstruction.setAttribute('text', txt);
                if (data) sansInstruction.setAttribute('data', data);
              } else sansInstruction.appendChild(sf.cloneNode(true));
            }
          });
          fieldWrapAndReplace(fld, sansField, sansContent);
        }
      });
      fields = select('//w:fldChar[@w:fldCharType="begin"]')
        .map(begin => new FieldProcessor(begin, select, docx).run())
        .filter(fp => fp.maxDepth === 1);
      iterations++;
      if (iterations > maxestDepth + 1) {
        throw new Error(
          `On iteration ${iterations} of field system with max depth ${maxestDepth}`
        );
      }
    }
  } catch (e) {
    log.error(e);
  }
  process.nextTick(callback);
};

// Look for all fldChar`begin`. Start from their parent run.
// Get the fldData if applicable
// Go through each following run in turn.
//  - if the run contains fldChar`separate` and depth is 1, set that flag
//  - if the run contains fldChar`end`:
//    - if depth is 1, we are done
//    - otherwise decrement the depth
//  - if the run contains fldChar`begin`, increment depth
//  - if the run contains an instrText, add that to the list of instructions
//  - otherwise:
//    - if we've seen separate, add to the field list
// If we run out of runs, we switch to paragraph mode
// The first paragraph is the current one, minus all the runs that contain fldChar or instrText.
// Go through each following paragraph in turn.
// For each, go through its runs one by one like above, until we reach an exit condition.
// (Check for the presence of fldChar before descending, as an optimisation.)
// If we reach the end of the document, we're in an invalid state: remove all fld stuff.
class FieldProcessor {
  constructor(begin, select) {
    this.begin = begin;
    this.select = select;
    this.docx = begin.ownerDocument;
    this.startRun = begin.parentNode;
    this.invalid = false;
    this.instructions = [];
    this.currentRuns = [];
    this.currentParagraphs = [];
    this.depth = 1;
    this.maxDepth = 1;
    this.separator = false;
    this.paragraphMode = false;
    this.done = false;
    this.endRun = null;
    this.endParagraph = null;
    let fldData = select('./w:fldData', begin)[0];
    this.data = fldData && fldData.textContent;
  }
  run() {
    if (!this.startRun) return this;
    this.goThroughRuns(this.select('following-sibling::*', this.startRun));
    // we haven't reached the end in the current runs, we switch to paragraphMode
    if (!this.done) {
      // We're switching to paragraphMode, which means the current paragraph will become part of
      // current content. Later, we will transform things to include the content.
      this.paragraphMode = true;
      this.currentParagraphs = [this.startRun.parentNode];
      let curParagraph = this.followingElement(this.startRun.parentNode);
      while (!this.done && curParagraph) {
        this.currentParagraphs.push(curParagraph);
        this.goThroughRuns(Array.from(curParagraph.childNodes));
        curParagraph = this.followingElement(curParagraph);
      }
      if (!this.done) this.invalid = true;
    }
    return this;
  }
  goThroughRuns(runs) {
    runs.forEach(r => {
      if (this.done) return;
      if (
        (r.namespaceURI === W_NS && r.localName === 'fldSimple') ||
        (r.namespaceURI === SA_NS && r.localName === 'field')
      ) {
        if (this.separator) {
          if (!this.paragraphMode) this.currentRuns.push(r);
        } else this.instructions.push(r);
        return;
      }
      let fldChar = this.select('./w:fldChar', r)[0];
      if (fldChar) {
        let type = fldChar.getAttributeNS(W_NS, 'fldCharType');
        if (type === 'separate') {
          if (this.depth === 1) this.separator = r;
          else if (this.separator) {
            if (!this.paragraphMode) this.currentRuns.push(r);
          } else this.instructions.push(r);
        } else if (type === 'begin') {
          this.depth++;
          if (this.depth > this.maxDepth) this.maxDepth = this.depth;
          if (this.separator) {
            if (!this.paragraphMode) this.currentRuns.push(r);
          } else this.instructions.push(r);
        } else if (type === 'end') {
          if (this.depth === 1) {
            this.done = true;
            this.endRun = r;
            if (this.currentParagraphs && this.currentParagraphs.length) {
              this.endParagraph = this.currentParagraphs[
                this.currentParagraphs.length - 1
              ];
            }
          } else if (this.separator) {
            if (!this.paragraphMode) this.currentRuns.push(r);
          } else this.instructions.push(r);
          this.depth--;
        }
        return;
      }
      let instr = this.select('./w:instrText', r)[0];
      if (instr) {
        if (this.separator) {
          if (!this.paragraphMode) this.currentRuns.push(r);
        } else this.instructions.push(r);
        return;
      }
      // if we get here and haven't seen the separator, we're not in the right place
      if (!this.separator) return;
      if (!this.paragraphMode) this.currentRuns.push(r);
    });
  }
  followingElement(el) {
    if (!el) return;
    let ns = el.nextSibling;
    while (ns) {
      if (ns.nodeType === ELEMENT_NODE) return ns;
      ns = ns.nextSibling;
    }
  }
  initialRuns() {
    return [this.startRun]
      .concat(this.instructions)
      .concat(this.separator)
      .filter(Boolean);
  }
  allRuns() {
    return this.initialRuns()
      .concat(this.currentRuns)
      .concat(this.endRun)
      .filter(Boolean);
  }
  dump() {
    let hideData = node => {
      this.select('.//w:fldData', node).forEach(
        data => (data.textContent = '')
      );
      return node;
    };
    console.warn(`
### Field ${this.done ? 'DONE' : 'NOT DONE'} / ${
      this.invalid ? 'INVALID' : 'OK'
    }
  max depth: ${this.maxDepth}
  paragraph: ${this.paragraphMode}
  <INSTRUCTIONS>
    ${this.instructions
      .map(inst => serializeXML(hideData(inst)))
      .join('\n--------\n')}
  </INSTRUCTIONS>
  ${this.separator ? serializeXML(this.separator) : '-- no sep --'}
  <CONTENT>
    ${
      this.paragraphMode
        ? this.currentParagraphs
            .map(p => serializeXML(hideData(p)))
            .join('\n--------\n')
        : this.currentRuns
            .map(r => serializeXML(hideData(r)))
            .join('\n--------\n')
    }
  </CONTENT>
  ${
    this.paragraphMode
      ? `${
          this.endParagraph ? serializeXML(this.endParagraph) : '-- no end --'
        }`
      : `${this.endRun ? serializeXML(this.endRun) : '-- no end --'}`
  }
    `);
  }
}

function fieldWrapAndReplace(fld, wrapper, content) {
  // This is a bit confusing, follow the comments as we progress.
  if (fld.paragraphMode) {
    let ignorable = el =>
      el.namespaceURI === W_NS &&
      (/Pr$/.test(el.localName) || el.localName === 'proofErr');

    // The structure of the field has dictated that we operate at the paragraph level; nevertheless
    // the fldChar`begin` marker can still be preceded by runs of text that are not technically
    // inside the field despite being technically inside its first paragraph. We clone the
    // paragraph, remove everything after the field begins from it, and and move that before us.
    let hasLeadingContent = xpath(fld.startRun)('preceding-sibling::*').find(
      el => !ignorable(el)
    );
    if (hasLeadingContent) {
      // Get the index of the start run in the paragraph because we can't know there aren't several
      // that would match on other criteria
      let firstParagraph = fld.currentParagraphs[0],
        offset = Array.from(firstParagraph.childNodes).indexOf(fld.startRun),
        cloneParagraph = firstParagraph.cloneNode(true),
        cloneStart = cloneParagraph.childNodes[offset];
      while (cloneStart && cloneStart.nextSibling)
        remove(cloneStart.nextSibling);
      remove(cloneStart);
      firstParagraph.parentNode.insertBefore(cloneParagraph, firstParagraph);
      while (
        fld.startRun.previousSibling &&
        !/Pr$/.test(fld.startRun.previousSibling.localName)
      ) {
        remove(fld.startRun.previousSibling);
      }
    }

    // In a similar manner, the last paragraph of the paragraph-mode field may be followed by
    // content. We move that content out to a cloned paragraph.
    let hasTrailingContent = xpath(fld.endRun)('following-sibling::*').find(
      el => !ignorable(el)
    );
    if (hasTrailingContent) {
      // Same thing, get index, etc.
      let lastParagraph = fld.endParagraph,
        offset = Array.from(lastParagraph.childNodes).indexOf(fld.endRun),
        cloneParagraph = lastParagraph.cloneNode(true),
        cloneEnd = cloneParagraph.childNodes[offset];
      while (
        cloneEnd &&
        cloneEnd.previousSibling &&
        !/Pr$/.test(cloneEnd.previousSibling.localName)
      ) {
        remove(cloneEnd.previousSibling);
      }
      remove(cloneEnd);
      lastParagraph.parentNode.insertBefore(
        cloneParagraph,
        lastParagraph.nextSibling
      );
      while (fld.endRun.nextSibling) remove(fld.endRun.nextSibling);
    }

    // move and remove
    fld.initialRuns().forEach(remove);
    fld.endParagraph.parentNode.insertBefore(
      wrapper,
      fld.endParagraph.nextSibling
    );
    // NOTE: reinstate p.cloneNode() below?
    fld.currentParagraphs.forEach(p => content.appendChild(p));
    remove(fld.endRun);
  } else {
    fld.currentRuns.forEach(r => content.appendChild(r.cloneNode(true)));
    fld.endRun.parentNode.replaceChild(wrapper, fld.endRun);
    fld.allRuns().forEach(remove);
  }
}
