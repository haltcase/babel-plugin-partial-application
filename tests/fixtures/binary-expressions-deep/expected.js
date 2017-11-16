(_ide) => {
  return _ide.fn().bar().baz <= parseInt('10');
};

(_ide2, _ide3) => {
  return _ide2.fn().foo >= _ide3.bar.foo.baz();
};

const foo = (_ide4) => {
  return _ide4.method().value > 10;
};

const bar = (_ide5, _ide6) => {
  return _ide5.method().value === _ide6.method().value();
};
const baz = (_ide7, _ide8) => {
  return _ide7.method().value() === _ide8.method().value;
};