const map = require('lodash.map')
const get = require('lodash.get')

const mapper = map(_, get(_, 'nested.key', 'default'))

const array = [
  { nested: { key: 'value' } },
  { nested: { something: '' } },
  { nested: { key: 'things' } }
]

const actual = mapper(array)
