const something = [];
const foo = () => 42;
const H = class {};

const _ref = (_obj2) => {
  return _obj2.method();
};

const _ref2 = fn((_obj3) => {
  return _obj3.foo();
});

const _ref3 = foo();

const _ref4 = new H();

const partial = (_arg, _arg2, _obj, ..._spr) => {
  return fn(_arg, 1, _arg2, _obj.property, true, null, _ref, 'some string', undefined, something, _ref2, _ref3, _ref4, () => {}, ..._spr);
};

partial('hello', 'world');