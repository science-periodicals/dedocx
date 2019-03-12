let { TEXT_NODE, ELEMENT_NODE } = require('dom-node-types'),
  { W_NS } = require('../constants/ns'),
  xpath = require('../lib/xpath'),
  normalizeText = require('../lib/normalize-text'),
  remove = require('../lib/remove'),
  compareNodePositions = require('../lib/compare-node-position'),
  nodeContains = require('../lib/node-contains'),
  commonAncestor = require('../lib/common-ancestor'),
  ancestorsToNode = require('../lib/ancestors-to-node');

// Word enjoys placing bookmarks in inconvenient places. This moves them around so try to get them
// to make more sense. Also applies to permissions.
module.exports = function reparentBookmarks(ctx, cb) {
  try {
    let { select, docx } = ctx;
    // process all bookmark pairs in turn (by looking at bookmarkStart)
    select('//w:bookmarkStart | //w:permStart | //w:commentRangeStart').forEach(
      bm => {
        let type = bm.localName.replace('Start', ''),
          name = bm.getAttributeNS(W_NS, 'name'),
          id = bm.getAttributeNS(W_NS, 'id'),
          bmEnd = select(`//w:${type}End[@w:id="${id}"]`)[0];
        if (!name) return;
        // if no matching bookmarkEnd is found, just generate one
        if (!bmEnd) {
          bmEnd = docx.createElementNS(W_NS, `w:${type}End`);
          bmEnd.setAttributeNS(W_NS, 'w:id', id);
          bm.parentNode.insertBefore(bmEnd, bm.nextSibling);
        }
        // if they are out of order swap
        if (compareNodePositions(bm, bmEnd) === 'after') {
          let endClone = bmEnd.cloneNode(true);
          bm.parentNode.insertBefore(endClone, bm);
          bmEnd.parentNode.replaceChild(bm, bmEnd);
          bmEnd = endClone;
        }
        if (bm.parentNode === bmEnd.parentNode) return;

        // move bookmarks around until they have the same parent
        let giveUp = () => bm.parentNode.insertBefore(bmEnd, bm.nextSibling);
        // This handles the (very common) case in which the user intended to create a bookmark at the
        // beginning of a w:p, but for some benighted reason Word placed the start at the end of the
        // last w:t in the last w:r of the preceding w:p (or similar cases)
        // Let ns be START's nextSibling
        //   - if there is no ns, move START right after its parent node, start over
        //   - if ns is END, we are done
        //   - if ns contains END, make START the firstChild of ns, start over
        //   - if ns has relevant content (non-ignored text, images) then stop (we are not done
        //      though)
        //   - if it's not an element, move START after ns
        while (true) {
          let ns = bm.nextSibling;
          if (!ns) {
            if (!bm.parentNode || !bm.parentNode.parentNode) break;
            bm.parentNode.parentNode.insertBefore(
              bm,
              bm.parentNode.nextSibling
            );
          } else if (ns === bmEnd) return;
          else if (nodeContains(ns, bmEnd)) ns.insertBefore(bm, ns.firstChild);
          else if (hasRelevantContent(ns)) break;
          // else if (ns.nodeType !== ELEMENT_NODE) ns.parentNode.insertBefore(bm, ns.nextSibling);
          else ns.parentNode.insertBefore(bm, ns.nextSibling);
        }

        // if we did find a solution, succeed early
        if (bm.parentNode === bmEnd.parentNode) return;

        // Now we handle the equally common case in which the user intended to place a bookmark at the
        // end of a w:p, but for some reason Word decided to place the end at the start of the first
        // w:t of the first w:r of the following w:p (or similar)
        // This is the exact same algorithm as the previous one, but with the end moving backward
        // instead of the start moving forward.
        while (true) {
          let ps = bmEnd.previousSibling;
          if (!ps) {
            if (!bmEnd.parentNode || !bmEnd.parentNode.parentNode) break;
            bmEnd.parentNode.parentNode.insertBefore(bmEnd, bmEnd.parentNode);
          } else if (ps === bm) return;
          else if (nodeContains(ps, bm)) ps.appendChild(bmEnd);
          else if (hasRelevantContent(ps)) break;
          // else if (ps.nodeType !== ELEMENT_NODE) ps.parentNode.insertBefore(bmEnd, ps);
          else ps.parentNode.insertBefore(bmEnd, ps);
        }

        // again, if we did find a solution, succeed early
        if (bm.parentNode === bmEnd.parentNode) return;

        // We now reach the case in which either end of the bookmark pair was not gratuitously placed
        // at a location which does not increase its relevant content. We might still be faced with a
        // relatively simple case in which reparenting can happen without increasing the relevant
        // content between the endpoints. The typical case is that in which one of the points is
        // inside an element but could be right outside of it:
        // <p>
        //   <START/>Blah <strong>blah<END/></strong>
        // </p>
        // Here just moving the end to after the strong is all that's needed. There are more involved
        // cases:
        // <ul>
        //   <li>
        //     <p><START/><a href="#A">fooo</a></p>
        //   </li>
        //   <li>
        //     <p><a href="#B">fooo<END/></a></p>
        //   </li>
        // </ul>
        // In the above, what is really selected are the two li (moving the START to before the first
        // li and the END to after the last one). This step will not however ever increase the amount
        // of relevant content (see `hasRelevantContent()` for details) that a bookmark range contains
        // as that is probably always a bad thing
        // What we do:
        //  - find common ancestor
        //  - find the position at which each endpoint would have to move to in that common ancestor
        //    . for start, that's right before its ancestor that is a child of the common ancestor
        //    . for end it's right after the same
        //  - walk from that position to the endpoint (for each)
        //    . for start, set candidate to the first child of the current point
        //      . if it's start, success
        //      . if it's an ancestor of start, recurse
        //      . if it has relevant content, fail
        //      . move on the nextSibling of candidate and try again
        //    . for end the same but with end and previousSibling
        //  if in either case we find relevant content before we find the endpoint, abort
        //  if all is good, just move them both to the right place (which might require no moving) if
        //  they are already in the common ancestor
        let common = commonAncestor(bm, bmEnd),
          startSuccess,
          endSuccess,
          startBranch,
          endBranch;
        if (bm.parentNode !== common) {
          startSuccess = false;
          let startAncestors = ancestorsToNode(bm, common);
          startBranch = startAncestors[startAncestors.length - 1];
          let startCandidate = startBranch.firstChild;
          while (true) {
            if (!startCandidate) return giveUp();
            // success from this end
            if (startCandidate === bm) {
              startSuccess = true;
              break;
            }
            if (nodeContains(startCandidate, bm)) {
              startCandidate = startCandidate.firstChild;
              continue;
            }
            if (hasRelevantContent(startCandidate)) return giveUp();
            startCandidate = startCandidate.nextSibling;
          }
        }
        if (bmEnd.parentNode !== common) {
          endSuccess = false;
          let endAncestors = ancestorsToNode(bmEnd, common);
          endBranch = endAncestors[endAncestors.length - 1];
          let endCandidate = endBranch.lastChild;
          while (true) {
            if (!endCandidate) return giveUp();
            // success!
            if (endCandidate === bmEnd) {
              endSuccess = true;
              break;
            }
            if (nodeContains(endCandidate, bmEnd)) {
              endCandidate = endCandidate.lastChild;
              continue;
            }
            if (hasRelevantContent(endCandidate)) return giveUp();
            endCandidate = endCandidate.previousSibling;
          }
        }
        if (startSuccess !== false && endSuccess !== false) {
          if (startSuccess)
            startBranch.parentNode.insertBefore(bm, startBranch);
          if (endSuccess)
            endBranch.parentNode.insertBefore(bmEnd, endBranch.nextSibling);
        }

        // check for success one more time
        if (bm.parentNode === bmEnd.parentNode) return;

        // if nothing has worked all the way here, give up
        giveUp();
      }
    );
  } catch (e) {
    ctx.log.error(e);
  }
  process.nextTick(cb);
};

function hasRelevantContent(n) {
  if (!n) return false;
  let select = xpath(n);
  if (n.nodeType === TEXT_NODE) return !!normalizeText(n.data);
  if (n.nodeType !== ELEMENT_NODE) return false;
  if (
    select('.//w:hyperlink | .//a:graphic | .//w:tbl | .//w:txbxContent').length
  )
    return true;
  let clone = n.cloneNode(true);
  select('.//w:r[./w:fldChar | ./w:instrText]', clone).forEach(remove);
  if (normalizeText(clone.textContent)) return true;
  return false;
}
