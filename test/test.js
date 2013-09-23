/*jslint node: true */
'use strict';

/**
 * Require patsy from the library
 *
 * @var     Object
 * @source  patsy
 */
var patsy      = require('../lib/patsy.js');

var pjson         = require('../package.json');
var defaultConfig = require('../patsy.default.json');
var exampelConfig = require('../patsy.example.json');

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util          = require('util');

var colors  = require('colors');
var path    = require('path');

exports.nodeunit = {
  will_always_pass: function(test) {
    test.expect(1);
    test.ok(true, 'this had better work.');
    test.done();
  },
  check_json: function(test){

    /**
     * Require json from the library
     *
     * @var     Object
     * @source  patsy
     */
    var json          = require('../lib/json/');

    test.expect(4);

    test.equal('object', typeof pjson);
    test.ok(json.validate(pjson,'patsy.schema.json'), 'package.json should be valid');
    test.ok(json.validate(defaultConfig,'patsy.schema.json'), 'patsy.default.json should be valid');
    test.ok(json.validate(exampelConfig,'patsy.schema.json'), 'patsy.example.json should be valid');

    test.done();
  },
  check_dependencies: function(test){

    var fs = require('fs'),
      path = require('path'),
      module_pjson = '',
      module_pjson_path = '',
      module_pjson_abs_path = '';

    var check_modules = function(module){

      module_pjson_path     = '..' + path.sep + 'node_modules' + path.sep + module + path.sep + 'package.json';
      module_pjson_abs_path = path.resolve(__dirname, module_pjson_path);

      if(fs.existsSync(module_pjson_abs_path) && typeof require(module_pjson_abs_path) === 'object'){

        //console.log(String('✓ Module ' + module + ' found!').green);
      } else {

        throw new Error('Module ' + module + ' not found!');
      }
    };

    var testModules = function(module){
      check_modules(module);
    };

    test.expect(pjson.dependencies.length);

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
  },
  check_grunt_run: function(test){


    test.done();
  },
  check_load_config_fails: function(test){

    test.expect(1);

    var _cfg;


    /**
     * Require config from the library
     *
     * @var     Object
     * @source  patsy
     */
    var config      = require('../lib/config')({
      verbose: false
    });

    _cfg = config.load();       

    test.ok(typeof _cfg === 'undefined' || typeof _cfg !== 'object', 'Configuration file should not be found here, remove config file from patsy directory!');



    test.done();

  },
  test_project_load_config: function(test){
    // We've created a "test" project within this test folder to make sure patsy would operate as normal on a new project

    var _cfg;


    /**
     * Require config from the library
     *
     * @var     Object
     * @source  patsy
     */
    var config      = require('../lib/config')({
      verbose: false
    });

    _cfg = config.load(path.normalize(process.cwd() + '/test/inc/project_folder/'));    

    test.ok(typeof _cfg !== 'undefined' || typeof _cfg === 'object', 'Configuration file should be loaded!');

    test.done();
  }
};
