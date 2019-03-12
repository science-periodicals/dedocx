import assert from 'assert';
import dedocx from '../src';
import { join } from 'path';

const sourcePath = join(__dirname, 'fixtures/code.docx');

describe('Code', () => {
  let doc;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;

      // require('fs').writeFileSync(
      //   join(__dirname, '/fixtures/code.html'),
      //   `<!DOCTYPE html>${doc.body.outerHTML}`
      // );

      done();
    });
  });

  it('should process inline code', () => {
    //get <code> with rStyle = InlineCode
    assert(
      doc
        .getElementsByTagName('code')[0]
        .getAttribute('data-dedocx-props')
        .includes('InlineCode')
    );
  });

  it('should process code blocks', () => {
    //get 5 <pre><code> (1 per line of code in the document), each with pStyle BlockCode
    assert(doc.getElementsByTagName('pre').length, 5);

    //check that each line has a pre tag and 'BlockCode' in its attribute
    assert(
      doc
        .getElementsByTagName('pre')[0]
        .getAttribute('data-dedocx-props')
        .includes('BlockCode')
    );

    assert(
      doc
        .getElementsByTagName('pre')[1]
        .getAttribute('data-dedocx-props')
        .includes('BlockCode')
    );

    assert(
      doc
        .getElementsByTagName('pre')[2]
        .getAttribute('data-dedocx-props')
        .includes('BlockCode')
    );
    assert(
      doc
        .getElementsByTagName('pre')[3]
        .getAttribute('data-dedocx-props')
        .includes('BlockCode')
    );
    assert(
      doc
        .getElementsByTagName('pre')[4]
        .getAttribute('data-dedocx-props')
        .includes('BlockCode')
    );

    //check that each line is wrapped in a code tag
    assert.equal(
      doc.getElementsByTagName('pre')[0].childNodes[0].tagName,
      'CODE'
    );

    assert.equal(
      doc.getElementsByTagName('pre')[1].childNodes[0].tagName,
      'CODE'
    );

    assert.equal(
      doc.getElementsByTagName('pre')[2].childNodes[0].tagName,
      'CODE'
    );

    assert.equal(
      doc.getElementsByTagName('pre')[3].childNodes[0].tagName,
      'CODE'
    );

    assert.equal(
      doc.getElementsByTagName('pre')[4].childNodes[0].tagName,
      'CODE'
    );
  });

  it('should process code block captions', () => {
    assert.equal(doc.querySelector('div').className, 'dedocx-caption');
  });
});
