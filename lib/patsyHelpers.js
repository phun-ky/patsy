var patsyHelpers = module.exports = {};


patsyHelpers.loadPatsyConfigInCurrentProject = function(path){

  if(typeof path === 'undefined') var path = '';

  // default encoding is utf8
  if (typeof (encoding) == 'undefined') encoding = 'utf8';

  // Read file synchroneously, parse contents as JSON and return config
  JSON.parse(fs.readFileSync(path + 'patsy.JSON', encoding));
}