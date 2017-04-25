(_bin, _bin2) => {
  return _bin === _bin2;
};

const foo = (_obj, _obj2) => {
  return _obj.trash === _obj2.treasure;
};

const nope = (_obj3, _obj4) => {
  return _obj3[1] !== _obj4[1];
};