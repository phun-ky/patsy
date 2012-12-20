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




module.exports = function(grunt) {
  
  path = grunt.option('path');  
  project = grunt.option('project');  

  

  //grunt.loadNpmTasks('grunt-dox');   
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-recess');

  grunt.registerMultiTask('mustached', 'Concat mustache templates into a JSON string.', function() {    

    var templateOutput  = '';

    var concat_to_json_string = function(abspath, rootdir, subdir, filename){        
      
      templateContent += '"' + filename.replace('.mustache','') + '"' + " : '" + grunt.file.read(abspath) + "',";
    };
    
    
    //SB.extend({templates: {"done":true}});
    var templateOutput = 'SB.extend({templates: {';
    
    this.data.src.forEach(function(source){        
      
      grunt.file.recurse( source, concat_to_json_string);
      
      templateOutput += templateContent.replace( /\r|\n|\t|\s\s/g, "");
      
      
    });
    templateOutput += ' "done": "true"}});';
    grunt.file.write( path + this.file.dest, templateOutput );  
    
    

    templateContent = '';

  });

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
        src : [path + 'js/src/mustache/']
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