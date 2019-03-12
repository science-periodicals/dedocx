import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const sourcePath = join(__dirname, 'fixtures/web-first-data-citation.docx');

// DEBUG
let { writeFileSync, copySync } = require('fs-extra');

// This appears to test whether dedocx extracts the media files and document correctly. Adding back it.skip as it writes files everytime the test runs.

describe('Simple Document', () => {
  it.skip('are present', done => {
    dedocx({ sourcePath }, (err, ctx) => {
      assert.ifError(err);
      // XXX
      writeFileSync(
        join(__dirname, '/index.html'),
        `<!DOCTYPE html>${ctx.doc.documentElement.outerHTML}`
      );
      Object.keys(ctx.fileTree).forEach(k => {
        if (!/^\/word\/media\//.test(k)) return;
        copySync(
          ctx.fileTree[k].fullPath,
          join(__dirname, k.replace('/word/', ''))
        );
      });
      // \XX
      done();
    });
  });
});
