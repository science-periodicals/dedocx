import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const sourcePath = join(__dirname, 'fixtures/tables-with-equations.docx');

describe('Tables with equations', () => {
  let doc;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;
      done();
    });
  });

  // this.timeout(10 * 1000);
  it('should keep th as such when tables contain math', () => {
    let tables = Array.from(doc.querySelectorAll('table'));
    assert(tables.length, 3, 'there are three tables');
    // second table
    assert(
      tables[1].querySelector('th:nth-child(3) math'),
      'third th has math'
    );
    // third table
    assert(
      tables[2].querySelector('th:nth-child(3) math'),
      'third th has math (2)'
    );
    assert(
      tables[2].querySelector('tbody > tr:nth-child(2) > th:nth-child(1) math'),
      'third row of table start with a th containing math'
    );
  });
});
