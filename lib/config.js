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

var glob = require("glob");

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



          callback(patsy);

        } catch(e){

          console.log('config.create',e);

          return false;
        }

      } else {

          patsy.config.generateDefaultConfiguration();

          callback(patsy);

      }
    },
    ask : function(patsy){
      var project,
      _questions = [],
      _helptexts = [];

      if(!patsy.scripture.opts.scripture){

        _questions.push('Would you like to make a configuration script? [y/n/DEFAULT] (enter for default config): ');

        _helptexts.push('Making configuration! If you need to change it, see the wiki for help https://github.com/phun-ky/patsy/wiki/Configuration\n');

      } else {

        _questions.push('[Patsy]'.cyan + ': Would you like me to make a configuration script for you Sire? [y/n/DEFAULT] (enter for default config): ');

        _helptexts.push('[Patsy]'.cyan + ': Yes my Liege! If you need to change it Sire, see the wiki for help https://github.com/phun-ky/patsy/wiki/Configuration\n');

      }

      patsy.scripture.print('[Patsy]'.yellow + ': I\'m very sorry my Liege, I can\'t find any configuration here.. Let\'s go to Camelot instead!\n');
      patsy.scripture.print('[King Arthur]'.magenta + ': No! It\'s a silly, silly place! Stop that!\n');

      program.prompt(_questions[0], function(proceed){

        // Did he answer yes? (or DEFAULT)
        if (( proceed.search(/yes|y|j|ja/g) !== -1 ) ||
            (( proceed.trim() === '' ))) {

          util.print(_helptexts[0]);

          try {

           /**
            * Require project from the library
            *
            * @var     Object
            * @source  patsy
            */
           project = require('./project')(opts);

            patsy.config.create(project.check,patsy);

          } catch (e){

            console.log('config.ask:yes',e);

          }

        }
        // Did he answer no?
        else if( proceed.search(/no|n|nei/g) !== -1 ) {

          patsy.scripture.print('[Patsy]'.cyan + ': Oh well, you can write it yourself I guess... For help, see https://github.com/phun-ky/patsy/wiki/Configuration\n');
          patsy.scripture.print('[King Arthur]'.magenta + ': I shall write the Script of Configuration with piety and wisdom! \n');
          patsy.scripture.print('[Patsy]'.cyan + ': <shrugs> \n');

          process.exit(1);

        }
        // No valid input
        else {

          patsy.utils.fail('No valid input, exiting..')
          patsy.scripture.print('[King Arthur]'.magenta + ': I can\'t do that!? It\'s to silly! I\'m leaving, come Patsy! <sound of two half coconuts banging together fading out..>\n');

          process.exit();

        }

      });
    },
    searchForConfigFile : function(patsy){

      var _project_path = opts.abs_path || opts.project_path || process.cwd() + path.sep;
      var _path_to_config;
      var _tmp_config;
      var _error;

      var _path_to_return = false;

      glob('**/**/patsy.json', {
        cwd : _project_path,
        nonull: true,
        sync: true
      },function(er, files){

        _error = er;


        if(
          er === null
        ){

          var _fullPath;

          files.forEach(function(file){

            _fullPath = _project_path + file;

            if( fs.existsSync( _fullPath ) ){

              _tmp_config = require( _fullPath );

              if( typeof _tmp_config.project.environment.abs_path !== 'undefined'){

                if( path.normalize( path.dirname( _fullPath ) + path.sep ) == _tmp_config.project.environment.abs_path){

                  _path_to_return = path.normalize( _fullPath );


                }

              }

            }

          });

        }

      });

      if(_path_to_return){

        return _path_to_return;

      } else {

        _error = _error ===  null ? 'Proper configuration file not found!' : _error;

        if(opts.verbose){          

          patsy.utils.fail();
          patsy.utils.fail('Proper configuration file not found!');
          console.log('>> EXCEPTION'.red, _error);

        } 
        
      }

    },
    validate : function(config_json){


      return json.validate(config_json,'patsy.schema.json');

    },
    /**
     * Function to load patsy configuration
     *
     * @param   Object  patsy
     * @param   String  projectPath
     * @return  Object
     */
    load : function(patsy, project_path){

      if(opts.verbose){

        util.print('>>'.cyan + ' Loading project configuration...');

      }

      if(typeof project_path === 'undefined'){        

        if(opts.verbose){

          patsy.utils.notice();
          patsy.utils.notice('No project path set, declaring path to CWD: '.white + String(process.cwd() + path.sep).inverse.cyan + '');

        }

        project_path = opts.project_path || process.cwd() + path.sep;

      } else {

        if(opts.verbose){

          patsy.utils.ok();

        }

      }

      var _path_to_config  = project_path + 'patsy.json';

      if(opts.verbose){

        util.print('>>'.cyan + ' Reading project configuration file: ' + _path_to_config.inverse.cyan + '...\n');

      }

      if(!fs.existsSync(_path_to_config)){

        patsy.utils.notice();

        if(opts.verbose){
          patsy.utils.notice('Configuration file not found here, looking elsewhere: ' + _path_to_config.inverse.cyan + '...\n');
        }

        patsy.scripture.print('[Patsy]'.yellow + ': <stumbling forward>\n');

        _path_to_config = this.searchForConfigFile(patsy);


      }

      if(fs.existsSync(_path_to_config)){

        if(opts.verbose){
          
          patsy.utils.ok('File found here: ' + _path_to_config.inverse.cyan);
          util.print('>>'.cyan + ' Loading project configuration...');
          
        }

        // Read file synchroneously, parse contents as JSON and return config

        var _config_json;

        try{

          _config_json        = require(_path_to_config);

        } catch (e){

          patsy.utils.fail();

        }

        if(this.validate(_config_json)){

          if(opts.verbose){
            
            patsy.utils.ok();

          }

        } else {

          if(opts.verbose){
            
            patsy.utils.fail('Configuration file is not valid!');

          }

          patsy.scripture.print('[Patsy]'.yellow + ': Sire! The configuration script is not valid! We have to turn around!\n');
          process.exit(1);

        }


        _config_json.project.environment.rel_path = path.relative(_config_json.appPath || '', _config_json.project.environment.abs_path) + path.sep;

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
    generateDefaultConfiguration : function () {
      var defaultConfig = JSON.parse(fs.readFileSync(__dirname + '/../patsy.default.json', 'utf8'));

      var projectSpecificSettings = {
        "project": {
          "details" : {
            "name" : path.basename(process.cwd())
          },
          "environment": {
            "root" : path.basename(process.cwd()),
            "abs_path": process.cwd() + path.sep
          }
        }
      };

      var almostDefaultConfig = require('./utils').deepExtend(defaultConfig, projectSpecificSettings);

      almostDefaultConfig = JSON.stringify(almostDefaultConfig, null, 2);

      fs.writeFileSync("patsy.json", almostDefaultConfig);

    }
  };
};
