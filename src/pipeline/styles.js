import { OFFICE_DOCUMENT_REL, STYLES_REL } from '../constants/relationships';
import loadXML from '../lib/load-xml';
import xpath from '../lib/xpath';
import extractProperties from '../lib/extract-properties';
import styleTypes from '../constants/style-types';
import tableStyleTypes from '../constants/table-style-types';
import { boolean, string, enums } from '../lib/attribute-parsers';

// Extracts the styles (default and named) as they apply to the Main Document.
// NOTE: the Glossary Document also has this type of style, when we support it we will also apply
// the same processing.
// We ignore latentStyles (at least for now).

export default function styles(ctx, callback) {
  try {
    const mainDoc =
      ctx.fileTree['/'] &&
      ctx.fileTree['/'].rels &&
      ctx.fileTree['/'].rels.find(rel => rel.type === OFFICE_DOCUMENT_REL);

    if (!mainDoc) {
      return process.nextTick(callback);
    }

    const mainDocPath = mainDoc.packagePath;
    const stylesRel =
      ctx.fileTree[mainDocPath] &&
      ctx.fileTree[mainDocPath].rels &&
      ctx.fileTree[mainDocPath].rels.find(rel => rel.type === STYLES_REL);

    if (!stylesRel) {
      return process.nextTick(callback);
    }

    loadXML(stylesRel.fullPath, (err, doc) => {
      if (err) {
        ctx.log.error(err);
        return callback();
      }
      try {
        const select = xpath(doc);
        const docDefaults = select('/w:styles/w:docDefaults')[0];
        const styleEls = select('/w:styles/w:style');

        if (docDefaults) {
          const rPr = select('./w:rPrDefault/w:rPr', docDefaults)[0];
          const pPr = select('./w:pPrDefault/w:pPr', docDefaults)[0];

          if (rPr) {
            ctx.defaultRunProps = extractProperties(rPr);
          }

          if (pPr) {
            ctx.defaultParaProps = extractProperties(pPr);
          }
        }

        const skip = {
          next: true,
          link: true,
          autoRedefine: true,
          hidden: true,
          uiPriority: true,
          semiHidden: true,
          unhideWhenUsed: true,
          locked: true,
          personal: true,
          personalCompose: true,
          personalReply: true,
          qFormat: true,
          rsid: true
        };

        ctx.styles = styleEls.map(style => {
          const res = {
            type: enums(style, 'type', styleTypes),
            styleId: string(style, 'styleId'),
            default: boolean(style, 'default'),
            customStyle: boolean(style, 'customStyle')
          };

          select('./w:*', style).forEach(child => {
            let ln = child.localName;
            // these are the ones that we skip for now
            if (skip[ln]) {
              return;
            }

            if (ln === 'name' || ln === 'basedOn') {
              return (res[ln] = string(child));
            }

            if (ln === 'aliases') {
              return (res.aliases = (string(child) || '')
                .split(/\s+/)
                .filter(Boolean));
            }

            if (
              ln === 'pPr' ||
              ln === 'rPr' ||
              ln === 'tblPr' ||
              ln === 'trPr' ||
              ln === 'tcPr'
            ) {
              return (res[ln] = extractProperties(child));
            }

            if (ln === 'tblStylePr') {
              if (!res.tblStylePr) {
                res.tblStylePr = {};
              }

              const type = enums(child, 'type', tableStyleTypes);
              res.tblStylePr[type] = {};
              select('./w:*', child).forEach(tblStyle => {
                res.tblStylePr[type][tblStyle.localName] = extractProperties(
                  tblStyle
                );
              });
            }
          });
          return res;
        });
      } catch (e) {
        ctx.log.error(e);
      }
      callback();
    });
  } catch (e) {
    ctx.log.error(e);
    callback();
  }
}
