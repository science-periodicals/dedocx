import { JSDOM } from 'jsdom';
import assert from 'assert';

import Marcheur from '../src/lib/marcheur';
import nodal from '../src/lib/marcheur-nodal';
import Matcher from '../src/lib/marcheur-matcher';
import loadXML from '../src/lib/load-xml';
import { join } from 'path';
const prefixMap = { b: 'http://berjon.com/' };

describe('Marcheur Basic', () => {
  let m = new Matcher(prefixMap),
    walker;
  before(() => {
    walker = new Marcheur();
  });
  it('should match basic structures', done => {
    loadXML(join(__dirname, 'fixtures/marcheur-basic.xml'), (err, document) => {
      assert.ifError(err);
      let seenDoc = false,
        seenEl = false,
        seenDefault = false,
        el;
      walker
        .match(m.document(), (src, out, w) => {
          const {
            window: { document: doc }
          } = new JSDOM('');
          const nod = nodal(doc, {}, prefixMap);
          const meta = doc.createElement('meta');
          el = nod.el;
          meta.setAttribute('charset', 'utf8');
          doc.head.appendChild(meta);
          seenDoc = true;
          w.result(doc);
          w.walk(doc.body);
        })
        .match(m.el('b:sub-element'), (src, out, w) => {
          seenEl = true;
          assert(out, 'there is an output');
          assert.equal(out.localName, 'div', 'output is div');
          w.walk(el('span', {}, out));
        })
        .match(m.el('*'), (src, out, w) => {
          seenDefault = true;
          assert(src, 'there is a source');
          assert.equal(src.localName, 'test', 'src is body');
          assert.equal(src.namespaceURI, prefixMap.b, 'src is in right ns');
          assert(out, 'there is an output');
          assert.equal(out.localName, 'body', 'output is body');
          w.walk(el('div', { id: 'found' }, out));
        })
        .run(document, (err, result) => {
          assert(seenDoc, 'walked the document');
          assert(seenEl, 'walked the element');
          assert(seenDefault, 'walked the default');
          assert(result, 'there is a result');
          assert(result.querySelector('body'), 'result has a body');
          assert(
            result.querySelector('meta[charset="utf8"]'),
            'result has a meta[charset]'
          );
          assert(result.querySelector('#found'), 'made an output');
          assert(
            result.querySelector('body > #found > span'),
            'correct structure'
          );
          assert(/Kittens/.test(result.body.textContent), 'result has kittens');
          done();
        });
    });
  });
});
