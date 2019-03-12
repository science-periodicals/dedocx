import pipeline from './pipeline';
import pickTmp from '../pipeline/pick-tmp';
import unzip from '../pipeline/unzip';
import contentTypes from '../pipeline/content-types';
import fileTree from '../pipeline/file-tree';
import rels from '../pipeline/rels';
import docProps from '../pipeline/doc-props';
import styles from '../pipeline/styles';
import theme from '../pipeline/theme';
import numbering from '../pipeline/numbering';
import settings from '../pipeline/settings';
import loadMainDocument from '../pipeline/load-main-document';
import loadFootnotes from '../pipeline/load-footnotes';
import loadBibliography from '../pipeline/load-bibliography';
import walkDocument from '../pipeline/walk-document';
import defaultStyleMap from './default-style-map';

// CONTEXT (ctx)
//  This carries the configuration and current state of the system across the whole pipeline.
//  {
//    sourcePath:       path to the DOCX
//    tmpPath:          path into which to unzip the DOCX, defaults to a generated tmp dir
//    log:              object that has error/warn, defaults to console
//    fileTree:         all the files, keyed by package-relative name, with
//                      { fullPath, mediaType, rels }
//    resolveFileType:  function added for us to resolve the types of files
//    docProps:         the metadata properties of the whole document
//    defaultRunProps:  the default style props for runs
//    defaultParaProps: the default style props for paragraphs
//    styles:           an array of named styles
//    docx:             the main document
//    mainDocumentRels: the rels for the main document
//    styleMap:         an object mapping DOCX style names to an object detailing what element name
//                      and what attributes it maps to
//    numbering:        the numbering information to know how to handle lists
//    bibliography:     bibliography JSON for the content
//    plugins:          a list of plugins as functions
//  }

// NOTE:
//  We currently skip the processing of: settings.xml, webSettings.xml, numbering.xml,
//  fontTable.xml, as well as theming (though for that we could at least get the colours).
export default function dedocx(ctx = {}, callback) {
  if (!ctx.log) ctx.log = console;
  if (!ctx.styleMap) ctx.styleMap = defaultStyleMap;
  if (!ctx.bibliography) ctx.bibliography = {};
  try {
    // First perform basic document preprocessing and then, once complete
    // (and assuming no errors), continue by running the plugins
    // specified in the current context.
    pipeline(
      [
        pickTmp,
        unzip,
        contentTypes,
        fileTree,
        rels,
        docProps,
        styles,
        theme,
        numbering,
        settings,
        loadMainDocument,
        loadBibliography,
        loadFootnotes,
        walkDocument
      ],
      ctx,
      err => {
        if (err) {
          ctx.log.error(err);
          return callback(err);
        }
        try {
          // Run the requested plugins.
          pipeline(ctx.plugins || [], ctx, err => {
            if (err) ctx.log.error(err);
            callback(err, ctx);
          });
        } catch (e) {
          ctx.log.error(e);
          callback();
        }
      }
    );
  } catch (e) {
    ctx.log.error(e);
    callback();
  }
}
