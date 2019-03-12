import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';
import { readFile } from 'fs';

const sourcePath = join(__dirname, 'fixtures/minimum-test-document.docx');

describe('Basic: API', () => {
  it('should produce a correct context object', done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }

      readFile(
        join(__dirname, 'fixtures/minimum-test-document-context.json'),
        'utf8',
        (err, output) => {
          if (err) {
            return done(err);
          }

          assert.deepEqual(
            Object.keys(ctx.fileTree).sort(),
            Array.from(Object.keys(JSON.parse(output))).sort()
          );

          done();
        }
      );
    });
  });
});
