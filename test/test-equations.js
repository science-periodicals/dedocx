import assert from 'assert';
import dedocx from '../src';
import { join } from 'path';

const sourcePath = join(__dirname, 'fixtures/equations.docx');

describe('Equations', () => {
  let doc;

  before(done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      doc = ctx.doc;

      // require('fs').writeFileSync(
      //   join(__dirname, '/fixtures/equations.html'),
      //   `<!DOCTYPE html>${doc.body.outerHTML}`
      // );

      done();
    });
  });

  it('should process inline equations', () => {
    assert.equal(
      doc.querySelectorAll('math')[0].getAttribute('display'),
      'inline'
    );

    //inline equations should have <p> as parent and that <p> should contain the text 'Inline equation '
    assert.equal(doc.querySelectorAll('math')[0].parentElement.nodeName, 'P');
    assert.equal(
      doc.querySelectorAll('math')[0].parentElement.childNodes[0].nodeValue,
      'Inline equation '
    );
  });

  it('should process block equations', () => {
    assert.equal(
      doc.querySelectorAll('math')[1].getAttribute('display'),
      'block'
    );

    //block equations should have <p> as parent and that <p> should contain no text.
    assert.equal(doc.querySelectorAll('math')[1].parentElement.nodeName, 'P');
    assert.equal(
      doc.querySelectorAll('math')[1].parentElement.childNodes[0].nodeValue,
      null
    );
  });

  it('should process systems of equations as one block', () => {
    //each equation in a system of equations should be wrapped in <math display="block> and the whole thing should be wrapped in one <p>
    assert.equal(
      doc.querySelectorAll('math')[2].getAttribute('display'),
      'block'
    );

    assert.equal(
      doc.querySelectorAll('math')[3].getAttribute('display'),
      'block'
    );

    assert.equal(
      doc.querySelectorAll('math')[4].getAttribute('display'),
      'block'
    );

    //each equation in the system of equations should have <p> as parent and that <p> should contain three childNodes
    assert.equal(doc.querySelectorAll('math')[2].parentElement.nodeName, 'P');
    assert.equal(
      doc.querySelectorAll('math')[2].parentElement.childNodes.length,
      3
    );

    assert.equal(doc.querySelectorAll('math')[3].parentElement.nodeName, 'P');
    assert.equal(
      doc.querySelectorAll('math')[3].parentElement.childNodes.length,
      3
    );

    assert.equal(doc.querySelectorAll('math')[4].parentElement.nodeName, 'P');
    assert.equal(
      doc.querySelectorAll('math')[4].parentElement.childNodes.length,
      3
    );
  });
});
