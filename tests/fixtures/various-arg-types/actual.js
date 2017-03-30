const something = []
const foo = () => 42
const H = class {}

const partial = fn(
  _,
  1,
  _,
  true,
  null,
  'some string',
  undefined,
  something,
  foo(),
  new H(),
  () => {}
)

partial('hello', 'world')