/**
 * File containing functions for patsy
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    this.js
 */
 /*jslint node: true */
'use strict';

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

process.on('uncaughtException', function (error) {
  if(String(error.code) == 'EACCES'){
    console.log('>> EXCEPTION'.red + ': Run patsy with superuser priviligies. ');
  } else {
   console.log('>> EXCEPTION'.red + ':', error);
  }
  process.exit(1);
});


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
    /**
     * Variable to store the grunt configuration
     *
     * @var     Object
     * @source  Gruntfile.js
     */
    grunt_cfg : '',
    /**
     * Variable to store the project configuration
     *
     * @var     Object
     * @source  patsy.json
     */
    project_cfg : {},
    /**
     * Function to start patsy
     *
     */
    start : function(preScripture){

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


      if ((Array.isArray(preScripture)) && (preScripture.length > 0)) {
        for (var i = 0; i < preScripture.length; i++) {
          this.scripture.print(preScripture[i]);
        }
      }

      this.scripture.print('[King Arthur]'.magenta + ': Come Patsy, my trusty servant!! <sound of two half coconuts banging together> ..');

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
        console.log('>> PatsyStartException'.red + ':', e);
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

        this.scripture.print('[King Arthur]'.magenta + ': On second thought, let\'s not go to Camelot, it\'s a silly place.\n');
        this.die();

      } else if(chunk == 'test') {
        this.scripture.print('[Patsy]'.yellow + ': Running tests!\n');
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

      this.scripture.print('[Patsy]'.yellow + ': Just putting my rucksack on my Lord!');

      if(typeof config !== 'undefined' && typeof config === 'object'){

        this.scripture.print('[Patsy]'.yellow + ': And yes, the scripture is in my rucksack, I just checked.');

        this.project_cfg = config;

        // We have a gonfig, set up the application
        this.setup();

        process.chdir(opts.app_path);

        try{
          /**
           * Require proxy from the library
           *
           * @var     Object
           * @source  patsy
           */
          var proxy      = require('./proxy/')({
            verbose   : opts.verbose || config.options.verbose || config.proxy.options.verbose || false
          });
          proxy.start(config);
          /**
           * Require fileserver from the library
           *
           * @var     Object
           * @source  patsy
           */
          var fileserver  = require('./fileserver')(config);
          fileserver.load();

          this.loadGrunt(config);
        } catch(e){
          console.log('>> FAIL'.red + ': patsy.load',e);
        }
      }
    },
    /**
     * Loads grunt
     *
     * @param   Object  config
     */
    loadGrunt : function(config){

      opts = xtend(opts, {
        verbose: opts.verbose || config.options.verbose,
        force: config.build.options.force || false
      });



      var _newArgs = [];
      var _bin;

      var _self = this;

      if(process.platform == 'win32'){

        _bin       = "cmd";
        var _cmdName   = 'node_modules\\.bin\\grunt';

        //New args will go to cmd.exe, then we append the args passed in to the list
        //  the /c part tells it to run the command.  Thanks, Windows...
        _newArgs.push('/c');
        _newArgs.push(_cmdName);

        if(opts.verbose){

          util.print('>>'.cyan + ' Loading grunt: ' + String(_bin + ' /c ' + _cmdName + ' --path ' + config.project.environment.abs_path).inverse.white + '\n');
        }

      } else {

        if(opts.verbose){

          util.print('>>'.cyan + ' Loading grunt: ' + String('node_modules/.bin/grunt --path ' + config.project.environment.abs_path).inverse.white + '\n');
        }

        _bin        = 'node_modules/.bin/grunt';

      }

      // Append needed arguments for grunt
      _newArgs.push('--path');
      _newArgs.push(config.project.environment.abs_path);

      if(opts.verbose){
        _newArgs.push('-v');
      }

      if(opts.force){
        _newArgs.push('--force');
      }


      // Spawn grunt instance
      this.grunt     = spawn(_bin, _newArgs);

      this.scripture.print('[Patsy]'.yellow + ': The grunt is saddling up!');

      // Can be commented back in again, just testing if this is necessary
      //this.grunt.stderr.pipe(process.stdout);
      var warnings = [];

      this.grunt.stdout.on('data',function(data){

        data = String(data).trim();

        // Do not print out empty lines/strings
        if(data !== ''){

          // If opts verbose is set, output is piped directly from grunt
          if(opts.verbose){
            util.puts(data);
          }
          // If not verbose, use scripture or other
          else {

            if(data.indexOf('Done, without errors') !== -1){

              _self.scripture.print('[Patsy]'.yellow + ': The grunt has finished building without errors!');
            } else if(data.indexOf('Done, but with warnings') !== -1){

              _self.scripture.print('[Patsy]'.yellow + ': The grunt has finished building, but with warnings!');

              if(warnings.length !== 0){

                util.print(warnings.join('\n'));
                warnings = [];
              }
            } else if(data.indexOf('Waiting..') !== -1){

              _self.scripture.print('[Grunt]'.green + ': Watching for changes my Liege!'.white);
            } else if(data.indexOf('changed') !== -1){

              _self.scripture.print('[Grunt]'.green + ': File changed! Running tasks..'.white);
            } else if(data.indexOf('not found') !== -1){

              warnings.push(data);
            } else {

              if(warnings.length !== 0){

               // _self.scripture.print('[Patsy]'.yellow + ': The grunt has finished building, but with warnings!'.yellow);
                util.print(warnings.join('\n'));
                warnings = [];
              }
            }
          }
        }

      });

      this.grunt.stderr.on('data',function(data){
        try{
          var buff = new Buffer(data);
          data = buff.toString('utf8');
        } catch(e){

        }


        warnings.push(String('Warning: Grunt: ' + data).yellow);

      });

      this.grunt.on('exit',function(code){
        _self.scripture.print('[Patsy]'.yellow + ': The grunt has buggered off! ' + code.red + "\n");
        process.exit(1);
      });
    },
    /**
     * Runs grunt test
     *
     */
    runTests : function(){

      this.runGruntTasks('test');


    },
    /**
     * Runs test on patsy
     *
     */
    runPatsyTest : function(){

      console.log('Running patsy test');

      process.exit(1);
    },
    /**
     * Initialize patsy with default configuration file
     *
     */
    init : function(){
      
      var config      = require('./config')(null);

      config.generateDefaultConfiguration();

    },
    /**
     * Setup
     *
     * The purpose of this method is to run through the given configuration/arguments and
     * set up patsy accordingly
     */
    setup : function(){

      var _self = this;

      if(opts.verbose){
        util.print('>>'.cyan + ' Setting up patsy for current project...');
      }

      if(typeof this.project_cfg === 'undefined'){

        if(opts.verbose){
          util.print('NOTICE'.cyan + '\n');
          util.print('>>'.cyan + ' NOTICE'.yellow + ': Configuration is not defined, trying to reload config...'.white + '');
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
          util.print('OK'.green + '\n');
          util.print('>>'.green + ' Configuration is defined, continuing'.white + '\n');
        }
      }


      if(typeof this.project_cfg.project.options !== 'undefined' && this.project_cfg.project.options.watch_config){

        if(opts.verbose){

          util.print('>>'.cyan + ' Watching project configuration file: '.white + path.resolve('this.json').cyan + '...');

        } else {
          this.scripture.print('[Patsy]'.yellow + ': And yes Sire, I am watching over the configuration file!');
        }

        // Set up watch on the current projects configuration file
        fs.watchFile('patsy.json', { persistent: true, interval: 1000 }, function (curr, prev) {

          var _currTS = new Date(curr.mtime);
          var _prevTS = new Date(prev.mtime);

          if(_currTS.getTime() > _prevTS.getTime() ){
            if(opts.verbose){

              util.print('OK'.green + '\n');
            }

            _self.scripture.print('[Patsy]'.yellow + ': The configuration file has changed! Reciting scripture!');
            //program.confirm(': ', function(ok){
              /*if(ok){*/
                /**
                 * Require config from the library
                 *
                 * @var     Object
                 * @source  patsy
                 */
                var config      = require('./config')({
                  app_path  : opts.app_path,
                  verbose   : opts.verbose,
                  project_path : _self.project_cfg.project.environment.abs_path || ''
                });
                config.load();
              /*} else {
                util.puts('[Patsy]'.yellow + ': Ok then, we will continue with this current config'.yellow);
              }*/
            //});
          }

        });


      } else {

        if(opts.verbose){

          util.print('>>'.cyan + ' Not watching project configuration file.\n'.white);
        }
      }

    },
    /**
     * Update relative paths
     *
     * @param   String  relativeProjectPah
     * @param   String|Array  relative
     */
    updateRelativePaths : function(relativeProjectPath, relative){
      var src = [];
      var complete_path;
      var _self = this;

      if(_self.utils.isArray(relative)){
        // For each path, check if path is negated, if it is, remove negation
        relative.forEach(function(_path){

          if(_self.utils.isPathNegated(_path)){

            _path = _path.slice(1);
            complete_path = '!' + relativeProjectPath + _path;
          } else {

            complete_path = relativeProjectPath + _path;
          }

          src.push(path.normalize(complete_path));

        });
      } else {

        if(_self.utils.isPathNegated(relative)){

          var _path = relative.slice(1);
          complete_path = '!' + relativeProjectPath + _path;
        } else {

          complete_path = relativeProjectPath + relative;
        }

        src = path.normalize(complete_path);
      }


      return src;

    },
    /**
     * Runs grunt tasks
     *
     * @param   String  how
     */
    runGruntTasks : function(how){

      var _child, _cfg, _self = this;
      var _execCmd = [];

      if(typeof this.project_cfg.project === 'undefined'){
        /**
         * Require config from the library
         *
         * @var     Object
         * @source  patsy
         */
        var config      = require('./config')({
          app_path  : opts.app_path,
          verbose   : opts.verbose,
          project_path : ''
        });
        this.project_cfg = config.load();
      }



      process.chdir(this.project_cfg.project.environment.abs_path);

      _cfg = this.project_cfg || this.config.load();

      process.chdir(opts.app_path);

      if(process.platform == 'win32'){

        _execCmd.push('cmd');
        // New args will go to cmd.exe, then we append the args passed in to the list
        // the /c part tells it to run the command.  Thanks, Windows...
        _execCmd.push('/c');
        _execCmd.push('node_modules\\.bin\\grunt');

      } else {

        _execCmd.push('node_modules/.bin/grunt');

      }

      // Append needed arguments for grunt
      _execCmd.push('--path');
      _execCmd.push(_cfg.project.environment.abs_path);
      _execCmd.push(opts.verbose ? '-v' : '');
      _execCmd.push(opts.force ? '--force' : '');
      _execCmd.push(how);


      _child = exec(_execCmd.join(' '),
        function (error, stdout, stderr) {

          util.print(stdout);

          if(stderr){

            _self.scripture.print('\n' + stderr.yellow);
          }

          if (error !== null) {

            _self.scripture.print('\n[Patsy]'.yellow + ': The grunt died!');

            if(opts.verbose){
              console.log('>> FAIL'.red + ':' , error);
            }
            process.exit(1);
          }


      });
    }
  };
};
