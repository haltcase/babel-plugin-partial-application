const maxOf = Math.max(..._)

const sum = (a, b, c, d, e, f, g) => {
  return a + b + c + d + e + f + g
}

const addAllToFive = sum(5, ..._)

const argTypes = console.log(1, 'string', {}, Function, true, ..._)