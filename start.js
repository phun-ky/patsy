var fs        = require('fs');
var spawn      = require('child_process').spawn;
var util      = require('util');

var colors = require('colors');

var project = '';

var arguments = process.argv;
var stage = arguments[2];

 var stdin = process.stdin, stdout = process.stdout;

 
var path = '';


stdin.resume();
stdin.setEncoding('utf8');

stdout.write("\n\nWhat project are you working on today?: ".yellow);



function checkInput(chunk) {
  
  chunk = chunk.trim();
  if(chunk == 'nostage'){
    
    loadEnvironment();
  } else if(chunk == "development" || chunk == "test"){
    
    loadEnvironment(chunk);
  } else if(checkProject(chunk)){
    util.puts('1. FOUND "' + project + '" PROJECT....');
    
    stdout.write('\n\nWhat stage are we loading for "' + project.cyan + '":');
    
  } else {
    console.log("You have to send a valid parameter to the startup file!!\n\nValid parameters: \n\n\t* <project name>\n\n".green)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! Fatal Error: No valid parameter found, exiting...".red);
    process.exit(1);      
  }
}


 




function checkProject(isProject){
  try {
    // default encoding is utf8
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    
    // read file synchroneously
    var contents = fs.readFileSync('../' + isProject + '/patsy.JSON', encoding);

    // parse contents as JSON
      
    var tmp = JSON.parse(contents);
    
    project = isProject;
    path = '../' + isProject + tmp.webroot;

    return true;
    
  } catch (err) {    

    project = false;
    return false;
  }
}

stdin.on('data', checkInput);

function loadEnvironment(stage){
  
  util.puts('############## LOADING ENVIRONMENT....'.green); 

    if(typeof stage !== 'undefined'){
      var stageServerFile   = "env_" + stage + ".js";  
      var stageServer = spawn('node',[stageServerFile,project]);
      util.puts('############## LOADING STAGE....'.green); 
      stageServer.stderr.pipe(process.stdout);
      stageServer.stdout.on('data',function(data){
        util.puts("-------------- ".yellow + data);
      });

      stageServer.stderr.on('data',function(data){
        util.puts("-------------- STAGE ERROR: ".red + data);
      });

      stageServer.on('exit',function(code){
        util.puts("-------------- STAGE IS SHUT DOWN: ".yellow + code);
        process.exit(1);
      });

    }
    

    if(process.platform == 'win32'){

      var bin = "cmd";
      var cmdName = 'grunt';
      //New args will go to cmd.exe, then we append the args passed in to the list
      newArgs = ["/c", cmdName].concat(['--config', 'Gruntfile.js','--path', path, '--project',project]);  //  the /c part tells it to run the command.  Thanks, Windows...
      var grunt = spawn(bin, newArgs);
      
    } else {
      var grunt       = spawn('grunt',['--config', 'Gruntfile.js','--path', path, '--project',project]); 
    }

    
    util.puts('############## LOADING GRUNT....'.magenta); 
    
    
    grunt.stderr.pipe(process.stdout);
    

    grunt.stdout.on('data',function(data){
      util.puts("¤¤¤¤¤¤¤¤¤¤¤¤¤¤ ".magenta + data);
    });

    grunt.stderr.on('data',function(data){
      util.puts("¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GRUNT ERROR: ".red + data);
    });

    grunt.on('exit',function(code){
      util.puts("¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GRUNT HAS FINISHED: ".magenta + code);
    });

    
        
    

    util.puts('############## ENVIRONMENT LOADED!'.green);
  
}