import assert from 'assert';
import path from 'path';
import dedocx from '../src';

const sourcePath = path.join(
  __dirname,
  '/fixtures/uncaptioned-images.ds3.docx'
);

describe('uncaptioned images', () => {
  let doc;
  let table;
  beforeEach(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;

      //the test sample contains one table (with 1 inline and 1 floating image)
      table = Array.from(doc.querySelectorAll('table'))[0];

      done();
    });
  });

  it('should extract two images from the table', () => {
    assert.equal(table.querySelectorAll('img').length, 2);
  });

  it('should have one inline image', () => {
    assert(table.querySelectorAll('span[class="wp_inline"]').length, 1);
  });

  it('should have one floating image', () => {
    assert(table.querySelectorAll('span[data-type="topAndBottom"]').length, 1);
  });
});
