let { W_NS } = require('../constants/ns');

exports.boolean = function boolean(el, attrName = 'val', defaultValue) {
  if (!el.hasAttributeNS(W_NS, attrName)) return defaultValue;
  let val = el.getAttributeNS(W_NS, attrName).toLowerCase();
  return val === 'true' || val === 'on' || val === '1';
};

exports.string = function string(el, attrName = 'val', defaultValue) {
  if (!el.hasAttributeNS(W_NS, attrName)) return defaultValue;
  return el.getAttributeNS(W_NS, attrName);
};

exports.number = function number(el, attrName = 'val', defaultValue) {
  if (!el.hasAttributeNS(W_NS, attrName)) return defaultValue;
  return parseFloat(el.getAttributeNS(W_NS, attrName));
};

exports.enums = function enums(el, attrName = 'val', values, defaultValue) {
  if (!el.hasAttributeNS(W_NS, attrName)) return defaultValue;
  let val = el.getAttributeNS(W_NS, attrName);
  if (!val || !~values.indexOf(val)) return defaultValue;
  return val;
};
