/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */
var templateContent = '';
var templateCount = 0;



var project = '';

var path = '';

  
var uglify = require('uglify-js');

var projectConfig;




module.exports = function(grunt) {
  
  path = grunt.option('path');  
  project = grunt.option('project');  

  // Get config options from project if available
  try{
      // default encoding is utf8
      if (typeof (encoding) === 'undefined') var encoding = 'utf8';
          
      // Read file synchroneously and parse contents as JSON      
      projectConfig = JSON.parse(fs.readFileSync(path + 'patsy.JSON', encoding));

      if(typeof projectConfig !== 'undefined'){
        if( typeof projectConfig.template !== 'undefined' && 
            typeof projectConfig.options !== 'undefined' && 
            typeof projectConfig.options.postfix !== 'undefined' && 
            typeof projectConfig.options.prefix !== 'undefined' ){
          var _mustachePostfix  = projectConfig.options.postfix;
          var _mustachePrefix   = projectConfig.options.prefix;
        }
      }

  } catch(e){}

  console.log(path);

  //grunt.loadNpmTasks('grunt-dox');   
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mustache');
  grunt.loadNpmTasks('grunt-recess');

  grunt.registerMultiTask('minified', 'Concat javascript files a single javascript file.', function() {
    var destPath = '';
    var pathToProcess;
    
    var minifyJS = function(abspath, rootdir, subdir, filename){        

      

      var src     = grunt.file.read(abspath);
      var ast     = uglify.minify(abspath);
      var minSrc  = ast.code
      
      grunt.log.writeln(filename + ":");
      grunt.log.writeln("_________________________________________");
      grunt.log.writeln('Original size: \t\t' + src.length + ' bytes.');
      grunt.log.writeln('Minified size: \t\t' + minSrc.length + ' bytes.\n');

      var minDest = '';

      minDest = destPath + filename.replace('.js','.min.js')
      
      console.log(minDest, minSrc);
      grunt.file.write( minDest, minSrc );
      
      

    };

    
      
      destPath = path + this.file.dest;
      
      
      this.file.src.forEach(function(source){              
        
          grunt.file.recurse( require('path').dirname(source) , minifyJS);
        
        
        
      });
      

  });

    
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts : {
        files : [ 
          path + 'js/mustache/*.mustache',          
          path + 'js/src/**/*.js',                
          path + 'js/src/*.js', 
          path + 'js/min/*.js'          
        ], 
        tasks: ['mustached','minified','concat','jshint'],
        options: {
          debounceDelay: 2500


        }
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
      files: [ path + '/js/src/*.js' ]
    },
    concat: {
      dist: {
        src:  [
                path + 'js/min/*.js'
              ],
        dest: path + 'js/dist/' +  project + '.core.js'
      }
    },        
    mustached:{
      files: {
        dest : 'js/src/templates.js',
        src : [path + 'js/src/mustache/'],
        options: {
          postfix: typeof _mustachePostfix !== 'undefined' ? _mustachePostfix : undefined,
          prefix:  typeof _mustachePrefix !== 'undefined' ? _mustachePrefix : undefined
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