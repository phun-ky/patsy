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

          fs.writeFileSync( "patsy.json", JSON.stringify( config, null, 2 ) );

          util.print('[God]: Arthur, You may now continue with your quest!\n');

          callback(patsy);

        } catch(e){

          console.log('config.create',e);

          return false;
        }

      } else {

          patsy.config.generateDefaultConfiguration(patsy);

          callback(patsy);

      }
    },
    ask : function(_patsy){
      var project;

      util.print('[Patsy]'.yellow + ': I\'m very sorry my Liege, I can\'t find any configuration here.. Let\'s go to Camelot instead!\n');
      util.print('[King Arthur]'.magenta + ': No! It\'s a silly, silly place! Stop that!\n');

      program.prompt('[God]: Would you like me to serve Patsy with the default configuration (patsy.default.json)? [y/n/DEFAULT] (enter for default config): ', function(proceed){

        // Did he answer yes? (or DEFAULT)
        if (( proceed.search(/yes|y|j|ja/g) !== -1 ) ||
            (( proceed.trim() === '' ))) {

          util.print('[God]: Giving the defualt configuration to Patsy. If you need to change it, see the wiki for help https://github.com/phun-ky/patsy/wiki/Configuration\n');
          
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
        // Did he answer no?
        else if( proceed.search(/no|n|nei/g) !== -1 ) {

          util.print('[God]: Write a valid patsy.json configuration. For help, see https://github.com/phun-ky/patsy/wiki/Configuration\n');
          util.print('[King Arthur]'.magenta + ': <insert scripture here - i have no imagination! ;) - Magnus> \n');
          process.exit();

        }
        // No valid input
        else {

          util.print('[King Arthur]'.magenta + ': I can\'t do that!? It\'s to silly! I\'m leaving, come Patsy! <sound of two half coconuts banging together fading out..>\n');
          process.exit();

        }

      });
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
    },
    /**
     * Generates a default patsy.json configuration file in the root of the current project.
     *
     * @var     Object
     */
    generateDefaultConfiguration : function (_patsy) {
      var defaultConfig = JSON.parse(fs.readFileSync(__dirname + '/../patsy.default.json', 'utf8'));

          var projectSpecificSettings = {
            "project": {
              "environment": {
                "root" : path.basename(path.resolve(path.dirname('config.JSON'))),
                "abs_path": path.resolve(path.dirname('config.JSON')) + path.sep
              }
            }
          };

          var almostDefaultConfig = _patsy.utils.deepExtend(defaultConfig, projectSpecificSettings);

          almostDefaultConfig = JSON.stringify(almostDefaultConfig, null, 2);

          fs.writeFileSync("patsy.json", almostDefaultConfig);

          util.print('[God]: Arthur, You may now continue with your quest!\n');
    }
  };
};
