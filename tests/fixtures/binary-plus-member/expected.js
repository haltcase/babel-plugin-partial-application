foo.filter(_obj => {
  return _obj.level > 0;
});
foo.filter(_obj2 => {
  return _obj2.getName().length > 10;
});
foo.filter(_obj3 => {
  return _obj3.prop._ === 2;
});