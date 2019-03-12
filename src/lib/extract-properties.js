let xpath = require('./xpath'),
  { W_NS } = require('../constants/ns'),
  { boolean, string, number, enums } = require('./attribute-parsers'),
  borders = require('../constants/borders'),
  themeColors = require('../constants/theme-colors'),
  textEffects = require('../constants/text-effects'),
  emphasisTypes = require('../constants/emphasis-types'),
  justifications = require('../constants/justifications'),
  textAlignments = require('../constants/text-alignments'),
  textboxTightWraps = require('../constants/textbox-tight-wrap'),
  textDirections = require('../constants/text-directions'),
  vertAligns = require('../constants/vertical-aligns'),
  combineBrackets = require('../constants/combine-brackets'),
  hints = require('../constants/hints'),
  themes = require('../constants/themes'),
  shades = require('../constants/shades'),
  lineRules = require('../constants/line-spacing-rules'),
  underlines = require('../constants/underlines'),
  dropCaps = require('../constants/drop-caps'),
  wraps = require('../constants/wraps'),
  anchors = require('../constants/anchors'),
  xAligns = require('../constants/x-aligns'),
  yAligns = require('../constants/y-aligns'),
  heightRules = require('../constants/height-rules'),
  tabJustifications = require('../constants/tab-justifications'),
  tabStopLeaderChars = require('../constants/tab-stop-leader-chars'),
  tableOverlaps = require('../constants/table-overlaps'),
  tableWidths = require('../constants/table-widths'),
  tableLayouts = require('../constants/table-layouts'),
  merges = require('../constants/merges'),
  verticalJustifications = require('../constants/vertical-justifications'),
  annotationVMerges = require('../constants/annotation-vmerges'),
  locks = require('../constants/locks'),
  dateMappings = require('../constants/date-mappings'),
  calendars = require('../constants/calendars');

// XXX
//  - Should support a number of `w14` elements (eg. shadow)
//  - Should extract from rubyPr

// LIST OF ELEMENTS THAT APPEAR AS PROPERTIES
// Differently property-defining elements can appear in different contexts. We are liberal in what
// we accept and process them all indifferently of the containing element. Basically this step
// produces a reliable description of the properties, the caller can then merge it, convert it, etc.
//
//  - w:adjustRightInd        toggle            ignore
//  - w:autoSpaceDE           toggle            ignore
//  - w:autoSpaceDN           toggle            ignore
//  - w:b                     toggle            -> bold
//  - w:bCs                   toggle            ignore for now
//  - w:bdr                   complex attr      -> text border
//  - w:bidi                  toggle            -> dir=rtl
//  - w:caps                  toggle            -> text-transform: uppercase
//  - w:cnfStyle              weird             -> table th and all
//  - w:color                 color+theme attr  -> color
//  - w:contextualSpacing     toggle            -> if next w:p has same w:pStyle, ignore our
//                                                  margin-bottom and its margin-top
//  - w:cs                    toggle            ignore
//  - w:del                   author/date       -> marks whole w:tr or w:p as deleted
//  - w:divId                 values            ignore
//  - w:dstrike               toggle            -> double-strikethrought (maybe convert to single)
//  - w:eastAsianLayout       complex attr      ignore for now
//  - w:effect                val=animation     ignore
//  - w:em                    val=emphasis type ignore for now
//  - w:emboss                toggle            ignore
//  - w:fitText               misc              ignore
//  - w:framePr               complex           ignore
//  - w:highlight             color             -> background
//  - w:i                     toggle            -> italics
//  - w:iCs                   toggle            ignore for now
//  - w:imprint               toggle            ignore
//  - w:ind                   complex attr      -> text-indent and friends
//  - w:ins                   date/author       -> whole w:p or w:tr was inserted, or props changed
//                                              only consider the quasi-toggle case for now
//  - w:jc                    w:val alignment   -> text-align http://www.datypic.com/sc/ooxml/t-w_ST_Jc.html
//  - w:keepLines             toggle            -> the CSS equivalent (if exists)
//  - w:keepNext              toggle            -> the CSS equivalent (if exists)
//  - w:kern                  numeric val       -> letter-spacing
//  - w:kinsoku               toggle            ignore
//  - w:lang                  lang attr         -> need to figure out what complex script, etc. is
//  - w:mirrorIndents         toggle            ignore
//  - w:moveFrom              date/author       -> change tracking, think I can ignore
//  - w:moveTo                ditto             ditto
//  - w:noProof               toggle            ignore
//  - w:numPr                 complex els       -> think we need this for lists
//  - w:oMath                 toggle            -> probably ignore? we can see the math
//  - w:outline               toggle            -> text-stroke?
//  - w:outlineLvl            val number        no idea
//  - w:overflowPunct         toggle            ignore
//  - w:pageBreakBefore       toggle            -> the CSS equivalent
//  - w:pBdr                  complex els       -> border
//  - w:position              val number        -> vertical-align
//  - w:pPrChange             date/author       ignore
//  - w:pStyle                val string        -> the fundamental style
//  - w:rFonts                complex attr      -> font-family
//  - w:rPr                   recurse           -> ignore except as default in pPr for the rPr
//  - w:rPrChange             contains recurse  ignore
//  - w:rStyle                val string        -> the fundamental style
//  - w:rtl                   toggle            -> dir=rtl (relationship to bidi?)
//  - w:sectPr                complex els       ignore for now
//  - w:shadow                toggle            -> text-shadow or box-shadow
//  - w:shd                   complex attr      -> text-shadow or box-shadow
//  - w:smallCaps             toggle            -> font-variant
//  - w:snapToGrid            toggle            ignore
//  - w:spacing               complex attr      -> line-height, margin-*
//                            val number        -> letter-spacing (so it's not w:kern)
//  - w:specVanish            toggle            ignore
//  - w:strike                toggle            -> <s>
//  - w:suppressAutoHyphens   toggle            -> hyphens (should default to on I guess?)
//  - w:suppressLineNumbers   toggle            ignore
//  - w:suppressOverlap       toggle            ignore
//  - w:sz                    val number        -> font-size (in rPr context)
//  - w:szCs                  val number        ignore for now
//  - w:tabs                  complex els       ignore
//  - w:textAlignment         special val       -> vertical-align
//  - w:textboxTightWrap      misc              ignore
//  - w:textDirection         val bidi          -> yet another bidi/dir/vertical specification
//  - w:topLinePunct          toggle            ignore
//  - w:u                     color/type attr   -> text-decoration
//  - w:vanish                toggle            ignore
//  - w:vertAlign             specific val      -> sub/sup
//  - w:w                     misc              ignore
//  - w:webHidden             toggle            ignore
//  - w:widowControl          toggle            -> CSS equivalent
//  - w:wordWrap              toggle            -> word-break
//  - w:trPrChange
//  - w:tcW
//  - w:gridSpan
//  - w:hMerge
//  - w:vMerge
//  - w:tcBorders
//  - w:noWrap
//  - w:tcMar
//  - w:tcFitText
//  - w:vAlign
//  - w:hideMark
//  - w:cellIns
//  - w:cellDel
//  - w:cellMerge
//  - w:tcPrChange
//  - w:alias
//  - w:lock
//  - w:placeholder
//  - w:showingPlcHdr
//  - w:dataBinding
//  - w:temporary
//  - w:id
//  - w:tag
//  - w:equation
//  - w:comboBox
//  - w:date
//  - w:docPartObj
//  - w:docPartList
//  - w:dropDownList
//  - w:picture
//  - w:richText
//  - w:text
//  - w:citation
//  - w:group
//  - w:bibliography
//
//  NOTE: the list above does not include many properties from: tblPr, trPr, tcPr (but they are
//  implemented below).

// USAGE CONTEXTS
//  w:pPr appears in w:style, w:tblStylePr, w:lvl, w:p, w:pPrDefault, w:pPrChange
//  w:rPr appears in w:tblStylePr, w:lvl, w:strPr, w:rPrDefault, w:style, m:ctrlPr, m:r, w:r, w:pPr,
//    w:pPrChange, w:ins, w:del

// COMPLEX SCRIPTS
//  DOCX I18N is a mess. Some useful notes here about which range is what:
//  https://onedrive.live.com/view.aspx/Public%20Documents/2009/DR-09-0040.docx?cid=c8ba0861dc5e4adc&sc=documents

module.exports = function extractProperties(propEl) {
  if (!propEl) return {};
  let props = {},
    select = xpath(propEl),
    setForEl = (elName, makeValue) => {
      let el = select(`./w:${elName}`)[0];
      if (el) props[elName] = makeValue(el);
    },
    parseBorder = el => ({
      val: enums(el, 'val', borders),
      color: string(el, 'color'),
      themeColor: enums(el, 'themeColor', themeColors),
      themeTint: string(el, 'themeTint'),
      themeShade: string(el, 'themeShade'),
      sz: number(el, 'sz'), // 1/8th pt
      space: number(el, 'space'), // pt
      shadow: boolean(el, 'shadow'),
      frame: boolean(el, 'frame')
    });
  // toggles
  [
    'adjustRightInd',
    'autoSpaceDE',
    'autoSpaceDN',
    'b',
    'bCs',
    'bidi',
    'caps',
    'contextualSpacing',
    'cs',
    'dstrike',
    'emboss',
    'i',
    'iCs',
    'imprint',
    'keepLines',
    'keepNext',
    'kinsoku',
    'mirrorIndents',
    'noProof',
    'oMath',
    'outline',
    'overflowPunct',
    'pageBreakBefore',
    'rtl',
    'shadow',
    'smallCaps',
    'snapToGrid',
    'specVanish',
    'strike',
    'suppressAutoHyphens',
    'suppressLineNumbers',
    'suppressOverlap',
    'topLinePunct',
    'vanish',
    'webHidden',
    'widowControl',
    'wordWrap',
    'bidiVisual',
    'cantSplit',
    'tblHeader',
    'hidden',
    'noWrap',
    'tcFitText',
    'hideMark',
    'bibliography',
    'group',
    'citation',
    'richText',
    'picture',
    'equation',
    'temporary',
    'showingPlcHdr'
  ].forEach(prop => {
    let el = select(`./w:${prop}`)[0];
    if (!el) return;
    props[prop] = boolean(el, 'val', true);
  });

  // w:val is a number
  [
    'kern',
    'outlineLvl',
    'position',
    'sz',
    'szCs',
    'w',
    'tblStyleRowBandSize',
    'tblStyleColBandSize',
    'gridBefore',
    'gridAfter',
    'gridSpan'
  ].forEach(prop => {
    let el = select(`./w:${prop}[@w:val]`)[0];
    if (!el) return;
    props[prop] = number(el);
  });

  // w:val is a string
  [
    'highlight',
    'divId',
    'rStyle',
    'pStyle',
    'tblStyle',
    'alias',
    'tag',
    'id'
  ].forEach(prop => setForEl(prop, el => string(el)));

  // w:val is an enum
  [
    ['effect', textEffects],
    ['em', emphasisTypes],
    ['jc', justifications],
    ['textAlignment', textAlignments],
    ['textboxTightWrap', textboxTightWraps],
    ['textDirection', textDirections],
    ['vertAlign', vertAligns],
    ['tblOverlap', tableOverlaps],
    ['hMerge', merges],
    ['vMerge', merges],
    ['vAlign', verticalJustifications],
    ['lock', locks]
  ].forEach(([prop, values]) => {
    let el = select(`./w:${prop}[@w:val]`)[0];
    if (!el) return;
    props[prop] = enums(el, 'val', values);
  });

  // id/date/author (revision props)
  [
    'del',
    'ins',
    'moveFrom',
    'moveTo',
    'cellIns',
    'cellDel',
    'cellMerge'
  ].forEach(prop => {
    let el = select(`./w:${prop}`)[0];
    if (!el) return;
    if (el.hasChildNode()) return; // NOTE: some are different, right now ignored
    props[prop] = {
      id: string(el, 'id'),
      author: string(el, 'author'),
      date: string(el, 'date'),
      vMerge: enums(el, 'vMerge', annotationVMerges), // cellMerge-only
      vMergeOrig: enums(el, 'vMerge', annotationVMerges) // cellMerge-only
    };
  });

  // w and table width type
  [
    'tblW',
    'tblCellSpacing',
    'tblInd',
    'wBefore',
    'wAfter',
    'tblCellSpacing',
    'tcW'
  ].forEach(type => {
    setForEl(type, el => ({
      w: number(el, 'w'),
      type: enums(el, 'type', tableWidths)
    }));
  });

  // margins
  ['tblCellMar', 'tcMar'].forEach(type => {
    setForEl(type, el => {
      let cellMars = {};
      ['top', 'left', 'bottom', 'right'].forEach(key => {
        let subEl = select(`./w:${key}`, el)[0];
        if (!subEl) return;
        cellMars[key] = {
          w: number(subEl, 'w'),
          type: enums(subEl, 'type', tableWidths)
        };
      });
      return cellMars;
    });
  });

  // w:bdr
  setForEl('bdr', parseBorder);

  // color
  setForEl('color', el => ({
    val: string(el),
    themeColor: enums(el, 'themeColor', themeColors),
    themeTint: string(el, 'themeTint'),
    themeShade: string(el, 'themeShade')
  }));

  // cnfStyle
  setForEl('cnfStyle', el => ({
    val: string(el),
    firstRow: boolean(el, 'firstRow'),
    lastRow: boolean(el, 'lastRow'),
    firstColumn: boolean(el, 'firstColumn'),
    lastColumn: boolean(el, 'lastColumn'),
    oddVBand: boolean(el, 'oddVBand'),
    evenVBand: boolean(el, 'evenVBand'),
    oddHBand: boolean(el, 'oddHBand'),
    evenHBand: boolean(el, 'evenHBand'),
    firstRowFirstColumn: boolean(el, 'firstRowFirstColumn'),
    firstRowLastColumn: boolean(el, 'firstRowLastColumn'),
    lastRowFirstColumn: boolean(el, 'lastRowFirstColumn'),
    lastRowLastColumn: boolean(el, 'lastRowLastColumn')
  }));

  // eastAsianLayout
  setForEl('eastAsianLayout', el => ({
    id: string(el, 'id'),
    combine: boolean(el, 'combine'),
    combineBrackets: enums(el, 'combineBrackets', combineBrackets),
    vert: boolean(el, 'vert'),
    vertCompress: boolean(el, 'vertCompress')
  }));

  // ind
  setForEl('ind', el => ({
    left: number(el, 'left'),
    leftChars: number(el, 'leftChars'),
    right: number(el, 'right'),
    rightChars: number(el, 'rightChars'),
    hanging: number(el, 'hanging'),
    hangingChars: number(el, 'hangingChars'),
    firstLine: number(el, 'firstLine'),
    firstLineChars: number(el, 'firstLineChars')
  }));

  // lang
  setForEl('lang', el => ({
    val: string(el),
    eastAsia: string(el, 'eastAsia'),
    bidi: string(el, 'bidi')
  }));

  // rFonts
  setForEl('rFonts', el => ({
    hint: enums(el, 'hint', hints),
    ascii: string(el, 'ascii'),
    hAnsi: string(el, 'hAnsi'),
    eastAsia: string(el, 'eastAsia'),
    cs: string(el, 'cs'),
    asciiTheme: enums(el, 'asciiTheme', themes),
    hAnsiTheme: enums(el, 'hAnsiTheme', themes),
    eastAsiaTheme: enums(el, 'eastAsiaTheme', themes),
    cstheme: enums(el, 'cstheme', themes) // NOTE: the lowercase "theme" is from spec
  }));

  // shd
  setForEl('shd', el => ({
    val: enums(el, 'val', shades),
    color: string(el, 'color'),
    themeColor: enums(el, 'themeColor', themeColors),
    themeTint: string(el, 'themeTint'),
    themeShade: string(el, 'themeShade'),
    fill: string(el, 'fill'),
    themeFill: enums(el, 'themeFill', themeColors),
    themeFillTint: string(el, 'themeFillTint'),
    themeFillShade: string(el, 'themeFillShade')
  }));

  // spacing - sometimes just a val, sometimes a whole lot more
  setForEl('spacing', el => {
    if (el.hasAttributeNS(W_NS, 'val')) return number(el);
    return {
      val: number(el),
      before: number(el, 'before'),
      beforeLines: number(el, 'beforeLines'),
      beforeAutospacing: boolean(el, 'beforeAutospacing'),
      after: number(el, 'after'),
      afterLines: number(el, 'afterLines'),
      afterAutospacing: boolean(el, 'afterAutospacing'),
      line: number(el, 'firstLineChars'),
      lineRule: enums(el, 'lineRule', lineRules)
    };
  });

  // u
  setForEl('u', el => ({
    val: enums(el, 'val', underlines),
    color: string(el, 'color'),
    themeColor: enums(el, 'themeColor', themeColors),
    themeTint: string(el, 'themeTint'),
    themeShade: string(el, 'themeShade')
  }));

  // pPrChange
  setForEl('pPrChange', el => {
    let pPr = select('./w:pPr', el)[0];
    return {
      id: string(el, 'id'),
      author: string(el, 'author'),
      date: string(el, 'date'),
      pPr: pPr ? extractProperties(pPr) : {}
    };
  });

  // rPrChange
  setForEl('rPrChange', el => {
    let rPr = select('./w:rPr', el)[0];
    return {
      id: string(el, 'id'),
      author: string(el, 'author'),
      date: string(el, 'date'),
      rPr: rPr ? extractProperties(rPr) : {}
    };
  });

  // trPrChange
  setForEl('trPrChange', el => {
    let trPr = select('./w:trPr', el)[0];
    return {
      id: string(el, 'id'),
      author: string(el, 'author'),
      date: string(el, 'date'),
      trPr: trPr ? extractProperties(trPr) : {}
    };
  });

  // tcPrChange
  setForEl('tcPrChange', el => {
    let tcPr = select('./w:tcPr', el)[0];
    return {
      id: string(el, 'id'),
      author: string(el, 'author'),
      date: string(el, 'date'),
      tcPr: tcPr ? extractProperties(tcPr) : {}
    };
  });

  // rPr (child of pPr)
  setForEl('rPr', extractProperties);

  // fitText
  setForEl('fitText', el => ({
    val: number(el),
    id: string(el, 'id')
  }));

  // text
  setForEl('text', el => ({
    multiLine: boolean(el, 'multiLine')
  }));

  // framePr
  setForEl('framePr', el => ({
    dropCap: enums(el, 'dropCap', dropCaps),
    lines: number(el, 'lines'),
    w: number(el, 'w'),
    h: number(el, 'h'),
    vSpace: number(el, 'vSpace'),
    hSpace: number(el, 'hSpace'),
    wrap: enums(el, 'wrap', wraps),
    hAnchor: enums(el, 'hAnchor', anchors),
    vAnchor: enums(el, 'vAnchor', anchors),
    x: number(el, 'x'),
    xAlign: enums(el, 'xAlign', xAligns),
    y: number(el, 'y'),
    yAlign: enums(el, 'yAlign', yAligns),
    hRule: enums(el, 'hRule', heightRules),
    anchorLock: boolean(el, 'anchorLock')
  }));

  // tblpPr
  setForEl('tblpPr', el => ({
    leftFromText: number(el, 'leftFromText'),
    rightFromText: number(el, 'rightFromText'),
    topFromText: number(el, 'topFromText'),
    bottomFromText: number(el, 'bottomFromText'),
    horzAnchor: enums(el, 'horzAnchor', anchors),
    vertAnchor: enums(el, 'vertAnchor', anchors),
    tblpX: number(el, 'tblpX'),
    tblpXSpec: enums(el, 'tblpXSpec', xAligns),
    tblpY: number(el, 'tblpY'),
    tblpYSpec: enums(el, 'tblpYSpec', yAligns)
  }));

  // tblLayout
  setForEl('tblLayout', el => enums(el, 'type', tableLayouts));

  // trHeight
  setForEl('trHeight', el => ({
    val: number(el),
    hRule: enums(el, 'hRule', heightRules)
  }));

  // dataBinding
  setForEl('dataBinding', el => ({
    prefixMappings: string(el, 'prefixMappings'),
    xpath: string(el, 'xpath'),
    storeItemID: string(el, 'storeItemID')
  }));

  // tblLook
  setForEl('tblLook', el => ({
    val: string(el),
    firstRow: boolean(el, 'firstRow'),
    lastRow: boolean(el, 'lastRow'),
    firstColumn: boolean(el, 'firstColumn'),
    lastColumn: boolean(el, 'lastColumn'),
    noHBand: boolean(el, 'noHBand'),
    noVBand: boolean(el, 'noVBand')
  }));

  // placeholder
  setForEl(
    'placeholder',
    el => select('./w:docPart', el).map(sub => string(sub))[0]
  );

  // numPr
  setForEl('numPr', el => {
    let numberingChange = select('./w:numberingChange', el)[0],
      ins = select('./w:ins', el)[0];
    return {
      ilvl: elValue(el, 'ilvl', number),
      numId: elValue(el, 'numId', number),
      numberingChange: numberingChange
        ? {
            id: string(numberingChange, 'id'),
            author: string(numberingChange, 'author'),
            date: string(numberingChange, 'date'),
            original: string(numberingChange, 'original')
          }
        : undefined,
      ins: ins
        ? {
            id: string(ins, 'id'),
            author: string(ins, 'author'),
            date: string(ins, 'date')
          }
        : undefined
    };
  });

  // structured borders
  ['pBdr', 'tblBorders', 'tcBorders'].forEach(bdrType => {
    setForEl(bdrType, el => {
      let bdrProps = {};
      [
        'top',
        'left',
        'bottom',
        'right',
        'between', // p-only
        'bar', // p-only
        'insideH', // (tbl, tc)-only
        'insideV', // (tbl, tc)-only
        'tl2br', // tc-only
        'tl2bl' // tc-only
      ].forEach(key => {
        let subEl = select(`./w:${key}`, el)[0];
        if (!subEl) return;
        bdrProps[key] = parseBorder(subEl);
      });
      return bdrProps;
    });
  });

  // sectPr
  // NOTE: this is currently not implemented, pretty complex but limited immediate value
  setForEl('sectPr', () => ({}));

  // tabs
  setForEl('tabs', el =>
    select('./w:tab', el).map(tab => ({
      val: enums(tab, 'val', tabJustifications),
      leader: enums(tab, 'leader', tabStopLeaderChars),
      pos: number(tab, 'clear')
    }))
  );

  // drop-downs
  ['dropDownList', 'comboBox'].forEach(dd => {
    setForEl(dd, el => ({
      lastValue: string(el, 'lastValue'),
      listItems: select('./w:listItem', el).map(li => ({
        displayText: string(li, 'displayText'),
        value: string(li, 'value')
      }))
    }));
  });

  // doc parts
  ['docPartList', 'docPartObj'].forEach(dp => {
    setForEl(dp, el => ({
      docPartGallery: select('./w:docPartGallery', el).map(sub =>
        string(sub)
      )[0],
      docPartCategory: select('./w:docPartCategory', el).map(sub =>
        string(sub)
      )[0],
      docPartUnique: select('./w:docPartUnique', el).map(sub =>
        boolean(sub, 'val', true)
      )[0]
    }));
  });

  // date
  setForEl('date', el => ({
    fullDate: string(el, 'fullDate'),
    dateFormat: select('./w:dateFormat', el).map(sub => string(sub))[0],
    lid: select('./w:lid', el).map(sub => string(sub))[0],
    storeMappedData: select('./w:storeMappedData', el).map(sub =>
      enums(sub, 'val', dateMappings)
    )[0],
    calendar: select('./w:calendar', el).map(sub =>
      enums(sub, 'val', calendars)
    )[0]
  }));

  return props;
};

function elValue(el, elName, typeMaker, ...rest) {
  let select = xpath(el),
    subEl = select(`./w:${elName}`)[0];
  if (!subEl) return;
  return typeMaker(subEl, ...rest);
}
