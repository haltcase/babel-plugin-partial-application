(_obj, ..._spr) => {
  return _obj.foo(..._);
};

(_obj2, _arg, ..._spr2) => {
  return _obj2.foo(_arg, ..._spr2);
};

(_obj3, _obj4) => {
  return _obj3.foo(_obj4.bar, ..._);
};