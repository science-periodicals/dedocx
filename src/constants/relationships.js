const ooRelationships = `http://schemas.openxmlformats.org/officeDocument/2006/relationships/`,
  packMeta = `http://schemas.openxmlformats.org/package/2006/relationships/metadata/`,
  OFFICE_DOCUMENT_REL = `${ooRelationships}officeDocument`,
  CUSTOM_PROPERTIES_REL = `${ooRelationships}custom-properties`,
  CUSTOM_XML_REL = `${ooRelationships}customXml`,
  CORE_PROPERTIES_REL = `${packMeta}core-properties`,
  EXTENDED_PROPERTIES_REL = `${ooRelationships}extended-properties`,
  THUMBNAIL_REL = `${packMeta}thumbnail`,
  STYLES_REL = `${ooRelationships}styles`,
  THEME_REL = `${ooRelationships}theme`,
  NUMBERING_REL = `${ooRelationships}numbering`,
  FOOTNOTES_REL = `${ooRelationships}footnotes`,
  ENDNOTES_REL = `${ooRelationships}endnotes`;

module.exports = {
  OFFICE_DOCUMENT_REL,
  CORE_PROPERTIES_REL,
  EXTENDED_PROPERTIES_REL,
  CUSTOM_PROPERTIES_REL,
  CUSTOM_XML_REL,
  THUMBNAIL_REL,
  STYLES_REL,
  THEME_REL,
  NUMBERING_REL,
  FOOTNOTES_REL,
  ENDNOTES_REL
};
