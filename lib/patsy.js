/**
 * File containing functions for patsy
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    this.js
 */
 /*jslint node: true */
'use strict';

process.on('uncaughtException', function (error) {
   console.log(error);
});

/**
 * Require file system plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var fs            = require('fs');

/**
 * Require colors plugin
 *
 * @var     Object
 */
var colors        = require('colors');

/**
 * Require spawn from child process
 *
 * @var     Object
 * @source  NodeJS
 */
var spawn         = require('child_process').spawn;

/**
 * Require exec from child process
 *
 * @var     Object
 * @source  NodeJS
 */
var exec          = require('child_process').exec;

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util          = require('util');

/**
 * Require path plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var path          = require('path');

/**
 * Require colors plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var program       = require('commander');

/**
 * Require xtend plugin for deep object extending
 *
 * @var     Object
 */
var xtend         = require('xtend');

module.exports = function(opts){

  opts  = opts || {
    verbose : false,
    scripture : true
  };



  return {

    /**
     * Varholder for process.stdin
     *
     * @var     Object
     */
    stdin         : process.stdin,
    /**
     * Varholder for process.stoud
     *
     * @var     Object
     */
    stdout        : process.stdout,
    /**
     * Varholder for spawned grunt
     *
     * @var     Object
     */
    grunt : '',
    /**
     * Require proxy from the library
     *
     * @var     Object
     * @source  patsy
     */
    proxy      : require('./proxy/')({
      verbose   : opts.verbose
    }),
    /**
     * Require scripture from the library
     *
     * @var     Object
     * @source  patsy
     */
    scripture   : require('./monty/scripture')({
      verbose   : opts.verbose,
      scripture : opts.scripture || false
    }),
    /**
     * Require mock from the library
     *
     * @var     Object
     * @source  patsy
     */
    mock        : require('./mock/'),
    /**
     * Require fileserver from the library
     *
     * @var     Object
     * @source  patsy
     */
    fileserver  : require('./fileserver')(),
    /**
     * Require utils from the library
     *
     * @var     Object
     * @source  patsy
     */
    utils     : require('./utils'),
    /**
     * Require config from the library
     *
     * @var     Object
     * @source  patsy
     */
    config  : require('./config')({
      app_path  : opts.app_path,
      verbose   : opts.verbose
    }),
    grunt_cfg : '',
    project_cfg : {},
    start : function(){

      this.stdin.resume();
      this.stdin.setEncoding('utf8');
      this.stdin.on('data', this.checkInput.bind(this));

      this.scripture.print('\n'+
      '..............................................................................,,\n'.inverse.yellow +
      '...............................................................................,\n'.inverse.yellow +
      '...............................................................................,\n'.inverse.yellow +
      '.............................................................................,,,\n'.inverse.yellow +
      '......................................................,:::::::,,,,............,,\n'.inverse.yellow +
      '................................................,,::~~~~~~======+=,..........,,,\n'.inverse.yellow +
      '.........................,$$~I+..............,::~~::::::::::::::~+=,........,,,,\n'.inverse.yellow +
      '...................++Z7$7=~~~+?7ZOZZO?.....,:~~::::::::::~~~~::::+?:......,,,,,,\n'.inverse.yellow +
      '................OZ$~?~:::,,:,,,,,,::~IZZ8Z:~::::::::::~:~~~~~:::~II:,.....,.,,,,\n'.inverse.yellow +
      '..............ZZZ~::,:,,,,,.,.....,,,,::=78~~::::::::::::~~~:::~IZI:,......,,,,,\n'.inverse.yellow +
      '...........I:IZO~:,,,.,,,,,::~:,,,,...,,,::78,::::::::::::::::=7ZZI:,,,.....,,,,\n'.inverse.yellow +
      '...........=IZO~:,,,.,~~~~~~==~=~~~~:,,...,:~DO,,,:::::::::~=IZZZZ?:.........,,,\n'.inverse.yellow +
      '...........~Z7$:,,,,,=~~=~========~=~~~~...,,:IO~~~~~~~=?I$OOZZZZ$=,...........,\n'.inverse.yellow +
      '..........Z$O$O~:,,,~=~~~==============~~,,,,::$O$ZZZOOOOOOOOZZZZ?:............,\n'.inverse.yellow +
      '..........ZO$$Z~:,,,=~~~~~~==============~:,,::~OOZOOZZOOOOOOOOZ$~,.............\n'.inverse.yellow +
      '.........~ZOZOO7:,,,=~~~~~~~~=============~:,,,:~OZZZOOOOOOOOOOO+,..............\n'.inverse.yellow +
      '.........O8OOOZZ::,,:~~~~~~~~~====~~=======~,,,,~IZOOOOOOOOOZOZ?:,,.............\n'.inverse.yellow +
      '.........NZ$788ZI:,,,~~~~~~~~~~=~~~~~======~,.,,:~OIO8888888Z7+~~:::,,,,........\n'.inverse.yellow +
      '........=Z$Z8OZ$$7:,,,~~~~~~~~=~~~~~~~====~~,,,,::ZODDDDD8Z7+=~~~~::::::,,,.....\n'.inverse.yellow +
      '........:$8$OZZOZO7:,,,,~~~~~~~~~~~~~~===~~~,.,,:~ZO?IIIII?+=~~~::::::,,,,......\n'.inverse.yellow +
      '.......+?Z$O$OZZZOOO:,,,,:~~~~~~~~~~~~=~~~~,.,,,:~ZI::::::::::,,,,,,............\n'.inverse.yellow +
      '.........Z78ZO88OZ7$$=:,,,,~~~~~~~~=~~~~~::.,,,,:7Z=,,,,,,,,,,,,,,,.............\n'.inverse.yellow +
      '.........:OZ8ZZ8ZZ$?$$$:,,,,.,,,:::=::...,..,,::~ZI,,,,,,,,,,,,,,,..............\n'.inverse.yellow +
      '..........7ZZO88OZ8ZOOZOO:,,,,,.....,,,,,,,,,::=ZI......,.,,,,,.................\n'.inverse.yellow +
      '...........IZ$88OOOOZZ88Z7OZ~:,,,,,,,,,,,::::$OZZ:..............................\n'.inverse.yellow +
      '............ZZZZO$Z$OOOZOO$77OZI77+:::ZOOOZZZZ$8................................\n'.inverse.yellow +
      '............+878$$ZZDZZOOZZZOO$ZOOZO7Z7$$Z$OO7?.................................\n'.inverse.yellow +
      '.....,,,,,,,,,Z$OZOZ8ZOOO$O$O7Z$OO$$$8OOOOZZZ7..................................\n'.inverse.yellow +
      '..,,,,,,,,,,,,,,OOO8Z88OZD8OOO$8Z8$8OZZO7Z7O....................................\n'.inverse.yellow +
      '..,,,,,,,,,,,,:~+?OD8D$O888OOOOZ$88OZ$Z8O~~~::,,................................\n'.inverse.yellow +
      '...,,,,,,,,,~=+++???8D8DD8NDDDO88NOD8?7===~~~:::::,,,...........................\n'.inverse.yellow +
      '.......,,,::=++??IZ78O8NNDDNMNM8MZZ$7I?+==~~~::::,,,,,,,,............... . .    \n'.inverse.yellow +
      '............,:=+??I7$$$ZZZOOO8OOOZ$7I?+=~~::::,,,,,,,,,..............           \n'.inverse.yellow +
      '         ......,,:~~==============~~~~:::::,,,,,,....................  .        \n'.inverse.yellow);


      this.scripture.print("[King Arthur]: Come Patsy, my trusty servant!! <sound of two half coconuts banging together> ..".yellow);

      try{
        var _self = this;
        /**
         * Require project from the library
         *
         * @var     Object
         * @source  patsy
         */
        var project = require('./project')(opts);
        project.check(_self);
      } catch(e){
        console.log('patsy.start', e);
      }


    },
    /**
     * Function to check current input from stdin
     *
     * @param   String  chunk
     * @calls   this.die
     */
    checkInput : function(chunk) {

      chunk = chunk.trim();

      if(chunk == 'exit'){

        util.print("[King Arthur]: On second thought, let's not go to Camelot, it's a silly place.\n".yellow);
        this.die();

      } else if(chunk == 'test') {
        util.print("[Patsy]: Running tests!\n".yellow);
        this.runTests();

      }
    },
    /**
     * Kills Patsy!
     *
     */
    die : function(){

      process.exit(1);
    },
    /**
     * Loads stage
     *
     * @param   Object  config
     */
    load : function(config){

      util.print("[Patsy]: Just putting my rucksack on my Lord!\n".yellow);

      if(typeof config !== 'undefined' && typeof config === 'object'){

        util.print("[Patsy]: And yes, the scripture is in my rucksack, I just checked.\n".yellow);

        this.project_cfg = config;

        // We have a gonfig, set up the application
        this.setup();

        process.chdir(opts.app_path);

        try{

          this.proxy.start(config);
          this.fileserver.load(config);
          this.loadGrunt(config);
        } catch(e){
          console.log('patsy.load',e);
        }
      }
    },
    loadGrunt : function(config){
      var _newArgs;
      var _bin;
      if(process.platform == 'win32'){

        _bin       = "cmd";
        var _cmdName   = 'node_modules\\.bin\\grunt';

        //New args will go to cmd.exe, then we append the args passed in to the list
        //  the /c part tells it to run the command.  Thanks, Windows...
        _newArgs   = ["/c", _cmdName, '--path', config.project.environment.abs_path];

        _newArgs    = opts.verbose ? _newArgs.concat(['-v']) : _newArgs;

        if(opts.verbose){

          util.print('Loading grunt: ' + _bin.magenta.inverse + ' /c ' + _cmdName.cyan + ' --path ' + config.project.environment.abs_path.cyan + '\n');
        }



      } else {

        if(opts.verbose){

          util.print('Loading grunt: ' + 'node_modules/.bin/grunt '.magenta.inverse + ' --path ' + config.project.environment.abs_path.cyan + '\n');
        }

        _bin        = 'node_modules/.bin/grunt';
        _newArgs    = ['--path', config.project.environment.abs_path];

        _newArgs    = opts.verbose ? _newArgs.concat(['-v']) : _newArgs;


      }

      this.grunt     = spawn(_bin, _newArgs);

      util.print("[Patsy]: Here's the grunt my King!\n".yellow);

      this.grunt.stderr.pipe(process.stdout);


      this.grunt.stdout.on('data',function(data){
        data = String(data).trim();
        if(data !== ''){

          //util.print("[Patsy]: The grunt speaks my Lord! Listen!\n".yellow);
          util.puts("[Grunt]: ".green + data + "");
        }

      });

      this.grunt.stderr.on('data',function(data){
        util.print("[Patsy]: The grunt is sick my Liege! ".yellow + data.red + "\n");
      });

      this.grunt.on('exit',function(code){
        util.print("[Patsy]: The grunt has buggered off! ".yellow + code.red + "\n");
        process.exit(1);
      });
    },
    runTests : function(){

      this.runGruntTasks('test');


    },
    runPatsyTest : function(){

      console.log('Running patsy test');

      process.exit();
    },
    /*
    the purpose of this method is to run through the given configuration/arguments and
    set up patsy accordingly
    */
    setup : function(){

      if(typeof this.project_cfg === 'undefined'){

        if(opts.verbose){

          util.print('>> NOTICE: '.yellow + ' Setup: Configuration is not defined, trying to define config..'.white + '\n');
        }
        /**
         * Require config from the library
         *
         * @var     Object
         * @source  patsy
         */
        var config      = require('./config')({
          app_path  : opts.app_path,
          verbose   : opts.verbose
        });
        config.load();

      } else {
        if(opts.verbose){

          util.print('>> '.green + 'Setup'.white.underline + ': Configuration is defined, continuing..'.white + '\n');
        }
      }


      if(typeof this.project_cfg.project.options !== 'undefined' && this.project_cfg.project.options.watch_config){

        if(opts.verbose){

          util.print('Watching project configuration file: '.white + path.resolve('this.json').cyan + '\n');
          util.print('Waiting...');
        }

        // Set up watch on the current projects configuration file
        fs.watchFile('patsy.json', { persistent: true, interval: 1000 }, function (curr, prev) {

          var _currTS = new Date(curr.mtime);
          var _prevTS = new Date(prev.mtime);

          if(_currTS.getTime() > _prevTS.getTime() ){
            if(opts.verbose){

              util.print('OK'.green + '\n');
            }

            util.print('\n[Patsy]: The configuration file has changed! Should I reload it Sire?'.yellow);
            program.confirm(': ', function(ok){
              if(ok){
                /**
                 * Require config from the library
                 *
                 * @var     Object
                 * @source  patsy
                 */
                var config      = require('./config')({
                  app_path  : opts.app_path,
                  verbose   : opts.verbose
                });
                config.load();
              } else {
                util.puts('[Patsy]: Ok then, we will continue with this current config'.yellow);
              }
            });
          }

        });


      } else {

        if(opts.verbose){

          util.print('>> '.green + 'Setup'.white.underline + ': Not watching project configuration file.\n'.white);
        }
      }

    },
    updateRelativePaths : function(relativeProjectPath, relative){
      var src = [];
      var complete_path;

      if(this.utils.isArray(relative)){
        // For each path, check if path is negated, if it is, remove negation
        relative.forEach(function(_path){

          if(this.utils.isPathNegated(_path)){

            _path = _path.slice(1);
            complete_path = '!' + relativeProjectPath + _path;
          } else {

            complete_path = relativeProjectPath + _path;
          }

          src.push(complete_path);

        });
      } else {

        if(this.utils.isPathNegated(relative)){

          var _path = relative.slice(1);
          complete_path = '!' + relativeProjectPath + _path;
        } else {

          complete_path = relativeProjectPath + relative;
        }

        src = complete_path;
      }


      return src;

    },
    runGruntTasks : function(how){

      var _child, _execCmd, _cfg;

      _cfg = this.config.load();

      process.chdir(opts.app_path);

      if(process.platform == 'win32'){

        var _bin       = "cmd";
        var _cmdName   = 'node_modules\\.bin\\grunt';


        //New args will go to cmd.exe, then we append the args passed in to the list
        //  the /c part tells it to run the command.  Thanks, Windows...
        var _newArgs   = ["/c", _cmdName].concat(['--path', _cfg.project.environment.abs_path]);


        _execCmd     = 'cmd /c node_modules\\.bin\\grunt --path ' + _cfg.project.environment.abs_path + ' ' + how;

      } else {

        _execCmd       = 'node_modules/.bin/grunt --path ' + _cfg.project.environment.abs_path + ' ' + how;
      }

      _child = exec(_execCmd,
        function (error, stdout, stderr) {

          util.print(stdout);

          if(stderr){

            util.print('\n[Patsy]: The grunt is sick my Liege! '.yellow  + stderr.red);
          }

          if (error !== null) {

            console.log('\n[Patsy]: The grunt died! '.yellow  + error);
            process.exit(1);
          }


      });
    }
  };
};



