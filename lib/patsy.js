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
    console.trace();
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

      var _fillStrBlue = '................................................................................';
      var _lengthOfSprite = _fillStrBlue.length;
      var _fillerStrLengthForConsoleWidth = Math.floor(_lengthOfSprite / 2);

      var _fillerStrForConsolePadding = '';

      for(var oo = 0; oo < _fillerStrLengthForConsoleWidth; oo++){
        _fillerStrForConsolePadding += '.';
      }

      util.puts("Loading PatsyJS...".bold);
      util.print('\n'+
      _fillerStrForConsolePadding.inverse.blue + '................................................................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '................................................................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '................................................................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '................................................................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '......................................................'.inverse.blue + ',:::::::,,,,'.inverse.yellow + '..............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '................................................'.inverse.blue + ',,::'.inverse.yellow + '~~~~~~======'.inverse.white + '+=,'.inverse.yellow + '.............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.........................,'.inverse.blue + '$$~I+'.inverse.yellow + '..............'.inverse.blue + ',::'.inverse.yellow + '~~'.inverse.white + '::::::::::::::'.white + '~'.inverse.white + '+=,'.inverse.yellow + '............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '...................'.inverse.blue + '++Z7$7=~~~+?7ZOZZO?'.inverse.yellow + '.....'.inverse.blue + ',:'.inverse.yellow + '~~'.inverse.white + '::::::::::~~~~::'.white + '::'.inverse.white + '+?:'.inverse.yellow + '............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '................'.inverse.blue + 'OZ$~?~'.inverse.yellow + ':::,,:,,,,,,'.inverse.white + '::~IZZ8Z:'.inverse.yellow + '~:'.inverse.white + ':::::::::~:~~~~~:'.white + '::'.inverse.white + '~II:,'.inverse.yellow + '...........'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '..............'.inverse.blue + 'ZZZ~'.inverse.yellow + '::,:,,,,,.,.....,,,,'.inverse.white + '::=78~~'.inverse.yellow + '::::::::::::~~~:'.white + '::'.inverse.white + '~IZI:,'.inverse.yellow + '...........'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '...........'.inverse.blue + 'I:IZO~'.inverse.yellow + ':,,,.,,,,,'.inverse.white + '::~:'.white + ',,,,...,,,'.inverse.white + '::78,'.inverse.yellow + ':::::::::::::'.white + ':::'.inverse.white + '=7ZZI:,'.inverse.yellow + '...........'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '...........'.inverse.blue + '=IZO~'.inverse.yellow + ':,,,.,'.inverse.white + '~~~~~~==~=~~~~'.white + ':,,...,'.inverse.white + ':~DO,'.inverse.yellow + ',,'.inverse.white + '::::::'.white + ':::~'.inverse.white + '=IZZZZ?:'.inverse.yellow + '............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '...........'.inverse.blue + '~Z7$'.inverse.yellow + ':,,,,,'.inverse.white + '=~~=~========~=~~~~'.white + '...,,'.inverse.white + ':IO~'.inverse.yellow + '~~~~~~='.inverse.white + '?I$OOZZZZ$=,'.inverse.yellow + '............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '..........'.inverse.blue + 'Z$O$O~'.inverse.yellow + ':,,,'.inverse.white + '~=~~~==============~~'.white + ',,,,'.inverse.white + '::$O$ZZZOOOOOOOOZZZZ?:'.inverse.yellow + '.............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '..........'.inverse.blue + 'ZO$$Z~'.inverse.yellow + ':,,,'.inverse.white + '=~~~~~~==============~'.white + ':,,'.inverse.white + '::~OOZOOZZOOOOOOOOZ$~'.inverse.yellow + ','.inverse.grey + '.............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.........'.inverse.blue + '~ZOZOO7'.inverse.yellow + ':,,,'.inverse.white + '=~~~~~~~~=============~'.white + ':,,,'.inverse.white + ':~OZZZOOOOOOOOOOO+'.inverse.yellow + ','.inverse.grey + '..............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.........'.inverse.blue + 'O8OOOZZ'.inverse.yellow + '::,,:'.inverse.white + '~~~~~~~~~====~~=======~'.white + ',,,,'.inverse.white + '~IZOOOOOOOOOZOZ?:'.inverse.yellow + ',,'.inverse.grey + '.............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.........'.inverse.blue + 'NZ$788ZI'.inverse.yellow + ':,,,'.inverse.white + '~~~~~~~~~~=~~~~~======~'.white + ',.,,'.inverse.white + ':~OIO8888888Z7+'.inverse.yellow + '~~:::,,,,'.inverse.grey + '........'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '........'.inverse.blue + '=Z$Z8OZ$$7'.inverse.yellow + ':,,,'.inverse.white + '~~~~~~~~=~~~~~~~====~~'.white + ',,,,'.inverse.white + '::ZODDDDD8Z7+='.inverse.yellow + '~~~~::::::,,,'.inverse.grey + '.....'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '........'.inverse.blue + ':$8$OZZOZO7'.inverse.yellow + ':,,,,'.inverse.white + '~~~~~~~~~~~~~~===~~~'.white + ',.,,'.inverse.white + ':~ZO?IIIII?+='.inverse.yellow + '~~~::::::,,,,'.inverse.grey + '......'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.......'.inverse.blue + '+?Z$O$OZZZOOO'.inverse.yellow + ':,,,,:'.inverse.white + '~~~~~~~~~~~~=~~~~'.white + ',.,,,'.inverse.white + ':~ZI'.inverse.yellow + '::::::::::,,,,,,'.inverse.grey + '............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.........'.inverse.blue + 'Z78ZO88OZ7$$='.inverse.yellow + ':,,,,'.inverse.white + '~~~~~~~~=~~~~~'.white + '::.,,,,'.inverse.white + ':7Z='.inverse.yellow + ',,,,,,,,,,,,,,,'.inverse.grey + '.............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.........'.inverse.blue + ':OZ8ZZ8ZZ$?$$$'.inverse.yellow + ':,,,,.,,,'.inverse.white + ':::=::'.white + '...,..,,'.inverse.white + '::~ZI'.inverse.yellow + ',,,,,,,,,,,,,,,'.inverse.grey + '..............'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.........'.inverse.blue + '.7ZZO88OZ8ZOOZOO'.inverse.yellow + ':,,,,,.....,,,,,,,,,'.inverse.white + '::=ZI'.inverse.yellow + '......'.inverse.blue + ',.,,,,,'.inverse.grey + '.................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '...........'.inverse.blue + 'IZ$88OOOOZZ88Z7OZ~'.inverse.yellow + ':,,,,,,,,,,,'.inverse.white + '::::$OZZ:'.inverse.yellow + '..............................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '............'.inverse.blue + 'ZZZZO$Z$OOOZOO$77OZI77+'.inverse.yellow + ':::ZOOOZZZZ$8'.inverse.yellow + '................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '............'.inverse.blue + '+878$$ZZDZZOOZZZOO$ZOOZO7Z7$$Z$OO7?'.inverse.yellow + '.................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.....'.inverse.blue + ',,,,,,,,,'.inverse.grey + 'Z$OZOZ8ZOOO$O$O7Z$OO$$$8OOOOZZZ7'.inverse.yellow + '..................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '..'.inverse.blue + ',,,,,,,,,,,,,,'.inverse.grey + 'OOO8Z88OZD8OOO$8Z8$8OZZO7Z7O'.inverse.yellow + '....................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '..'.inverse.blue + ',,,,,,,,,,,,:~+?'.inverse.grey + 'OD8D$O888OOOOZ$88OZ$Z8O~~'.inverse.yellow + '~::,,'.inverse.grey + '................................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '...'.inverse.blue + ',,,,,,,,,~=+++???'.inverse.grey + '8D8DD8NDDDO88NOD8?7==='.inverse.yellow + '~~~:::::,,,'.inverse.grey + '...........................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '.......'.inverse.blue + ',,,::=++??IZ78O'.inverse.grey + '8NNDDNMNM8MZZ$7I?+'.inverse.yellow + '==~~~::::,,,,,,,,'.inverse.grey + '.......................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '............'.inverse.blue + ',:=+??I7$$$'.inverse.grey + 'ZZZOOO8OOOZ$7I?+'.inverse.yellow + '=~~::::,,,,,,,,,'.inverse.grey + '.........................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue +
      _fillerStrForConsolePadding.inverse.blue + '...............'.inverse.blue + ',,:~~==============~~~~:::::,,,,,,'.inverse.grey + '...............................'.inverse.blue + _fillerStrForConsolePadding.inverse.blue + '\n'.inverse.blue);


      if ((Array.isArray(preScripture)) && (preScripture.length > 0)) {
        for (var i = 0; i < preScripture.length; i++) {
          this.scripture.print(preScripture[i]);
        }
      }

      this.scripture.print('[King Arthur]'.magenta + ': Come Patsy, my trusty servant!!');
      this.scripture.print('[Patsy]'.yellow + ': <banging two half coconuts together> ');

      try{
        var patsy = this;
        /**
         * Require project from the library
         *
         * @var     Object
         * @source  patsy
         */
        var project = require('./project')(opts);
        project.check(patsy);
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


      var patsy = this;

      chunk = chunk.trim();

      if(chunk == 'exit'){

        this.scripture.print('[King Arthur]'.magenta + ': On second thought, let\'s not go to Camelot, it\'s a silly place. I am leaving you behind squire!\n');

        program.prompt('[Patsy]'.cyan + ': Sire, do you really want to leave me here all alone? [Y/n] (enter for yes): ', function(proceed){

          // Did he answer yes? (or DEFAULT)
          if (( proceed.search(/yes|y|j|ja/g) !== -1 ) ||
              (( proceed.trim() === '' ))) {

            util.print('[King Arthur]'.magenta + ': I hold your oath fullfilled!\n');

            patsy.die();

          }
          // Did he answer no?
          else if( proceed.search(/no|n|nei/g) !== -1 ) {

            util.print('[King Arthur]'.magenta + ': No, I am just pulling your leg mate! \n');
            util.print('[Patsy]'.cyan + ': <shrugs> \n');


          }
          // No valid input
          else {

            util.print('[King Arthur]'.magenta + ': I can\'t do that!? It\'s to silly! I\'m leaving, come Patsy! <sound of two half coconuts banging together fading out..>\n');
            process.exit();

          }

        });


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

      var patsy = this;

      if(typeof patsy.grunt !== 'undefined'){

        try{

          patsy.grunt.kill();

        } catch(e){}

      }

      process.exit(1);
    },
    /**
     * Loads stage
     *
     * @param   Object  config
     */
    load : function(config){

      var patsy = this;

      this.scripture.print('[Patsy]'.yellow + ': Just putting my rucksack on my Lord!');

      if(typeof config !== 'undefined' && typeof config === 'object'){

        this.scripture.print('[Patsy]'.yellow + ': And yes, the scripture is in my rucksack, I just checked.');

        this.project_cfg = config;

        // We have a gonfig, set up the application
        this.setup();

        if(opts.verbose || config.options.verbose || false){

          util.print('>>'.cyan + ' Changing directory to : ' + opts.app_path.inverse.cyan + '...\n');

        }

        try{

          process.chdir(opts.app_path);

        } catch(e){

          console.trace();
          patsy.utils.fail('Could not change directory!');
          console.log(e);

        }

        if(typeof config.proxy !== 'undefined'){

          if(opts.verbose || config.options.verbose || false){
            util.print('Loading the Proxy\n'.bold);
          }

          try{
            /**
             * Require proxy from the library
             *
             * @var     Object
             * @source  patsy
             */
            var proxy      = require('./proxy/')({
              verbose   : opts.verbose || config.options.verbose || config.proxy.options.verbose || false,
              patsy : patsy
            });
            proxy.start(config);

          } catch(e){

            patsy.utils.fail('Could not load proxy!');
            console.trace();
            console.log(e);

          }

        }

        if(typeof config.fileserver !== 'undefined'){

          if(opts.verbose || config.options.verbose || false){
            util.print('Loading the Fileserver\n'.bold);
          }

          try {

            /**
             * Require fileserver from the library
             *
             * @var     Object
             * @source  patsy
             */
            var fileserver  = require('./fileserver')(config);

            fileserver.load(patsy);

          } catch(ex){

            patsy.utils.fail('Could not load fileserver!');
            console.trace();
            console.log(ex);

          }

        }

        try {

          if(opts.verbose || config.options.verbose || false){
            util.print('Loading Grunt, The JavaScript Task Runner\n'.bold);
          }

          this.loadGrunt(config);

        } catch(ex){

          patsy.utils.fail('Could not load Grunt!');
          console.trace();
          console.log(ex);

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
        verbose: opts.verbose || config.options.verbose || config.build.options.verbose,
        force: config.build.options.force || false
      });

      var _newArgs = [],
      _bin,
      patsy = this;

      if(patsy.utils.isWin){

        _bin       = "cmd";
        var _cmdName   = 'node_modules\\.bin\\grunt';

        //New args will go to cmd.exe, then we append the args passed in to the list
        //  the /c part tells it to run the command.  Thanks, Windows...
        _newArgs.push('/c');
        _newArgs.push(_cmdName);

        if(opts.verbose){

          util.print('>>'.cyan + ' Loading grunt\nCommand options: ' + String(_bin + ' /c ' + _cmdName + ' --path ' + config.project.environment.abs_path).cyan + '\n');

        }

      } else {

        if(opts.verbose){

          util.print('>>'.cyan + ' Loading grunt\nCommand options: ' + String('node_modules/.bin/grunt --path ' + config.project.environment.abs_path).cyan + '\n');
        }

        _bin        = 'node_modules/.bin/grunt';

      }

      // Append needed arguments for grunt
      _newArgs.push('--path');
      _newArgs.push(config.project.environment.abs_path);
      _newArgs.push('--stack');

      if(opts.verbose){

        _newArgs.push('-v');

      }

      if(opts.force){

        _newArgs.push('--force');

      }

      // Spawn grunt instance
      patsy.grunt     = spawn(_bin, _newArgs, { stdio: 'inherit' });

      patsy.scripture.print('[Patsy]'.yellow + ': The grunt is saddling up!');

      // Can be commented back in again, just testing if this is necessary
      //this.grunt.stderr.pipe(process.stdout);
      var warnings = [];

      /*this.grunt.stdout.on('data',function(data){
        var buff = new Buffer(data);
        console.log("foo: " + buff.toString('utf8'));
      });*/

      /*this.grunt.stdout.on('data',function(data){

        data = String(data).trim();

        // Do not print out empty lines/strings
        if(data !== ''){

          // If opts verbose is set, output is piped directly from grunt
          if(opts.verbose){

            util.puts( data );
          }
          // If not verbose, use scripture or other
          else {

            if(data.indexOf('Done, without errors') !== -1){

              patsy.scripture.print('[Patsy]'.yellow + ': The grunt has finished building without errors!');
            } else if(data.indexOf('Done, but with warnings') !== -1){

              patsy.scripture.print('[Patsy]'.yellow + ': The grunt has finished building, but with warnings!');

              if(warnings.length !== 0){

                util.print(warnings.join('\n'));
                warnings = [];
              }
            } else if(data.indexOf('Waiting..') !== -1){

              patsy.scripture.print('[Grunt]'.green + ': Watching for changes my Liege!'.bold);
            } else if(data.indexOf('changed') !== -1){

              patsy.scripture.print('[Grunt]'.green + ': File changed! Running tasks..'.bold);
            } else if(data.indexOf('not found') !== -1){

              warnings.push(data);
            } else {

              if(warnings.length !== 0){

               // patsy.scripture.print('[Patsy]'.yellow + ': The grunt has finished building, but with warnings!'.yellow);
                util.print(warnings.join('\n'));
                warnings = [];
              }
            }
          }
        }

      });*/

      /*this.grunt.stderr.on('data',function(data){
        try{
          var buff = new Buffer(data);
          data = buff.toString('utf8');
        } catch(e){

        }


        warnings.push(String('Warning: Grunt: ' + data).yellow);

      });
*/
      this.grunt.on('exit',function(code){

        if(opts.verbose){

          patsy.utils.fail('Grunt exception! ' + code.red);

        }

        patsy.scripture.print('[Patsy]'.yellow + ': The grunt has buggered off! ' + code.red + "\n");



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

      var patsy = this;

      if(opts.verbose){

        util.print('>>'.cyan + ' Setting up patsy for current project...\n');

      }

      if(typeof this.project_cfg === 'undefined'){

        if(opts.verbose){

          util.print('NOTICE'.cyan + '\n');
          util.print('>>'.cyan + ' NOTICE'.yellow + ': Configuration is not defined, trying to reload config...'.bold + '');

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

          patsy.utils.ok('Configuration is defined, continuing...');

        }
      }


      if(typeof this.project_cfg.project.options !== 'undefined' && this.project_cfg.project.options.watch_config){

        if(opts.verbose){

          util.print('>>'.cyan + ' Watching project configuration file: '.bold + path.resolve('patsy.json').cyan + '...');

        } else {

          this.scripture.print('[Patsy]'.yellow + ': And yes Sire, I am watching over the configuration file!');

        }

        // Set up watch on the current projects configuration file
        fs.watchFile('patsy.json', { persistent: true, interval: 1000 }, function (curr, prev) {

          var _currTS = new Date(curr.mtime);
          var _prevTS = new Date(prev.mtime);

          if(_currTS.getTime() > _prevTS.getTime() ){

            if(opts.verbose){

              patsy.utils.ok();
            }

            patsy.scripture.print('[Patsy]'.yellow + ': The configuration file has changed! Reciting scripture!');
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
                  project_path : patsy.project_cfg.project.environment.abs_path || ''
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

          util.print('>>'.yellow + ' Not watching project configuration file.\n');
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
      var patsy = this;

      if(patsy.utils.isArray(relative)){
        // For each path, check if path is negated, if it is, remove negation
        relative.forEach(function(_path){

          if(patsy.utils.isPathNegated(_path)){

            _path = _path.slice(1);
            complete_path = '!' + relativeProjectPath + _path;
          } else {

            complete_path = relativeProjectPath + _path;
          }

          src.push(path.normalize(complete_path));

        });
      } else {

        if(patsy.utils.isPathNegated(relative)){

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

      var _child, _cfg, patsy = this;
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

      if(patsy.utils.isWin){

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

            console.log(stderr);

          }

          if (error !== null) {

            patsy.scripture.print('\n[Patsy]'.yellow + ': The grunt died!');

            if(opts.verbose){

              console.log('>> ERROR'.red + ':' , error);

            }

            process.exit(1);

          }


      });
    }
  };
};
