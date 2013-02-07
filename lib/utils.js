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


utils.deepExtend = function (target, newObject) {

	var func = function (target, newObject) {
	  // clone target
	  target = JSON.parse(JSON.stringify(target));

	  // If the target is a value, then we just assign the new value
	  if (typeof target !== 'object') {
	    return newObject;
	  }

	  // We treat arrays as we treat values
	  // note that (typeof [1, 2, 4] === 'object') === true
	  if (Array.isArray(target)) {
	    return newObject;
	  }

	  var keys = Object.keys(newObject);

	  // We are trying to add an empty object to another object, so we simply return target
	  if (keys.length === 0) {
	    return target;
	  }

	  // If there are no properties to preserve, then we don't
	  // (target is an empty object)
	  if (Object.keys(target).length === 0) {
	    return newObject;
	  }

	  // There are properties on target object
	  for (var i = 0; i < keys.length; i++) {

	    var key = keys[i];

	    if (target[key]) {

	      // If target already have the property which we are trying to add, we use recursion
	      // (in order to preserve possible properties on the property, which we dont want to accidentally remove)
	      target[key] = func(target[key], newObject[key]);

	    } else {

	      // The target does not have the property which we are are trying to add, so we simply add it
	      // (there is nothing which we accidentally might overwrite)
	      target[key] = newObject[key];

	    }
	  }

	  return target;
	};

	return func(target, newObject);
};
