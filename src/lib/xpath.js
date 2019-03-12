let { createExpression, XPathResult } = require('xpath'),
  { prefixMap } = require('../constants/ns'),
  cache = {};

// NOTE: this could be turned into a PR or module. The gains for dedocx on a typical document were
// 14s -> 18ms for the most XPath-intensive code-path.

module.exports = function makeXPath(defaultContext) {
  return (q, context) => {
    let expression = cache[q];
    if (!expression) {
      let resolver = {
        mappings: prefixMap || {},
        lookupNamespaceURI: pfx => prefixMap[pfx]
      };
      expression = createExpression(q, resolver);
      cache[q] = expression;
    }
    let result = expression.evaluate(
      context || defaultContext,
      XPathResult.ANY_TYPE
    );
    if (result.resultType === XPathResult.STRING_TYPE)
      return result.stringValue;
    if (result.resultType === XPathResult.NUMBER_TYPE)
      return result.numberValue;
    if (result.resultType === XPathResult.BOOLEAN_TYPE)
      return result.booleanValue;
    return result.nodes;
  };
};
