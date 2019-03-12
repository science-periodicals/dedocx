import assert from 'assert';
import path from 'path';
import dedocx from '../src';

const sourcePath = path.join(__dirname, 'fixtures/undefined-bookmarks.docx');

describe('Undefined bookmarks', function() {
  let doc;
  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      doc = ctx.doc;
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should match the expected markup for references to footnotes and endnotes in the body', () => {
    const testReferences = Array.from(
      doc.querySelectorAll('a[role="doc-noteref"]')
    ).map(el => el.outerHTML);

    //we know the third bookmark is a footnote, but it is undefined so we don't expect it to match with an existing footnote.
    const expectedReferences = [
      '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
      '<a role="doc-noteref" href="#dedocx-footnote-2">2</a>',
      '<a href="#_Ref2774461" role="doc-noteref"><sup data-dedocx-props="{&quot;elementType&quot;:&quot;run&quot;,&quot;rStyle&quot;:&quot;FootnoteReference&quot;}">1</sup></a>'
    ];

    assert.deepEqual(testReferences, expectedReferences);
  });
});
