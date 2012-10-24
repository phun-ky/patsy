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
                tmpDir + '/js/mustache/*.mustache',
                tmpDir + '/js/services/*.js',
                tmpDir + '/js/src/*.js',                ,
                tmpDir + '/js/dist/fpi.services.js',
                tmpDir + '/js/dist/fpi.core.js'
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
                tmpDir + '/js/src/ext.js',
                tmpDir + '/js/src/templates.js',                
                tmpDir + '/js/src/cms.js',
                tmpDir + '/js/src/progressbar.js',
                tmpDir + '/js/src/api.js',
                tmpDir + '/js/src/utils.js',
                tmpDir + '/js/src/callbacks.js',
                tmpDir + '/js/src/charts.js',
                tmpDir + '/js/src/parallaxe.js',
                tmpDir + '/js/src/fpi.js'
              ],
        dest: tmpDir + '/js/dist/fpi.core.js'
      },
      extras:{
        src:  [
                tmpDir + '/js/services/index.js',
                tmpDir + '/js/services/policies.js',
                tmpDir + '/js/services/receipt.js',
                tmpDir + '/js/services/signing.js',
                tmpDir + '/js/services/calculations.js'
              ],
        dest: tmpDir + '/js/dist/fpi.services.js'
      }
    },
    min: {
      dist: {
        src: [tmpDir + '/js/dist/fpi.services.js', tmpDir + '/js/dist/fpi.core.js'],
        dest: tmpDir + '/js/dist/fpi.min.js'
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
          tmpDir + '/js/src/templates.js' : [tmpDir + '/js/mustache/']
        }
      }
    },

    
    globals: {

    }      
  });






  grunt.registerTask('default', 'watch');


  
};