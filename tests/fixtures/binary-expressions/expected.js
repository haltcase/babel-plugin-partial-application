(_bin, _bin2, _bin3) => {
  return _bin + _bin2 + _bin3;
};

(_bin4) => {
  return _bin4 + 4;
};

(_bin5, _bin6, _bin7) => {
  return _bin5 + '(' + _bin6 + ')' + _bin7;
};

foo.filter((_bin8) => {
  return _bin8 % 2 === 0;
});

foo.filter((_bin9) => {
  return _bin9 === true;
});

foo.reduce((_bin10, _bin11) => {
  return _bin10 + _bin11;
});