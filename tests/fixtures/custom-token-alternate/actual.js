import __ from 'babel-plugin-partial-application'

// should not be transpiled
const foo1 = _.method().value > 10

// should be transpiled
const foo2 = __.method().value > 10