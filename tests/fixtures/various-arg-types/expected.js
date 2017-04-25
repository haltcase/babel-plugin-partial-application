const something = [];
const foo = () => 42;
const H = class {};

const _ref = foo();

const _ref2 = new H();

const partial = (_arg, _arg2) => {
  return fn(_arg, 1, _arg2, true, null, 'some string', undefined, something, _ref, _ref2, () => {});
};

partial('hello', 'world');