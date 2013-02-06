/**
 * File for patsy's config file needs
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    index.js
 */
 /*jslint node: true */
'use strict';

/**
 * Require file system plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var fs            = require('fs');

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util          = require('util');

/**
 * Require path plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var path          = require('path');

/**
 * Require commander
 *
 * @var     Object
 */
var program       = require('commander');

/**
 * Require xtend plugin for deep object extending
 *
 * @var     Object
 */
var xtend         = require('xtend');

/**
 * Require json from the library
 *
 * @var     Object
 * @source  patsy
 */
var json          = require('./json/');

module.exports = function(opts){

  opts  = opts || {
    app_path  : path.resolve(__dirname,'..') + path.sep,
    verbose   : false
  };



  return {

    /**
     * Function to create a config file with given configuration object
     *
     * @param   Object    config
     * @param   Funciton  callback
     */
    create  : function(config,callback,patsy){

      patsy     = typeof config === 'function' && typeof callback === 'object' ? callback : patsy;
      callback  = typeof config === 'function' ? config : callback;
      config    = typeof config === 'function' ? undefined : config;




      if(typeof config !== 'undefined' && typeof callback !== 'undefined' && typeof callback === 'function'){

        try{

          config = this.bake(config);

          fs.writeFile( "patsy.json", JSON.stringify( config, null, 2 ) );

          util.print('[God]: Arthur, You may now continue with your quest!\n');

          setTimeout(function(){

            callback(patsy);

          },500);

        } catch(e){

          console.log('config.create',e);

          return false;
        }

      } else {

        program.prompt({

          "project": {
            "details" : {
              "name" : '[God]: What is the projects name? [' +  path.basename(path.resolve(path.dirname())) + ']: '
            }
          },
          "build" : {
            "js": '[God]: Where do you keep your JavaScript source files? [js/src/]: ',
            "min": {
              "dest" : '[God]: Where do you want to save your minified files? [js/min/]: '
            },
            "docs": {
              "dest" : '[God]: Where do you want to save your documentation files? [js/docs/]: '
            },
            "css" : {
              "src" : '[God]: Where do you keep your .less and .css files? [css/src/]: ',
              "dist" : '[God]: Where do you want to save your compiled css files? [css/dist/]: '
            },
            "dist": '[God]: Where do you want to save your baked files? [js/dist/]: ',
            "tmpl": {
              "src" : '[God]: I can currently offer you mustache compiling of templates, where is your *.mustache files? [js/mustache/]: '
            }
          }

        }, function(obj){

          util.print('[God]: I will now create a scripture you can follow\n');

          if(typeof callback !== 'undefined' && typeof callback === 'function'){
            try{
              if(program.verbose){
                util.puts('config.create: trying to create configuration file');
              }
              patsy.config.create(obj, callback, patsy);
            } catch(e){
              console.log('config.create: God creates scripture',e);
            }

          } else {
            util.print('[God]: Oh bugger..\n');

            if(program.verbose){
              util.puts('>> FAIL:'.red + ' Unable to created config file, callback not defined!');
            }
          }

        });
      }
    },
    ask : function(_patsy){
      var project;

      util.print('[Patsy]'.yellow + ': I\'m very sorry my Liege, I can\'t find any configuration here.. Let\'s go to Camelot instead!\n');
      util.print('[King Arthur]'.magenta + ': No! It\'s a silly, silly place! Stop that!\n');
      util.print('[Patsy]'.yellow + ': Sire, do you want to create your own configuration script? Listen to the Allmighty God:\n');

      program.prompt('[God]: Well, do you? [y/n/DEFAULT] (enter for default config): ', function(proceed){

        // Did he answer yes?
        if( proceed.search(/yes|y|j|ja/g) !== -1 ) {
          try{
           /**
            * Require project from the library
            *
            * @var     Object
            * @source  patsy
            */
           project = require('./project')(opts);

            _patsy.config.create(project.check,_patsy);
          } catch (e){
            console.log('config.ask:yes',e);
          }

        }
        // Wants default?
        else if( proceed.trim() === '' ) {
          try{
            /**
             * Require project from the library
             *
             * @var     Object
             * @source  patsy
             */
            project = require('./project')(opts);
            _patsy.config.create('default',project.check,_patsy);
          } catch (e){
            console.log('config.ask:default',e);
          }

        }
        // No valid input
        else {

          util.print('[King Arthur]'.magenta + ': I can\'t do that!? It\'s to silly! I\'m leaving, come Patsy! <sound of two half coconuts banging together fading out..>\n');

        }

      });
    },
    /**
     * Function to bake a config file with given configuration and config defaults
     *
     * @param   Object  config
     * @return  Object  config
     */
    bake : function(config){

      // Read default patsy config from patsy.default.json-file
      var _defaults  = JSON.parse(fs.readFileSync(opts.app_path + 'patsy.default.json'));

      // Extend objects with missing values
      _defaults.project.details = xtend(_defaults.project.details, {
        name      : path.basename(path.resolve(path.dirname()))
      });

      _defaults.project.environment = xtend(_defaults.project.environment, {
        abs_path  : path.resolve(path.dirname('config.JSON')) + path.sep,
        root      : path.basename(path.resolve(path.dirname('config.JSON')))
      });

      // Do we have an object? Extend with default configuration
      if(typeof config !== 'undefined' && typeof config === 'object'){


        var preservingOverwrite = function (target, newObject) {

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
              target[key] = preservingOverwrite(target[key], newObject[key]);

            } else {

              // The target does not have the property which we are are trying to add, so we simply add it
              // (there is nothing which we accidentally might overwrite)
              target[key] = newObject[key];

            }
          }

          return target;
        }

        config = preservingOverwrite(_defaults, config);

        return config;
      }
      // Return default config if that is chosen
      else if ( typeof config !== 'undefined' && typeof config === 'string' && config == 'default' ) {

        return _defaults;
      }
    },
    validate : function(config_json){


      return json.validate(config_json,'patsy.schema.json');

    },
    /**
     * Function to load patsy configuration
     *
     * @param   String  projectPath
     * @return  Object
     */
    load : function(project_path){

      if(opts.verbose){
        util.print('>>'.cyan + ' Loading project configuration...');
      }

      if(typeof project_path === 'undefined'){

        if(opts.verbose){
          util.print('NOTICE'.cyan + '\n');
          util.print('>>'.cyan + ' NOTICE'.yellow + ': No project path set, declaring path to CWD: '.white + String(process.cwd() + path.sep).inverse.cyan + '');
        }
        project_path = opts.project_path || process.cwd() + path.sep;

      } else {
        if(opts.verbose){
          util.print('OK'.green + '');
        }
      }

      var _path_to_config  = project_path + 'patsy.json';

      if(opts.verbose){
        util.print('\n>>'.cyan + ' Reading project configuration file: ' + _path_to_config + '...');
      }

      if(fs.existsSync(_path_to_config)){

        if(opts.verbose){
          util.print('OK'.green + '\n');
          util.print('>>'.green + ' File found, loading configuration...'.white + '');
        }
        // Read file synchroneously, parse contents as JSON and return config

        var _config_json;

        try{


          _config_json        = require(_path_to_config);
        } catch (e){

          if(opts.verbose){
            util.print('FAIL'.red);
          }
          console.log('>> EXCEPTION'.red + ':', e);
        }
        if(this.validate(_config_json)){

          if(opts.verbose){
            util.print('OK'.green + '\n');
          }

        } else {
          if(opts.verbose){
            util.print('FAIL'.red + '\n');
            util.puts('>> FAIL'.red + ': Configuration file is not valid!');
          }
          util.print('[Patsy]'.yellow + ': Sire! The configuration script is not valid! We have to turn around!\n');
          process.exit(1);
        }


        _config_json.project.environment.rel_path = path.relative(_config_json.appPath, _config_json.project.environment.abs_path) + path.sep;

        return _config_json;
      } else {

        if(opts.verbose){

          util.print('>> FAIL'.red + ': Loading project configuration: Could not find configuration file!'.white + '\n');
        }

        return undefined;
      }
    }
  };
};
