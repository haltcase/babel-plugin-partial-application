const map = require('lodash.map');
const get = require('lodash.get');

const mapper = function (_a) {
  return map(_a, function (_a2) {
    return get(_a2, 'nested.key', 'default');
  });
};

const array = [{ nested: { key: 'value' } }, { nested: { something: '' } }, { nested: { key: 'things' } }];

const actual = mapper(array);