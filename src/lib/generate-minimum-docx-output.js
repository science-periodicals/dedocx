import fs from 'fs';
import path from 'path';
import dedocx, { prettify } from '../';

function generateMinimumDocxOutput(callback) {
  const sourcePath = path.join(
    __dirname,
    '../../test/fixtures/minimum-test-document.docx'
  );

  dedocx({ sourcePath }, (err, ctx) => {
    if (err) {
      return callback(err);
    }
    const doc = ctx.doc;

    fs.writeFile(
      path.join(__dirname, '../../test/fixtures/minimum-test-document.js'),
      `import React from 'react'; ${'\n'} ${prettify(doc.body.outerHTML)}`,
      err => {
        if (err) {
          return callback(err);
        }
        fs.writeFile(
          path.join(
            __dirname,
            '../../test/fixtures/minimum-test-document-context.json'
          ),
          JSON.stringify(ctx.fileTree, null, 2),
          err => {
            if (err) {
              return callback(err);
            }
            callback;
          }
        );
      }
    );
  });
}

generateMinimumDocxOutput(err => {
  if (err) {
    return console.error(err);
  }
  return;
});
