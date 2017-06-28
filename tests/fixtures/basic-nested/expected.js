const map = require('lodash.map');
const get = require('lodash.get');

const mapper = (_arg) => {
  return map(_arg, (_arg2) => {
    return get(_arg2, 'nested.key', 'default');
  });
};

const array = [{ nested: { key: 'value' } }, { nested: { something: '' } }, { nested: { key: 'things' } }];

const actual = mapper(array);