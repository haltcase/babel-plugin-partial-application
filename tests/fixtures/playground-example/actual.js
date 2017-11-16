const _ = require('babel-plugin-partial-application')
// importing / requiring the plugin is optional

const log = console.log(..._)

const people = [
  { name: 'Harold' },
  { name: 'Karen' },
  { name: 'Jennifer' },
  { name: 'Arlene' }
]

const names = people
  .map(_.name)
  .filter(_.includes('en'))
  .sort(_.length < _.length)
  .reduce(`${_}, ${_}`)

log(names)
