import assert from 'assert';
import { join } from 'path';
import dedocx from '../src';

const sourcePath = join(__dirname, 'fixtures/symbols.docx');

describe('Symbols', () => {
  it('should have killed symbols', done => {
    dedocx({ sourcePath }, (err, { doc } = {}) => {
      assert.ifError(err);
      let result =
        '!∀#∃%&∋()∗+,−./0123456789:;<=>?≅ΑΒΧΔΕΦΓΗΙϑΚΛΜΝΟΠΘΡΣΤΥςΩΞΨΖ[∴]⟂_̅αβχδεϕγηιφκλμνοπθρστυϖωξψζ{|}∼ϒ′≤⁄∞𝑓♣♦♥♠↔←↑→↓°±″≥×∝∂•÷≠≡≈…|―↵ℵ𝔍ℜ℘⊗⊕∅∩∪⊃⊇⊄⊂⊆∈∉∠∇®©™∏√⋅¬∧∨⇔⇐⇑⇒⇓◊〈®©™∑⎛⎜⎝⎡⎢⎣⎧⎨⎩⎸〉∫⌠⎮⌡⎞⎟⎠⎤⎥⎦⎫⎬⎭';
      assert.equal(
        doc.querySelector('p:not(:empty)').textContent,
        result,
        `Content is "${result}"`
      );
      done();
    });
  });
});
