module.exports = function renameElement($el, name) {
  if (!$el) return;
  if ($el.localName === name) return $el;
  let $new = $el.ownerDocument.createElement(name);
  for (let i = 0; i < $el.attributes.length; i++) {
    let at = $el.attributes[i];
    $new.setAttribute(at.name, at.value);
  }
  while ($el.hasChildNodes()) $new.appendChild($el.firstChild);
  $el.parentNode.replaceChild($new, $el);
  return $new;
};
