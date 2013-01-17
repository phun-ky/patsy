/**
 * Require file system plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var fs            = require('fs');

var utils = module.exports = {};

utils.isPathNegated = function(path){
  // if path is negated remove negate
  if(path.indexOf('!') === 0){
    return true;
  } else {
    return false;
  }
};



utils.doesPathExist = function(path){

  return fs.existsSync(path);
};


utils.isArray = function(value){


  return Array.isArray(value);
};
