// This function, imported on its own, will take a name (of an element or attribute) and an optional object mapping namespace prefixes to namespace URLs. If the name is a qualified name that matches one of the given prefixes, a `{ ns, ln }` object will be returned with the namespace and local name (ie. without prefix) for the given qualified name; otherwise it will just return `{ qn }` being the provided name.

module.exports = function qname(name, ns = {}) {
  let match = /^(\w+):(.+)/.exec(name);
  if (match && ns[match[1]]) return { ns: ns[match[1]], ln: match[2] };
  return { qn: name };
};
