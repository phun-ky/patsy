/**
 * File for patsy's json needs
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    index.js
 */
 /*jslint node: true */
'use strict';

/**
 * Set up json variable to be exported
 *
 * @var   Object
 */
var json          = module.exports = {};

/**
 * Require path plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var path          = require('path');

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util          = require('util');


/**
 * Require file system plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var fs            = require('fs');

// Declare local verbose var
json.verbose      = false;

// Set patsy path
var patsy_path    = path.resolve(__dirname, '..', '..') + path.sep;

// Require validator from jsonchema module
json.validator    = require(patsy_path  + '/node_modules/jsonschema/lib/validator');

// The purpose of this method is to validate incoming json object with given schema
json.validate     = function(config_json, schema){

  // Get schema
  var _config_json_schema = fs.readFileSync(patsy_path + 'lib/json/' + schema, 'utf8');

  // Set schema
  var _schema             = JSON.parse(_config_json_schema);

  var _config             = config_json;

  var _v                  = new json.validator();

  var _result             = _v.validate(_config, _schema);

  // Let's see if we need to add trailing slash to abs_path (keeping grunt happy)
  // Also, check for _config.project, tests fail if we look for undefined config vars (as in patsy.example.json)
  if(_config.project){
    var _absPath = _config.project.environment.abs_path;
    if(_absPath.charAt(_absPath.length -1) !== path.sep){
      _config.project.environment.abs_path += path.sep;
    }
  }

  // No result?
  if(_result.length !== 0 || _config === undefined){

    if(json.verbose){

      console.log('>> FAIL: '.red + _result[0].property + ' ' + _result[0].message);
    }

    return false;

  }
  // Is valid?
  else {

    if(json.verbose){

      console.log('>> '.green + 'JSON configuration for ' + _config.project.details.name + ' is valid according to the ' + _schema.id + 'schema.\n');
    }

    return true;
  }


};
