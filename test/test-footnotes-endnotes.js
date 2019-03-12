import assert from 'assert';
import path from 'path';
import dedocx from '../src';

const sourcePath = path.join(
  __dirname,
  'fixtures/footnotes-and-endnotes-multiple-repeated.docx'
);

describe('Footnotes and endnotes', function() {
  it('should match the expected markup for references to footnotes and endnotes in the body', function(done) {
    dedocx({ sourcePath }, (err, { doc }) => {
      const correctReferences = [
        '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-2">2</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-endnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-endnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-endnote-2">2</a>',
        '<a role="doc-noteref" href="#dedocx-endnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-endnote-1">1</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-3">3</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-3">3</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-4">4</a>',
        '<a role="doc-noteref" href="#dedocx-footnote-3">3</a>'
      ];

      const testReferences = Array.from(
        doc.querySelectorAll('a[role="doc-noteref"]')
      ).map(el => el.outerHTML);

      assert.deepEqual(testReferences, correctReferences);
    });
    done();
  });

  it('should have 4 footnote divs with ids', function(done) {
    dedocx({ sourcePath }, (err, { doc }) => {
      const numFootnotes = 4; //actual  number of unique footnotes
      let footnoteCount = Array.from(
        doc.querySelectorAll('div[role="doc-footnote"]')
      ).length;

      assert.equal(footnoteCount, numFootnotes, `${footnoteCount} footnotes`);
    });
    done();
  });

  it('should have 2 endnote divs with ids', function(done) {
    dedocx({ sourcePath }, (err, { doc }) => {
      const numEndnotes = 2; //actual number of unique endnotes
      const endnoteCount = Array.from(
        doc.querySelectorAll('div[role="doc-endnote"]')
      ).length;

      assert.equal(endnoteCount, numEndnotes, `${endnoteCount} endnotes`);
    });
    done();
  });

  it('should have 6 endnote and footnote sups', function(done) {
    dedocx({ sourcePath }, (err, { doc }) => {
      const numSups = 6; //total number of actual footnote and endnote sups

      let footnoteSups = doc.querySelectorAll('div[role="doc-footnote"] sup');
      let endnoteSups = doc.querySelectorAll('div[role="doc-endnote"] sup');

      let count =
        Array.from(footnoteSups).length + Array.from(endnoteSups).length;

      assert.equal(count, numSups, `${count} footnote and endnote sups`);
    });
    done();
  });
});
