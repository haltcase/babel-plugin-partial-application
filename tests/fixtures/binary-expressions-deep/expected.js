_a => {
  return _a.fn().bar().baz <= parseInt('10');
};

(_a2, _a3) => {
  return _a2.fn().foo >= _a3.bar.foo.baz();
};

const foo = _a4 => {
  return _a4.method().value > 10;
};

const bar = (_a5, _a6) => {
  return _a5.method().value === _a6.method().value();
};
const baz = (_a7, _a8) => {
  return _a7.method().value() === _a8.method().value;
};