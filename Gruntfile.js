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

  
var uglifyjs = require('uglify-js');

module.exports = function(grunt) {
  
  path = grunt.option('path');  
  project = grunt.option('project');  

  //grunt.loadNpmTasks('grunt-dox');   
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-recess');

  grunt.registerMultiTask('mustached', 'Concat mustache templates into a JSON string.', function() {    

    var templateOutput  = '';

    var concat_to_json_string = function(abspath, rootdir, subdir, filename){        
      
      templateContent += '"' + filename.replace('.mustache','') + '"' + " : '" + grunt.file.read(abspath) + "',";
    };
    
    this.files.forEach(function( sources ) {
      //SB.extend({templates: {"done":true}});
      var templateOutput = 'SB.extend({templates: {';
      
      sources.src.forEach(function(source){        
        
        grunt.file.recurse( source, concat_to_json_string);
        
        templateOutput += templateContent.replace( /\r|\n|\t|\s\s/g, "");
        
        
      });
      templateOutput += '"done":true}});';
      grunt.file.write( path + sources.dest, templateOutput );  
      
    });

    templateContent = '';

  });

  grunt.registerMultiTask('minified', 'Concat javascript files a single javascript file.', function() {
    var destPath = '';
    var minifyJS = function(abspath, rootdir, subdir, filename){        

      var src     = grunt.file.read(abspath);
      var minSrc  = grunt.helper('uglify', src);
      grunt.log.writeln('Original size: ' + src.length + ' bytes.');
      grunt.log.writeln('Minified size: ' + minSrc.length + ' bytes.');

      var minDest = '';

      if(rootdir.indexOf('js/src') != -1){

        minDest = destPath + 'src/'+ filename.replace('.js','.min.js')
      } else if(rootdir.indexOf('js/services') != -1){
        
        minDest = destPath + 'services/'+ filename.replace('.js','.min.js')
      }
      
      grunt.file.write( minDest, minSrc );
      
      

    };

    this.files.forEach(function( sources ) {
      
      destPath = path + sources.dest;
      
      sources.src.forEach(function(source){              
        
        grunt.file.recurse( source, minifyJS);
        
        
        
      });
      
      //grunt.file.write( sources.dest, templateOutput );  
      
    });

  });

    
  // Project configuration.
  grunt.initConfig({
    watch: {
      scripts : {
        files : [ 
          path + 'js/mustache/*.mustache',
          path + 'js/services/*.js',
          path + 'js/src/*.js',                
          path + 'js/min/services/*.js',
          path + 'js/min/src/*.js'
        ], 
        tasks: ['mustached','minified','concat','lint'],
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
      dist: {
        files : {
          'js/min/' : [path + 'js/services/',path + 'js/src/']
        }
      }
    },
    lint : {
      
      files: [ tmpDir + '/js/src/*.js' ]
    },
    jshint : {
      options : {
        indent : 2        
      }
    },
    concat: {
      basic: {
        src:  [
                path + 'js/min/services/*.js',
                path + 'js/min/src/*.js'                   
              ],
        dest: path + 'js/dist/' +  project + '.core.js'
      }
    },        
    mustached:{
      dist: {
        files : {
          'js/src/templates.js' : [path + 'js/mustache/']
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