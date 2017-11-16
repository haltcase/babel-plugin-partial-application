const map = require('lodash.map');
const get = require('lodash.get');

const mapper = (_ide) => {
  return map(_ide, (_ide2) => {
    return get(_ide2, 'nested.key', 'default');
  });
};

const array = [{ nested: { key: 'value' } }, { nested: { something: '' } }, { nested: { key: 'things' } }];

const actual = mapper(array);