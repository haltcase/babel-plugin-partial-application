({
  name: {
    foo: {
      bar: {
        baz: _arg = 'world'
      }
    }
  }
}) => {
  return hello(_arg);
};