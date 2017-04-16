(_b, _b2, _b3) => {
  return _b + _b2 + _b3;
};

_b4 => {
  return _b4 + 4;
};

(_b5, _b6, _b7) => {
  return _b5 + '(' + _b6 + ')' + _b7;
};

foo.filter(_b8 => {
  return _b8 % 2 === 0;
});

foo.filter(_b9 => {
  return _b9 === true;
});

foo.reduce((_b10, _b11) => {
  return _b10 + _b11;
});