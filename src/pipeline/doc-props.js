let asyncEach = require('async/each'),
  { readFile } = require('fs-extra'),
  { join } = require('path'),
  {
    CORE_PROPERTIES_REL,
    EXTENDED_PROPERTIES_REL,
    CUSTOM_PROPERTIES_REL,
    THUMBNAIL_REL
  } = require('../constants/relationships'),
  loadXML = require('../lib/load-xml'),
  xpath = require('../lib/xpath');

module.exports = function docProps(ctx, callback) {
  try {
    let rootRels =
      (ctx.fileTree && ctx.fileTree['/'] && ctx.fileTree['/'].rels) || [];
    ctx.docProps = { custom: {} };
    asyncEach(
      rootRels,
      (rel, cb) => {
        try {
          if (
            rel.type === CORE_PROPERTIES_REL ||
            rel.type === EXTENDED_PROPERTIES_REL
          ) {
            loadXML(join(ctx.tmpPath, rel.target), (err, doc) => {
              if (err) {
                ctx.log.error(err);
                return cb();
              }
              try {
                let select = xpath(doc);
                // NOTE: we don't process ep:HeadingPairs and ep:TitlesOfParts as they seem
                // redundant with the content of the file.
                [
                  ['dc:title', 'title'],
                  ['dc:subject', 'subject'],
                  ['dc:creator', 'creator'],
                  ['cp:keywords', 'keywords'],
                  ['dc:description', 'description'],
                  ['cp:lastModifiedBy', 'lastModifiedBy'],
                  ['cp:revision', 'revision', 'integer'],
                  ['cp:lastPrinted', 'lastPrinted'],
                  ['dcterms:created', 'created'],
                  ['dcterms:modified', 'modified'],
                  ['cp:category', 'category'],
                  ['ep:Template', 'wordTemplate'],
                  ['ep:TotalTime', 'totalTime', 'integer'],
                  ['ep:Pages', 'numberOfPages', 'integer'],
                  ['ep:Words', 'numberOfWords', 'integer'],
                  ['ep:Characters', 'numberOfCharacters', 'integer'],
                  ['ep:Lines', 'numberOfLines', 'integer'],
                  ['ep:Paragraphs', 'numberOfParagraphs', 'integer'],
                  [
                    'ep:CharactersWithSpaces',
                    'numberOfCharactersWithSpaces',
                    'integer'
                  ],
                  ['ep:Application', 'applicationName'],
                  ['ep:DocSecurity', 'docSecurity'],
                  ['ep:ScaleCrop', 'scaleCrop', 'boolean'],
                  ['ep:Manager', 'manager'],
                  ['ep:Company', 'company'],
                  ['ep:LinksUpToDate', 'linksUpToDate', 'boolean'],
                  ['ep:SharedDoc', 'sharedDoc', 'boolean'],
                  ['ep:HyperlinkBase', 'hyperlinkBase'],
                  ['ep:HyperlinksChanged', 'hyperlinksHaveChanged', 'boolean'],
                  ['ep:AppVersion', 'applicationVersion']
                ].forEach(([match, key, type]) => {
                  let el = select(`//${match}`)[0];
                  if (!el) return;
                  let val = el.textContent;
                  if (!val) return;
                  if (type === 'integer') val = parseInt(val, 10);
                  else if (type === 'boolean') val = val === 'true';
                  ctx.docProps[key] = val;
                });
              } catch (e) {
                ctx.log.error(e);
              }
              cb();
            });
          } else if (rel.type === CUSTOM_PROPERTIES_REL) {
            loadXML(join(ctx.tmpPath, rel.target), (err, doc) => {
              if (err) {
                ctx.log.error(err);
                return cb();
              }
              try {
                let select = xpath(doc);
                select('//custom:property').forEach(prop => {
                  let name = prop.getAttribute('name');
                  if (!name) return;
                  let vt = select('./vt:*', prop)[0];
                  if (!vt) return;
                  let val = vt.textContent,
                    ln = vt.localName;
                  if (!val) return;
                  if (ln === 'i4') val = parseInt(val, 10);
                  else if (ln === 'bool') val = val === 'true';
                  ctx.docProps.custom[name] = val;
                });
              } catch (e) {
                ctx.log.error(e);
              }
              cb();
            });
          } else if (rel.type === THUMBNAIL_REL) {
            readFile(join(ctx.tmpPath, rel.target), (err, buf) => {
              if (err) {
                ctx.log.error(err);
                return cb();
              }
              try {
                let file = ctx.fileTree[rel.packagePath];
                if (!file || !file.mediaType) return;
                ctx.docProps.thumbnail = `data:${
                  file.mediaType
                };base64,${buf.toString('base64')}`;
              } catch (e) {
                ctx.log.error(e);
              }
              cb();
            });
          } else cb();
        } catch (e) {
          ctx.log.error(e);
          cb();
        }
      },
      err => {
        if (err) ctx.log.error(err);
        callback();
      }
    );
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
};
