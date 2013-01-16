/**
 * File containing functions for patsy
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    patsyHelpers.js
 */
 /*jslint node: true */
'use strict';
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

/**
 * Varholder for spawned grunt
 *
 * @var     Object
 */
var grunt;

/**
 * Require proxy from the library
 *
 * @var     Object
 * @source  patsy
 */
//var proxy      = require('./proxy/proxy.js');

/**
 * Require http-proxy plugin
 *
 * @var     Object
 */
var httpProxy     = require('http-proxy');



patsyHelpers.gruntConfig            = '';

// Set patsy's app path
patsyHelpers.appPath                = path.resolve(__dirname, '..') + path.sep;


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
  projectConfigDefaults.project.details = xtend(projectConfigDefaults.project.details, {
    name      : path.basename(path.resolve(path.dirname()))
  });

  projectConfigDefaults.project.environment = xtend(projectConfigDefaults.project.environment, {
    abs_path  : path.resolve(path.dirname('patsy.JSON')) + path.sep,
    root      : path.basename(path.resolve(path.dirname('patsy.JSON')))
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


patsyHelpers.isArray = function(value){


  return Array.isArray(value);
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
          "details" : {
            "name" : '[God]: What is the projects name? [' +  path.basename(path.resolve(path.dirname())) + ']: '
          }
        },
        "build" : {
          "js": '[God]: Where do you keep your JavaScript source files? [js/src/]: ',
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

patsyHelpers.validateJSONConfig = function(config_json){


  var Validator     = require(patsyHelpers.appPath  + '/node_modules/jsonschema/lib/validator');

    var _config_json_schema = fs.readFileSync(patsyHelpers.appPath + 'lib/json/patsy.schema.json', 'utf8');



  // Person model
  var schema = JSON.parse(_config_json_schema);

  var p = config_json;

  var v = new Validator();

  var result = v.validate(p, schema);

  if(result.length !== 0){

    if(program.verbose){
      console.log('>> FAIL: '.red + result[0].property + ' ' + result[0].message);
    }

    return false;
  } else {

    if(program.verbose){
      console.log('>> '.green + 'JSON configuration for ' + p.project.details.name + ' is valid according to the ' + schema.id + 'schema.\n');
    }
    return true;
  }


};

/**
 * Function to load patsy configuration
 *
 * @param   String  projectPath
 * @return  Object
 */
patsyHelpers.loadPatsyConfigInCurrentProject = function(project_path){

  if(typeof project_path === 'undefined'){

    if(program.verbose){

      util.print('>>'.yellow + ' NOTICE'.cyan + ': Loading project configuration: No project path set, declaring path to CWD.'.white + '\n');
    }
    project_path = process.cwd() + path.sep;
  }



  var _path_to_config  = project_path + 'patsy.json';

  if(fs.existsSync(_path_to_config)){

    if(program.verbose){

      util.print('>>'.green + ' Loading project configuration: File found, loading configuration.'.white + '\n');
    }
    // Read file synchroneously, parse contents as JSON and return config

var _config_json;

try{
    _config_json        = require(_path_to_config);
  } catch (e){
    console.log(e);
  }
    if(patsyHelpers.validateJSONConfig(_config_json)){
      patsyHelpers.config = _config_json;


    } else {
      util.print("[Patsy]: Sire! The configuration script is not valid! We have to turn around!\n".yellow);
      patsyHelpers.die();
    }


    patsyHelpers.config.project.environment.rel_path = path.relative(patsyHelpers.appPath, patsyHelpers.config.project.environment.abs_path) + path.sep;

    return patsyHelpers.config;
  } else {
    if(program.verbose){

      util.print('>> FAIL: '.red + ' Loading project configuration: Could not find configuration file!'.white + '\n');
    }
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

  } else if(chunk == 'test') {
    util.print("[Patsy]: Running tests!\n".yellow);
    patsyHelpers.runTests();

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
      util.print('[Patsy]: Follow the path of "'.yellow + _projectConfig.project.environment.abs_path.yellow + '" to complete the quest of.. \n'.yellow);
      util.print('[Patsy]: Of.. ehm, of '.yellow + _projectConfig.project.details.name.yellow + '"! \n'.yellow );
      util.print("[King Arthur]: Well? Don't just stand there, saddle up! And fetch me my grunt!\n".yellow);
      patsyHelpers.setup();

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
        else if( proceed.trim() === '' ) {

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


  patsyHelpers.loadProxy(config);
  patsyHelpers.loadStaticFileServer(config);
  patsyHelpers.loadGrunt(config);



};

patsyHelpers.loadStaticFileServer = function(config){
  /*if(program.verbose){
    util.print("loadStaticFileserver: Starting server...");
  }

  patsyHelpers.static_server  = proxy.startStaticFileServer(config.project.environment.webroot || "/");*/
};

patsyHelpers.loadProxy = function(config){

  if(program.verbose){
    util.puts('[Proxy]:'.magenta + ' Starting server...');
    //proxy.verbose = true;
  }

  var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
httpProxy.createServer(function (req, res, proxy) {
  //
  // Put your custom server logic here
  //
  var proxyOpts = {};

  if (req.url.match('/api/open/prognosis')) {
    req.url = req.url.replace('/api/open/prognosis', '/prognosis-rest-api/open/prognosis');
    proxyOpts = {
      host: 'alt-stb-002.stb.local',
      port: 12010
    };

  } else if ( req.url.match('/sb-js')){

    proxyOpts = {
      host: 'www2.storebrand.no',
        port: 443,
        https: true
    };
  } else {
    proxyOpts = {
      host: 'localhost',
      port: 8094
    };
  }



  proxy.proxyRequest(req, res, proxyOpts);


}).listen(8000);



/*

  // Set up port
  var _port           = config.project.environment.port || process.env.PORT;
  // Set up static server


  // Load server to listen to incoming URLs
  var _server         = proxy.createServer(function(webres, webreq){

    var url     = webres.url;

    var opts    = {};

    // Only process requests when we have a URL
    if(url){
      // Is url routable (Do we have a match from the projects patsy config?)
      if(proxy.isUrlRoutable(config.proxy.resources, url)){

        opts = {
          webres : webres,
          webreq: webreq,
          url: url,
          route: proxy.getMatchedRouteObject(),
          headers: config.proxy.options.headers || {}
        };



        // Route path
        proxy.route(opts);
      } else {

        // Serve local files
        proxy.serveStaticFiles(patsyHelpers.static_server, webreq, webres);
      }
    }
  });

  _server.on('error', function(e){
    util.puts("\n!!!!!!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR CREATING SERVER: " + e.message);
  });

  _server.listen(_port);*/

};

patsyHelpers.loadGrunt = function(config){

  if(process.platform == 'win32'){

    var _bin       = "cmd";
    var _cmdName   = 'node_modules\\.bin\\grunt';

    //New args will go to cmd.exe, then we append the args passed in to the list
    //  the /c part tells it to run the command.  Thanks, Windows...
    var _newArgs   = ["/c", _cmdName].concat(['--path', config.project.environment.abs_path]);

    if(program.verbose){

      util.print('Loading grunt: ' + _bin.magenta.inverse + ' /c ' + _cmdName.cyan + ' --path ' + config.project.environment.abs_path.cyan + '\n');
    }

    grunt     = spawn(_bin, _newArgs);

  } else {

    if(program.verbose){

      util.print('Loading grunt: ' + 'node_modules/.bin/grunt '.magenta.inverse + ' --path ' + config.project.environment.abs_path.cyan + '\n');
    }

    grunt       = spawn('node_modules/.bin/grunt',['--path', config.project.environment.abs_path]);
  }

  util.print("[Patsy]: Here's the grunt my King!\n".yellow);

  grunt.stderr.pipe(process.stdout);


  grunt.stdout.on('data',function(data){
    data = String(data).trim();
    if(data !== ''){

      //util.print("[Patsy]: The grunt speaks my Lord! Listen!\n".yellow);
      util.puts("[Grunt]: ".green + data + "");
    }

  });

  grunt.stderr.on('data',function(data){
    util.print("[Patsy]: The grunt is sick my Liege! ".yellow + data.red + "\n");
  });

  grunt.on('exit',function(code){
    util.print("[Patsy]: The grunt has buggered off! ".yellow + code.red + "\n");
    process.exit(1);
  });
};

patsyHelpers.runTests = function(){

  patsyHelpers.runGruntTasks('test');


};

patsyHelpers.runPatsyTest = function(){

  console.log('Running patsy test');

  process.exit();
};

patsyHelpers.setup = function(){

  if(typeof patsyHelpers.config === 'undefined'){

    if(program.verbose){

      util.print('>> NOTICE: '.yellow + ' Setup: Configuration is not defined, trying to define config..'.white + '\n');
    }
    patsyHelpers.loadPatsyConfigInCurrentProject();

  } else {
    if(program.verbose){

      util.print('>> '.green + 'Setup'.white.underline + ': Configuration is defined, continuing..'.white + '\n');
    }
  }


  if(typeof patsyHelpers.config.project.options !== 'undefined' && patsyHelpers.config.project.options.watch_config){

    if(program.verbose){

      util.print('Watching project configuration file: '.white + path.resolve('patsy.json').cyan + '\n');
      util.print('Waiting...');
    }

    // Set up watch on the current projects configuration file
    fs.watchFile('patsy.json', { persistent: true, interval: 1000 }, function (curr, prev) {

      var _currTS = new Date(curr.mtime);
      var _prevTS = new Date(prev.mtime);

      if(_currTS.getTime() > _prevTS.getTime() ){
        if(program.verbose){

          util.print('OK'.green + '\n');
        }

        util.print('\n[Patsy]: The configuration file has changed! Should I reload it Sire?'.yellow);
        program.confirm(': ', function(ok){
          if(ok){
            patsyHelpers.loadPatsyConfigInCurrentProject();
          } else {
            util.puts('[Patsy]: Ok then, we will continue with this current config'.yellow);
          }
        });
      }

    });


  } else {

    if(program.verbose){

      util.print('>> '.green + 'Setup'.white.underline + ': Not watching project configuration file.\n'.white);
    }
  }

};

 patsyHelpers.isPathNegated = function(path){
  // if path is negated remove negate
  if(path.indexOf('!') === 0){
    return true;
  } else {
    return false;
  }
};

patsyHelpers.updateRelativePaths = function(relativeProjectPath, relative){
  var src = [];
  var complete_path;

  if(patsyHelpers.isArray(relative)){
    // For each path, check if path is negated, if it is, remove negation
    relative.forEach(function(path){

      if(patsyHelpers.isPathNegated(path)){

        path = path.slice(1);
        complete_path = '!' + relativeProjectPath + path;
      } else {

        complete_path = relativeProjectPath + path;
      }

      src.push(complete_path);

    });
  } else {

    if(patsyHelpers.isPathNegated(relative)){

      path = relative.slice(1);
      complete_path = '!' + relativeProjectPath + path;
    } else {

      complete_path = relativeProjectPath + relative;
    }

    src = complete_path;
  }


  return src;

};

patsyHelpers.runGruntTasks = function(how){
  var exec = require('child_process').exec,
    child, execCmd;

    patsyHelpers.loadPatsyConfigInCurrentProject();



    process.chdir(patsyHelpers.appPath);

    if(process.platform == 'win32'){

      var _bin       = "cmd";
      var _cmdName   = 'node_modules\\.bin\\grunt';


      //New args will go to cmd.exe, then we append the args passed in to the list
      //  the /c part tells it to run the command.  Thanks, Windows...
      var _newArgs   = ["/c", _cmdName].concat(['--path', patsyHelpers.config.project.environment.abs_path]);


      execCmd     = 'cmd /c node_modules\\.bin\\grunt --path ' + patsyHelpers.config.project.environment.abs_path + ' ' + how;

    } else {

      execCmd       = 'node_modules/.bin/grunt --path ' + patsyHelpers.config.project.environment.abs_path + ' ' + how;
    }

    child = exec(execCmd,
      function (error, stdout, stderr) {

        util.print(stdout);

        if(stderr){

          console.log('[Patsy]: The grunt is sick my Liege! '.yellow  + stderr.red);
        }

        if (error !== null) {

          console.log('[Patsy]: The grunt died! '.yellow  + error);
          process.exit(1);
        }


    });


};
