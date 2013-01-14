/*jslint node: true */
'use strict';

/**
 * Require patsyHelpers from the library
 *
 * @var     Object
 * @source  patsy
 */
var patsyHelpers      = require('../lib/patsyHelpers');

var pjson = require('../package.json');

var colors = require('colors');

exports.nodeunit = {
  will_always_pass: function(test) {
    test.expect(1);
    test.ok(true, 'this had better work.');
    test.done();
  },
  check_package_json: function(test){

    test.equal('object', typeof pjson);
    test.done();
  },
  check_dependencies: function(test){

    console.log('\n');

    var fs = require('fs'),
      path = require('path'),
      module_pjson = '',
      module_pjson_path = '',
      module_pjson_abs_path = '';

    var check_modules = function(module){

      module_pjson_path     = '..' + path.sep + 'node_modules' + path.sep + module + path.sep + 'package.json';
      module_pjson_abs_path = path.resolve(__dirname, module_pjson_path);

      if(fs.existsSync(module_pjson_abs_path) && typeof require(module_pjson_abs_path) === 'object'){

        console.log('>> '.green + 'Module ' + module + ' found!');
      } else {

        throw new Error('Module ' + module + ' not found!');
      }
    };

    var testModules = function(module){
      check_modules(module);
    };

    for(var module in pjson.dependencies){
      if(pjson.dependencies.hasOwnProperty(module)){

        test.throws(
          testModules(module),
          Error,
          'Show fail for non existent module'
        );

      }
    }

    test.done();
  }
};
