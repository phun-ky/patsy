#! /usr/bin/env node

var fs        = require('fs');
var spawn     = require('child_process').spawn;
var util      = require('util');
var colors    = require('colors');

var arguments = process.argv;
var stage     = arguments[2];
var stdin     = process.stdin, stdout = process.stdout;
 
var path      = '';
var project   = '';

var appPath   = require('path').dirname(require.main.filename) + "/";
var projectPath;

stdin.resume();
stdin.setEncoding('utf8');

stdout.write("Come Patsy, my trusty servant!! <sound of two half coconuts banging together> .. \n".yellow);

checkProject();

function checkInput(chunk) {
  
  chunk = chunk.trim();
  if(chunk == 'exit'){
    stdout.write("Exiting.. May the force be with you!\n");
    process.exit(1); 
    
  } 
}

function checkProject(){
  try {
    // default encoding is utf8
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    
    // read file synchroneously
    var contents = fs.readFileSync('patsy.JSON', encoding);
    
    // parse contents as JSON      
    var projectConfig = JSON.parse(contents);

    projectPath   = require('path').resolve(require('path').dirname('patsy.JSON'));
    
    if(typeof projectConfig.webroot !== 'undefined'){
      path    = projectPath + projectConfig.webroot;  
    } else {
      path    = projectPath + '/';
    }
    project = require('path').basename(projectPath);

    stdout.write('Found project "' + project + '" on path "' + path + '", continuing.. \n' );
    

    loadStage();

    return true;
    
  } catch (err) {    

    project = false;
    return false;
  }
}

stdin.on('data', checkInput);

function loadStage(){
  
  util.puts('Loading build system....'.green); 

    if(typeof stage !== 'undefined'){
      var stageServerFile   = "stage.js";  
      var stageServer = spawn('node',[stageServerFile,project]);
      
      stageServer.stderr.pipe(process.stdout);
      stageServer.stdout.on('data',function(data){
        util.puts("".yellow + data);
        
      });

      stageServer.stderr.on('data',function(data){
        util.puts("Stage error: ".red + data);
      });

      stageServer.on('exit',function(code){
        util.puts("Stage is exiting: ".yellow + code);
        process.exit(1);
      });

    }

    console.log(appPath + 'Gruntfile.js');

    process.chdir(appPath);

    if(process.platform == 'win32'){

      var bin = "cmd";
      var cmdName = 'grunt';
      //New args will go to cmd.exe, then we append the args passed in to the list
      newArgs = ["/c", cmdName].concat(['--config', appPath + 'Gruntfile.js','--path', path, '--project',project]);  //  the /c part tells it to run the command.  Thanks, Windows...
      var grunt = spawn(bin, newArgs);
      
    } else {
      var grunt       = spawn('grunt',['--config', appPath + 'Gruntfile.js','--path', path, '--project',project]); 
    }

    
    util.puts('Loading GruntJS....'.magenta); 
    
    
    grunt.stderr.pipe(process.stdout);
    

    grunt.stdout.on('data',function(data){
      util.puts("".magenta + data);
      
    });

    grunt.stderr.on('data',function(data){
      util.puts("GruntJS error: ".red + data);
    });

    grunt.on('exit',function(code){
      util.puts("GruntJS exiting: ".magenta + code);
              process.exit(1);

    });

    
        
    

    util.puts('Build system loaded'.green);
  
}