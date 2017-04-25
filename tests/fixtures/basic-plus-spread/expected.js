const maxWith = (_arg, ..._spr) => {
  return Math.max(_arg, ..._spr);
};

const maxWithGap = (_arg2, ..._spr2) => {
  return Math.max(_arg2, 5, ..._spr2);
};