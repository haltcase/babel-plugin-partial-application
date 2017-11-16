const something = [];
const foo = () => 42;
const H = class {};

const _ref = foo();

const _ref2 = new H();

const partial = (_ide, _ide2, _mem, _cal, ..._spr) => {
  return fn(_ide, 1, _ide2, _mem.property, true, null, _cal.method(), 'some string', undefined, something, (_cal2) => {
    return fn(_cal2.foo());
  }, _ref, _ref2, () => {}, ..._spr);
};

partial('hello', 'world');