module.exports = {
  // paragraphs
  Normal: { el: 'p' },
  Heading1: { el: 'h1' },
  Title: { el: 'h1' },
  Heading2: { el: 'h2' },
  Heading3: { el: 'h3' },
  Heading4: { el: 'h4' },
  Heading5: { el: 'h5' },
  Heading6: { el: 'h6' },
  Heading7: { el: 'h6', attr: { 'aria-level': 7 } },
  Heading8: { el: 'h6', attr: { 'aria-level': 8 } },
  Heading9: { el: 'h6', attr: { 'aria-level': 9 } },
  Quote: {
    el: (src, out) => {
      let doc = out.ownerDocument,
        bq = doc.createElement('blockquote'),
        p = doc.createElement('p');
      bq.appendChild(p);
      out.appendChild(bq);
      return { output: bq, walk: p };
    }
  },
  BlockCode: {
    el: (src, out) => {
      let doc = out.ownerDocument,
        pre = doc.createElement('pre'),
        code = doc.createElement('code');
      pre.appendChild(code);
      out.appendChild(pre);
      return { output: pre, walk: code };
    }
  },
  Subtitle: {
    el: (src, out) => {
      // the idea is that downstream can see the header
      let doc = out.ownerDocument,
        header = doc.createElement('header'),
        p = doc.createElement('p');
      header.setAttribute('class', 'dedocx-subtitle');
      header.appendChild(p);
      out.appendChild(header);
      return { output: header, walk: p };
    }
  },
  // runs
  InlineCode: { el: 'code' },
  FootnoteReference: { el: 'sup' },
  EndnoteReference: { el: 'sup' }
};
