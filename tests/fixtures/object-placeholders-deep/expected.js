const a = _obj => {
  return _obj.deeply.nested.property.accessor;
};

const b = _obj2 => {
  return _obj2.deeply.nested.method().upIn.here;
};

const c = _obj3 => {
  return _obj3.nested.method('with', 'args', a);
};