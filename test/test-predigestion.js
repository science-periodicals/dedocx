import assert from 'assert';
import fields from '../src/predigest/fields';
import { W_NS } from '../src/constants/ns';
import loadXML from '../src/lib/load-xml';
// import serializeXML from '../src/lib/serialize-xml';
import normalizeText from '../src/lib/normalize-text';
import xpath from '../src/lib/xpath';
import { join } from 'path';

describe('Complex Field Processing', () => {
  // <w:fldSimple w:instr="HYPERLINK \l &quot;_ENREF_95&quot; \o &quot;Kappos, 2010 #67&quot;"/>
  it('should handle the simplest field', done => {
    processFields('fields-single.xml', (err, { select, docx }) => {
      assert.ifError(err);
      assert(docx, 'there is a document');
      let fs = select('//w:fldSimple');
      assert.equal(fs.length, 1, 'one fldSimple');
      let instr = fs[0].getAttributeNS(W_NS, 'instr');
      assert.equal(
        instr,
        'HYPERLINK \\l "_ENREF_95" \\o "Kappos, 2010 #67"',
        'right instruction'
      );
      assert.equal(fs[0].childNodes.length, 0, 'no children');
      done();
    });
  });
  // <w:fldSimple w:instr="HYPERLINK \l &quot;_ENREF_95&quot; \o &quot;Kappos, 2010 #67&quot;">
  //  <w:fldSimple w:instr="HYPERLINK \l &quot;_ENREF_2&quot; \o &quot;Kappos, 2010 #67&quot;"/>
  // </w:fldSimple>
  it('should handle subfields in body', done => {
    processFields('fields-trivial.xml', (err, { select, docx }) => {
      assert.ifError(err);
      assert(docx, 'there is a document');
      let fs = select('//w:fldSimple');
      assert.equal(fs.length, 2, 'two fldSimple');
      let instr1 = fs[0].getAttributeNS(W_NS, 'instr'),
        instr2 = fs[1].getAttributeNS(W_NS, 'instr');
      assert.equal(
        instr1,
        'HYPERLINK \\l "_ENREF_95" \\o "Kappos, 2010 #67"',
        'right instruction 1'
      );
      assert.equal(
        instr2,
        'HYPERLINK \\l "_ENREF_2" \\o "Kappos, 2010 #67"',
        'right instruction 2'
      );
      assert.equal(fs[0].childNodes.length, 1, 'one child');
      assert.equal(fs[1].childNodes.length, 0, 'no children');
      done();
    });
  });
  // <sans:field>
  //  <sans:instructions>
  //   <sans:instruction text="HYPERLINK \l &quot;_ENREF_95&quot; \o &quot;Kappos, 2010 #67&quot;"/>
  //   <sans:instruction text="HYPERLINK \l &quot;_ENREF_2&quot; \o &quot;Kappos, 2010 #67&quot;"/>
  //  </sans:instructions>
  //  <sans:content/>
  // </sans:field>
  it('should handle subfields in instructions', done => {
    processFields('fields-trivial-instr.xml', (err, { select, docx }) => {
      assert.ifError(err);
      assert(docx, 'there is a document');
      let fs = select('//sans:field');
      assert.equal(fs.length, 1, 'one field');
      let instrs = select('./sans:instructions/sans:instruction', fs[0]),
        content = select('./sans:content', fs[0])[0];
      assert.equal(instrs.length, 2, 'two instructions');
      assert.equal(
        instrs[0].getAttribute('text'),
        'HYPERLINK \\l "_ENREF_95" \\o "Kappos, 2010 #67"',
        'right instruction 1'
      );
      assert.equal(
        instrs[1].getAttribute('text'),
        'HYPERLINK \\l "_ENREF_2" \\o "Kappos, 2010 #67"',
        'right instruction 1'
      );
      assert.equal(content.childNodes.length, 0, 'no children');
      done();
    });
  });
  // <w:fldSimple w:instr="HYPERLINK \l &quot;_ENREF_95&quot; \o &quot;Kappos, 2010 #67&quot;">
  //  <w:r><w:rPr/></w:r>
  //  <w:r><w:rPr/</w:r>
  //  <sans:field data="XXX">
  //    <sans:instructions>
  //      <sans:instruction props="{...}" text=" ADDIN EN.CITE "/>
  //      <sans:instruction text=" ADDIN EN.CITE.DATA " data="XXX"/>
  //    </sans:instructions>
  //    <sans:content>
  //      <w:r>
  //        <w:rPr/>
  //        <w:t>95-98</w:t>
  //      </w:r>
  //    </sans:content>
  //  </sans:field>
  // </w:fldSimple>
  it('should handle deeper nesting', done => {
    processFields('fields-three.xml', (err, { select, docx }) => {
      assert.ifError(err);
      assert(docx, 'there is a document');
      let fs = select('//w:fldSimple');
      assert.equal(fs.length, 1, 'one fldSimple');
      let instr = fs[0].getAttributeNS(W_NS, 'instr');
      assert.equal(
        instr,
        'HYPERLINK \\l "_ENREF_95" \\o "Kappos, 2010 #67"',
        'right instruction'
      );
      assert.equal(select('./w:r', fs[0]).length, 2, 'two runs');
      let fld = select('./sans:field', fs[0]);
      assert.equal(fld.length, 1, 'one sans:field');
      let instrs = select('./sans:instructions/sans:instruction', fld[0]),
        content = select('./sans:content', fld[0])[0];
      assert.equal(instrs.length, 2, 'two instructions');
      assert.equal(
        instrs[0].getAttribute('text'),
        ' ADDIN EN.CITE ',
        'right instruction 1'
      );
      assert.equal(
        instrs[1].getAttribute('text'),
        ' ADDIN EN.CITE.DATA ',
        'right instruction 2'
      );
      try {
        let props = JSON.parse(instrs[0].getAttribute('props'));
        assert(props.color, 'there is color');
        assert.equal(props.color.val, 'auto', 'color is auto');
        assert(props.rFonts, 'there is run font');
        assert.equal(props.rFonts.ascii, 'Times New Roman', 'font is ugly');
      } catch (e) {
        assert.ifError(e);
      }
      assert.equal(instrs[1].getAttribute('data'), 'XXX', 'data is available');
      assert.equal(select('./w:r', content).length, 1, 'one run in content');
      assert.equal(
        normalizeText(content.textContent),
        '95-98',
        'correct content'
      );
      done();
    });
  });
  // too long to show, basically the biblioref for EN
  it('should handle paragraph mode', done => {
    processFields('fields-bib.xml', (err, { select, docx }) => {
      assert.ifError(err);
      assert(docx, 'there is a document');
      let body = select('//w:body')[0],
        bodyPara = select('./w:p', body),
        fldSimple = select('./w:fldSimple', body),
        fldPara = select('./w:p', fldSimple[0]),
        bms = select('.//w:bookmarkStart', fldSimple[0]).map(bm =>
          bm.getAttributeNS(W_NS, 'name')
        );
      assert.equal(bodyPara.length, 2, 'two w:p in body');
      assert.equal(
        normalizeText(bodyPara[0].textContent),
        'US is about 400,000 and over two million people are',
        'correct content p1'
      );
      assert.equal(
        normalizeText(bodyPara[1].textContent),
        'expected increase in the number of cases in future',
        'correct content p2'
      );
      assert.equal(fldSimple.length, 1, 'one w:fldSimple in body');
      assert.equal(
        fldSimple[0].getAttributeNS(W_NS, 'instr'),
        ' ADDIN EN.REFLIST ',
        'right instr'
      );
      assert.equal(fldPara.length, 4, 'four w:p in body');
      assert.deepEqual(
        bms,
        ['_ENREF_1', '_ENREF_2', '_ENREF_3'],
        'right bookmarks'
      );
      done();
    });
  });
});

function processFields(src, cb) {
  loadXML(join(__dirname, 'fixtures/fields', src), (err, docx) => {
    if (err) return cb(err);
    let select = xpath(docx);
    fields({ select, docx }, err => {
      cb(err, { select, docx });
    });
  });
}
