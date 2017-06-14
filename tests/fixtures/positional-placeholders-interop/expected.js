const isObjectPropertyNaN = (_pos) => {
  return _pos.length !== _pos.length;
};

const getNameLengthAsString = (_pos2) => {
  return _pos2.name.length.toString();
};

const positionalWithSpread = (_pos3, ..._spr) => {
  return fn(_pos3, ..._spr);
};

const multiplePlaceholders = (_pos4, _arg, _arg2, _obj, ..._spr2) => {
  return fn(_arg, _arg2, _pos4, _obj.name._, ..._spr2);
};