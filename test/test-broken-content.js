import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const fixtures = 'fixtures/broken';
let list = [
  // not even wrong
  {
    name: 'is-not-there-at-all.docx',
    giveUp: true,
    code: 'ENOENT',
    message: /no such file or directory/,
    log: [/no such file or directory/]
  },
  // an empty document
  {
    name: 'empty.docx',
    giveUp: true,
    message: /end of central directory record signature not found/,
    log: [/end of central directory record signature not found/]
  },
  // spaces
  {
    name: 'stupid name with spaces.docx',
    giveUp: false,
    check: doc => {
      assert(doc, 'got a document');
      let seen = false;
      Array.from(doc.querySelectorAll('h2'))
        .filter(h2 => /abstract/i.test(h2.textContent))
        .map(h2 => h2.parentNode.querySelector('p'))
        .forEach(p => {
          seen = true;
          assert(/abstract/.test(p.textContent), 'got the abstract');
        });
      assert(seen, 'saw the abstract');
    }
  },
  // various non-docx documents pretending to be docx
  {
    name: 'png.docx',
    giveUp: true,
    message: /end of central directory record signature not found/,
    log: [/end of central directory record signature not found/]
  },
  {
    name: 'excel.docx',
    giveUp: false,
    check: doc => {
      assert(doc, 'there is a document');
      assert(
        doc.querySelector('.mc_AlternateContent'),
        'it has some Excel stuff'
      );
    }
  },
  {
    name: 'html.docx',
    giveUp: true,
    message: /end of central directory record signature not found/,
    log: [/end of central directory record signature not found/]
  },
  {
    name: 'doc.docx',
    giveUp: true,
    message: /invalid comment length. expected: 30539. found: 0/,
    log: [/invalid comment length. expected: 30539. found: 0/]
  },
  // corrupted content
  {
    name: 'corrupt-zip.docx',
    giveUp: true,
    message: /unexpected EOF/,
    log: [/unexpected EOF/]
  },
  {
    name: 'no-document-xml.docx',
    giveUp: false,
    log: [/no such file or directory/, /select is not a function/]
  },
  {
    name: 'malformed-document-xml.docx',
    giveUp: false,
    check: doc => {
      assert(doc, 'there is a document');
      let p = doc.querySelector('p');
      assert(p, 'there is a `p`');
      assert(
        /Web-First\s+Data\s+Citation/.test(p.textContent),
        'title can be found'
      );
    },
    log: [/Failed to categorise bookmark/]
  }
];

describe('Broken content', () => {
  list.forEach(item => {
    let sourcePath = join(__dirname, fixtures, item.name),
      canari = { called: false },
      plugins = [canariPlugin(canari)],
      log = makeTestLog(item.log || [], item.name);
    it(`should handle ${item.name}`, done => {
      dedocx({ sourcePath, plugins, log }, (err, { doc } = {}) => {
        if (item.giveUp) {
          assert(err, 'there is a an error');
          assert(!canari.called, 'short-circuiting');
          if (item.code)
            assert.equal(err.code, item.code, `code is ${item.code}`);
          if (item.message)
            assert(
              item.message.test(err.message),
              `message matches ${item.message}`
            );
        } else {
          assert.ifError(err);
          assert(canari.called, 'no short-circuiting');
        }
        if (item.check) item.check(doc);
        done();
      });
    });
  });
});

function canariPlugin(obj) {
  obj.called = false;
  return (ctx, callback) => {
    obj.called = true;
    process.nextTick(callback);
  };
}

function makeTestLog(rxList = [], name = 'unnamed') {
  let logger = (err, message) => {
    if (rxList.some(rx => rx.test(message || err.message))) return;
    process.stderr.write(
      `👹 🙀 💣  Unexpected error[${name}]: 🔜 '${message || err.message}'🔚\n`
    );
    process.nextTick(() => assert.ifError(err, `Error in ${name}`));
  };
  return {
    error: logger,
    warn: logger
  };
}
