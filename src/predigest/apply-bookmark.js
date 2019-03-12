import { W_NS, SA_NS } from '../constants/ns';
import xpath from '../lib/xpath';
import remove from '../lib/remove';
import ancestors from '../lib/ancestors';
import fieldDetails from '../lib/field-details';
import prevElement from '../lib/prev-element';
import nextElement from '../lib/next-element';
import compareNodePositions from '../lib/compare-node-position';
// import xmldom from 'xmldom';

// TODO
//  check where bookmarks land in various table and maths cases

// This processes the bookmarkStart/bookmarkEnd in a way that an produce reliable IDs on the HTML
// side, in addition to lending itself to link flavouring.
// We:
//  - Assume bookmarks have been reparented upstream such that they always have the same parent
//  - Find bookmarks that are really giving an ID to their parent and signal that.
//  - Find bookmarks that come from working around the fact that Word cannot have multiple
//    references to the same footnote and turn them into footnoteRef elements.
//  - Find bookmarks that target a label in a caption, and signal that.
//  - Find bookmarks that identify a textual range, and signal the beginning/end of it.
export default function applyBookmarks(ctx, callback) {
  const { select, docx, log } = ctx;
  const ignorables = [
    'rPr',
    'bookmarkStart',
    'bookmarkEnd',
    'pPr',
    'tblPr',
    'tblGrid',
    'proofErr'
  ];

  try {
    // Word will do silly things in which multiple bookmarks are used but they overlap like
    // <1><2></1></2> (with sequences that can be larger). This confuses the start/end/wrap
    // algorithms. So we try to find those consecutive groups and simplify them.

    //Note, this will also remove undefined bookmarks (undefined bookmarks will have another bookmarkStart as previous content).  Bookmarks can be undefined if the user has crossreferenced a bookmark that was later removed. In MSWord the bookmark reference will still appear  but toggling field codes will display 'Error! Bookmark not defined'. This is particularly tricky if the same footnote that was removed was readded. The content will make sense but the bookmark references will differ.

    select('//w:bookmarkStart')
      .filter(bm => {
        let prev = prevElement(bm);
        if (!prev) {
          return true;
        }
        if (prev.namespaceURI === W_NS && prev.localName === 'bookmarkStart') {
          return false;
        }
        return true;
      })
      .forEach(bm => {
        let group = [bm];
        while (bm && nextElement(bm)) {
          let next = nextElement(bm);
          if (
            next.namespaceURI === W_NS &&
            next.localName === 'bookmarkStart'
          ) {
            group.push(next);
            bm = next;
          } else break;
        }

        if (group.length === 1) {
          return;
        }
        let endGroups = [];
        let curGroup = [];
        group
          .map(
            start =>
              select(
                `//w:bookmarkEnd[@w:id="${start.getAttributeNS(W_NS, 'id')}"]`
              )[0]
          )
          .filter(Boolean)
          .sort((a, b) => {
            let cmp = compareNodePositions(a, b);
            if (cmp === 'before') {
              return -1;
            }
            if (cmp === 'after') {
              return 1;
            }
            return 0;
          })
          .forEach((end, idx) => {
            if (!idx) {
              curGroup.push(end);
              return;
            }
            let prev = prevElement(end);
            if (curGroup[curGroup.length - 1] === prev) {
              curGroup.push(end);
            } else {
              endGroups.push(curGroup);
              curGroup = [end];
            }
          });
        if (curGroup.length) {
          endGroups.push(curGroup);
        }
        endGroups
          .filter(g => g.length > 1)
          .forEach(rest => {
            let starts = rest.map(end => {
              let id = end.getAttributeNS(W_NS, 'id');
              return group.find(bmk => bmk.getAttributeNS(W_NS, 'id') === id);
            });
            //This is where the second bookmark gets removed (if there are two bookmarks in a row)
            let targetName = starts.shift().getAttributeNS(W_NS, 'name');
            rest.shift();
            rest.forEach(remove);
            starts.forEach(remove);
            starts
              .map(st => st.getAttributeNS(W_NS, 'name'))
              .forEach(name => {
                select(`//w:hyperlink[@w:anchor="${name}"]`).forEach(hyper =>
                  hyper.setAttributeNS(W_NS, 'w:anchor', targetName)
                );
              });
          });
      });

    select('//w:bookmarkStart').forEach(bm => {
      const name = bm.getAttributeNS(W_NS, 'name');
      const id = bm.getAttributeNS(W_NS, 'id');
      // console.log(new xmldom.XMLSerializer().serializeToString(bm));

      const bmEnd = select(`//w:bookmarkEnd[@w:id="${id}"]`)[0];

      const makeAxisCheck = (field, axis) => el => {
        if (!el) {
          return false;
        }
        if (!el[field]) {
          return true;
        }
        let igPath = ignorables.map(ig => `${axis}::w:${ig}`).join(' | ');
        return select(igPath, el).length === select(`${axis}::w:*`, el).length;
      };

      const isFirst = makeAxisCheck('previousSibling', 'preceding-sibling');
      const isLast = makeAxisCheck('nextSibling', 'following-sibling');

      if (!name) {
        return;
      }

      const parent = bm.parentNode;

      // find the content between the two, not caring about any embedded bookmarks
      const content = select(
        `following-sibling::*[following-sibling::w:bookmarkEnd[@w:id="${id}"]]`,
        bm
      ).filter(el => {
        return !/^bookmark(?:Start|End)$/.test(el.localName);
      });

      // if the content contains only a footnoteRef, then find all crossrefs to it and make THEM be
      // footnoteRefs, then remove the bm
      // NOTE: sometimes Word actually contains a bit more than the reference, so we look for a max
      // of 2. We don't want to take just any item that contains a reference because it could be a
      // much larger structure.
      if (content.length <= 2 && getRef(content)) {
        let newRef = getRef(content);
        // console.log(new xmldom.XMLSerializer().serializeToString(newRef));
        select('//w:fldSimple[@w:instr] | //sans:field')
          .filter(fld => {
            const { instr } = fieldDetails(fld);

            //The ref id for the first footnote is not getting recognized (always testing against the second footnote ref so this function returns false and the new ref never gets created)

            return new RegExp(`\s*NOTEREF\\s+${name}`).test(instr);
          })
          .forEach(fld => {
            // NOTE: here we do something that isn't completely correct, but allows us to produce
            // better output. Normally, w:footnoteReference and w:endnoteReference do not have
            // children. But the NOTEREF w:fldSimple does: they represent the content that the user
            // saw when referencing that footnote. It so happens that some options are available on
            // a NOTEREF that are not present on w:{footnote,endnote}Reference, notably the ability
            // to interject a localised "above/below" so that you can say "…as described in footnote
            // <sup>2</sup> above…".
            // We could reimplement this using flags and knowledge of the language, but we'd have to
            // do it for all languages. Instead, we take the existing generated content and put it
            // inside the reference.

            newRef = newRef.cloneNode(true);

            //TODO investigate when we may want to uncomment this code. It was commented
            //out as a temporary fix to get rid of nested spans for footnotes and endnotes that appeared to be created by adding ChildNodes

            // let actualRef = select(
            //   './/w:footnoteReference | .//w:endnoteReference',
            //   newRef
            // )[0];
            // let { content: contentParent } = fieldDetails(fld);

            // if (!actualRef.hasChildNodes()) {
            //   while (contentParent.hasChildNodes()) {
            //     actualRef.appendChild(contentParent.firstChild);
            //   }
            // }
            fld.parentNode.replaceChild(newRef, fld);
          });
      } else if (
        content.filter(
          el => el.namespaceURI === SA_NS && el.localName === 'caption-label'
        ).length
      ) {
        // Upstream `captions` will have turned labellable SEQ inside captions into sans:caption-label
        // and moved bookmarks in the way to more advantageous places. If we contain one of those,
        // we're an ID for the thing being labelled.
        content
          .find(
            el => el.namespaceURI === SA_NS && el.localName === 'caption-label'
          )
          .setAttributeNS(SA_NS, 'sans:id', name);
      } else if (isFirst(bm) && isLast(bmEnd)) {
        // If the endpoints are first and last on their parent, they identify the parent
        let idEl = docx.createElementNS(SA_NS, 'sans:id');
        idEl.setAttribute('id', name);
        parent.appendChild(idEl);
      } else if (content.length === 0) {
        // If it contains nothing, walk up the ancestry
        let elders = ancestors(bm);
        for (let i = 0; i < elders.length; i++) {
          let elder = elders[i];
          if (elder.namespaceURI !== W_NS) {
            continue;
          }
          const ln = elder.localName;
          if (
            ['r', 'p', 'hyperlink', 'tc', 'tr', 'tbl', 'body'].find(
              n => n === ln
            )
          ) {
            elder.setAttributeNS(SA_NS, 'sans:id', name);
            break;
          }
        }
      } else if (
        content.filter(el =>
          /^(r|bookmarkStart|bookmarkEnd|rPr|hyperlink|fldSimple|field|proofErr)$/.test(
            el.localName
          )
        ).length === content.length
      ) {
        // If we only contain a sequence of w:r (and ignorable stuff) then we generate start/end
        // pairs. The logic here is that we need to wrap the content so we use a sans:span.
        let span = docx.createElementNS(SA_NS, 'sans:span');
        span.setAttribute('id', name);
        content[0].parentNode.insertBefore(span, content[0]);
        content.forEach(cnt => span.appendChild(cnt));
      } else if (content.filter(el => /^(p|tbl)$/.test(el.localName)).length) {
        // If we get here, there is nothing "smart" that we can do with the bookmark. If it contains a
        // w:p or w:tbl, we just mark the first we find as parent
        let target = content.find(el => /^(p|tbl)$/.test(el.localName));
        target.setAttributeNS(SA_NS, 'sans:id', name);
      } else {
        // NOTE:
        // There are cases we could handle but don't at this point. For instance, a:graphic,
        // w:txbxContent and friends (probably as part of the previous step so as to get the first
        // one). But there are diminishing returns. So we just give up and warn that a bookmark will
        // be lost.
        // There are probably cases in which the bookmark could end up wrapping a SANS element. We
        // should make sure those get an ID too when needed.
        // TODO: handle those if there is time.
        // Note, this includes bookmarks added around tables
        log.warn(new Error(`Failed to categorise bookmark: ${name}`));
      }

      // kill the bms
      remove(bm);
      remove(bmEnd);
    });
  } catch (e) {
    ctx.log.error(e);
  }
  process.nextTick(callback);
}

function getRef(content) {
  for (let i = 0; i < content.length; i++) {
    let el = content[i];
    if (xpath(el)('.//w:footnoteReference | .//w:endnoteReference')[0]) {
      return el;
    }
  }
}
