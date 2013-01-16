var utils = module.exports = {};

utils.isPathNegated = function(path){
  // if path is negated remove negate
  if(path.indexOf('!') === 0){
    return true;
  } else {
    return false;
  }
};
