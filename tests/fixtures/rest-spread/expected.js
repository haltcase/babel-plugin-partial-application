const maxOf = (..._spr) => {
  return Math.max(..._spr);
};

const sum = (a, b, c, d, e, f, g) => {
  return a + b + c + d + e + f + g;
};

const addAllToFive = (..._spr2) => {
  return sum(5, ..._spr2);
};

const argTypes = (..._spr3) => {
  return console.log(1, 'string', {}, Function, true, ..._spr3);
};