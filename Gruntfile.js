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
      config = patsy.config.load(projectPath);



      // A crude way to do this, but bare with us, this will improve
      if(config.build.test.suites.jasmine){

        grunt.loadNpmTasks('grunt-contrib-jasmine');

        if(config.build.test.suites.jasmine[config.project.details.name]){

          testTasks.push('jasmine');

          config.build.test.suites.jasmine[config.project.details.name].src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine[config.project.details.name].src);

          if(typeof config.build.test.suites.jasmine[config.project.details.name].options !== 'undefined'){

            if(typeof config.build.test.suites.jasmine[config.project.details.name].options.template !== 'undefined'){
              config.build.test.suites.jasmine[config.project.details.name].options.template = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine[config.project.details.name].options.template);
            }

            if(typeof config.build.test.suites.jasmine[config.project.details.name].options.outfile !== 'undefined'){
              config.build.test.suites.jasmine[config.project.details.name].options.outfile = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine[config.project.details.name].options.outfile);
            }

            if(typeof config.build.test.suites.jasmine[config.project.details.name].options.specs !== 'undefined'){
              config.build.test.suites.jasmine[config.project.details.name].options.specs = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine[config.project.details.name].options.specs);
            }

          }

        } else {

          testTasks.push('jasmine');

          config.build.test.suites.jasmine.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine.src);

          if(typeof config.build.test.suites.jasmine.options !== 'undefined'){

            if(typeof config.build.test.suites.jasmine.options.template !== 'undefined'){
              config.build.test.suites.jasmine.options.template = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine.options.template);
            }

            if(typeof config.build.test.suites.jasmine.options.outfile !== 'undefined'){
              config.build.test.suites.jasmine.options.outfile = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine.options.outfile);
            }

            if(typeof config.build.test.suites.jasmine.options.specs !== 'undefined'){
              config.build.test.suites.jasmine.options.specs = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.jasmine.options.specs);
            }

          }
        }
      }

      if(config.build.test.suites.nodeunit){
        testTasks.push('nodeunit');
        grunt.loadNpmTasks('grunt-contrib-nodeunit');


        config.build.test.suites.nodeunit.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.nodeunit.src);


      }

      if(config.build.test.suites.qunit){
        testTasks.push('qunit');

        if(typeof config.build.test.suites.qunit.src !== 'undefined'){
          config.build.test.suites.qunit.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.test.suites.qunit.src);
        }

        grunt.loadNpmTasks('grunt-contrib-qunit');
      }

      if(config.build.lint.src){
        config.build.lint.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.lint.src);
      }

      if(config.build.css.src){


          config.build.css.src = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.css.src);


      }

      if(config.build.min.options){
        config.build.min.options = xtend(config.build.min.options,{
          banner: '<%= banner %>'
        });



        if(config.build.min.options.sourceMap){

          config.build.min.options.sourceMap = patsy.updateRelativePaths(config.project.environment.rel_path, config.build.min.options.sourceMap);

        }
      }
      grunt.loadNpmTasks('grunt-reload');
      defaultTasks.push('reload');

      watchTasks = watchTasks.concat(['jshint','mustache', 'uglify','dox','recess', 'reload']);
      if(testTasks.length !== 0 && config.build.options.testsOnWatch){
        watchTasks = watchTasks.concat(testTasks);
      }

      patsy.gruntConfig = {
        // Read patsys configuration file into pkg
        pkg: grunt.file.readJSON('package.json'),
        // Read the projects configuration file into app
        app : grunt.file.readJSON(config.project.environment.rel_path + 'patsy.json'),
        // Set basepath
        basepath : config.project.environment.rel_path,
        banner: '/** \n * Generated by <%= pkg.title || pkg.name %> '+
          '<%= app.project.details.name ? "for " + app.project.details.name + "" : "" %>' +
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
              '!node_modules/**/*.js'
            ].concat(config.build.css.src),
            tasks: watchTasks,
            options : {
              debounceDelay: 2500
            }
          }
        },
        // Tasks
        clean: {
          folder: '<%= basepath %><%= app.build.dist %>debug/*'
        },
        jasmine : config.build.test.suites.jasmine || {},
        nodeunit : config.build.test.suites.nodeunit || {},
        qunit : config.build.test.suites.qunit || {},
        uglify : {
          project : {
            files : {
              '<%= basepath %><%= app.build.dist ? app.build.dist + app.project.details.name + ".core.js" : app.build.min.dest %>' : [ '<%= basepath %><%= app.build.js %>**/*.js','<%= basepath %><%= app.build.js %>*.js']
            }
          },
          options: config.build.min.options || {
            banner: '<%= banner %>'
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
            '!<%= basepath %><%= app.build.dist %>**/*.js',
            '!node_modules/**/*.js'
          ]
        },
        mustache:{
          files: {
            dest : '<%= basepath %><%= app.build.js %>templates.js',
            src : ['<%= basepath %><%= app.build.tmpl.src %>']
          },
          options: config.build.tmpl.options || {}
        },
        reload: {
          port: 8001,
          proxy: {
            host: config.project.environment.host || "localhost",
            port: config.project.environment.port || 8090
          }
        },
        dox: {
          files: {
            src: ['<%= basepath %><%= app.build.js %>'],
            dest: '<%= basepath %><%= app.build.docs.dest %>'
          },
          options: config.build.docs.options || {}
        },
        recess: {
          dist: {
            src: config.build.css.src || [
              '<%= basepath %><%= app.build.css.src %>**/*.css',
              '<%= basepath %><%= app.build.css.src %>**/*.less'
            ],
            dest: '<%= basepath %><%= app.build.css.dest %>',
            options: config.build.css.options || { compile: true }
          }
        },
        globals: {

        }
      };


    }

  } else {

    testTasks.push('nodeunit');

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

  grunt.loadNpmTasks('grunt-dox');
  grunt.loadNpmTasks('grunt-mustache');

  grunt.loadNpmTasks('grunt-recess');



  // GruntJS configuration
  grunt.initConfig(patsy.gruntConfig);

  //console.log(grunt.config.get());
  defaultTasks.push('watch');
  grunt.registerTask('default', defaultTasks);

  if(testTasks.length !== 0){
    grunt.registerTask('test', testTasks);
    grunt.registerTask('all', ['jshint','mustache', 'uglify','dox','recess'].concat(testTasks));
  } else {
    grunt.registerTask('all', ['jshint','mustache', 'uglify','dox','recess']);
  }




};
