const pickBy = require('lodash/pickBy');
const once = require('once');
const asyncEach = require('async/each');
const shortid = require('shortid');

const { CUSTOM_XML_REL } = require('../constants/relationships');
const loadXML = require('../lib/load-xml');
const xpath = require('../lib/xpath');

// This exposes all the bibliography information extracted from word (see: http://www.datypic.com/sc/ooxml/s-shared-bibliography.xsd.html).
// dedocx outputs a bibliography context object containing the references.

// This is a reverse-engineering of the format produced by Word for built-in bibliography support.
// It is assisted in part by actual documentation, but at this point no attempt has been made to
// support it in full.
export default function word(ctx, callback) {
  callback = once(callback);

  try {
    const { mainDocumentRels } = ctx;

    if (!mainDocumentRels) {
      return process.nextTick(callback);
    }

    //the bibliography xml is in a customXml file. The path to this file is given in the main word Rels file (../customXml/item1.xml)
    const customXmlRels = mainDocumentRels.filter(
      rel => rel.type === CUSTOM_XML_REL
    );

    //there should only ever be 1 bibliography custom xml file, but we run asyncEach just in case the bibliography is split between multiple files.
    asyncEach(
      customXmlRels,
      (rel, cb) => {
        cb = once(cb);
        loadXML(rel.fullPath, (err, doc) => {
          //doc is the bibliography XML
          if (err) {
            ctx.log.error(err);
            return cb();
          }

          try {
            let select = xpath(doc);

            let xpathText = (xp, el) => {
              let res = select(xp, el);
              if (!res || !res.length) {
                return;
              }

              let txt = res[0].textContent;
              if (/^\d+$/.test(txt)) {
                return parseInt(txt, 10);
              }
              return txt;
            };

            // We extract Person or Corporate entities (both called 'Authors' in OOXML) by their type (see: http://www.datypic.com/sc/ooxml/t-bibliography_CT_AuthorType.html for a list of Types), following the structure:
            // {[bibliography:CT_AuthorType]: {Person: [{name: string, ...}], Corporate: string}
            // We collapse NameList, so only 'Person' remains. This is because NameList can only contain Persons (see: http://www.datypic.com/sc/ooxml/e-bibliography_NameList-1.html).
            // Persons can be a list of named strings, whereas Corporate entities are always a single string, and never a list (see: http://www.datypic.com/sc/ooxml/e-bibliography_Corporate-1.html).

            const extractPersonAndCorporate = (
              entityTypeElementName,
              source
            ) => {
              const entities = select(
                `./b:Author/${entityTypeElementName}//b:Person | ./b:Author/${entityTypeElementName}//b:Corporate`,
                source
              )
                .map(entity => {
                  if (entity.localName === 'Person') {
                    return {
                      Person: [
                        pickBy({
                          First: xpathText('./b:First', entity),
                          Middle: xpathText('./b:Middle', entity),
                          Last: xpathText('./b:Last', entity)
                        })
                      ]
                    };
                  }
                  if (entity.localName === 'Corporate') {
                    return pickBy({
                      Corporate: entity.textContent
                    });
                  }
                  return false;
                })
                .filter(Boolean);
              if (entities.length) {
                return entities;
              }
            };

            if (!select('//b:Sources').length) {
              return cb();
            }

            select('//b:Source').forEach(source => {
              // for bibliography XML:
              // console.log(
              //  xpathText('./b:Tag', source),
              //  new xmldom.XMLSerializer().serializeToString(source)
              // );

              const type = xpathText('./b:SourceType', source);

              const item = pickBy({
                Guid: xpathText('./b:Guid', source), //globally unique id (http://www.datypic.com/sc/ooxml/e-bibliography_Guid-1.html)
                LCID: xpathText('./b:LCID', source), //locale id (http://www.datypic.com/sc/ooxml/e-bibliography_LCID-1.html)
                RefOrder: xpathText('./b:RefOrder', source), //order of refs in the bibliography
                Tag: xpathText('./b:Tag', source) || shortid.generate(), //MSWord genereated short identifier for each reference

                SourceType: type || 'Misc', //set default type to Miscellaneous if there is none
                ThesisType: xpathText('./b:ThesisType', source),

                Title: xpathText('./b:Title', source),
                AlbumTitle: xpathText('./b:AlbumTitle', source),
                BroadcastTitle: xpathText('./b:BroadcastTitle', source),
                InternetSiteTitle: xpathText('./b:InternetSiteTitle', source),
                BookTitle: xpathText('./b:BookTitle', source),
                ShortTitle: xpathText('./b:ShortTitle', source),

                Author: extractPersonAndCorporate('b:Author', source),
                Editor: extractPersonAndCorporate('b:Editor', source),
                Translator: extractPersonAndCorporate('b:Translator', source),
                BookAuthor: extractPersonAndCorporate('b:BookAuthor', source),
                Composer: extractPersonAndCorporate('b:Composer', source),
                Director: extractPersonAndCorporate('b:Director', source),
                Interviewer: extractPersonAndCorporate('b:Interviewer', source),
                ProducerName: extractPersonAndCorporate(
                  'b:Interviewer',
                  source
                ),
                Artist: extractPersonAndCorporate('b:Artist', source),
                Conductor: extractPersonAndCorporate('b:Conductor', source),
                Performer: extractPersonAndCorporate('b:Performer', source),
                Writer: extractPersonAndCorporate('b:Writer', source),
                Interviewee: extractPersonAndCorporate('b:Interviewee', source),
                Compiler: extractPersonAndCorporate('b:Compiler', source),
                Inventor: extractPersonAndCorporate('b:Inventor', source),
                Reporter: extractPersonAndCorporate('b:Reporter', source),
                Counsel: extractPersonAndCorporate('b:Counsel', source),

                Edition: xpathText('./b:Edition', source),
                Publisher: xpathText('./b:Publisher', source),
                ConferenceName: xpathText('./b:ConferenceName', source),
                Distributor: xpathText('./b:Distributor', source),
                ProductionCompany: xpathText('./b:ProductionCompany', source),
                Broadcaster: xpathText('./b:Broadcaster', source),
                Station: xpathText('./b:Station', source),
                Theater: xpathText('./b:Theater', source),

                Department: xpathText('./b:Department', source),
                Institution: xpathText('./b:Institution', source),
                City: xpathText('./b:City', source),
                StateProvince: xpathText('./b:StateProvince', source),
                CountryRegion: xpathText('./b:CountryRegion', source),

                ChapterNumber: xpathText('./b:ChapterNumber', source),
                NumberVolumes: xpathText('./b:NumberVolumes', source),

                JournalName: xpathText('./b:JournalName', source),
                PeriodicalTitle: xpathText('./b:PeriodicalTitle', source),
                PublicationTitle: xpathText('./b:PublicationTitle', source),

                Comments: xpathText('./b:Comments', source),
                Issue: xpathText('./b:Issue', source),
                Court: xpathText('./b:Court', source),
                Pages: xpathText('./b:Pages', source),
                Medium: xpathText('./b:Medium', source),
                URL: xpathText('./b:URL', source),
                Version: xpathText('./b:Version', source),
                Volume: xpathText('./b:Volume', source),

                CaseNumber: xpathText('./b:CaseNumber', source),
                PatentNumber: xpathText('./b:PatentNumber', source),
                RecordingNumber: xpathText('./b:RecordingNumber', source),
                AbbreviatedCaseNumber: xpathText(
                  './b:AbbreviatedCaseNumber',
                  source
                ),

                Day: xpathText('./b:Day', source),
                Month: xpathText('./b:Month', source),
                Year: xpathText('./b:Year', source),

                //accessed dates (for online documents)
                DayAccessed: xpathText('./b:DayAccessed', source),
                MonthAccessed: xpathText('./b:MonthAccessed', source),
                YearAccessed: xpathText('./b:YearAccessed', source),

                //standard number (e.g., DOI, PMCID, ISBN, or other identifier)
                StandardNumber: xpathText('./b:StandardNumber', source)
              });

              ctx.bibliography[item.Tag] = item;
            });
          } catch (e) {
            ctx.log.error(e);
          }
          cb();
        });
      },
      err => {
        if (err) {
          ctx.log.error(err);
        }
        callback();
      }
    );
  } catch (e) {
    ctx.log.error(e);
    process.nextTick(callback);
  }
}
