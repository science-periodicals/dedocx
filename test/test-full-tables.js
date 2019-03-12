import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const sourcePath = join(__dirname, 'fixtures/full-tables.docx');

describe('Accessible Tables', () => {
  // this.timeout(10 * 1000);
  let doc;
  let tables;

  beforeEach(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      assert.ifError(err);
      doc = ctx.doc;
      tables = Array.from(doc.querySelectorAll('table'));
      // tables.forEach(table => console.log(prettify(table.outerHTML)));
      done();
    });
  });
  it('should set table headers in a simple table', () => {
    checkTable(
      ' h h h',
      ` h d d
        h d d`,
      ' h d d', // looks like th, but is really td (but in tfoot)
      tables[0]
    );
  });
  it('should set table headers in a complex table', () => {
    checkTable(
      ` hr2 hc2 hc2
            h h h h`,
      ` h d d d d
        hc5
        h-2 d d d d
        h-2 d d d d
        hc5
        h-2 d d d d
        h-2 d d d d
        h-2 d d d d
        h dc2 dc2`,
      ` h d d d d`,
      tables[1]
    );
  });
  it('should set table structure also using styles', () => {
    checkTable(
      ` h h h hc2
        h h`,
      ` hr3 h d d d
            h d d d
            h d d d
        hr3 h d d d
            h d d d
            h d d d
        hc2 d d d`,
      ` hc2 d d d`,
      tables[2]
    );
  });
});

function checkTable(head, body, foot, table) {
  if (head) {
    checkTablePart(head, table.querySelector('thead'));
  }
  if (body) {
    checkTablePart(body, table.querySelector('tbody'));
  }
  if (foot) {
    checkTablePart(foot, table.querySelector('tfoot'));
  }
}

// this is a simple and stupid DSL to check the parts of table structure that we're interested in
// rows are \n-separated, cells as space-separated
// the first letter is h or d for th or td
// the second (optional) letter is is r for rowspan, c for colspan, or - for aria-level
// if there is a second letter, it must be followed by its value as a number
function checkTablePart(part, tablePart) {
  let rows = part
    .trim()
    .split('\n')
    .map(row => row.trim());
  let mode = tablePart.localName;
  let typeMap = { h: 'th', d: 'td' };
  let spanMap = { r: 'rowspan', c: 'colspan', '-': 'aria-level' };

  Array.from(tablePart.querySelectorAll('tr')).forEach((tr, idx) => {
    let cells = Array.from(tr.querySelectorAll('td, th'));

    rows[idx]
      .split(/\s+/)
      .map(spec => {
        let [type, spanType, span] = spec.split(/([rc-])/);

        return {
          type: typeMap[type],
          spanType: spanMap[spanType],
          span
        };
      })
      .forEach((spec, i) => {
        let cell = cells[i];
        assert(cells[i], `[${mode}] There is a [${idx},${i}] cell.`);
        assert.equal(
          cell.localName,
          spec.type,
          `[${mode}] Cell [${idx},${i}] is a ${spec.type}.`
        );
        if (spec.span) {
          let target = cell;
          if (spec.spanType === 'aria-level') {
            target = cell.parentNode;
          }
          assert.equal(
            target.getAttribute(spec.spanType),
            spec.span,
            `[${mode}] Cell [${idx},${i}] is ${spec.spanType}=${spec.span} (${
              target.outerHTML
            }).`
          );
        }
      });
  });
}
