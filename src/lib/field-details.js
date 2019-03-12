let { W_NS, SA_NS } = require('../constants/ns'),
  xpath = require('./xpath');

// return useful information about fields
module.exports = function fieldDetails(fld) {
  if (!fld) return {};
  let instr,
    data,
    content, // this is the parent of the content
    wholeInstr;
  if (fld.namespaceURI === W_NS) {
    instr = fld.getAttributeNS(W_NS, 'instr');
    data = fld.getAttributeNS(SA_NS, 'data');
    content = fld;
    wholeInstr = instr;
  } else {
    data = fld.getAttribute('data');
    let select = xpath(fld),
      instructions = select('./sans:instructions/sans:instruction', fld);
    content = select('./sans:content')[0];
    if (instructions.length) {
      instr = instructions[0].getAttribute('text');
      wholeInstr = instructions.map(getInstructions).join(' ');
    }
  }
  return { instr, data, content, wholeInstr };
};

function getInstructions(el) {
  if (!el) return '';
  if (el.namespaceURI === W_NS && el.localName === 'fldSimple') {
    return el.getAttributeNS(W_NS, 'instr') || '';
  }
  if (el.namespaceURI === SA_NS) {
    if (el.localName === 'instruction') {
      if (el.hasAttribute('text')) return el.getAttribute('text');
      if (el.hasChildNodes()) return getInstructions(el.firstChild);
    }
    if (el.localName === 'field') {
      return xpath(el)('./sans:instructions/sans:instruction')
        .map(getInstructions)
        .join(' ');
    }
  }
  return '';
}
