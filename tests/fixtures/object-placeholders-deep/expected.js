const a = (_ide) => {
  return _ide.deeply.nested.property.accessor;
};

const b = (_ide2) => {
  return _ide2.deeply.nested.method().upIn.here;
};

const c = (_ide3) => {
  return _ide3.nested.method('with', 'args', a);
};

const d = (_ide4) => {
  return _ide4.unaffected.nested.placeholder.identifier._;
};