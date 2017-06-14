const apply = (_pos2, _pos) => {
  return _pos(_pos2);
};

const applyWith = (_pos4, _pos3, _arg) => {
  return _pos3(_pos4, _arg, 'static');
};

const withProperty = (_pos6, _pos5) => {
  return _pos5(_pos6.foo);
};