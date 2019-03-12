import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const sourcePath = join(__dirname, 'fixtures/tables.docx');

describe('Tables', () => {
  // this.timeout(20 * 1000);
  let doc,
    tables = [];
  beforeEach(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      assert.ifError(err);
      doc = ctx.doc;
      tables = Array.from(doc.querySelectorAll('table')).map(cleanup);
      done();
    });
  });
  it('should keep simple tables simple', () => {
    let table = tables[0];
    assert.equal(table.querySelectorAll('[colspan]').length, 0, 'no colspan');
    assert.equal(table.querySelectorAll('[rowspan]').length, 0, 'no rowspan');
    assert.equal(table.querySelectorAll('td').length, 12, '12 td');
    cellsInRow(table, [4, 4, 4]);
  });
  it('should support full column rowspan', () => {
    let table = tables[1];
    assert.equal(
      table
        .querySelector('tr:nth-of-type(1) > td:nth-of-type(2)')
        .getAttribute('rowspan'),
      '3',
      'row 1, cell 2 has rowspan=3'
    );
    cellsInRow(table, [4, 3, 3]);
    assert.equal(
      table.querySelectorAll('[rowspan]').length,
      1,
      'only one rowspan'
    );
    assert.equal(table.querySelectorAll('[colspan]').length, 0, 'no colspan');
  });
  it('should support full row colspan', () => {
    let table = tables[2];
    assert.equal(
      table
        .querySelector('tr:nth-of-type(2) > td:nth-of-type(1)')
        .getAttribute('colspan'),
      '4',
      'row 2, cell 1 has colspan=4'
    );
    cellsInRow(table, [4, 1, 4]);
    assert.equal(
      table.querySelectorAll('[colspan]').length,
      1,
      'only one colspan'
    );
    assert.equal(table.querySelectorAll('[rowspan]').length, 0, 'no rowspan');
  });
  it('should support partial spanning', () => {
    let table = tables[3];
    assert.equal(
      table
        .querySelector('tr:nth-of-type(1) > td:nth-of-type(1)')
        .getAttribute('colspan'),
      '2',
      'row 1, cell 1 has colspan=2'
    );
    assert.equal(
      table
        .querySelector('tr:nth-of-type(2) > td:nth-of-type(4)')
        .getAttribute('rowspan'),
      '2',
      'row 2, cell 4 has rowspan=2'
    );
    cellsInRow(table, [3, 4, 3]);
    assert.equal(
      table.querySelectorAll('[colspan]').length,
      1,
      'only one colspan'
    );
    assert.equal(
      table.querySelectorAll('[rowspan]').length,
      1,
      'only one rowspan'
    );
  });
  it('should support rowspan/colspan on same cell', () => {
    let table = tables[4],
      cell = table.querySelector('tr:nth-of-type(2) > td:nth-of-type(2)');
    assert.equal(
      cell.getAttribute('colspan'),
      '2',
      'row 2, cell 2 has colspan=2'
    );
    assert.equal(
      cell.getAttribute('rowspan'),
      '2',
      'row 2, cell 2 has rowspan=2'
    );
    cellsInRow(table, [4, 3, 2]);
    assert.equal(
      table.querySelectorAll('[colspan]').length,
      1,
      'only one colspan'
    );
    assert.equal(
      table.querySelectorAll('[rowspan]').length,
      1,
      'only one rowspan'
    );
  });
  it('should support consecutive colspan', () => {
    let table = tables[5];
    assert.equal(
      table.querySelectorAll('tr:nth-of-type(1) > td[colspan="2"]').length,
      2,
      'first row has two td with colspan=2'
    );
    cellsInRow(table, [2, 4, 4]);
    assert.equal(table.querySelectorAll('[colspan]').length, 2, '2 colspans');
    assert.equal(table.querySelectorAll('[rowspan]').length, 0, 'no rowspan');
  });
  it('should support consecutive rowspan', () => {
    let table = tables[6];
    assert.equal(
      table
        .querySelector('tr:nth-of-type(1) > td:nth-of-type(2)')
        .getAttribute('rowspan'),
      '2',
      'row 1, cell 2 has rowspan=2'
    );
    assert.equal(
      table
        .querySelector('tr:nth-of-type(3) > td:nth-of-type(2)')
        .getAttribute('rowspan'),
      '2',
      'row 3, cell 2 has rowspan=2'
    );
    cellsInRow(table, [4, 3, 4, 3]);
    assert.equal(table.querySelectorAll('[colspan]').length, 0, 'no colspan');
    assert.equal(table.querySelectorAll('[rowspan]').length, 2, '2 rowspans');
  });
  it('should support cell splitting', () => {
    let table = tables[7];
    assert.equal(
      table
        .querySelector('tr:nth-of-type(2) > td:nth-of-type(1)')
        .getAttribute('colspan'),
      '2',
      'row 2, cell 1 has colspan=2 (cell 1,1 was split)'
    );
    assert.equal(
      table
        .querySelector('tr:nth-of-type(3) > td:nth-of-type(1)')
        .getAttribute('colspan'),
      '2',
      'row 3, cell 1 has colspan=2 (cell 1,1 was split)'
    );
    assert.equal(
      table
        .querySelector('tr:nth-of-type(3) > td:nth-of-type(1)')
        .getAttribute('rowspan'),
      '2',
      'row 3, cell 1 has rowspan=2 (cell 3,4 was split)'
    );
    assert.equal(
      table
        .querySelector('tr:nth-of-type(3) > td:nth-of-type(2)')
        .getAttribute('rowspan'),
      '2',
      'row 3, cell 2 has rowspan=2 (cell 3,4 was split)'
    );
    assert.equal(
      table
        .querySelector('tr:nth-of-type(3) > td:nth-of-type(3)')
        .getAttribute('rowspan'),
      '2',
      'row 3, cell 3 has rowspan=2 (cell 3,4 was split)'
    );
    cellsInRow(table, [5, 4, 4, 1]);
    assert.equal(table.querySelectorAll('[colspan]').length, 2, '2 colspans');
    assert.equal(table.querySelectorAll('[rowspan]').length, 3, '3 rowspans');
  });
});

function cellsInRow(table, spec) {
  for (let i = 0; i < spec.length; i++) {
    assert.equal(
      table.querySelectorAll(`tr:nth-of-type(${i + 1}) > td`).length,
      spec[i],
      `tr ${i + 1} has ${spec[i]} td elements.`
    );
  }
}

// cleanup for easier testing
function cleanup(table) {
  let doc = table.ownerDocument;
  // replace all thead, tbody by their content
  Array.from(table.querySelectorAll('thead, tbody')).forEach(hb => {
    let df = doc.createDocumentFragment();
    while (hb.firstChild) df.appendChild(hb.firstChild);
    hb.parentNode.replaceChild(df, hb);
  });
  // replace all th by td
  Array.from(table.querySelectorAll('th')).forEach(th => {
    let td = doc.createElement('td');
    while (th.firstChild) td.appendChild(th.firstChild);
    for (let i = 0; i < th.attributes.length; i++) {
      let at = th.attributes[i];
      td.setAttribute(at.name, at.value);
    }
    th.parentNode.replaceChild(td, th);
  });
  return table;
}
