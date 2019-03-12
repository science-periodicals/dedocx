import assert from 'assert';
import path from 'path';
import dedocx from '../src';

const sourcePath = path.join(__dirname, '/fixtures/textboxes.docx');

describe('textboxes with captions', () => {
  let doc;
  let textboxes;
  beforeEach(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;

      textboxes = Array.from(doc.querySelectorAll('aside'));

      done();
    });
  });

  it('should extract the textbox captions', () => {
    //textbox caption should be first p of an aside
    //textbox markup is duplicated, so we test one set of markup for each (textbox[0] and textbox[3])
    assert.equal(
      textboxes[0].querySelector('p').getAttribute('data-dedocx-props'),
      '{"elementType":"para","keepNext":true,"pStyle":"Caption"}'
    );

    assert.equal(
      textboxes[3].querySelector('p').getAttribute('data-dedocx-props'),
      '{"elementType":"para","keepNext":true,"pStyle":"Caption"}'
    );
  });

  it('should not find any captions on uncaptioned images', () => {
    assert.equal(
      textboxes[0].querySelectorAll(
        'p[data-dedocx-caption-target-type="image"]'
      ).length,
      0
    );
  });
});
