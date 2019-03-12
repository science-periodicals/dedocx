import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';
import makeSelectron from 'selectron-test';

describe('Section links', () => {
  it('work in the document', done => {
    dedocx(
      { sourcePath: join(__dirname, 'fixtures/section-links.docx') },
      (err, { doc } = {}) => {
        assert.ifError(err);
        let selectron = makeSelectron(doc);
        selectron('#_Introduction');
        selectron('a[href="#_Introduction"][role="doc-anchorlink"]');
        selectron('#_Ref494986032');
        selectron('a[href="#_Ref494986032"][role="doc-anchorlink"]');
        done();
      }
    );
  });
});
