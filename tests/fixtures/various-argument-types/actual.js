const something = []
const foo = () => 42
const H = class {}

const partial = fn(
  _,
  1,
  _,
  _.property,
  true,
  null,
  _.method(),
  'some string',
  undefined,
  something,
  fn(_.foo()),
  foo(),
  new H(),
  () => {},
  ..._
)

partial('hello', 'world')