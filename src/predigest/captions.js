import shortid from 'shortid';
import { SA_NS, W_NS } from '../constants/ns';
import remove from '../lib/remove';
import fieldDetails from '../lib/field-details';

// Captions in Word are done in pretty much the worst possible manner. They are just paragraphs with
// a style, you cannot know what they are actually attached to. Because of this, we use heuristics
// that help us generate order in this mess so that we can accurately caption content and make use
// of cross-references.
//
// All the talk is about machine learning. This here is all about machine guessing. With a shotgun.
//
// Attachment targets for captions are: table, equation, figure, text boxes or code.
// We use SANS to mark captions while we are processing them.
//
// == PROCESS ==
// If a caption has keepNext, it attaches to what follows it.
// What follows may be a target, or more captions to be grouped with it.
// Between that caption and its target there may be other captions (to group with it).
// If non-captions and non-targets are found, this is a dead caption
//
// Then find all non-keepNext captions that are not already grouped from above.
// Look both before and after for an attachment bailing on a) non-captions, b) non-attachments,
// c) classified captions.
// If both are found, prefer the before one (since there is no keepNext) unless it already has
// attached captions.
// If only one is found, use that.
// If none was found, try again without bailing on classified captions (group them instead).
// Again, prefer before if both are found (again, unless it is captioned).
// If still nothing, this is a dead caption.
//
// Look for all dead captions.
// If they are inside a text box, either at the start or end, then switch them to labelling
// that text box. Keep in mind that text boxes are typically present TWICE in the same tree for
// compatibility reasons (or whatever benighted reason).
//
// We're not done! We also want to identify the label part of the caption (say, "Table A"). In order
// to do that we parse caption labels that look like this:
//  <w:r>Some text (may be zero or more)</w:r>
//  <w:r><w:fldSimple w:instr=" SEQ Table \* ALPHABETIC "/></w:r>
//  <w:r><w:rPr>...</w:rPr><w:t>B</w:t></w:r>
//  <w:r><w:rPr>...</w:rPr><w:fldChar w:fldCharType="end"/></w:r>
// We work on the assumption that the SEQ is always the end of the label.
// We look for the first SEQ. If there is none, or if it does not look right, just bail.
// If found, we backtrack to pick up all the preceding w:r, and wrap the result in a
// hyperlink with sans:caption-label.

export default function predigestCaptions({ docx, select, log } = {}, cb) {
  // XXX
  //  Currently a bug: this code assumes known pStyles for Caption and BlockCode, even though they
  //  could be changed. Here as in lists, we should make that configurable (instead of inferred
  //  poorly as it is in lists)

  // a few useful functions
  let unclassifiedCaptions = () =>
    select('//w:p[not(@sans:*)][./w:pPr/w:pStyle[@w:val="Caption"]]');

  // while we're iterating, captions can become classified, this allows us to skip them over
  let isClassified = el => el.hasAttributeNS(SA_NS, 'caption-target-type');
  let isGrouped = el => el.hasAttributeNS(SA_NS, 'caption-group');
  let isCaption = el =>
    !!select('./w:pPr/w:pStyle[@w:val="Caption"]', el).length;
  let isCode = el =>
    !!select('./w:pPr/w:pStyle[@w:val="BlockCode"]', el).length;
  let isMaths = el => {
    if (select(`.//m:oMathPara`, el).length) {
      return true;
    }
    if (!select(`.//m:oMath`, el).length) {
      return false;
    }
    // We accept math surrounded by a bit of punctuation
    let clone = el.cloneNode(true);
    select('.//m:oMath | .//w:pPr', clone).forEach(remove);
    return /^[.,;:!?()-—\u220e]*$/.test(clone.textContent);
  };

  let checkName = (el, name) =>
    el.namespaceURI === W_NS && el.localName === name;
  let isTarget = el => !isCaption(el) && !!targetType(el);
  let hasKeepNext = el => !!select('./w:pPr/w:keepNext', el).length;
  let markDead = el => el.setAttributeNS(SA_NS, 'sans:dead-caption', 'true');
  let group = (el, gid) => el.setAttributeNS(SA_NS, 'sans:caption-group', gid);
  let type = (el, tt) =>
    el.setAttributeNS(SA_NS, 'sans:caption-target-type', tt);
  let targetType = el => {
    if (checkName(el, 'tbl')) {
      return 'table';
    }
    if (checkName(el, 'txbxContent')) {
      return 'textbox';
    }
    if (checkName(el, 'p') && isCode(el)) {
      return 'code';
    }
    if (checkName(el, 'p') && !!select(`.//a:blip[@r:embed]`, el).length) {
      return 'image';
    }
    if (el.namespaceURI === SA_NS && el.localName === 'picture-grid') {
      return 'multi-image';
    }
    if (checkName(el, 'p') && isMaths(el)) {
      return 'math';
    }

    // hyperlink captionables are *only* hyperlinks
    if (checkName(el, 'p') && select(`./w:hyperlink[@r:id]`, el).length === 1) {
      // non-ignorable length
      let niLen = select('./*', el).filter(ni => {
        if (ni.namespaceURI !== W_NS) {
          return true;
        }
        if (ni.localName === 'pPr') {
          return false;
        }
        if (/^bookmark(?:Start|End)$/.test(ni.localName)) {
          return false;
        }
        if (ni.localName === 'r' && /^\s*$/.test(ni.textContent)) {
          return false;
        }
        return true;
      }).length;
      if (niLen === 1) {
        return 'hyper';
      }
      return null;
    }
    return null;
  };

  let getCaptionsAndTargetByAxis = axis => {
    let nextField;

    if (axis === 'following') {
      nextField = 'nextSibling';
    } else if (axis === 'preceding') {
      nextField = 'previousSibling';
    } else throw new Error(`Unknown axis: ${axis}`);

    return (el, excludeClassified = false) => {
      let ret = {
        target: null,
        captions: []
      };
      let nxt = el[nextField];
      while (nxt) {
        if (isCaption(nxt)) {
          if (excludeClassified && isClassified(nxt)) {
            return ret;
          }
          ret.captions.push(nxt);
          nxt = nxt[nextField];
          continue;
        }
        if (isTarget(nxt)) {
          // Code is just consecutive paragraphs with a given style. They get turned into a
          // single block, but if the caption is after we can't have it place the target typing
          // only right before the last paragraph, so we follow up.
          // Same with maths.
          // NOTE: technically, now we could do that, it probably does not matter.
          if (axis === 'preceding' && (isCode(nxt) || isMaths(nxt))) {
            let first = nxt,
              nextCheck = isCode(nxt) ? isCode : isMaths;
            while (first.previousSibling) {
              if (nextCheck(first.previousSibling)) {
                first = first.previousSibling;
              } else break;
            }
            ret.target = first;
          } else ret.target = nxt;
        }
        break;
      }
      return ret;
    };
  };

  let following = getCaptionsAndTargetByAxis('following');
  let preceding = getCaptionsAndTargetByAxis('preceding');

  let classify = (cap, found, gid = shortid.generate()) => {
    // XXX here, we could just wrap them up right away?
    if (found.target)
      gid = found.target.getAttributeNS(SA_NS, 'caption-group') || gid;
    [cap].concat(found.captions).forEach(c => {
      group(c, gid);
      if (!found.target) markDead(c);
      else if (c.hasAttributeNS(SA_NS, 'dead-caption'))
        c.removeAttributeNS(SA_NS, 'dead-caption');
    });
    if (found.target) {
      group(found.target, gid);
      type(found.target, targetType(found.target));
    }
  };

  try {
    // We actually get started!
    // Phase 0: remove empty captions
    unclassifiedCaptions()
      .filter(cap => cap.childNodes.length < 2)
      .forEach(markDead);

    // Phase 1A: Textboxes with keepnext (and containing uncaptioned resources)
    // Textboxes with uncaptioned resources will have a 'keepNext', so the captions will not be picked up here and will need to be handled separately (as part of the keepNext captions above)
    unclassifiedCaptions()
      .filter(cap => !!select('ancestor::w:txbxContent', cap).length)
      .forEach(cap => {
        let found = {
          target: select('ancestor::w:txbxContent', cap)[0]
        };
        let hit = false;
        // at start of box
        if (select('preceding-sibling::w:*', cap).length === 0) {
          found.captions = following(cap, true).captions;
          hit = true;
        } else if (select('following-sibling::w:*', cap).length === 0) {
          found.captions = preceding(cap, true).captions;
          hit = true;
        }
        if (hit) {
          classify(cap, found);
        }
      });

    // Phase 1B: other captions with keepNext
    unclassifiedCaptions()
      .filter(cap => hasKeepNext(cap))
      .forEach(cap => {
        if (isClassified(cap)) return;
        classify(cap, following(cap));
      });

    // Phase 2: captions without keepNext
    let exploreBothAxes = cap => {
      let prec = preceding(cap, true);
      let foll = following(cap, true);

      if (prec.target && foll.target) {
        if (isGrouped(prec.target)) {
          if (isGrouped(foll.target)) {
            return prec;
          }
          return foll;
        }
        return prec;
      }
      if (prec.target) {
        return prec;
      }
      if (foll.target) {
        return foll;
      }
    };
    unclassifiedCaptions()
      .filter(cap => !hasKeepNext(cap))
      .forEach(cap => {
        if (isClassified(cap)) {
          return;
        }
        let wanted = exploreBothAxes(cap);
        classify(cap, wanted || { captions: [] });
      });

    // Phase 3: Textboxes with dead captions (and containing no uncaptioned resources)
    select('//w:p[@sans:dead-caption = "true"]')
      .filter(cap => !!select('ancestor::w:txbxContent', cap).length)
      .forEach(cap => {
        let found = {
          target: select('ancestor::w:txbxContent', cap)[0]
        };
        let hit = false;
        // at start of box
        if (select('preceding-sibling::w:*', cap).length === 0) {
          found.captions = following(cap, true).captions;
          hit = true;
        } else if (select('following-sibling::w:*', cap).length === 0) {
          found.captions = preceding(cap, true).captions;
          hit = true;
        }
        if (hit) {
          classify(cap, found);
        }
      });

    // Phase 4: kill the really dead
    select('//*[@sans:dead-caption = "true"]').forEach(el => {
      let style = select('.//w:pStyle[@w:val="Caption"]', el)[0];
      if (style) {
        remove(style);
      }
      el.removeAttributeNS(SA_NS, 'caption-group');
    });

    // Phase 5: hyperlink all the things
    let seenGroups = {};
    select(
      '//*[@sans:caption-group and not(@sans:caption-target-type)]'
    ).forEach(el => {
      let gid = el.getAttributeNS(SA_NS, 'caption-group');
      let groupEl = seenGroups[gid];
      if (!groupEl) {
        groupEl = docx.createElementNS(SA_NS, 'sans:caption');
        groupEl.setAttribute('group', gid);
        seenGroups[gid] = groupEl;
        el.parentNode.insertBefore(groupEl, el);
      }
      groupEl.appendChild(el);
      el.removeAttributeNS(SA_NS, 'caption-group');
    });

    // Phase 6: label all the captions
    select('//w:p[./w:pPr/w:pStyle[@w:val="Caption"]]').forEach(cap => {
      let seenLabel = false;
      select('.//w:fldSimple | .//sans:field', cap).forEach(fld => {
        if (seenLabel) {
          return;
        }
        let { instr } = fieldDetails(fld);
        if (!/^\s*SEQ\s+/.test(instr)) {
          return;
        }
        seenLabel = true;
        let list = [fld];
        let prev = fld.previousSibling;
        while (prev) {
          // CAUTION: this could really screw around with bookmarks
          if (
            prev.namespaceURI === W_NS &&
            /^(bookmarkStart|bookmarkEnd|r|proofErr)$/.test(prev.localName)
          ) {
            list.unshift(prev);
            prev = prev.previousSibling;
          } else break;
        }
        let label = docx.createElementNS(SA_NS, 'sans:caption-label');
        list[0].parentNode.insertBefore(label, list[0]);
        list.forEach(el => label.appendChild(el));
        // In order to maintain bookmark integrity, push all bmS in the hyper before it, and all
        // the bmEnd in the hyper after it.
        list.forEach(el => {
          if (checkName(el, 'bookmarkStart')) {
            label.parentNode.insertBefore(el, label);
          } else if (checkName(el, 'bookmarkEnd')) {
            label.parentNode.insertBefore(el, label.nextSibling);
          }
        });
      });
    });
  } catch (e) {
    log.error(e);
  }
  process.nextTick(cb);
}
