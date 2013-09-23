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
    ask : function(_patsy){
      var project;

      util.print('[Patsy]'.yellow + ': I\'m very sorry my Liege, I can\'t find any configuration here.. Let\'s go to Camelot instead!\n');
      util.print('[King Arthur]'.magenta + ': No! It\'s a silly, silly place! Stop that!\n');

      program.prompt('[Patsy]'.cyan + ': Would you like me to make a configuration script for you Sire? [y/n/DEFAULT] (enter for default config): ', function(proceed){

        // Did he answer yes? (or DEFAULT)
        if (( proceed.search(/yes|y|j|ja/g) !== -1 ) ||
            (( proceed.trim() === '' ))) {

          util.print('[Patsy]'.cyan + ': Yes my Liege! If you need to change it Sire, see the wiki for help https://github.com/phun-ky/patsy/wiki/Configuration\n');

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

          util.print('[Patsy]'.cyan + ': Oh well, you can write it yourself I guess... For help, see https://github.com/phun-ky/patsy/wiki/Configuration\n');
          util.print('[King Arthur]'.magenta + ': I shall write the Script of Configuration with piety and wisdom! \n');
          util.print('[Patsy]'.cyan + ': <shrugs> \n');
          process.exit(1);

        }
        // No valid input
        else {

          util.print('[King Arthur]'.magenta + ': I can\'t do that!? It\'s to silly! I\'m leaving, come Patsy! <sound of two half coconuts banging together fading out..>\n');
          process.exit();

        }

      });
    },
    searchForConfigFile : function(){

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
        if(opts.verbose){

          util.print('FAIL'.red);

        }

        console.log('>> EXCEPTION'.red + ': Proper configuration file not found!', _error);
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

      if(!fs.existsSync(_path_to_config)){

        if(opts.verbose){
          util.print('\n>>'.yellow + ' Configuration file not found here, looking elsewhere: ' + _path_to_config + '...');
        }       

        util.print('[Patsy]'.yellow + ': <stumbling forward>\n'); 

        _path_to_config = this.searchForConfigFile();        
        

      }

      if(fs.existsSync(_path_to_config)){

        if(opts.verbose){
          util.print('OK'.green + '\n');
          util.print('>>'.green + ' File found here: '.white + _path_to_config.cyan + ' , loading configuration...'.white + '');
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
