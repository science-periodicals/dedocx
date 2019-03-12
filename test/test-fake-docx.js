import assert from 'assert';
import path from 'path';
import dedocx from '../src';

const sourcePath = path.join(__dirname, '/fixtures/fake-test-docx.ds3.docx');

describe('Fake docx', () => {
  it('should error but not crash', done => {
    dedocx({ sourcePath }, (err, ctx) => {
      assert(err);
      done();
    });
  });
});
