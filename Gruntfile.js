/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */
 "use strict";

var util              = require('util');
var uglify            = require('uglify-js');

var templateContent   = '';
var templateCount     = 0;
var project           = '';
var path              = '';

var patsyHelpers      = require('./lib/patsyHelpers');
var _mustachePostfix, _mustachePrefix;


module.exports = function(grunt) {
  var _projectConfig;
  path      = grunt.option('path');  
  project   = grunt.option('project');  


// Get config options from project if available
  try{
      _projectConfig = patsyHelpers.loadPatsyConfigInCurrentProject(path);
      
      if(typeof _projectConfig !== 'undefined'){
        if( typeof _projectConfig.template !== 'undefined' && 
            typeof _projectConfig.template.options !== 'undefined' && 
            typeof _projectConfig.template.options.postfix !== 'undefined' && 
            typeof _projectConfig.template.options.prefix !== 'undefined' ){
          _mustachePostfix  = _projectConfig.template.options.postfix;
          _mustachePrefix   = _projectConfig.template.options.prefix;
        }
      }

  } catch(e){}
  


  //grunt.loadNpmTasks('grunt-dox');   
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mustache');
  grunt.loadNpmTasks('grunt-recess');

  grunt.registerMultiTask('minified', 'Concat javascript files a single javascript file.', function() {
    var destPath = '';
    var pathToProcess;
    
    var minifyJS = function(source){        

      

      var src       = grunt.file.read(source);
      var ast       = uglify.minify(source);
      var minSrc    = ast.code
      var filename  = require('path').basename(source);
      
      util.puts(filename + ", ");
      util.puts('Original size: ' + src.length + ' bytes.' + ' Minified size: ' + minSrc.length + ' bytes.');      

      var minDest = '';

      minDest = destPath + filename.replace('.js','.min.js')
            
      grunt.file.write( minDest, minSrc );      

    };
      
    destPath = path + this.file.dest;

    this.file.src.forEach(function(source){              
      
        minifyJS(source);
      
      
      
    });
      

  });

  

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts : {
        files : [ 
                    
          path + 'js/src/**/*.js',                
          path + 'js/src/*.js', 
          path + 'js/**/mustache/*.mustache'
                    
        ], 
        tasks: ['mustache','jshint', 'minified'],
        options : {

        }
        
      },      
      concatinate : {
        files : [path + 'js/min/*.js'],
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
        src: [path + 'js/src/*.js', path + 'js/src/**/*.js'],
        dest: 'js/min/'
      }
        
      
      
    },
    jshint : {
      options : {
        indent : 2        
      },
      files: [ path + '/js/src/*.js', !path + '/js/src/templates.js' ]
    },
    concat: {
      dist: {
        src:  [
                path + 'js/min/*.js'
              ],
        dest: path + 'js/dist/' +  project + '.core.js'
      }
    },        
    mustache:{
      files: {
        dest : path + 'js/src/templates.js',
        src : [path + 'js/src/mustache/'],
        options: {
          postfix: typeof _mustachePostfix !== 'undefined' ? _mustachePostfix : '',
          prefix:  typeof _mustachePrefix !== 'undefined' ? _mustachePrefix : ''
        }
      }
    },    
    recess: {
      dist: {
        src: [ path + 'css/src/style.css' ]
      }
    },
    globals: {

    }      
  });

  grunt.registerTask('default', 'watch');


};