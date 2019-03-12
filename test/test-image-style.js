/* eslint import/no-extraneous-dependencies:0 */
import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

describe('Standard Lists', () => {
  const sourcePath = join(
    __dirname,
    'fixtures/inline-and-block-image-styles.docx'
  );
  let doc;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;
      // const xhtmlBody = require('xmlserializer').serializeToString(
      //   require('parse5').parse(doc.body.outerHTML)
      // );
      // console.log(xhtmlBody);

      done();
    });
  });

  // images (w:drawing in word) are either 'inline' (w:inline) or floating drawing objects with 'anchors' (w:anchor), see: http://www.datypic.com/sc/ooxml/e-w_drawing-1.html.
  // Anchored images can have different alignments with the text (e.g., No wrapping, square wrapping, etc.  see: http://www.datypic.com/sc/ooxml/e-wp_anchor.html)

  it('should keep inline image style', () => {
    assert.equal(doc.querySelectorAll('span[class="wp_inline"]').length, 1);
  });

  it('should keep block image style', () => {
    assert.equal(doc.querySelectorAll('span[class="wp_anchor"]').length, 1);
  });
});
