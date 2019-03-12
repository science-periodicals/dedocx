import { JSDOM } from 'jsdom';

import Marcheur from '../lib/marcheur';
import nodal from '../lib/marcheur-nodal';
import LookupMatcher from '../lib/marcheur-lookup-matcher';
import omit from 'lodash/omit';
import win1252 from 'windows-1252';
import { Iconv } from 'iconv';
import omml2mathml from '../lib/omml2mathml';
import { prefixMap, W_NS, SA_NS } from '../constants/ns';
import extractProperties from '../lib/extract-properties';
import parseField from '../lib/parse-field';
import fieldDetails from '../lib/field-details';
import xpath from '../lib/xpath';
import remove from '../lib/remove';
import symbolMap from '../constants/symbol-map';
import addAttributesToTable from '../lib/analyze-table';
import createTableHeadAndFoot from '../lib/post-fix-table';

// XXX TABLES
// These need special handling inside tables
//  Need to be placed in the closest relevant cell: w:bookmarkStart, w:bookmarkEnd, w:permStart,
//    w:permEnd, m:oMathPara, m:oMath
//  Need to be skipped (most likely) w:moveFromRangeStart, w:moveFromRangeEnd, w:moveToRangeStart,
//    w:moveToRangeEnd, w:customXmlInsRangeStart,
//    w:customXmlInsRangeEnd, w:customXmlDelRangeStart, w:customXmlDelRangeEnd,
//    w:customXmlMoveFromRangeStart, w:customXmlMoveFromRangeEnd, w:customXmlMoveToRangeStart
//    w:customXmlMoveToRangeEnd, w:customXml, w:proofErr, w:moveFrom, w:moveTo
//  Need passthrough: w:sdt, w:ins, w:del
//     Move Source Run Content
//     Move Destination Run Content

// The big walk across the document
// NOTE: We ignore all the revision attributes.
export default function walkDocument(ctx, callback) {
  let { select, docx, styleMap } = ctx;
  if (!select) {
    // XXX create an empty JSDOM
    return process.nextTick(callback);
  }
  let m = new LookupMatcher(prefixMap);
  let walker = new Marcheur({ mode: 'lookup' });
  let reverseMap = {};
  let unknownNSCount = 0;
  let passthrough = (src, out, w) => w.walk(out);
  let skip = () => {};

  let nameForNode = n => {
    let name = '';
    if (n.namespaceURI) {
      if (!reverseMap[n.namespaceURI]) {
        let prefix;
        if (!prefixMap[n.prefix]) {
          prefix = n.prefix;
        } else {
          unknownNSCount++;
          prefix = `ukn${unknownNSCount}`;
        }
        reverseMap[n.namespaceURI] = prefix;
      }
      name = reverseMap[n.namespaceURI] + '_';
    }
    return `${name}${n.localName}`;
  };

  let wrap = (src, out, ln = 'span') => {
    let attr = extractAttr(src);
    attr.class = nameForNode(src);
    return el(ln, attr, out);
  };

  let extractAttr = src => {
    let attr = {};
    Array.from(src.attributes).forEach(atn => {
      attr[`data-${nameForNode(atn)}`] = atn.value;
    });
    return attr;
  };

  let elMatch = m.el.bind(m);
  let el;
  let inTable = false;

  Object.keys(prefixMap).forEach(pfx => (reverseMap[prefixMap[pfx]] = pfx));
  walker = walker
    // #document
    .match(m.document(), (src, out, w) => {
      const {
        window: { document: doc }
      } = new JSDOM('');
      const nod = nodal(doc, {}, prefixMap);
      const meta = doc.createElement('meta');
      el = nod.el;
      // amap = nod.amap;
      ctx.doc = doc;
      meta.setAttribute('charset', 'utf8');
      doc.head.appendChild(meta);
      w.result(doc);
      w.walk(doc.body);
    })

    // GENERIC MAPPING TO ELEMENTS
    // elements for which we do nothing
    .match(
      [
        'w:document',
        'w:body',
        'w:t',
        'w:sdtContent',
        'm:oMathPara',
        'm:oMathParaPr'
      ].map(elMatch),
      passthrough
    )

    // elements we skip (at least for now) either because we don't want to process them or we do
    // in another manner (eg. properties)
    .match(
      [
        'w:background',
        'w:proofErr',
        'w:fldChar',
        'w:lastRenderedPageBreak',
        // props
        'w:pPr',
        'w:rPr',
        'w:sdtPr',
        'w:sdtEndPr',
        'w:tblPr',
        'w:trPr',
        'w:tcPr',
        'w:rubyPr',
        // might revert
        'w:tblGrid',
        'w:sectPr'
      ].map(elMatch),
      skip
    )

    // BODY
    // paragraphs
    .match(m.el('w:p'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      let pPr = select('./w:pPr', src)[0];
      let props = pPr ? extractProperties(pPr) : {};
      let elDef = styleMap[props.pStyle || 'Normal'] || { el: 'p' };
      let captionGroup = src.getAttributeNS(SA_NS, 'caption-group');
      let captionType = src.getAttributeNS(SA_NS, 'caption-target-type');
      let id = src.getAttributeNS(SA_NS, 'id');
      let output;
      let walk;

      if (typeof elDef.el === 'function') {
        let res = elDef.el(src, out);
        output = res.output;
        walk = res.walk;
      } else if (props.numPr) {
        output = walk = el('li', {}, out);
      } else {
        output = walk = el(elDef.el || 'p', {}, out);
      }

      if (elDef.attr) {
        Object.keys(elDef.attr).forEach(n =>
          output.setAttribute(n, elDef.attr[n])
        );
      }

      if (Object.keys(props).length) {
        output.setAttribute('data-dedocx-props', dataProps(props, 'para'));
      }

      // these are here so that downstream can turn them into figures if need be
      if (captionGroup) {
        output.setAttribute('data-dedocx-caption-group', captionGroup);
      }

      if (captionType) {
        output.setAttribute('data-dedocx-caption-target-type', captionType);
      }

      if (id) {
        output.setAttribute('id', id);
      }

      if (props.textDirection) {
        output.setAttribute(
          'dir',
          /lt/i.test(props.textDirection) ? 'ltr' : 'rtl'
        );
      }
      w.walk(walk);
    })

    // bookmarks, permissions, and comments
    .match(
      [
        'w:bookmarkStart',
        'w:bookmarkEnd',
        'w:permStart',
        'w:permEnd',
        'w:commentRangeStart',
        'w:commentRangeEnd',
        'w:commentReference'
      ].map(elMatch),
      (src, out, w) => {
        if (inTable) {
          return w.walk(out);
        }
        let attr = extractAttr(src);
        attr.class = src.localName;
        if (attr['data-w_id']) {
          attr.id = `${src.localName}_${attr['data-w_id']}`;
          delete attr['data-w_id'];
        }
        el('span', attr, out);
      }
    )

    // images
    .match(m.el('a:blip'), (src, out, w) => {
      if (inTable) return w.walk(out);
      let linkRel =
        src.hasAttributeNS(SA_NS, 'rel') &&
        JSON.parse(src.getAttributeNS(SA_NS, 'rel'));
      if (!linkRel) return w.walk(wrap(src, out));
      let attr = {
        src: linkRel.fullPath,
        'data-dedocx-rel-target': linkRel.target,
        'data-dedocx-rel-package-path': linkRel.packagePath
      };
      // NOTE: a:blip can contain other elements, for now we just ignore that
      el('img', attr, out);
    })

    //anchored images in tables
    //an anchored image in a table is given by v:imagedata (not a:blip as other images in the document) http://www.datypic.com/sc/ooxml/e-v_imagedata.html
    .match(m.el('v:imagedata'), (src, out, w) => {
      if (inTable) return w.walk(out);
      let linkRel =
        src.hasAttributeNS(SA_NS, 'rel') &&
        JSON.parse(src.getAttributeNS(SA_NS, 'rel'));
      if (!linkRel) return w.walk(wrap(src, out));
      let attr = {
        src: linkRel.fullPath,
        'data-dedocx-rel-target': linkRel.target,
        'data-dedocx-rel-package-path': linkRel.packagePath
      };
      el('img', attr, out);
    })

    // picture grid
    .match(m.el('sans:picture-grid'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }

      w.walk(
        el(
          'div',
          {
            class: 'dedocx-picture-grid',
            'data-dedocx-caption-group': src.getAttributeNS(
              SA_NS,
              'caption-group'
            ),
            'data-dedocx-caption-target-type': src.getAttributeNS(
              SA_NS,
              'caption-target-type'
            )
          },
          out
        )
      );
    })
    .match(m.el('sans:picture-grid-item'), (src, out) => {
      let div = el('div', { class: 'dedocx-picture-grid-item' }, out),
        style = '';
      if (src.getAttribute('width')) {
        style += `width: ${src.getAttribute('width')}; `;
      }
      if (src.getAttribute('height')) {
        style += `height: ${src.getAttribute('height')}; `;
      }
      el(
        'img',
        {
          src: src.getAttribute('full-path'),
          'data-dedocx-rel-target': src.getAttribute('src'),
          'data-dedocx-rel-package-path': src.getAttribute('package-path'),
          style: style || undefined
        },
        div
      );
      let label = el('span', { class: 'dedocx-picture-grid-label' }, div);
      label.textContent = src.getAttribute('label');
    })

    // table stuff
    .match(m.el('w:tbl'), (src, out, w) => {
      let tblProps = extractProperties(select('./w:tblPr', src)[0]);
      let id = src.getAttributeNS(SA_NS, 'id');
      addAttributesToTable(src, tblProps);
      inTable = true;

      let table = el(
          'table',
          {
            'data-dedocx-props': dataProps(tblProps, 'table'),
            'data-dedocx-caption-group': src.getAttributeNS(
              SA_NS,
              'caption-group'
            ),
            'data-dedocx-caption-target-type': src.getAttributeNS(
              SA_NS,
              'caption-target-type'
            ),
            id
          },
          out
        ),
        tbody = el('tbody', {}, table);
      w.walk(tbody);
      createTableHeadAndFoot(table);
      inTable = false;
    })
    // tc, tr... using SANS: colspan, rowspan, colhead, colfoot, rowhead, rowhead-depth
    .match(m.el('w:tr'), (src, out, w) => {
      let trProps = extractProperties(select('./w:trPr', src)[0]);
      let id = src.getAttributeNS(SA_NS, 'id');

      w.walk(
        el('tr', { 'data-dedocx-props': dataProps(trProps, 'tr'), id }, out)
      );
    })
    .match(m.el('w:tc'), (src, out, w) => {
      if (src.getAttributeNS(SA_NS, 'dead-cell')) return;
      let tcProps = extractProperties(select('./w:tcPr', src)[0]);
      let attr = {
        colspan: src.getAttributeNS(SA_NS, 'colspan'),
        rowspan: src.getAttributeNS(SA_NS, 'rowspan'),
        id: src.getAttributeNS(SA_NS, 'id')
      };
      let elName = 'td';
      let colhead = src.getAttributeNS(SA_NS, 'colhead');
      let rowhead = src.getAttributeNS(SA_NS, 'rowhead');

      if (src.hasAttributeNS(SA_NS, 'rowhead-depth')) {
        out.setAttribute(
          'aria-level',
          src.getAttributeNS(SA_NS, 'rowhead-depth')
        );
      }

      attr['data-dedocx-tfoot'] = src.getAttributeNS(SA_NS, 'colfoot');
      attr['data-dedocx-props'] = dataProps(tcProps, 'tc');
      if (colhead || rowhead) {
        elName = 'th';
      }

      inTable = false;
      w.walk(el(elName, attr, out));
      inTable = true;
    })

    // maths
    .match(m.el('m:oMath'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      let parent = select('parent::m:oMathPara', src)[0];
      let mathProps;
      if (parent) {
        mathProps = extractProperties(select('./m:oMathParaPr', parent)[0]);
      }

      let output = out.ownerDocument.importNode(omml2mathml(src), true);
      if (mathProps && Object.keys(mathProps).length) {
        output.setAttribute('data-dedocx-props', dataProps(mathProps, 'math'));
      }
      out.appendChild(output);
    })

    // lists
    .match(m.el('sans:list'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      w.walk(el(src.getAttribute('type') || 'ul', {}, out));
    })

    // captions & labels
    .match(m.el('sans:caption'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      w.walk(
        el(
          'div',
          {
            class: 'dedocx-caption',
            'data-dedocx-caption-group': src.getAttribute('group')
          },
          out
        )
      );
    })
    .match(m.el('sans:caption-label'), (src, out, w) => {
      let id = src.getAttributeNS(SA_NS, 'id');
      if (id) {
        out.setAttribute('id', id);
      }
      w.walk(el('span', { class: 'dedocx-label' }, out));
    })

    // generated spans
    .match(m.el('sans:span'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      w.walk(el('span', { id: src.getAttribute('id') }, out));
    })

    // IDs
    .match(m.el('sans:id'), (src, out) => {
      let id = src.getAttribute('id');
      if (id) {
        // XXX
        // it's arguable we should try to remap all links here, but that's potentially dodgy
        if (out.hasAttribute('id')) {
          el('span', { id }, out);
        } else out.setAttribute('id', id);
      }
    })

    // text boxes
    .match(m.el('w:txbxContent'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      w.walk(el('aside', {}, out));
    })

    // CONTENTS OF PARAGRAPHS
    // runs
    .match(m.el('w:r'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      let rPr = select('./w:rPr', src)[0];
      let props = rPr ? extractProperties(rPr) : {};
      let id = src.getAttributeNS(SA_NS, 'id');
      let hasProps = !!Object.keys(props).length || id;
      let elDef = styleMap[props.rStyle || 'DefaultParagraphFont'] || {
        el: 'span'
      };
      let output;
      let walk;

      if (typeof elDef.el === 'function') {
        let res = elDef.el(src, out);
        output = res.output;
        walk = res.walk;
      } else {
        let ln = elDef.el;
        if (!ln || ln === 'span') {
          if (props.b) {
            ln = 'strong';
            delete props.b;
          } else if (props.i) {
            ln = 'em';
            delete props.i;
          } else if (props.u) {
            ln = 'u';
            delete props.u;
          } else if (props.strike || props.dstrike) {
            ln = 's';
            if (props.strike) {
              delete props.strike;
            }
            if (props.dstrike) {
              delete props.dstrike;
            }
          } else if (props.vertAlign === 'subscript') {
            ln = 'sub';
            delete props.vertAlign;
          } else if (props.vertAlign === 'superscript') {
            ln = 'sup';
            delete props.vertAlign;
          } else if (props.rtl) {
            ln = 'bdi';
          }
        }
        // skip if the span adds nothing
        if ((!ln || ln === 'span') && !hasProps && !elDef.attr) {
          return w.walk(out);
        }
        output = walk = el(ln || 'span', {}, out);
      }
      if (elDef.attr) {
        Object.keys(elDef.attr).forEach(n =>
          output.setAttribute(n, elDef.attr[n])
        );
      }
      if (hasProps && Object.keys(props).length) {
        output.setAttribute('data-dedocx-props', dataProps(props, 'run'));
      }
      if (id) {
        output.setAttribute('id', id);
      }
      if (props.rtl) {
        output.setAttribute('dir', 'rtl');
      }
      w.walk(walk);
    })

    // hyperlink
    .match(m.el('w:hyperlink'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      let linkRel =
        src.hasAttributeNS(SA_NS, 'rel') &&
        JSON.parse(src.getAttributeNS(SA_NS, 'rel'));
      let attr = extractAttr(src);
      delete attr['data-r_id'];
      if (linkRel && linkRel.target) {
        attr.href = linkRel.target;
      } else if (attr['data-w_anchor']) {
        attr.href = `#${attr['data-w_anchor']}`;
        attr.role = 'doc-anchorlink';
        delete attr['data-w_anchor'];
      }
      if (attr['data-w_tooltip']) {
        attr.title = attr['data-w_tooltip'];
        delete attr['data-w_tooltip'];
      }
      if (attr['data-sans_citation'] === 'true') {
        attr.role = 'doc-biblioref';
        delete attr['data-sans_citation'];
      }
      if (attr['data-sans_id']) {
        attr.id = attr['data-sans_id'];
        delete attr['data-sans_id'];
      }
      w.walk(el('a', attr, out));
    })

    // citation group
    .match(m.el('sans:citation-group'), (src, out, w) => {
      let cites = JSON.parse(src.getAttribute('cites') || '[]');
      let first = cites.shift();
      let options = {
        prefix: undefined,
        suffix: undefined,
        suppressAuthors: false,
        suppressYear: false,
        suppressTitle: false,
        page: undefined,
        volume: undefined,
        tags: cites
      };
      let attr = {
        href: `#${first}`,
        'data-dedocx-citation-options': dataProps(options)
      };
      w.walk(el('a', attr, out));
    })

    // ins & del
    .match(['w:ins', 'w:del'].map(elMatch), (src, out, w) => {
      let ln = src.localName;
      let attr = {
        id:
          src.hasAttributeNS(W_NS, 'id') &&
          `dedocx-${ln}-${src.getAttributeNS(W_NS, 'id')}`,
        datetime: src.getAttributeNS(W_NS, 'date'),
        'data-dedocx-author': src.getAttributeNS(W_NS, 'author')
      };
      w.walk(el(ln, attr, out));
    })
    .match(m.el('w:delText'), passthrough)

    // Ruby text
    .match(m.el('w:ruby'), (src, out, w) => {
      w.walk(el('ruby', {}, out));
    })
    .match(m.el('w:rubyBase'), (src, out, w) => {
      w.walk(el('rb', {}, out));
    })
    .match(m.el('w:rt'), (src, out, w) => {
      w.walk(el('rt', {}, out));
    })

    // tabs & breaks
    .match(m.el('w:tab'), (src, out) => {
      out.appendChild(out.ownerDocument.createTextNode('\t'));
    })
    .match(m.el('w:br'), (src, out) => {
      el('br', {}, out);
    })

    // fields
    .match(['w:fldSimple', 'sans:field'].map(elMatch), (src, out, w) => {
      let { instr } = fieldDetails(src);
      if (!instr) {
        return w.walk(wrap(src, out));
      }
      // NOTE: this is a rich language that can support a lot of complexity. We do not interpret it.
      // One reason for not supporting it in full is that it is quite elaborate and would take time.
      // Another is that the fallback content will normally contain Word's latest evaluation of the
      // expression, meaning that we get the output free. Of course, someone can write a downstream
      // interpreter for this.
      // We do support some simple functions because they have no place being executed dynamically.
      // NOTE: not supported yet, but might require support soon: INCLUDEPICTURE, INCLUDETEXT,
      // INDEX, KEYWORDS
      let field = parseField(instr);
      let elName;
      let content = '';
      let attr = {};
      let fst = val => {
        if (typeof val === 'undefined') {
          return undefined;
        }
        return Array.isArray(val) ? val[0] : val;
      };
      if (!field) {
        return w.walk(wrap(src, out));
      }
      if (
        field.type === 'BIBLIOGRAPHY' ||
        (field.addin &&
          (field.type === 'EN.REFLIST' || field.type === 'ZOTERO_BIBL'))
      ) {
        // if we are inside an sdt with a w:bibliography, just passthrough
        let hasBibAncestor = !!select(
          'ancestor::w:sdt[./w:sdtPr/w:bibliography]',
          src
        ).length;
        if (hasBibAncestor) {
          return w.walk(out);
        }
        suppressFieldDetails(src);
        return w.walk(el('section', { role: 'doc-bibliography' }, out));
      } else if (field.type === 'CITATION') {
        elName = 'a';
        attr.href = `#${field.argument}`;
        attr.role = 'doc-biblioref';
        // NOTE: We produce a more digestible version of the switches to help downstream modules.
        // We leave the text that Word generated for the content of the citation callout, but it
        // should be noted that it is quite likely to be totally useless. It will likely be far more
        // useful to regenerate it from the citation data and possibly
        // applying the citation options.
        let options = {
          prefix: field.f,
          suffix: field.s,
          suppressAuthors: field.n,
          suppressYear: field.y,
          suppressTitle: field.t,
          page: field.p,
          volume: field.v,
          tags: field.m
        };
        attr['data-dedocx-citation-options'] = dataProps(options);
      } else if (field.type === 'EN.CITE') {
        // here we don't actually want to keep the content
        let tags = select('.//w:hyperlink', src)
            .map(hyper => hyper.getAttributeNS(W_NS, 'anchor'))
            .filter(Boolean),
          firstTag = tags.shift(),
          enAttr = {};
        if (!firstTag) {
          if (inTable) {
            return w.walk(out);
          }
          w.walk(wrap(src, out));
        }
        enAttr.href = `#${firstTag}`;
        enAttr.role = 'doc-biblioref';
        // NOTE: The idea is that we should become able to process the actual content of this
        // element in order to infer the information below, which in turn can serve bibliographic
        // formatting downstream.
        let options = {
          prefix: undefined,
          suffix: undefined,
          suppressAuthors: false,
          suppressYear: false,
          suppressTitle: false,
          page: undefined,
          volume: undefined,
          tags
        };
        enAttr['data-dedocx-citation-options'] = dataProps(options);
        let output = el('a', enAttr, out);
        output.textContent = src.textContent; // this is brutal, but so is the EndNote format
        suppressFieldDetails(src);
        return;
      } else if (field.type === 'HYPERLINK') {
        elName = 'a';
        let switches = {
          href: field.argument,
          ref: fst(field.l),
          usemap: fst(field.m),
          target: fst(field.t) || (fst(field.n) && '_blank'),
          tooltip: fst(field.o)
        };
        if (switches.href) {
          attr.href = switches.href;
        } else if (switches.ref) {
          attr.href = `#${switches.ref}`;
          attr.role = 'doc-anchorlink';
        }
        // extra attributes (no idea how to save usemap, also: don't care)
        if (switches.target) {
          attr.target = switches.target;
        }
        if (switches.tooltip) {
          attr.title = switches.tooltip;
        }
      } else if (field.type === 'NOTEREF' || field.type === 'REF') {
        elName = 'a';
        attr.href = `#${field.argument}`;
        attr.role = field.type === 'NOTEREF' ? 'doc-noteref' : 'doc-anchorlink';
      } else if (field.type === 'SYMBOL') {
        // NOTE: there's stuff here that could be usefully converted to CSS
        elName = 'span';
        let value = (field.argument || '').toLowerCase();
        let hex = /^0x/.test(value) && value.replace(/0x/);
        let num = !/^0x/.test(value) && parseInt(value, 10);

        if (hex) {
          if (field.f === 'Symbol' && symbolMap[hex]) {
            content = symbolMap[hex];
          } else num = parseInt(hex, 16);
        }
        if (!content && num) {
          // ANSI is CP-1252
          if (field.a) {
            content = win1252.decode(Buffer.alloc(1, num).toString('binary'));
          } else if (field.u) {
            content = String.fromCodePoint(num);
          } else if (field.j) {
            content = new Iconv('CP932', 'UTF-8')
              .convert(Buffer.alloc(1, num).toString('binary'))
              .toString();
          }
        }
        attr['data-dedocx-switches'] = dataProps(
          omit(field, ['type', 'argument'])
        );
      } else if (field.type === 'TOC') {
        elName = 'section';
        attr.role = 'directory';
        attr['data-dedocx-switches'] = dataProps(
          omit(field, ['type', 'argument'])
        );
      }
      if (elName) {
        let output = el(elName, attr, out);
        if (content.length) {
          output.textContent = content;
        }
        suppressFieldDetails(src);
        return w.walk(output);
      }
      if (inTable) {
        return w.walk(out);
      }
      w.walk(wrap(src, out));
    })

    // Structured Document Tags
    .match(m.el('w:sdt'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      let sdtPr = select('./w:sdtPr', src)[0];
      let sdtEndPr = select('./w:sdtEndPr', src)[0];
      let prProps = sdtPr ? extractProperties(sdtPr) : {};
      let endPrProps = sdtEndPr ? extractProperties(sdtEndPr) : {};
      let isBiblio =
        prProps &&
        prProps.docPartObj &&
        prProps.docPartObj.docPartGallery === 'Bibliographies';
      let output = el(
        isBiblio ? 'section' : 'span',
        {
          role: isBiblio ? 'doc-bibliography' : undefined,
          'data-dedocx-props': dataProps(prProps, 'para'),
          'data-dedocx-endprops': dataProps(endPrProps, 'para')
        },
        out
      );
      // we skip citations because they contain fields that can handle that correctly
      if (prProps.citation) {
        return w.walk(out);
      }
      w.walk(output);
    })

    // Symbols
    // If the font is Symbol, we know we need to remap the character. Otherwise, just insert the
    // character as is.
    // NOTE: this needs testing with other fonts, it is possible it is used for all PUA, in which
    // case we might be able to rely on it.
    .match(m.el('w:sym'), (src, out) => {
      let font = src.getAttributeNS(W_NS, 'font');
      let char = (src.getAttributeNS(W_NS, 'char') || '').toLowerCase();
      if (!char) {
        return;
      }
      if (font === 'Symbol' && symbolMap[char]) {
        return out.appendChild(
          out.ownerDocument.createTextNode(symbolMap[char])
        );
      }
      let attr = {};
      if (font) {
        attr.style = `font-family: "${font}";`;
      }
      let span = el('span', attr, out);
      span.textContent = String.fromCodePoint(parseInt(char, 16));
    })

    // Footnotes, endnotes...
    .match(m.el('w:footnotes'), (src, out, w) => {
      // NOTE: there is no doc-* to denote a footnotes section, so we make do with our own
      w.walk(el('section', { role: 'dedocx-footnotes' }, out));
    })
    .match(m.el('w:endnotes'), (src, out, w) => {
      w.walk(el('section', { role: 'doc-endnotes' }, out));
    })
    .match(m.el('w:footnote'), (src, out, w) => {
      let type = src.getAttributeNS(W_NS, 'type');
      let id = src.getAttributeNS(W_NS, 'id');

      if (type && type !== 'normal') {
        return;
      }
      w.walk(
        el('div', { role: 'doc-footnote', id: `dedocx-footnote-${id}` }, out)
      );
    })
    .match(m.el('w:endnote'), (src, out, w) => {
      let type = src.getAttributeNS(W_NS, 'type');
      let id = src.getAttributeNS(W_NS, 'id');

      if (type && type !== 'normal') {
        return;
      }

      w.walk(
        el('div', { role: 'doc-endnote', id: `dedocx-endnote-${id}` }, out)
      );
    })

    .match(
      ['w:footnoteReference', 'w:endnoteReference'].map(elMatch),
      (src, out, w) => {
        let id = src.getAttributeNS(W_NS, 'id');
        let type = src.localName.replace('Reference', '');

        if (!id) {
          return w.walk(wrap(src, out));
        }

        let output = el(
          'a',
          { role: 'doc-noteref', href: `#dedocx-${type}-${id}` },
          out
        );
        // NOTE: The default ID might not be correct, but it should generally be; and it can be
        // renamed downstream. Walking the reference allows NOTEREF cases to work (we synthetically
        // give them the correct body upstream).
        if (src.hasChildNodes()) {
          w.walk(output);
        } else output.textContent = id;
      }
    )
    .match(m.el('w:footnoteRef'), (src, out) => {
      let fn = select('ancestor::w:footnote', src)[0];
      if (!fn) {
        return;
      }
      let id = fn.getAttributeNS(W_NS, 'id');
      if (!id) {
        return;
      }
      let tn = out.ownerDocument.createTextNode(id);
      out.appendChild(tn);
    })
    .match(m.el('w:endnoteRef'), (src, out) => {
      let fn = select('ancestor::w:endnote', src)[0];
      if (!fn) {
        return;
      }
      let id = fn.getAttributeNS(W_NS, 'id');
      if (!id) {
        return;
      }
      let tn = out.ownerDocument.createTextNode(id);
      out.appendChild(tn);
    })

    // Default
    .match(m.el('*'), (src, out, w) => {
      if (inTable) {
        return w.walk(out);
      }
      let output = wrap(src, out);
      // don't render arbitrary structures inside tables
      // console.warn(`• unhandled: ${src.nodeName}`);
      w.walk(output);
    });
  try {
    walker.run(docx, callback);
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
}

function dataProps(obj = {}, elementType) {
  if (!Object.keys(obj).length) {
    return;
  }
  return JSON.stringify(Object.assign({ elementType }, obj));
}

function suppressFieldDetails(fld) {
  if (!fld || fld.namespaceURI !== SA_NS || fld.localName !== 'field') {
    return;
  }

  let select = xpath(fld);
  let content = select('./sans:content')[0];
  select('./sans:instructions').forEach(remove);
  if (content) {
    while (content.hasChildNodes()) fld.appendChild(content.firstChild);
    remove(content);
  }
}
