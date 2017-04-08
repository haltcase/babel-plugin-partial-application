const a = _a => {
  return _a.deeply.nested.property.accessor;
};

const b = _a2 => {
  return _a2.deeply.nested.method().upIn.here;
};

const c = _a3 => {
  return _a3.nested.method('with', 'args', a);
};