(_ide) => {
  return `this is super ${_ide}`;
};

const greet = (_ide2) => {
  return `Hello, ${_ide2}!`;
};
const greetProperty = (_ide3) => {
  return `Hello, ${_ide3.name}!`;
};
const greetMethod = (_ide4) => {
  return `Hello, ${_ide4.getName()}!`;
};

const foo = (_ide5, _arg) => {
  return `${_ide5} ${true ? '' : '-'} ${_arg}`;
};

// only the top `_` should be affected
const bar = (_ide6) => {
  return `${_ide6.foo._.bar._}`;
};
const baz = (_ide7) => {
  return `${_ide7.foo()._().bar._()}`;
};