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

/**
 * Function to bake a config file with given configuration and config defaults
 *
 * @param   Object  config
 * @return  Object  config 
 */
patsyHelpers.bakeConfigFile = function(config){

  // Extend objects with missing values
  projectConfigDefaults.patsy.project = xtend(projectConfigDefaults.patsy.project, {
    name              : path.basename(path.resolve(path.dirname())),
    path              : path.resolve(path.dirname('patsy.JSON')) + path.sep,
    project_folder    : path.basename(path.resolve(path.dirname('patsy.JSON')))
  });

	if(typeof config !== 'undefined' && typeof config === 'object'){
    
    config = xtend( config, projectConfigDefaults );

		return config;	
	}
};


/**
 * Prints out scripture text if allowed to
 *
 * @param   String  output 
 */
patsyHelpers.scripture = function(output){

  if(typeof program.scripture == 'undefined'){

    stdout.write(output);
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
          "name" : '[God]: What is the projects name? Defaults: [' +  path.basename(path.resolve(path.dirname())) + ']:',            
          "js": '[God]: Where do you keep your JavaScript source files? Defaults: [js/src/]: '
        },        
        "build" : {
          "min": {
            "src" : '[God]: Where do you want to save your minified files? Defaults: [js/min/]: '            
          },
          "dist": '[God]: Where do you want to save your baked files? Defaults: [js/dist/]: ',
          "tmpl": {
            "src" : '[God]: I can currently offer you mustache compiling of templates, where is your *.mustache files? Defaults: [js/mustache/]: ',
            "templatePrefix": '[God]: Do you want a template prefix? Please enter or leave blank if void: ',
            "templatePostfix": '[God]: Do you want a template postfix? Please enter or leave blank if void' 
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
    
  } /*else {
    util.print("[King Arthur]: Oh very well then, Patsy, let us proceed with our quest!\n".yellow);
  }*/
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
      util.print('[Patsy]: Follow the path of "'.yellow + _projectConfig.patsy.project.path.yellow + '" to complete the quest of.. \n'.yellow);
      util.print('[Patsy]: Of.. ehm, of '.yellow + _projectConfig.patsy.project.name.yellow + '"! \n'.yellow );      
      util.print("[King Arthur]: Well? Don't just stand there, saddle up! And fetch me my grunt!\n".yellow);

      patsyHelpers.loadStage(_projectConfig);

      return true;
    } else {
      util.print("[Patsy]: I'm very sorry my Liege, I can't find any configuration here.. Let's go to Camelot instead!\n".yellow);
      util.print("[King Arthur]: No! It's a silly, silly place! Stop that!\n".yellow);
      
      util.print("[Patsy]: Sire, do you want to create your own configuration script? Listen to the Allmighty God:\n".yellow); 
      
      

      program.prompt('[God]: Well, do you?: [y/N]  ', function(proceed){
  			
  			if( proceed.search(/yes|y|j|ja/g) !== -1){

  				patsyHelpers.createConfigFile();

  			} else {

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
    var _newArgs   = ["/c", _cmdName].concat(['--path', config.patsy.project.path]);  

    
    var _grunt     = spawn(_bin, _newArgs);
    
  } else {
    var _grunt       = spawn('node_modules/.bin/grunt',['--path', config.patsy.project.path]); 
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