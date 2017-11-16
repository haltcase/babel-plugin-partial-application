(_bin) => {
  return foo.filter(_bin.level > 0);
};
(_bin3) => {
  return foo.filter(_bin3.getName().length > 10);
};
(_bin5) => {
  return foo.filter(_bin5.prop._ === 2);
};