`this is super ${_}`

const greet = `Hello, ${_}!`
const greetProperty = `Hello, ${_.name}!`
const greetMethod = `Hello, ${_.getName()}!`

const foo = `${_} ${true ? '' : '-'} ${_}`

// only the top `_` should be affected
const bar = `${_.foo._.bar._}`
const baz = `${_.foo()._().bar._()}`
