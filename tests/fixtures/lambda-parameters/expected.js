(_cal) => {
  return [1, 2, 3].map(_cal.toString());
};

const people = [{ name: 'Jeff' }, { name: 'Karen' }, { name: 'Genevieve' }];

console.log((_mem) => {
  return people.map(_mem.name);
});