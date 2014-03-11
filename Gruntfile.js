/**
 * This file holds the grunt configuration for patsy and your project
 *
 * If the documented code here does not fullfill your needs, check the wiki on github here: https://github.com/phun-ky/patsy/wiki
 *
 * We do a bit more tweaking that we should here, but while we wait for grunt to be omnipotent, we do it like we do.
 *
 * grunt is copyrighted to "Cowboy" Ben Alman
 *
 * https://github.com/gruntjs/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */
 /*jslint node: true */
 'use strict';

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util              = require('util');

/**
 * Require path plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var path              = require('path');

/**
 * Require colors
 *
 * @var     Object
 * @source  NodeJS
 */
var colors              = require('colors');

/**
 * Require patsy from the library
 *
 * @var     Object
 * @source  patsy
 */
var patsy      = require('./lib/patsy')();

/**
 * Varholder for the [full] project path
 *
 * @var     String
 * @source  grunt.option
 */
var projectPath       = '';

/**
 * Variable for the project configuration
 *
 * @var     Object
 * @source  patsy.json
 */
var config;

/**
 * Varholder for test tasks
 *
 * @var     Array
 */
var testTasks = [];

/**
 * Varholder for tasks to run
 *
 * @var     Array
 */
var tasksToRun = [];

/**
 * Require xtend plugin for deep object extending
 *
 * @var     Object
 */
var xtend         = require('xtend');

/**
 * Set up grunt and export it for use
 *
 * @var     Function
 */
module.exports = function(grunt) {

  // Populate project variables, used for better readability
  projectPath       = grunt.option('path');

  var defaultTasks = [];
  var watchTasks = [];

  // Do we have a projectPath defined
  if(typeof projectPath !== 'undefined'){

    // Clean up project path, just in case it's missing a trailing slash
    projectPath = path.resolve(projectPath) + path.sep;

    if(!patsy.utils.doesPathExist(projectPath + 'patsy.json')){


      grunt.verbose.or.write(projectPath + 'patsy.json...').error().error('Project configuration not found, exiting...');
      grunt.fatal('Something bad happened!');
    } else {



      // Set config from patsy.json
      // Until we can access objects from inside grunt.initConfig with templating,
      // we've to load the file into another variable
      config = patsy.config.load(patsy, projectPath);


      if(config.build.js){

        if(typeof config.build.js === 'string'){

          config.build.js = [config.build.js + '**/*.js'];

        }

        config.build.js = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.js);



      }

      patsy.gruntConfig = {};

      if(typeof config.build.test !== 'undefined'){

        if(config.build.test.suites.nodeunit){
          testTasks.push('nodeunit');
          grunt.loadNpmTasks('grunt-contrib-nodeunit');


          config.build.test.suites.nodeunit.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.nodeunit.src);

          patsy.gruntConfig = xtend(patsy.gruntConfig,{
            nodeunit : config.build.test.suites.nodeunit || {}
          });


        }

        if(config.build.test.suites.qunit){
          testTasks.push('qunit');

          if(typeof config.build.test.suites.qunit.src !== 'undefined'){
            config.build.test.suites.qunit.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.qunit.src);
          }

          if( typeof config.build.test.suites.qunit.all !== 'undefined' ){

            if(typeof config.build.test.suites.qunit.all.options !== 'undefined'){

            } else {

              config.build.test.suites.qunit.all = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.qunit.all);

            }

          }

          patsy.gruntConfig = xtend(patsy.gruntConfig,{
            qunit : config.build.test.suites.qunit || {}
          });

          grunt.loadNpmTasks('grunt-contrib-qunit');
        }

      }

      if(config.build.lint.src){
        config.build.lint.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.lint.src);
      }

      tasksToRun.push('jshint');

      if(typeof config.build.min !== 'undefined'){

        if(config.build.min.options){

          config.build.min.options = xtend(config.build.min.options,{
            banner: '<%= banner %>'
          });

          if(
            config.build.min.options.sourceMap &&
            typeof config.build.min.options.sourceMap !== "boolean"
          ){

            config.build.min.options.sourceMap = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.min.options.sourceMap);

          }

        }

        patsy.gruntConfig = xtend(patsy.gruntConfig,{
          uglify : {
            project : {
              files : {
                '<%= basepath %><%= app.build.dist ? app.build.dist + app.project.details.name + ".core.js" : app.build.min.dest %>' : config.build.js
              }
            },
            options: config.build.min.options || {
              banner: '<%= banner %>',
              report : false
            }
          }
        });

        tasksToRun.push('uglify');

      }

      if(typeof config.build.css !== 'undefined'){

        if(config.build.css.src){

          config.build.css.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.css.src);

        }

        patsy.gruntConfig = xtend(patsy.gruntConfig,{
          recess: {
            dist: {
              src: config.build.css.src || [
                '<%= basepath %><%= app.build.css.src %>**/*.css',
                '<%= basepath %><%= app.build.css.src %>**/*.less'
              ],
              dest: '<%= basepath %><%= app.build.css.dest %>',
              options: config.build.css.options || { compile: true }
            }
          }
        });

        tasksToRun.push('recess');
        grunt.loadNpmTasks('grunt-recess');

      }

      if(typeof config.build.docs !== 'undefined'){

        if(typeof config.build.docs.files.src !== 'undefined'){

          config.build.docs.files.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.docs.files.src);

          config.build.docs.files.dest = config.build.docs.files.dest || 'docs/';
          config.build.docs.files.dest = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.docs.files.dest);

          patsy.gruntConfig = xtend(patsy.gruntConfig,{
            dox : config.build.docs
          });

          tasksToRun.push('dox');
          grunt.loadNpmTasks('grunt-dox');

        }

      }

      if(typeof config.build.tmpl !== 'undefined'){

        if(typeof config.build.tmpl.dest !== 'undefined'){

          config.build.tmpl.dest = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.tmpl.dest);

        }

        if(typeof config.build.tmpl.src !== 'undefined'){

          config.build.tmpl.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.tmpl.src);

        }

        patsy.gruntConfig = xtend(patsy.gruntConfig,{
          mustache:{
            files: {
              dest : config.build.tmpl.dest || '<%= basepath %>templates.js',
              src : config.build.tmpl.src || ['<%= basepath %>/**/*.mustache']
            },
            options: config.build.tmpl.options || {}
          }
        });

        tasksToRun.push('mustache');
        grunt.loadNpmTasks('grunt-mustache');

      }

      watchTasks = watchTasks.concat(tasksToRun);
      if(testTasks.length !== 0 && config.build.options.testsOnWatch){
        watchTasks = watchTasks.concat(testTasks);
      }

      var _package_json_to_use;

      // USe patsy package conf for banner, or projects package conf?
      if( grunt.file.exists(config.project.environment.rel_path + 'package.json')){

        _package_json_to_use = config.project.environment.rel_path + 'package.json';

      } else {

        _package_json_to_use = config.project.environment.rel_path + 'patsy.json';

      }

      patsy.gruntConfig = xtend(patsy.gruntConfig, {
        // Read package.json configuration file into pkg
        pkg : grunt.file.readJSON( _package_json_to_use ),
        patsy_pkg : grunt.file.readJSON( 'package.json' ),
        // Read the projects configuration file into app
        app : grunt.file.readJSON(config.project.environment.rel_path + 'patsy.json'),
        // Set basepath
        basepath : config.project.environment.rel_path,
        banner: '/** \n * Generated by <%= patsy_pkg.title || patsy_pkg.name %> '+
          '<%= pkg.name ? "for " + pkg.name || app.project.details.name + "" : "" %>' +
          '\n *\n' +
          ' * @version v<%= pkg.version %> \n' +
          ' * @date <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT") %>\n' +
          '<%= pkg.homepage ? " * @link " + pkg.homepage + "\\n" : "" %> */\n',
        // Watch tasks
        watch: {
          scripts : {
            files : config.build.js.concat(config.build.css ? config.build.css.src : [],config.build.tmpl ? config.build.tmpl.src : []),
            tasks: watchTasks,
            options : {
              debounceDelay: 2000,
              spawn : false,
              livereload: config.project.options.reload_port || true
            }
          }
        },
        // Tasks
        clean: {
          folder: '<%= basepath %><%= app.build.dist %>debug/*'
        },
        /*connect : {
          server : {
            options: {
              port: 8421,
              base: '.'
            }
          }
        },*/

        jshint : {
          options : config.build.lint.options || {
            indent : 2,
            white : false,
            passfail: true
          },
          src: config.build.lint.src || config.build.js
        },
        /*
        reload: {
          port: 8001,
          proxy: {
            host: config.project.environment.host || "localhost",
            port: config.project.environment.port || 8090
          }
        },*/
        globals: {

        }
      });



    }

  } else {

    testTasks.push('nodeunit');

    if(path.basename(path.resolve(__dirname)) == 'patsy'){

      grunt.log.writeln('Running grunt on patsy...');
      grunt.loadNpmTasks('grunt-contrib-nodeunit');
      grunt.loadNpmTasks('grunt-release');
      patsy.gruntConfig = {
        // Read patsys configuration file into pkg
        pkg: grunt.file.readJSON('package.json'),
        // Set basepath
        basepath : path.resolve(__dirname),
        watch: {
          scripts : {
            files : [
              '**/*.js',
              'bin/patsy',
              '!node_modules/**/*.js',
              '!lib/proxy/middleware.js'
            ],
            tasks: ['jshint', 'nodeunit']
          }
        },
        nodeunit: {
          src: "test/*.js"
        },
        jshint : {
          options : {
            indent : 2,
            white : false,
            passfail: false
          },
          src: [
            '<%= watch.scripts.files %>'
          ]
        }
      };

    } else {

      grunt.verbose.or.write('Running grunt on patsy...').error().error('Project path not set!');
      grunt.fatal('Something bad happened!');
    }

  }


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // grunt.loadNpmTasks('grunt-contrib-connect');








  // GruntJS configuration
  grunt.initConfig(patsy.gruntConfig);

  //console.log(grunt.config.get());
  defaultTasks.push('watch');
  grunt.registerTask('default', defaultTasks);

  if(testTasks.length !== 0){

    // testTasks.unshift('connect');

    grunt.registerTask('test', testTasks);
    grunt.registerTask('all', tasksToRun.concat(testTasks));
  } else {
    grunt.registerTask('all', tasksToRun);
  }




};
