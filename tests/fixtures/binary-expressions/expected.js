(_ide, _arg) => {
  return (_ide2) => {
    return _ide + _ide2 + _arg;
  };
};

(_ide3) => {
  return _ide3 + 4;
};

(_ide4, _arg2) => {
  return (_ide5) => {
    return _ide4 + '(' + _ide5 + ')' + _arg2;
  };
};

foo.filter((_ide6) => {
  return _ide6 % 2 === 0;
});

(_bin) => {
  return foo.filter(_bin === true);
};

(_bin3, _bin4) => {
  return foo.reduce(_bin3 + _bin4);
};