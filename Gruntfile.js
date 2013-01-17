/**
 * This file holds the grunt configuration for patsy
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
 * Set up grunt and export it for use
 *
 * @var     Function
 */
module.exports = function(grunt) {

  // Populate project variables, used for better readability
  projectPath       = grunt.option('path');



  // Do we have a projectPath defined
  if(typeof projectPath !== 'undefined'){

    if(!patsy.utils.doesPathExist(projectPath + 'patsy.json')){

      console.log('Project configuration not found, exiting...');
      process.exit(1);
    } else {

      //grunt.loadNpmTasks('grunt-reload');

      // Set config from patsy.json
      // Until we can access objects from inside grunt.initConfig with templating,
      // we've to load the file into another variable
      config = patsy.config.load(projectPath);

      // A crude way to do this, but bare with us, this will improve
      if(config.build.test.suites.jasmine){
        testTasks.push('jasmine');
        grunt.loadNpmTasks('grunt-contrib-jasmine');


        config.build.test.suites.jasmine.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine.src);
      }

      if(config.build.test.suites.nodeunit){
        testTasks.push('nodeunit');
        grunt.loadNpmTasks('grunt-contrib-nodeunit');


        config.build.test.suites.nodeunit.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.nodeunit.src);


      }

      if(config.build.test.suites.qunit){
        testTasks.push('qunit');
        config.build.test.suites.qunit.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.qunit.src);
        grunt.loadNpmTasks('grunt-contrib-qunit');
      }

      if(config.build.lint.src){
          config.build.lint.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.lint.src);
      }

      patsy.gruntConfig = {
        // Read patsys configuration file into pkg
        pkg: grunt.file.readJSON('package.json'),
        // Read the projects configuration file into app
        app : grunt.file.readJSON(config.project.environment.rel_path + 'patsy.json'),
        // Set basepath
        basepath : config.project.environment.rel_path,
        banner: '/** \n * Generated by <%= pkg.title || pkg.name %> '+
          '<%= app.project.name ? "for " + app.project.name + "" : "" %>' +
          '\n *\n' +
          ' * @version v<%= pkg.version %> \n' +
          ' * @date <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          '<%= pkg.homepage ? " * @link " + pkg.homepage + "\\n" : "" %> */\n',
        // Watch tasks
        watch: {
          scripts : {
            files : [
              '<%= basepath %><%= app.build.js %>**/*.js',
              '<%= basepath %><%= app.build.tmpl.src %>*.mustache',
              '<%= basepath %><%= app.build.css.src %>**/*.css',
              '<%= basepath %><%= app.build.css.src %>**/*.less',
              // DO NOT REMOVE
              '!node_modules/**/*.js'
            ],
            tasks: ['jshint','mustache', 'minified','dox','recess'],//.concat(config.build.options.testsOnWatch ? testTasks : ''),
            options : {
              debounceDelay: 2500,
              // This is required to prevent memory allocation errors in windows
              interrupt: true
            }
          },
          concatinate : {
            files : ['<%= basepath %><%= app.build.min.dest %>*.js'],
            tasks : ['concat']
          }
        },
        // Tasks
        clean: {
          folder: '<%= basepath %><%= app.build.dist %>debug/*'
        },
        jasmine : config.build.test.suites.jasmine || {},
        nodeunit : config.build.test.suites.nodeunit || {},
        qunit : config.build.test.suites.qunit || {},
        minified : {
          files: {
            src: [
              '<%= basepath %><%= app.build.js %>**/*.js',
              '<%= basepath %><%= app.build.js %>*.js'
            ],
            dest: '<%= basepath %><%= app.build.min.dest %>',
            options: config.build.min.options || {}
          }
        },
        jshint : {
          options : config.build.lint.options || {
            indent : 2,
            white : false,
            passfail: true
          },
          src: config.build.lint.src || [
            '<%= basepath %><%= app.build.js %>**/*.js',
            '!<%= basepath %><%= app.build.js %>templates.js',
            '!<%= basepath %><%= app.build.min.dest %>*.js',
            '!<%= basepath %><%= app.build.dist %>*.js',
            // DO NOT REMOVE
            '!node_modules/**/*.js'
          ]
        },
        concat: {
          options : {
            banner: '<%= banner %>'
          },
          dist: {
            src:  [
                    '<%= basepath %><%= app.build.min.dest %>*.js'
                  ],
            dest: '<%= basepath %><%= app.build.dist %><%= app.project.name %>.core.js'
          }
        },
        mustache:{
          files: {
            dest : '<%= basepath %><%= app.build.js %>templates.js',
            src : ['<%= basepath %><%= app.build.tmpl.src %>']
          },
          options: config.build.tmpl.options || {}
        },
        dox: {
          files: {
            src: ['<%= basepath %><%= app.build.js %>**/*.js'],
            dest: '<%= basepath %><%= app.build.docs.dest %>'
          },
          options: config.build.docs.options || {}
        },
        recess: {
          dist: {
            src: [
              '<%= basepath %><%= app.build.css.src %>**/*.css',
              '<%= basepath %><%= app.build.css.src %>**/*.less'
            ],
            dest: '<%= basepath %><%= app.build.css.dist %>style.css',
            options: config.build.css.options || { compile: true }
          }
        },
        globals: {

        }
      };
    }

  } else {



    if(path.basename(path.resolve(__dirname)) == 'patsy'){

      grunt.log.writeln('Running grunt on patsy...');
      grunt.loadNpmTasks('grunt-contrib-nodeunit');
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
            tasks: ['jshint', 'nodeunit'],
            options: {
              // This is required to prevent memory allocation errors in windows
              interrupt: true
            }
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
      grunt.log.warn('FAILURE: Project path not set, exiting...');
      process.exit(1);

    }

  }

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-dox');
  grunt.loadNpmTasks('grunt-mustache');
  grunt.loadNpmTasks('grunt-minified');
  grunt.loadNpmTasks('grunt-recess');


  // GruntJS configuration
  grunt.initConfig(patsy.gruntConfig);


  grunt.registerTask('default', ['watch']);
  grunt.registerTask('test', testTasks);
  grunt.registerTask('all', ['jshint','mustache', 'minified','dox','recess','concat'].concat(testTasks));


};
