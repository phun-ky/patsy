

var patsyHelpers = module.exports = {};

var fs        = require('fs');
var colors    = require('colors');
var spawn     = require('child_process').spawn;

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util              = require('util');

var stdin     = process.stdin;
var stdout    = process.stdout;

var program 	= require('commander');


var path 			= require('path');

var _projectConfigDefaults = {
	nameOfProject								: path.basename(path.resolve(path.dirname())),
	pathToJavaScriptFiles				: 'js/src/',
	pathToMinifiedFiles					: 'js/min/',
	pathToBakedFiles						: 'js/dist/',
	pathToTemplateFiles					: 'js/mustache/',
	templatePrefix							: '',
	templatePostfix							: ''		  
};

// Set patsy's app path
patsyHelpers.appPath = path.resolve(__dirname, '..') + path.sep;

patsyHelpers.bakeConfigFile = function(config){

	if(typeof config !== 'undefined' && typeof config === 'object'){

		
		if(config.nameOfProject === ''){
			config.nameOfProject = _projectConfigDefaults.nameOfProject;
		}

		if(config.pathToJavaScriptFiles === ''){
			config.pathToJavaScriptFiles = _projectConfigDefaults.pathToJavaScriptFiles;
		}

		if(config.pathToMinifiedFiles === ''){
			config.pathToMinifiedFiles = _projectConfigDefaults.pathToMinifiedFiles;
		}

		if(config.pathToBakedFiles === ''){
			config.pathToBakedFiles = _projectConfigDefaults.pathToBakedFiles;
		}

		if(config.pathToTemplateFiles === ''){
			config.pathToTemplateFiles = _projectConfigDefaults.pathToTemplateFiles;
		}

		if(config.templatePrefix === ''){
			config.templatePrefix = _projectConfigDefaults.templatePrefix;
		}

		if(config.templatePostfix === ''){
			config.templatePostfix = _projectConfigDefaults.templatePostfix;
		}
		
		
		return config;	
	}
};

patsyHelpers.createConfigFile = function(config){

	if(typeof config !== 'undefined'){

		try{

			config = patsyHelpers.bakeConfigFile(config);

			
			
			fs.writeFile("patsy.json", JSON.stringify(config,null, 2));

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
			nameOfProject								: '[God]: What is the projects name? Defaults: [' +  path.basename(path.resolve(path.dirname())) + ']:',
      /*test : {
        a : "SHIT",
        b : "HITTED",
        c : "FAN"
      },*/
		  pathToJavaScriptFiles				: '[God]: Where do you keep your JavaScript source files? Defaults: [js/src/]: ',
		  pathToMinifiedFiles					: '[God]: Where do you want to save your minified files? Defaults: [js/min/]: ',
		  pathToBakedFiles						: '[God]: Where do you want to save your minified files? Defaults: [js/dist/]: ',
		  pathToTemplateFiles					: '[God]: I can currently offer you mustache compiling of templates, where is your *.mustache files? Defaults: [js/mustache/]: ',
		  templatePrefix							: '[God]: Do you want a template prefix? Please enter or leave blank if void: ',
		  templatePostfix							: '[God]: Do you want a template postfix? Please enter or leave blank if void'		  
		  
		}, function(obj){
		  
		  util.print('[God]: I will now create a scripture you can follow\n');
		  patsyHelpers.createConfigFile(obj);
		  
		});
	}
};

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

patsyHelpers.checkInput = function(chunk) {
  
  chunk = chunk.trim();
  if(chunk == 'exit'){
  	util.print("[King Arthur]: On second thought, let's not go to Camelot, it's a silly place.\n".yellow);
    patsyHelpers.die();
    
  } /*else {
    util.print("[King Arthur]: Oh very well then, Patsy, let us proceed with our quest!\n".yellow);
  }*/
};

patsyHelpers.die = function(){
	
  process.exit(1); 
};

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
patsyHelpers.extend = function(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};

patsyHelpers.checkProject = function(){

  try {
    // Get projectConfig   
    var _projectConfig    = patsyHelpers.loadPatsyConfigInCurrentProject();
    var _projectPath      = path.resolve(path.dirname('patsy.JSON'));

    if(typeof _projectConfig !== 'undefined'){

      _projectConfig = patsyHelpers.extend(_projectConfig,{
        projectPath         : _projectPath + path.sep,
        
        projectFolderName   : path.basename(_projectPath)
      });     
      
      

      util.print('[Patsy]: I found a scripture of configuration Sire! It reads: \n'.yellow);
      util.print('[Patsy]: "F..fo..\n'.yellow);
      util.print('[Patsy]: Foo..foo.foou..\n'.yellow);
      util.print('[Patsy]: Follow the path of "'.yellow + _projectConfig.projectPath.yellow + '" to complete the quest of.. \n'.yellow);
      util.print('[Patsy]: Of.. ehm, of '.yellow + _projectConfig.nameOfProject.yellow + '"! \n'.yellow );      
      util.print("[King Arthur]: Well? Don't just stand there, saddle up! And fetch me my grunt!\n".yellow);

      patsyHelpers.loadStage(_projectConfig);

      return true;
    } else {
      util.print("[Patsy]: I'm very sorry my Liege, I can't find any configuration here.. Let's go to Camelot instead!\n".yellow);
      util.print("[King Arthur]: No! It's a silly, silly place! Stop that!\n".yellow);
      
      util.print("[Patsy]: Sire, do you want to create your own configuration script? Listen to the Allmighty God:\n".yellow); 
      
      

      program.prompt('[God]: Well, do you?:  ', function(proceed){
  			
  			
  			
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

patsyHelpers.loadStage = function(config){
  
  util.print("[Patsy]: Just putting my rucksack on my Lord!\n".yellow); 

  
  process.chdir(patsyHelpers.appPath);



  if(process.platform == 'win32'){

    var _bin       = "cmd";
    var _cmdName   = 'grunt';
    //New args will go to cmd.exe, then we append the args passed in to the list
    //  the /c part tells it to run the command.  Thanks, Windows...
    var _newArgs   = ["/c", _cmdName].concat(['--path', config.projectPath]);  

    
    var _grunt     = spawn(_bin, _newArgs);
    
  } else {
    var _grunt       = spawn('grunt',['--path', config.projectPath]); 
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