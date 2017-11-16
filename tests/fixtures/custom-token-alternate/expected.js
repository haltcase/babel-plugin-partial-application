

// should not be transpiled
const foo1 = _.method().value > 10;

// should be transpiled
const foo2 = (_ide) => {
  return _ide.method().value > 10;
};