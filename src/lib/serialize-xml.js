import { XMLSerializer } from 'xmldom';

export default function serializeXML(doc) {
  return new XMLSerializer().serializeToString(doc);
}
