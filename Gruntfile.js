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

    
  var uglifyjs = require('uglify-js');

module.exports = function(grunt) {

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
      grunt.file.write( tmpDir + sources.dest, templateOutput );  
      
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
      
      destPath = tmpDir + sources.dest;
      
      sources.src.forEach(function(source){              
        
        grunt.file.recurse( source, minifyJS);
        
        
        
      });
      
      //grunt.file.write( sources.dest, templateOutput );  
      
    });

  });

   // Minify with UglifyJS.
  // From https://github.com/mishoo/UglifyJS
  grunt.registerHelper('uglify', function(src, options) {
    if (!options) { options = {}; }
    var jsp = uglifyjs.parser;
    var pro = uglifyjs.uglify;
    var ast, pos;
    var msg = 'Minifying with UglifyJS...';
    grunt.verbose.write(msg);
    try {
      ast = jsp.parse(src);
      ast = pro.ast_mangle(ast, options.mangle || {});
      ast = pro.ast_squeeze(ast, options.squeeze || {});
      src = pro.gen_code(ast, options.codegen || {});
      // Success!
      grunt.verbose.ok();
      // UglifyJS adds a trailing semicolon only when run as a binary.
      // So we manually add the trailing semicolon when using it as a module.
      // https://github.com/mishoo/UglifyJS/issues/126
      return src + ';';
    } catch(e) {
      // Something went wrong.
      grunt.verbose.or.write(msg);
      pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + e.col).yellow + ']'.red;
      grunt.log.error().writeln(pos + ' ' + (e.message + ' (position: ' + e.pos + ')').yellow);
      grunt.warn('UglifyJS found errors.', 10);
    }
  });

  var tmpDir = '../fpi-client/src/main/webapp';
  

    
  // Project configuration.
  grunt.initConfig({
    watch: {
      files : [ 
                tmpDir + '/js/mustache/*.mustache',
                tmpDir + '/js/services/*.js',
                tmpDir + '/js/src/*.js',                
                tmpDir + '/js/min/services/*.js',
                tmpDir + '/js/min/src/*.js',
                tmpDir + '/css/src/*.css'
              ], 
      tasks: ['mustached','minified','concat','lint']
    },
    clean: {
      folder: "dist/debug/*"
    },     
    minified : {
      dist: {
        files : {
          '/js/min/' : [tmpDir + '/js/services/',tmpDir + '/js/src/']
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
                tmpDir + '/js/min/services/*.js',
                tmpDir + '/js/min/src/*.js'                   
              ],
        dest: tmpDir + '/js/dist/fpi.core.js'
      }
    },        
    mustached:{
      dist: {
        files : {
          '/js/src/templates.js' : [tmpDir + '/js/mustache/']
        }
      }
    },    
    recess: {
      dist: {
        src: [ tmpDir + '/css/src/style.css' ]
      }
    },  
    globals: {

    }      
  });






  grunt.registerTask('default', 'watch');


  
};