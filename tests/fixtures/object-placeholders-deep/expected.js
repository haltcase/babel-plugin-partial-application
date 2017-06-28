const a = (_obj) => {
  return _obj.deeply.nested.property.accessor;
};

const b = (_obj2) => {
  return _obj2.deeply.nested.method().upIn.here;
};

const c = (_obj3) => {
  return _obj3.nested.method('with', 'args', a);
};

const d = (_obj4) => {
  return _obj4.unaffected.nested.placeholder.identifier._;
};