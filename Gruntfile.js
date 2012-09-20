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

var arguments = process.argv;
//console.log(arguments);

    


module.exports = function(grunt) {

    
  

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
      grunt.file.write( sources.dest, templateOutput );  
      
    });

  });

  var tmpDir = '../fpi-client/src/main/webapp';
  

    
  // Project configuration.
  grunt.initConfig({
    watch: {
      files : [ '../fpi-client/src/main/webapp/js/mustache/*.mustache'], 
      tasks: ['mustached']
    },
    clean: {
      folder: "dist/debug/*"
    },
    test: {
      all: ['test/**/*.js']
    },
    mustached:{
      dist: {
        files : {
          '../fpi-client/src/main/webapp/js/src/templates.js' : ['../fpi-client/src/main/webapp/js/mustache/']
        }
      }
    },

    
    globals: {

    }      
  });






  grunt.registerTask('default', 'watch');


  
};