const something = [];
const foo = () => 42;
const H = class {};

const partial = (_a, _a2) => {
  return fn(_a, 1, _a2, true, null, 'some string', undefined, something, foo(), new H(), () => {});
};

partial('hello', 'world');