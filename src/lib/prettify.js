import prettier from 'prettier';
import xmlserializer from 'xmlserializer';

export default function prettify(htmlInput) {
  const xhtmlOut = xmlserializer
    .serializeToString(require('parse5').parse(htmlInput))
    .replace('<html xmlns="http://www.w3.org/1999/xhtml"><head/>', '')
    .replace('</html>', '');
  return prettier.format(
    `const jsx=( ${xhtmlOut
      .toString()
      .replace(/class/g, 'className')
      .replace(/rowspan/g, 'rowSpan')
      .replace(/colspan/g, 'colSpan')
      .replace(/&quot;/g, "'")
      .replace(/="{/g, '={{')
      .replace(/}"/g, '}}')})`,
    { singleQuote: true, parser: 'babylon' }
  );
}
