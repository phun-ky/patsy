/**
 * This file holds the grunt configuration for patsy
 *
 * If the documented code here does not fullfill your needs, check the wiki on github here: https://github.com/phun-ky/patsy/wiki
 *
 * We do a bit more tweaking that we should here, but while we wait for grunt to be omnipotent, we do it like we do.
 * 
 * grunt is copyrighted to "Cowboy" Ben Alman
 * 
 * https://github.com/gruntjs/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */
 "use strict";

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util              = require('util');

/**
 * Require path plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var path              = require('path');

/**
 * Require patsyHelpers from the library
 *
 * @var     Object
 * @source  patsy
 */
var patsyHelpers      = require('./lib/patsyHelpers');

/**
 * Varholder for the project name
 *
 * @var     String
 * @source  patsy.json
 */
var project           = '';

/**
 * Varholder for the [full] project path
 *
 * @var     String
 * @source  grunt.option
 */
var projectPath       = '';

/**
 * Postfix for templating
 *
 * @var     String
 * @source  patsy.json
 */
var templatePostfix  = '';

/**
 * Prefix for templating 
 *
 * @var     String
 * @source  patsy.json
 */
var templatePrefix   = '';

/**
 * Variable for the project configuration
 *
 * @var     Object
 * @source  patsy.json
 */
var projectConfig;

/**
 * Varholder for path to files for better readability
 *
 * @var     String
 * @source  patsy.json
 */
var pathToJavaScriptFiles;

/**
 * Varholder for path to files for better readability
 *
 * @var     String
 * @source  patsy.json
 */
var pathToTemplateFiles

/**
 * Varholder for path to files for better readability
 *
 * @var     String
 * @source  patsy.json
 */
var pathToMinifiedFiles

/**
 * Varholder for path to files for better readability
 *
 * @var     String
 * @source  patsy.json
 */
var pathToBakedFiles;

/**
 * Set up grunt and export it for use
 *
 * @var     Function 
 */
module.exports = function(grunt) {    

  // Populate project variables, used for better readability
  projectPath       = grunt.option('path');  
  
  // Do we have a projectPath defined
  if(typeof projectPath !== 'undefined'){

    // Get config options from project if available
    try {

      // Set projectConfig from patsy.json        
      projectConfig = patsyHelpers.loadPatsyConfigInCurrentProject(projectPath);
      
      if(typeof projectConfig !== 'undefined'){

        if( typeof projectConfig.templatePrefix !== 'undefined' && 
            typeof projectConfig.templatePostfix !== 'undefined'
        ){

          templatePostfix  = projectConfig.templatePostfix;
          templatePrefix   = projectConfig.templatePrefix;
        }

        // Try to set project name, if not found, use the folder name
        if(typeof projectConfig.nameOfProject !== 'undefined'){

          project           = projectConfig.nameOfProject;
        } else {

          project           = path.basename(projectPath);
        }
      } else {

        console.log('Project configuration not found, exiting...');
        process.exit(1);    
      }

    } catch(e){

      console.log('Project configuration not found, exiting...');
      process.exit(1);
    }
  } else {

    console.log('Project path not set, exiting...');
    process.exit(1);
  }

  //grunt.loadNpmTasks('grunt-dox');   
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mustache');
  grunt.loadNpmTasks('grunt-minified');
  //grunt.loadNpmTasks('grunt-recess'); 

  pathToJavaScriptFiles = projectPath + projectConfig.pathToJavaScriptFiles;

  // GruntJS configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
            
      scripts : {
        files : [ 
                    
          pathToJavaScriptFiles + '**/*.js',                          
          projectPath + projectConfig.pathToTemplateFiles + '*.mustache'
                    
        ], 
        tasks: ['jshint','mustache', 'minified'],
        options : {
          debounceDelay: 2500
        }
        
      },      
      concatinate : {
        files : [projectPath + projectConfig.pathToMinifiedFiles + '*.js'],
        tasks : ['concat']
      }
    },
    clean: {
      folder: projectPath + projectConfig.pathToBakedFiles + "debug/*"
    },
    test: {
      all: [pathToJavaScriptFiles + 'test/**/*.js']
    },
    minified : {
      files: {
        src: [
          pathToJavaScriptFiles + '**' + path.sep + '*.js',                
          pathToJavaScriptFiles + '*.js'
        ],
        dest: projectPath + projectConfig.pathToMinifiedFiles
      }
    },
    jshint : {
      options : {
        indent : 2,
        white : false,
        passfail: true
      },
      src: [ 
        pathToJavaScriptFiles + '**' + path.sep + '*.js',
        '!' + pathToJavaScriptFiles + 'templates.js'
      ]
    },
    concat: {
      dist: {
        src:  [
                projectPath + projectConfig.pathToMinifiedFiles + '*.js'
              ],
        dest: projectPath + projectConfig.pathToBakedFiles + project + '.core.js'
      }
    },        
    mustache:{
      files: {
        dest : pathToJavaScriptFiles + 'templates.js',
        src : [projectPath + projectConfig.pathToTemplateFiles],
        options: {
          postfix: typeof templatePostfix !== 'undefined' ? templatePostfix : '',
          prefix:  typeof templatePrefix !== 'undefined' ? templatePrefix : ''
        }
      }
    },    
    /*recess: {
      dist: {
        src: [ projectPath + 'css/src/style.css' ]
      }
    },*/
    globals: {

    }      
  });

  grunt.registerTask('default', 'watch');


};