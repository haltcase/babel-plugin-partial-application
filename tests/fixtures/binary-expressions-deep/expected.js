_obj => {
  return _obj.fn().bar().baz <= parseInt('10');
};

(_obj2, _obj3) => {
  return _obj2.fn().foo >= _obj3.bar.foo.baz();
};

const foo = _obj4 => {
  return _obj4.method().value > 10;
};

const bar = (_obj5, _obj6) => {
  return _obj5.method().value === _obj6.method().value();
};
const baz = (_obj7, _obj8) => {
  return _obj7.method().value() === _obj8.method().value;
};