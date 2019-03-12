import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const sourcePath = join(__dirname, 'fixtures/doc-props.docx');

describe('Basic: Document Properties', () => {
  it('are present', done => {
    dedocx({ sourcePath }, (err, ctx) => {
      if (err) {
        return done(err);
      }
      assert(ctx.docProps);
      // console.log(JSON.stringify(ctx.docProps, null, 2));
      // test for presence of specific properties of interest (currently docProps are stored but not used)
      done();
    });
  });
});
