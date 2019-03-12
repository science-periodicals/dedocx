let {
  ELEMENT_NODE,
  TEXT_NODE,
  CDATA_SECTION_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE
} = require('dom-node-types');

// Marcheur does not intend to replace XSLT, but it can be used to build simple tree walking tools based on a the extremely simple algorithm that is at the heart of XSLT 1 processing.

module.exports = class Marcheur {
  constructor({ mode = 'function' } = {}) {
    this.templates = [];
    this.mode = mode; // function, lookup
    this.lookupText = null;
    this.lookupDocument = null;
    this.lookupElement = {};
  }
  match(matcher, template) {
    if (!Array.isArray(matcher)) matcher = [matcher];
    // TODO: validate the matcher type
    if (this.mode === 'function') {
      if (matcher.find(m => typeof m !== 'function'))
        throw new Error(`All matchers must be functions`);
      this.templates.push({ matcher, template });
    } else if (this.mode === 'lookup') {
      if (matcher.find(m => !m.nt))
        throw new Error(`All matchers must be objects with a type`);
      matcher.forEach(({ nt, ns, ln }) => {
        if (nt === 'text') {
          if (this.lookupText)
            throw new Error(`You can only have one text lookup template`);
          this.lookupText = template;
        } else if (nt === 'document') {
          if (this.lookupDocument)
            throw new Error(`You can only have one document lookup template`);
          this.lookupDocument = template;
        } else if (nt === 'element') {
          if (!this.lookupElement[ns]) this.lookupElement[ns] = {};
          if (this.lookupElement[ns][ln]) {
            throw new Error(
              `You can only have one element lookup template ${ns}|${ln}`
            );
          }
          this.lookupElement[ns][ln] = template;
        } else throw new Error(`Unknown lookup node type "${nt}"`);
      });
    } else throw new Error(`Unknown mode ${this.mode}`);
    return this;
  }
  result(res) {
    this.res = res;
  }
  findMatch(node) {
    let type = node.nodeType;
    // This is the default mode, in which templates are matched with a function.
    if (this.mode === 'function') {
      for (let i = 0; i < this.templates.length; i++) {
        let tpl = this.templates[i];
        if (!tpl.matcher.some(m => m(node))) continue;
        this.stack.unshift(node);
        let res = tpl.template(node, this.out[0], this);
        this.stack.shift();
        return res;
      }
    } else if (this.mode === 'lookup') {
      if (
        (type === TEXT_NODE || type === CDATA_SECTION_NODE) &&
        this.lookupText
      ) {
        this.stack.unshift(node);
        let res = this.lookupText(node, this.out[0], this);
        this.stack.shift();
        return res;
      }
      if (type === DOCUMENT_NODE && this.lookupDocument) {
        this.stack.unshift(node);
        let res = this.lookupDocument(node, this.out[0], this);
        this.stack.shift();
        return res;
      }
      if (type === ELEMENT_NODE) {
        let { namespaceURI, localName } = node;
        let tpl =
          (this.lookupElement[namespaceURI] &&
            this.lookupElement[namespaceURI][localName]) ||
          (this.lookupElement[''] && this.lookupElement['']['*']);
        if (tpl) {
          this.stack.unshift(node);
          let res = tpl(node, this.out[0], this);
          this.stack.shift();
          return res;
        }
      }
    } else throw new Error(`Unknown mode ${this.mode}`);
    // this is the default rule when nothing matches
    if (type === TEXT_NODE || type === CDATA_SECTION_NODE) {
      let out = this.out[0];
      if (out) {
        let txt = out.ownerDocument.createTextNode(node.textContent);
        out.appendChild(txt);
      }
      return node;
    }
    if (
      type === ELEMENT_NODE ||
      type === DOCUMENT_NODE ||
      type === DOCUMENT_FRAGMENT_NODE
    ) {
      this.stack.unshift(node);
      let res = this.walk(this.out[0]);
      this.stack.shift();
      return res;
    }
  }
  walk(out, select) {
    this.out.unshift(out);
    let res = [];
    if (select) {
      if (!Array.isArray(select)) select = [select];
      select.forEach(sel => res.push(this.findMatch(sel)));
    } else {
      let parent = this.stack[0],
        nxt = parent.firstChild;
      while (nxt) {
        res.push(this.findMatch(nxt));
        nxt = nxt.nextSibling;
      }
    }
    this.out.shift();
    return res;
  }
  run(node, cb) {
    this.stack = [];
    this.out = [];
    this.res = null;
    if (cb) {
      process.nextTick(() => {
        this.findMatch(node);
        cb(null, this.res);
      });
    } else {
      this.findMatch(node);
      return this.res;
    }
  }
};
