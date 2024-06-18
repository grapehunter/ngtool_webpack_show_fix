module.exports = function (source, map) {
  if (this.resourcePath.indexOf("node_modules") !== -1) {
    return this.callback(null, source, map);
  }
  console.log(`////////////${this.resourcePath}////////////`);
  console.log(source);
  console.log(`////////////////////////`);
  this.callback(null, source, map);
};
