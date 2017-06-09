_exp => {
  return `this is super ${_exp}`;
};

const greet = _exp2 => {
  return `Hello, ${_exp2}!`;
};
const greetProperty = _exp3 => {
  return `Hello, ${_exp3.name}!`;
};
const greetMethod = _exp4 => {
  return `Hello, ${_exp4.getName()}!`;
};

const foo = (_exp5, _exp6) => {
  return `${_exp5} ${true ? '' : '-'} ${_exp6}`;
};

// only the top `_` should be affected
const bar = _exp7 => {
  return `${_exp7.foo._.bar._}`;
};
const baz = _exp8 => {
  return `${_exp8.foo()._().bar._()}`;
};