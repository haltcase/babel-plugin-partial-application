
// importing / requiring the plugin is optional

const log = (..._spr) => {
  return console.log(..._spr);
};

const people = [{ name: 'Harold' }, { name: 'Karen' }, { name: 'Jennifer' }, { name: 'Arlene' }];

const names = people.map((_mem) => {
  return _mem.name;
}).filter((_cal) => {
  return _cal.includes('en');
}).sort((_bin, _bin2) => {
  return _bin.length < _bin2.length;
}).reduce((_ide, _arg) => {
  return `${_ide}, ${_arg}`;
});

log(names);