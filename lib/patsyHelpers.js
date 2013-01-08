/**
 * File containing functions for patsy
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    patsyHelpers.js
 */

/**
 * Set up patsyHelpers variable to be exported
 *
 * @var   Object
 */
var patsyHelpers  = module.exports = {};

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
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util          = require('util');

/**
 * Require commander
 *
 * @var     Object
 */
var program       = require('commander');

/**
 * Require path plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var path          = require('path');

/**
 * Require xtend plugin for deep object extending
 *
 * @var     Object
 */
var xtend         = require('xtend');

/**
 * Varholder for process.stdin
 *
 * @var     Object
 */
var stdin         = process.stdin;

/**
 * Varholder for process.stoud
 *
 * @var     Object
 */
var stdout        = process.stdout;

// Set patsy's app path
patsyHelpers.appPath = path.resolve(__dirname, '..') + path.sep;

// Read default patsy config from patsy.default.json-file
var projectConfigDefaults = JSON.parse(fs.readFileSync(patsyHelpers.appPath + 'patsy.default.json'));


patsyHelpers.start = function(){

  stdin.resume();
  stdin.setEncoding('utf8');
  stdin.on('data', patsyHelpers.checkInput);

  patsyHelpers.scripture('\n'+
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


  patsyHelpers.scripture("[King Arthur]: Come Patsy, my trusty servant!! <sound of two half coconuts banging together> ..".yellow);
  patsyHelpers.checkProject();
};

/**
 * Function to bake a config file with given configuration and config defaults
 *
 * @param   Object  config
 * @return  Object  config
 */
patsyHelpers.bakeConfigFile = function(config){

  // Extend objects with missing values
  projectConfigDefaults.project = xtend(projectConfigDefaults.project, {
    name              : path.basename(path.resolve(path.dirname())),
    path              : path.resolve(path.dirname('patsy.JSON')) + path.sep,
    project_folder    : path.basename(path.resolve(path.dirname('patsy.JSON')))
  });

  // Do we have an object? Extend with default configuration
	if(typeof config !== 'undefined' && typeof config === 'object'){

    config = xtend( config, projectConfigDefaults );

		return config;
	}
  // Return default config if that is chosen
  else if ( typeof config !== 'undefined' && typeof config === 'string' && config == 'default' ) {

    return projectConfigDefaults;
  }
};


patsyHelpers.doesConfigExist = function(path){

  return fs.existsSync(path);
};

/**
 * Prints out scripture text if allowed to
 *
 * @param   String  output
 */
patsyHelpers.scripture = function(output){

  if(typeof program.scripture === 'undefined'){

    util.puts(output);
  }

};

/**
 * Function to create a config file with given configuration object
 *
 * @param   Object  config
 * @calls   patsyHelpers.bakeConfigFile
 * @calls   patsyHelpers.checkProject
 * @calls   patsyHelpers.createConfigFile
 */
patsyHelpers.createConfigFile = function(config){

	if(typeof config !== 'undefined'){

		try{

			config = patsyHelpers.bakeConfigFile(config);

			fs.writeFile( "patsy.json", JSON.stringify( config, null, 2 ) );

			util.print('[God]: Arthur, You may now continue with your quest!\n');

			setTimeout(function(){

				patsyHelpers.checkProject();

			},500);

		} catch(e){

			console.log(e);
			return false;
		}
	} else {

    program.prompt({
      "patsy" : {
        "project": {
          "name" : '[God]: What is the projects name? [' +  path.basename(path.resolve(path.dirname())) + ']: ',
          "js": '[God]: Where do you keep your JavaScript source files? [js/src/]: '
        },
        "build" : {
          "min": {
            "dest" : '[God]: Where do you want to save your minified files? [js/min/]: '
          },
          "docs": {
            "dest" : '[God]: Where do you want to save your documentation files? [js/docs/]: '
          },
          "css" : {
            "src" : '[God]: Where do you keep your .less and .css files? [css/src/]: ',
            "dist" : '[God]: Where do you want to save your compiled css files? [css/dist/]: '
          },
          "dist": '[God]: Where do you want to save your baked files? [js/dist/]: ',
          "tmpl": {
            "src" : '[God]: I can currently offer you mustache compiling of templates, where is your *.mustache files? [js/mustache/]: '
          }
        }
      }
    }, function(obj){

		  util.print('[God]: I will now create a scripture you can follow\n');
		  patsyHelpers.createConfigFile(obj);

		});
	}
};

/**
 * Function to load patsy configuration
 *
 * @param   String  projectPath
 * @return  Object
 */
patsyHelpers.loadPatsyConfigInCurrentProject = function(projectPath){

  if(typeof projectPath === 'undefined') var projectPath = '';

  // default encoding is utf8
  if (typeof (encoding) == 'undefined') encoding = 'utf8';

  var _fullConfigPath = projectPath + 'patsy.json';

  if(fs.existsSync(_fullConfigPath)){
    // Read file synchroneously, parse contents as JSON and return config
    return JSON.parse(fs.readFileSync(projectPath + 'patsy.json', encoding));
  } else {
    return undefined;
  }
};

/**
 * Function to check current input from stdin
 *
 * @param   String  chunk
 * @calls   patsyHelpers.die
 */
patsyHelpers.checkInput = function(chunk) {

  chunk = chunk.trim();

  if(chunk == 'exit'){

  	util.print("[King Arthur]: On second thought, let's not go to Camelot, it's a silly place.\n".yellow);
    patsyHelpers.die();

  }
};


/**
 * Kills Patsy!
 *
 */
patsyHelpers.die = function(){

  process.exit(1);
};


/**
 * Check project
 *
 * @return  Boolean
 */
patsyHelpers.checkProject = function(){

  try {
    // Get projectConfig
    var _projectConfig    = patsyHelpers.loadPatsyConfigInCurrentProject();


    if(typeof _projectConfig !== 'undefined'){

      util.print('[Patsy]: I found a scripture of configuration Sire! It reads: \n'.yellow);
      util.print('[Patsy]: "F..fo..\n'.yellow);
      util.print('[Patsy]: Foo..foo.foou..\n'.yellow);
      util.print('[Patsy]: Follow the path of "'.yellow + _projectConfig.project.path.yellow + '" to complete the quest of.. \n'.yellow);
      util.print('[Patsy]: Of.. ehm, of '.yellow + _projectConfig.project.name.yellow + '"! \n'.yellow );
      util.print("[King Arthur]: Well? Don't just stand there, saddle up! And fetch me my grunt!\n".yellow);

      patsyHelpers.loadStage(_projectConfig);

      return true;
    } else {
      util.print("[Patsy]: I'm very sorry my Liege, I can't find any configuration here.. Let's go to Camelot instead!\n".yellow);
      util.print("[King Arthur]: No! It's a silly, silly place! Stop that!\n".yellow);

      util.print("[Patsy]: Sire, do you want to create your own configuration script? Listen to the Allmighty God:\n".yellow);



      program.prompt('[God]: Well, do you? [y/n/DEFAULT] (enter for default config): ', function(proceed){

        // Did he answer yes?
  			if( proceed.search(/yes|y|j|ja/g) !== -1 ) {

  				patsyHelpers.createConfigFile();

  			}
        // Wants default?
        else if( proceed.trim() == '' ) {

          patsyHelpers.createConfigFile('default');

        }
        // No valid input
        else {

  				util.print("[King Arthur]: I can't do that!? It's to silly! I'm leaving, come Patsy! <sound of two half coconuts banging together fading out..>\n".yellow);
  				patsyHelpers.die();
  			}

			});
    }

  } catch (err) {

    return false;
  }
};


/**
 * Loads stage
 *
 * @param   Object  config
 */
patsyHelpers.loadStage = function(config){

  util.print("[Patsy]: Just putting my rucksack on my Lord!\n".yellow);


  process.chdir(patsyHelpers.appPath);



  if(process.platform == 'win32'){

    var _bin       = "cmd";
    var _cmdName   = 'node_modules\\.bin\\grunt';


    //New args will go to cmd.exe, then we append the args passed in to the list
    //  the /c part tells it to run the command.  Thanks, Windows...
    var _newArgs   = ["/c", _cmdName].concat(['--path', config.project.path]);


    var _grunt     = spawn(_bin, _newArgs);

  } else {
    var _grunt       = spawn('node_modules/.bin/grunt',['--path', config.project.path]);
  }

  util.print("[Patsy]: Here's the grunt my King!\n".yellow);

  _grunt.stderr.pipe(process.stdout);


  _grunt.stdout.on('data',function(data){

    if(String(data).trim() !== ''){

      //util.print("[Patsy]: The grunt speaks my Lord! Listen!\n".yellow);
      util.puts("[Grunt]: ".green + String(data).green + "");
    }

  });

  _grunt.stderr.on('data',function(data){
    util.print("[Patsy]: The grunt is sick my Liege! ".yellow + data.red + "\n");
  });

  _grunt.on('exit',function(code){
    util.print("[Patsy]: The grunt has buggered off! ".yellow + code.red + "\n");
    process.exit(1);
  });

  util.print("[Patsy]: Ready with the coconuts! <sound of two half coconuts banging together> .. ".yellow + "\n");

};
