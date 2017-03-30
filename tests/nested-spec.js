const test = require('ava')

const map = require('lodash.map')
const get = require('lodash.get')

test('nested partials result in the correct value', t => {
  const mapper = map(_, get(_, 'nested.key', 'default'))

  const array = [
    { nested: { key: 'value' } },
    { nested: { something: '' } },
    { nested: { key: 'things' } }
  ]

  const actual = mapper(array)
  const expected = ['value', 'default', 'things']

  t.deepEqual(actual, expected)
})
