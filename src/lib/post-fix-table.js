// NOTE: at this point the table should only have one tbody, no thead or tfoot
// All tr that only contain th and are at the start get moved to a thead that's right
// at the start
export default function createTableHeadAndFoot(table) {
  let theadRows = [];
  let doc = table.ownerDocument;
  let tr = table.querySelector('tr');
  while (tr) {
    if (tr.querySelector('td')) {
      break;
    }
    theadRows.push(tr);
    tr = tr.nextElementSibling;
  }
  if (theadRows.length) {
    let thead = doc.createElement('thead');
    theadRows.forEach(t => thead.appendChild(t));
    table.insertBefore(thead, table.querySelector('tbody'));
  }
  // for tfoot, we find the first cell that has SA_COLFOOT and we consider that its row and
  // all those that follow are in the tfoot
  let tfootRows = [],
    cell = table.querySelector('[data-dedocx-tfoot]');
  if (cell) {
    let ftr = cell.parentNode;
    while (ftr && ftr.localName === 'tr') {
      tfootRows.push(ftr);
      ftr = ftr.nextElementSibling;
    }
  }
  if (tfootRows.length) {
    let tfoot = doc.createElement('tfoot');
    tfootRows.forEach(t => tfoot.appendChild(t));
    table.appendChild(tfoot);
  }
  // TODO: @headers, @scope can be inferred for greater accessibility
}
