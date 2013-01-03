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
var uglify            = require('uglify-js');
var path              = require('path');

// Prepare patsyHelpers variable
var patsyHelpers      = require('./lib/patsyHelpers');

// Prepare local variables for this file
var project           = '';
var projectPath       = '';
var _mustachePostfix, _mustachePrefix;

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
  project           = grunt.option('project');  

  // Get config options from project if available
  try{
      _projectConfig = patsyHelpers.loadPatsyConfigInCurrentProject(projectPath);
      
      if(typeof _projectConfig !== 'undefined'){
        if( typeof _projectConfig.templatePrefix !== 'undefined' && 
            typeof _projectConfig.templatePostfix !== 'undefined'
        ){
          _mustachePostfix  = _projectConfig.templatePostfix;
          _mustachePrefix   = _projectConfig.templatePrefix;
        }
      }

  } catch(e){}


  //grunt.loadNpmTasks('grunt-dox');   
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mustache');
  //grunt.loadNpmTasks('grunt-recess');

  

  grunt.registerMultiTask('minified', 'Minify given JavaScript files', function() {

    // Set up vars for task
    var _destPath = '';    
    
    // Set up callback function for file iteration
    var minifyJS = function(source){              

      // Sandboxed variables

      // Read file source
      var src       = grunt.file.read(source);

      // Minify file source
      var ast       = uglify.minify(source);
      var minSrc    = ast.code

      // Get file name
      var filename  = path.basename(source);
      
      // Verbose output by default for now
      util.puts(filename + ", ");
      util.puts('Original size: ' + src.length + ' bytes.' + ' Minified size: ' + minSrc.length + ' bytes.');      

      // Set up destiation variable
      var minDest = '';

      // Set destination
      minDest = _destPath + filename.replace('.js','.min.js')
            
      // Write minified sorce to destination file
      grunt.file.write( minDest, minSrc );      

    };
      
    // Set path of files to be stored
    _destPath = projectPath + this.file.dest;

    // Iterate over files to minify
    this.file.src.forEach(function(source){              
      
      // Bazinga!
      minifyJS(source);
    });     
  });  

  // GruntJS configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts : {
        files : [ 
                    
          projectPath + _projectConfig.pathToJavaScriptFiles + '**/*.js',                
          projectPath + _projectConfig.pathToJavaScriptFiles + '*.js', 
          projectPath + _projectConfig.pathToTemplateFiles + '*.mustache'
                    
        ], 
        tasks: ['jshint', 'mustache', 'minified'],
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
      folder: "dist/debug/*"
    },
    test: {
      all: ['test/**/*.js']
    },
    minified : {
      files: {
        src: [
          projectPath + _projectConfig.pathToJavaScriptFiles + '**/*.js',                
          projectPath + _projectConfig.pathToJavaScriptFiles + '*.js'
        ],
        dest: _projectConfig.pathToMinifiedFiles
      }
    },
    jshint : {
      options : {
        indent : 2,
        white : false,
        passfail: false
      },
      src: [ projectPath + _projectConfig.pathToJavaScriptFiles + '*.js' ]
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