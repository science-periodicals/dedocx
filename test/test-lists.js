/* eslint import/no-extraneous-dependencies:0 */
import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

describe('Standard Lists', () => {
  const sourcePath = join(__dirname, 'fixtures/lists.docx');
  let doc;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;
      // console.log(prettify(doc.body.outerHTML));

      done();
    });
  });

  it('should process standard lists', () => {
    assert.equal(
      doc.querySelector('body > ul:first-of-type > li:nth-of-type(3)')
        .textContent,
      'UL Three'
    );

    assert.equal(
      doc.querySelectorAll('body > ol:first-of-type > li').length,
      3
    );

    assert.equal(
      doc.querySelector('body > ol:nth-of-type(2) > li:nth-of-type(3)')
        .textContent,
      'Simple parentheses Three'
    );

    assert.equal(
      doc.querySelector('body > ul:nth-of-type(2) > li:nth-of-type(3)')
        .textContent,
      'Nest UL OL Three back from nested (I think)'
    );

    assert.equal(
      doc.querySelector(
        'body > ul:nth-of-type(2) > li:nth-of-type(2) > ol > li:nth-of-type(3)'
      ).textContent,
      'Nest UL OL C'
    );

    assert.equal(
      doc.querySelectorAll(
        'body > ul:nth-of-type(3) > li:nth-of-type(1) > ul > li'
      ).length,
      2
    );

    assert(
      doc
        .querySelector('body > ul:nth-of-type(3) > li:nth-of-type(1) > ul > li')
        .textContent.includes('Nested from Style Level Three')
    );
  });
});

describe('Multilevel and mixed lists', () => {
  const sourcePath = join(__dirname, 'fixtures/list-test.docx');
  let doc;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;
      // console.log(prettify(doc.body.outerHTML));
      done();
    });
  });

  it('should process ordered lists', () => {
    assert.equal(
      doc.querySelector('body > ol:first-of-type > li:nth-of-type(3)')
        .innerHTML,
      'Third item'
    );
  });

  it('should process unordered lists', () => {
    assert.equal(
      doc.querySelector('body > ul:first-of-type > li:nth-of-type(3)')
        .innerHTML,
      'Item c'
    );
  });

  it('should process nested, ordered lists', () => {
    assert.equal(
      doc.querySelector(
        'body > ol:nth-of-type(2) > li:nth-of-type(3)  > ol > li:nth-of-type(2)  > ol > li:nth-of-type(2) > ol > li:nth-of-type(2)'
      ).innerHTML,
      'Question 3b.ii.2'
    );
  });

  it('should process nested, unordered lists', () => {
    assert.equal(
      doc.querySelector(
        'body > ul:nth-of-type(2) > li:nth-of-type(3)  > ul > li:nth-of-type(2)  > ul > li:nth-of-type(2) > ul > li:nth-of-type(2)'
      ).innerHTML,
      'blue cheese'
    );
  });

  it('should process mixed list unordered with ordered', () => {
    assert.equal(
      doc.querySelector(
        'body > ul:nth-of-type(3) > li:nth-of-type(2)  > ol > li:nth-of-type(2)'
      ).innerHTML,
      'second'
    );
  });

  it('should process mixed list ordered with unordered', () => {
    assert.equal(
      doc.querySelector(
        'body > ol:nth-of-type(3) > li:nth-of-type(2)  > ul > li:nth-of-type(2)  > ol > li:nth-of-type(3)'
      ).innerHTML,
      'Country'
    );
  });
});

describe('Custom lists', () => {
  const sourcePath = join(__dirname, 'fixtures/custom-list.docx');
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

  it('should process a custom list', () => {
    // require('fs').writeFileSync(
    //   join(__dirname, '/fixtures/custom-list.html'),
    //   `<!DOCTYPE html>${doc.body.outerHTML}`
    // );

    assert.equal(doc.querySelectorAll('ul').length, 1);
    assert.equal(doc.querySelectorAll('li').length, 2);
  });
});
