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
        console.log(templateContent);
        templateOutput += templateContent.replace( /\r|\n|\t|\s\s/g, "");
        
        
      });
      templateOutput += '"done":true}});';
      grunt.file.write( sources.dest, templateOutput );  
      
    });

    templateContent = '';

  });

  var tmpDir = '../fpi-client/src/main/webapp';
  

    
  // Project configuration.
  grunt.initConfig({
    watch: {
      files : [ 
                '../fpi-client/src/main/webapp/js/mustache/*.mustache',
                '../fpi-client/src/main/webapp/js/services/*.js',
                '../fpi-client/src/main/webapp/js/src/*.js',                ,
                '../fpi-client/src/main/webapp/js/dist/fpi.services.js',
                '../fpi-client/src/main/webapp/js/dist/fpi.core.js'
              ], 
      tasks: ['mustached','concat','min']
    },
    clean: {
      folder: "dist/debug/*"
    },
    test: {
      all: ['test/**/*.js']
    },    
    concat: {
      basic: {
        src:  [
                '../fpi-client/src/main/webapp/js/src/ext.js',
                '../fpi-client/src/main/webapp/js/src/templates.js',                
                '../fpi-client/src/main/webapp/js/src/cms.js',
                '../fpi-client/src/main/webapp/js/src/progressbar.js',
                '../fpi-client/src/main/webapp/js/src/api.js',
                '../fpi-client/src/main/webapp/js/src/utils.js',
                '../fpi-client/src/main/webapp/js/src/callbacks.js',
                '../fpi-client/src/main/webapp/js/src/charts.js',
                '../fpi-client/src/main/webapp/js/src/parallaxe.js',
                '../fpi-client/src/main/webapp/js/src/fpi.js'
              ],
        dest: '../fpi-client/src/main/webapp/js/dist/fpi.core.js'
      },
      extras:{
        src:  [
                '../fpi-client/src/main/webapp/js/services/index.js',
                '../fpi-client/src/main/webapp/js/services/policies.js',
                '../fpi-client/src/main/webapp/js/services/receipt.js',
                '../fpi-client/src/main/webapp/js/services/signing.js',
                '../fpi-client/src/main/webapp/js/services/calculations.js'
              ],
        dest: '../fpi-client/src/main/webapp/js/dist/fpi.services.js'
      }
    },
    min: {
      dist: {
        src: ['../fpi-client/src/main/webapp/js/dist/fpi.services.js', '../fpi-client/src/main/webapp/js/dist/fpi.core.js'],
        dest: '../fpi-client/src/main/webapp/js/dist/fpi.min.js'
      }
    },
    uglify: {
      
      squeeze: {dead_code: false},
      codegen: {
        beautify: true,
        indent_start : 0,
        indent_level : 4,
        space_colon   : true,
        quote_keys: true
        
      }
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