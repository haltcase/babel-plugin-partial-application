const map = require('lodash.map');
const get = require('lodash.get');

const mapper = _a => {
  return map(_a, _a2 => {
    return get(_a2, 'nested.key', 'default');
  });
};

const array = [{ nested: { key: 'value' } }, { nested: { something: '' } }, { nested: { key: 'things' } }];

const actual = mapper(array);