import assert from 'assert';
import path from 'path';
import dedocx from '../src';

const sourcePath = path.join(__dirname, '/fixtures/minimum-test-document.docx');

describe('Minimum docx', () => {
  let doc;
  let bibliography;

  beforeEach(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;
      bibliography = ctx.bibliography;

      done();
    });
  });

  it('should extract a title', () => {
    assert.equal(doc.querySelectorAll('h1')[0].innerHTML, 'Document title');
  });

  it('should extract a subtitle', () => {
    assert.equal(
      doc.querySelector('header[class="dedocx-subtitle"] > p').innerHTML,
      'Document subtitle'
    );
  });

  it('should extract heading styles', () => {
    assert.equal(doc.querySelector('h2').innerHTML, 'Heading 2');
    assert.equal(doc.querySelector('h3').innerHTML, 'Heading 3');
    assert.equal(doc.querySelector('h4').innerHTML, 'Heading 4');
    assert.equal(doc.querySelector('h5').innerHTML, 'Heading 5');
    assert.equal(doc.querySelector('h6').innerHTML, 'Heading 6');
  });

  it('should extract block quotes', () => {
    //each line of a blockquote is a separate blockquote element (in the test document there is the quote and the attribution lines)
    assert.equal(doc.querySelectorAll('blockquote').length, 2);
  });

  it('should extract hyperlinks', () => {
    assert.equal(
      doc.querySelector('a').getAttribute('href'),
      'https://science.ai/'
    );
    assert.equal(doc.querySelector('a > span').innerHTML, 'hyperlink');
  });

  it('should extract footnotes and endnotes', () => {
    //all footnote and endnote refs
    const expectedFootnoteRefs = [
      '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
      '<a role="doc-noteref" href="#dedocx-endnote-1">1</a>',
      '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
      '<a role="doc-noteref" href="#dedocx-footnote-1">1</a>',
      '<a role="doc-noteref" href="#dedocx-footnote-2">2</a>'
    ];

    assert.deepEqual(
      Array.from(doc.querySelectorAll('sup > a')).map(sup => sup.outerHTML),
      expectedFootnoteRefs
    );

    //all footnotes + refs
    assert.equal(
      Array.from(doc.querySelectorAll('sup')).filter(el =>
        el.getAttribute('data-dedocx-props').includes('FootnoteReference')
      ).length,
      6
    );

    //all endnotes + refs
    assert.equal(
      Array.from(doc.querySelectorAll('sup')).filter(el =>
        el.getAttribute('data-dedocx-props').includes('EndnoteReference')
      ).length,
      2
    );

    //footnote
    assert.equal(
      doc.querySelector('div[role="doc-footnote"]').getAttribute('id'),
      'dedocx-footnote-1'
    );

    //endnotes
    assert.equal(
      doc.querySelector('div[role="doc-endnote"]').getAttribute('id'),
      'dedocx-endnote-1'
    );
  });

  it('should extract bookmarks and cross-references', () => {
    const expectedCrossreferenceHrefs = [
      '#bk1',
      '#_Ref521321604',
      '#_Ref521321793'
    ];

    //cross-references are labeled with 'doc-anchorlink'
    assert.deepEqual(
      Array.from(doc.querySelectorAll('a[role="doc-anchorlink"]')).map(a =>
        a.getAttribute('href')
      ),
      expectedCrossreferenceHrefs
    );

    //user created bookmarks have the same bookmark text
    assert.equal(
      doc.querySelector('p[id="bk1"]').innerHTML,
      doc.querySelector('a[href="#bk1"]').innerHTML
    );
  });

  it('should extract in-text citations', () => {
    const citations = doc.querySelectorAll('a[role="doc-biblioref"]');

    //check for 3 citations
    assert.equal(citations.length, 3);

    //all citations have the same id
    assert.deepEqual(
      Array.from(citations).map(cit => cit.getAttribute('href')),
      ['#Kil11', '#Kil11', '#Kil11']
    );

    //check for point citation
    assert(
      Array.from(citations).map(
        cit =>
          cit.getAttribute('data-dedocx-citation-options') === '{"page":325}'
      )
    );

    //check for suppress authors and title
    assert(
      Array.from(citations).find(
        cit =>
          cit.getAttribute('data-dedocx-citation-options') ===
          '{"suppressAuthors":true,"suppressTitle":true}'
      )
    );
  });

  it('should extract comments', () => {
    //comments are found between 'commentRangeStart' and 'commentRangeEnd' span classes
    assert(doc.querySelector('span[class="commentRangeStart"'));
    assert(doc.querySelector('span[class="commentRangeEnd"'));
  });

  it('should extract text styling including highlight, italic, bold, underlined, and strikethrough', () => {
    //highlights
    assert(
      Array.from(doc.querySelectorAll('span')).find(
        span =>
          span.getAttribute('data-dedocx-props') ===
          '{"elementType":"run","highlight":"yellow"}'
      )
    );

    //italic
    assert.equal(doc.querySelector('em').innerHTML, 'Italics');

    //bold
    assert.equal(doc.querySelector('strong').innerHTML, 'Bold');

    //underlined
    assert.equal(doc.querySelector('u').innerHTML, 'Underlined');

    //strikethrough
    const strikeText = [];

    Array.from(doc.querySelectorAll('s')).forEach(s =>
      strikeText.push(s.innerHTML)
    );

    assert.equal(''.concat(...strikeText), 'Strikethrough');
  });

  it('should extract lists', () => {
    //ordered list with 1 level and 2 items
    assert.equal(
      doc.querySelectorAll('body > ol:first-of-type > li').length,
      2
    );

    //unordered list with 1 level and 2 items
    assert.equal(
      doc.querySelectorAll('body > ul:first-of-type > li').length,
      2
    );

    //unordered list with two levels, each with one item
    assert.equal(
      doc.querySelector('body > ul:nth-of-type(2) > li > ul > li').innerHTML,
      'Item 2 unordered, nested'
    );

    //ordered list with two levels, each with one item
    assert.equal(
      doc.querySelector('body > ol:nth-of-type(2) > li > ol > li').innerHTML,
      'Second ordered, nested'
    );

    //TODO check mixed, nested lists
    //mixed, nested list with three levels, each with two items
    assert.equal(
      doc.querySelectorAll('body > ol:nth-of-type(3) > li > ul > li > ol > li')
        .length,
      2
    );
  });

  it('should extract all images', () => {
    //add two to account for duplicate textboxes in markup
    assert.equal(doc.querySelectorAll('img').length, 11);

    //find inline standalone image
    assert(
      doc.querySelector('span[class="w_drawing"] > span[class="wp_inline"]')
    );

    //find anchored standalone image
    assert(
      doc.querySelector(
        'span[class="v_shape"] > span[data-type="topAndBottom"]'
      )
    );
  });

  it('should extract all captions', () => {
    //add two to account for duplicate textboxes in markup
    assert.equal(
      doc.querySelectorAll('div[class="dedocx-caption"]').length,
      10
    );

    //captions by type
    //image
    assert.equal(
      Array.from(doc.querySelectorAll('div[class="dedocx-caption"]')).find(
        caption =>
          caption.getAttribute('data-dedocx-caption-group') ===
          doc
            .querySelector('p[data-dedocx-caption-target-type="image"]')
            .getAttribute('data-dedocx-caption-group')
      ).textContent,
      'Figure 1 A captioned image.'
    );

    //multi-part figures
    assert.equal(
      doc
        .querySelector('div[class="dedocx-picture-grid"]')
        .getAttribute('data-dedocx-caption-target-type'),
      'multi-image'
    );

    assert.equal(
      Array.from(doc.querySelectorAll('div[class="dedocx-caption"]')).find(
        caption =>
          caption.getAttribute('data-dedocx-caption-group') ===
          doc
            .querySelector('div[class="dedocx-picture-grid"]')
            .getAttribute('data-dedocx-caption-group')
      ).textContent,
      'Figure 2 A multipart figure with caption.'
    );

    assert.equal(
      doc.querySelectorAll('span[class="dedocx-picture-grid-label"]').length,
      2
    );

    //math
    assert.equal(
      Array.from(doc.querySelectorAll('div[class="dedocx-caption"]')).find(
        caption =>
          caption.getAttribute('data-dedocx-caption-group') ===
          doc
            .querySelector('p[data-dedocx-caption-target-type="math"]')
            .getAttribute('data-dedocx-caption-group')
      ).textContent,
      'Equation 1 Binomial theorem.'
    );

    //code
    assert.equal(
      Array.from(doc.querySelectorAll('div[class="dedocx-caption"]')).find(
        caption =>
          caption.getAttribute('data-dedocx-caption-group') ===
          doc
            .querySelector('pre[data-dedocx-caption-target-type="code"]')
            .getAttribute('data-dedocx-caption-group')
      ).textContent,
      'Code 1 Code block sample. Programming Language: R.'
    );

    //tables
    assert.equal(
      Array.from(doc.querySelectorAll('div[class="dedocx-caption"]')).find(
        caption =>
          caption.getAttribute('data-dedocx-caption-group') ===
          doc
            .querySelector('table[data-dedocx-caption-target-type="table"]')
            .getAttribute('data-dedocx-caption-group')
      ).textContent,
      'Table 1 A table with images and footnotes.'
    );

    //external link
    assert.equal(
      Array.from(doc.querySelectorAll('div[class="dedocx-caption"]')).find(
        caption =>
          caption.getAttribute('data-dedocx-caption-group') ===
          doc
            .querySelector('p[data-dedocx-caption-target-type="hyper"]')
            .getAttribute('data-dedocx-caption-group')
      ).textContent,
      'Supporting Dataset 1 Genbank.'
    );

    //textboxes
    const textboxes = Array.from(doc.querySelectorAll('aside'));

    assert.equal(
      textboxes[0].querySelector('p').getAttribute('data-dedocx-props'),
      '{"elementType":"para","keepNext":true,"pStyle":"Caption"}'
    );

    assert.equal(
      textboxes[3].querySelector('p').getAttribute('data-dedocx-props'),
      '{"elementType":"para","keepNext":true,"pStyle":"Caption"}'
    );
  });

  it('should extract tables', () => {
    //has table element
    assert(
      doc
        .querySelector('table')
        .getAttribute('data-dedocx-props')
        .includes('"elementType":"table"')
    );

    //has two figures
    assert(doc.querySelector('table img'));

    //has inline figure
    assert(doc.querySelector('table span[class="wp_inline"]'));

    //has anchored figure
    assert(doc.querySelector('table span[class="wp_wrapTopAndBottom"]'));

    //has block equation
    assert(doc.querySelector('table math[display="block"]'));

    //has inline equation
    assert(doc.querySelector('table math[display="inline"]'));

    //has footnote
    assert(doc.querySelector('table sup > a[href="#dedocx-footnote-2"]'));
  });

  it('should extract textboxes', () => {
    const textboxes = Array.from(doc.querySelectorAll('aside'));
    assert.equal(textboxes.length, 4);

    //has heading
    assert(textboxes[0].querySelector('h2'));

    //has two inline images
    assert.equal(
      textboxes[3].querySelectorAll('span[class="wp_inline"]').length,
      2
    );
  });

  it('should extract code', () => {
    //inline
    assert(
      doc
        .querySelector('code')
        .getAttribute('data-dedocx-props')
        .includes('"rStyle":"InlineCode"')
    );

    //block
    //each new line is wrapped in 'pre'
    assert.equal(doc.querySelectorAll('pre').length, 5);
  });

  it('should extract equations', () => {
    //inline
    assert(doc.querySelector('p > math[display = "inline"]'));

    //block
    assert(doc.querySelector('p > math[display = "block"]'));
  });

  it('should extract one reference', () => {
    assert.equal(Object.keys(bibliography).length, 1);
  });
});
