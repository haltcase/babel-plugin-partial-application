const something = [];
const foo = () => 42;
const H = class {};

const _ref = foo();

const _ref2 = new H();

const partial = (_a, _a2) => {
  return fn(_a, 1, _a2, true, null, 'some string', undefined, something, _ref, _ref2, () => {});
};

partial('hello', 'world');