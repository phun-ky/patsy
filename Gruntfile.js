/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */
 "use strict";


// Prepare node plugin variables
var util              = require('util');
var path              = require('path');

// Prepare patsyHelpers variable
var patsyHelpers      = require('./lib/patsyHelpers');

// Prepare local variables for this file
var project           = '';
var projectPath       = '';
var _mustachePostfix  = '';
var _mustachePrefix   = '';

// Set up GruntJS
module.exports = function(grunt) {

  /**
   * Variable for the project configuration
   *
   * @var     Object
   * @source  patsy.json
   */
  var _projectConfig;

  // Populate project variables, used for better readability
  projectPath       = grunt.option('path');  
  
  if(typeof projectPath !== 'undefined'){

    // Get config options from project if available
    try {

        _projectConfig = patsyHelpers.loadPatsyConfigInCurrentProject(projectPath);
        
        if(typeof _projectConfig !== 'undefined'){

          if( typeof _projectConfig.templatePrefix !== 'undefined' && 
              typeof _projectConfig.templatePostfix !== 'undefined'
          ){

            _mustachePostfix  = _projectConfig.templatePostfix;
            _mustachePrefix   = _projectConfig.templatePrefix;
          }

          if(typeof _projectConfig.nameOfProject !== 'undefined'){

            project           = _projectConfig.nameOfProject;
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

  

  // GruntJS configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      /**
       * Currently, the jshint task ( grunt-contrib-jshint ) does not support to exclude files, so for now, we comment it out
       * There's a fix with a pull request to the repo, stay tuned here: https://github.com/gruntjs/grunt-contrib-jshint/issues/1
       */
      /*linting : {
        files : [
          projectPath + _projectConfig.pathToJavaScriptFiles + '**' + path.sep + '*.js',               
          projectPath + _projectConfig.pathToJavaScriptFiles + '**' + path.sep + '!(templates).js'
        ],
        tasks : ['jshint']
      },*/
      scripts : {
        files : [ 
                    
          projectPath + _projectConfig.pathToJavaScriptFiles + '**/*.js',                          
          projectPath + _projectConfig.pathToTemplateFiles + '*.mustache'
                    
        ], 
        tasks: ['mustache', 'minified'],
        options : {
          debounceDelay: 2500
        }
        
      },      
      concatinate : {
        files : [projectPath + _projectConfig.pathToMinifiedFiles + '*.js'],
        tasks : ['concat']
      }
    },
    clean: {
      folder: projectPath + _projectConfig.pathToBakedFiles + "debug/*"
    },
    test: {
      all: [projectPath + _projectConfig.pathToJavaScriptFiles + 'test/**/*.js']
    },
    minified : {
      files: {
        src: [
          projectPath + _projectConfig.pathToJavaScriptFiles + '**/*.js',                
          projectPath + _projectConfig.pathToJavaScriptFiles + '*.js'
        ],
        dest: projectPath + _projectConfig.pathToMinifiedFiles
      }
    },
    jshint : {
      options : {
        indent : 2,
        white : false,
        passfail: true
      },
      src: [ 
        projectPath + _projectConfig.pathToJavaScriptFiles + '**' + path.sep + '*.js'
      ]
    },
    concat: {
      dist: {
        src:  [
                projectPath + _projectConfig.pathToMinifiedFiles + '*.js'
              ],
        dest: projectPath + _projectConfig.pathToBakedFiles + project + '.core.js'
      }
    },        
    mustache:{
      files: {
        dest : projectPath + _projectConfig.pathToJavaScriptFiles + 'templates.js',
        src : [projectPath + _projectConfig.pathToTemplateFiles],
        options: {
          postfix: typeof _mustachePostfix !== 'undefined' ? _mustachePostfix : '',
          prefix:  typeof _mustachePrefix !== 'undefined' ? _mustachePrefix : ''
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