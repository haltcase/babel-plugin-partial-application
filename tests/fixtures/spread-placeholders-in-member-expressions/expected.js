(_ide, ..._spr) => {
  return _ide.foo(..._spr);
};

(_ide3, _ide2, ..._spr2) => {
  return _ide3.foo(_ide2, ..._spr2);
};

(_ide4, _mem, ..._spr3) => {
  return _ide4.foo(_mem.bar, ..._spr3);
};