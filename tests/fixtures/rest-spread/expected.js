const maxOf = (..._a) => {
  return Math.max(..._a);
};

const sum = (a, b, c, d, e, f, g) => {
  return a + b + c + d + e + f + g;
};

const addAllToFive = (..._a2) => {
  return sum(5, ..._a2);
};

const argTypes = (..._a3) => {
  return console.log(1, 'string', {}, Function, true, ..._a3);
};