const apply = (_pos2, _pos) => {
  return _pos(_pos2);
};

const applyWith = (_pos4, _pos3, _arg) => {
  return _pos3(_pos4, _arg, 'static');
};