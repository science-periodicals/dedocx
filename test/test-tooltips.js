import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const sourcePath = join(__dirname, 'fixtures/tooltip.docx');

describe('Tooltip', () => {
  // this.timeout(20 * 1000);
  it('should get a tooltip back', done => {
    dedocx({ sourcePath }, (err, { doc } = {}) => {
      assert.ifError(err);
      let a = doc.querySelector('a');
      assert.equal(a.getAttribute('title'), 'tooltip', 'tooltip acquired');
      done();
    });
  });
});
