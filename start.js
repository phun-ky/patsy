var fs        = require('fs');
var spawn      = require('child_process').spawn;
var util      = require('util');

var colors = require('colors');

var project = '';

var arguments = process.argv;
var stage = arguments[2];

 var stdin = process.stdin, stdout = process.stdout;

stdin.resume();
stdin.setEncoding('utf8');

stdout.write("\n\nWhat project are you working on today?: ".yellow);


function checkInput(chunk) {
  
  chunk = chunk.trim();
  if(chunk == "development" || chunk == "test"){
    loadStage(chunk);
  } else if(checkProject(chunk)){
    util.puts('1. FOUND PROJECT....');
    
    stdout.write("\n\nWhat stage are we loading today?: ".cyan);
    
  } else {
    console.log("You have to send a valid parameter to the startup file!!\n\nValid parameters: \n\n\t" + "* development\n\t* test\n\t* <project name>\n\n".green)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! Fatal Error: No valid parameter found, exiting...".red);
    process.exit(1);      
  }
}


 




function checkProject(isProject){
  try {
    // default encoding is utf8
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    
    // read file synchroneously
    var contents = fs.readFileSync(__dirname + '/' + isProject + '.JSON', encoding);


    // parse contents as JSON
    
    var tmp = JSON.parse(contents);
    project = isProject;
    return true;
    
  } catch (err) {    
    project = false;
    return false;
  }
}

stdin.on('data', checkInput);

function loadStage(stage){
  
    
    var stageServerFile   = "env_" + stage + ".js";

    //var grunt       = spawn('grunt',['--config','Gruntfile.js']);
    var stageServer = spawn('node',[stageServerFile,project]);
    
    util.puts('############## LOADING ENVIRONMENT....'.green); 
    
    /*grunt.stderr.pipe(process.stdout);
    stageServer.stderr.pipe(process.stdout);

    grunt.stdout.on('data',function(data){
      util.puts("¤¤¤¤¤¤¤¤¤¤¤¤¤¤ ".magenta + data);
    });

    grunt.stderr.on('data',function(data){
      util.puts("¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GRUNT ERROR: ".red + data);
    });

    grunt.on('exit',function(code){
      util.puts("¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GRUNT HAS FINISHED: ".magenta + code);
    });*/

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

        
    

    util.puts('############## ENVIRONMENT LOADED!'.green);
  
}