/* eslint no-loop-func:0 */

import xpath from './xpath';
import { W_NS, SA_NS } from '../constants/ns';
import remove from './remove';
import extractProperties from './extract-properties';

// The DOCX table model is somewhat capricious. This pre-analyses tables so as to make them more
// easily processed.
export default function addAttributesToTable(tbl, tblPr) {
  let select = xpath(tbl);
  let ancestorTC = el => select('ancestor::w:tc[1]', el)[0];

  // this gives us the colspan
  select('.//w:gridSpan').forEach(gs => {
    let tc = ancestorTC(gs);
    if (!tc) {
      return;
    }
    tc.setAttributeNS(
      SA_NS,
      'sans:colspan',
      gs.getAttributeNS(W_NS, 'val') || '1'
    );
  });

  // when cells are merged vertically (rowspan) OOXML does not remove the merged cells,
  // they just get a w:vMerge without restart. Those just need to get nuked from the HTML
  // but they need to be kept around so we can compute the rowspan
  select('.//w:vMerge[not(@w:val = "restart")]').forEach(vm => {
    let tc = ancestorTC(vm);
    if (!tc) {
      return;
    }
    tc.setAttributeNS(SA_NS, 'sans:dead-cell', 'true');
  });

  // for each w:vMerge with restart, find the cells vertically at the same position,
  // taking w:gridSpan into account, to know how many rows to actually span
  select('.//w:vMerge[@w:val = "restart"]').forEach(vm => {
    let tc = ancestorTC(vm);
    let pos = 1;
    let rs = 1;
    let tr = tc.parentNode.nextSibling;
    // find the position of the current w:tc, taking gridSpan into account
    select('preceding-sibling::w:tc', tc).forEach(ptc => {
      let gs2 = select('.//w:gridSpan', ptc)[0];
      if (gs2) {
        pos += parseInt(gs2.getAttributeNS(W_NS, 'val') || '1', 10);
      } else {
        pos++;
      }
    });

    // look at the following w:tr to find how many rows to span (w:vMerge, no restart)
    while (tr) {
      let wantedTC;
      let curPos = 0;
      // find the w:tc at the same offset as the starting one, taking into account that
      // w:gridSpan might be involved
      select('./w:tc', tr).forEach(tc2 => {
        if (wantedTC) {
          return;
        }
        curPos++;
        if (curPos === pos) {
          wantedTC = tc2;
          return;
        }
        let gs2 = select('.//w:gridSpan', tc2)[0];
        if (gs2) {
          curPos += parseInt(gs2.getAttributeNS(W_NS, 'val') || '1', 10) - 1;
        }
      });

      // Here we could error that gridSpan was out of line, but this happens very often and
      // easily in Word, so we just ignore it
      if (!wantedTC) {
        break;
      }

      if (select('.//w:vMerge[not(@w:val = "restart")]', wantedTC).length) {
        rs++;
      } else {
        break;
      }
      tr = tr.nextSibling;
    }
    // just one row, no attribute
    if (rs === 1) {
      return;
    }
    tc.setAttributeNS(SA_NS, 'sans:rowspan', rs);
  });

  // NOTE: This *must* run after table fixing. Otherwise we would have to take vMerge, gridSpan into
  // account.
  // NOTE: A lot of what is below was derived from document-worker. Some of it may not be applicable
  // in a broader context.
  // Header row: if the *table* wide style is on, we add that to all the cells in the first
  // row even if they locally claim not to be headers (which does happen) — because they're
  // lying. Likewise, if the *row* wide style is on, we add it to all its cells (even if they
  // disagree).
  // Footer: exactly the same, except that for the table-wide flag we consider the last row.
  // Row header: exactly the same, but we only consider first cells
  // The tblPr contains a tblLook with the following:
  //    firstColumn, firstRow, lastColumn, lastRow, noHBand, noVBand
  // They indicate whether the first row/column are headers, the last row/column are footers, and
  // the suppression of horizontal/vertical banding.
  // Both trPr and tcPr can have cnfStyle, with the following:
  //  val, firstRow, lastRow, firstColumn, lastColumn, oddVBand, evenVBand, oddHBand, evenHBand,
  //  firstRowFirstColumn, firstRowLastColumn, lastRowFirstColumn, lastRowLastColumn
  // So `val` can be ignored, it's just a bitmask equivalent to the rest. The band ones indicate the
  // style of the given band.
  // NOTE: not sure how best to apply firstRowFirstColumn, firstRowLastColumn, lastRowFirstColumn,
  //  lastRowLastColumn in this usage
  let { tblLook = {} } = tblPr;
  if (tblLook.firstRow) {
    select('./w:tr[1]/w:tc').forEach(tc =>
      tc.setAttributeNS(SA_NS, 'sans:colhead', 'true')
    );
  }
  if (tblLook.lastRow) {
    select('./w:tr[last()]/w:tc').forEach(tc =>
      tc.setAttributeNS(SA_NS, 'sans:colfoot', 'true')
    );
  }
  if (tblLook.firstColumn) {
    select('./w:tr/w:tc[1]').forEach(tc =>
      tc.setAttributeNS(SA_NS, 'sans:rowhead', 'true')
    );
  }
  select('./w:tr').forEach(tr => {
    let { cnfStyle: trTblLook = {} } = extractProperties(
      select('./w:trPr', tr)[0]
    );
    if (trTblLook.firstRow) {
      select('./w:tc', tr).forEach(tc =>
        tc.setAttributeNS(SA_NS, 'sans:colhead', 'true')
      );
    }
    if (trTblLook.lastRow) {
      select('./w:tc', tr).forEach(tc =>
        tc.setAttributeNS(SA_NS, 'sans:colfoot', 'true')
      );
    }
    if (trTblLook.firstColumn) {
      select('./w:tc[1]', tr).forEach(tc =>
        tc.setAttributeNS(SA_NS, 'sans:rowhead', 'true')
      );
    }
  });
  select('./w:tr/w:tc').forEach(tc => {
    let { cnfStyle: tcTblLook = {} } = extractProperties(
      select('./w:tcPr', tc)[0]
    );
    if (tcTblLook.firstRow) {
      tc.setAttributeNS(SA_NS, 'sans:colhead', 'true');
    }
    if (tcTblLook.lastRow) {
      tc.setAttributeNS(SA_NS, 'sans:colfoot', 'true');
    }
    if (tcTblLook.firstColumn) {
      tc.setAttributeNS(SA_NS, 'sans:rowhead', 'true');
    }
  });

  // indentation
  // We select all indentation properties and sort their values into groups. Then we look at
  // all of those cells and give them a depth matching the position in the sort.
  let indGroups = {};
  select('./w:tr/w:tc/w:p/w:pPr/w:ind').forEach(ind => {
    let val = ind.getAttributeNS(W_NS, 'left');
    if (val) {
      indGroups[val] = true;
    }
  });
  // this makes indGroups contain a mapping of ind values to sort order
  Object.keys(indGroups)
    .sort((a, b) => {
      a = parseInt(a, 10);
      b = parseInt(b, 10);
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    })
    .forEach((k, idx) => {
      indGroups[k] = idx + 2; // 2 because level 1 has no w:ind, and first idx = 0
    });
  select('./w:tr/w:tc/w:p/w:pPr/w:ind').forEach(ind => {
    let tc = ind.parentNode.parentNode.parentNode;
    let val = ind.getAttributeNS(W_NS, 'left');
    if (!val) {
      return;
    }
    remove(ind);
    tc.setAttributeNS(SA_NS, 'sans:rowhead-depth', indGroups[val]);
  });

  // In some cases the TableHeaderCell style is also used, generally when we can't set the
  // header style in other ways (e.g. 2+ row headings)
  select(
    './w:tr/w:tc[./w:p//w:rStyle[translate(@w:val, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", ' +
      '"abcdefghijklmnopqrstuvwxyz") = "tableheadercell"]]'
  ).forEach(tc => tc.setAttributeNS(SA_NS, 'sans:rowhead', 'true'));
}
