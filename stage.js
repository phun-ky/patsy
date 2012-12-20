
// Load modules into vars
var fs        = require('fs');
var http      = require('http');
var https     = require('https');
var connect   = require('connect');
var util      = require('util');
var static    = require('node-static');

// Set current stage
var stage     = 'dev';

// log streams
var access_log  = fs.createWriteStream('access.log', {'flags': 'w'});
var routing_log = fs.createWriteStream('route.log', {'flags': 'w'});

/*

@todo Set up the environment files to fetch local files when routed host is unreachable, 
so developers can still program locally. perhaps a service that downloads all requested files and stores them respectively?
*/


var arguments = process.argv;
var project   = arguments[2];


util.puts('1. STARTING ROUTE ENGINE FOR DEVELOPMENT STAGE...');

function loadJSONfile (filename, encoding) {
  try {
    // default encoding is utf8
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    
    // read file synchroneously
    var contents = fs.readFileSync('../'+ project + '/patsy.JSON', encoding);    


    // parse contents as JSON
    util.puts('2. LOADED JSON FILE...');
    return JSON.parse(contents);
    
  } catch (err) {
    // an error occurred
    util.puts('\n!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR LOADING JSON FILE !!!!!!!!!!!!!!!!!!!!!!');
    throw err;  
  }
} // loadJSONfile

// this is what we needed to do now

var projectSettings   = loadJSONfile(project + '.JSON');
var routes            = projectSettings.routes;
var foundRoute        = false;
var currentRoute      = '';
var currentRouteTmp   = '';
var serverRunning     = false;

// Start fileserver
var file              = new(static.Server)('../' + project + projectSettings.webroot, { cache: 0, headers: {"Cache-Control": "no-cache, must-revalidate"} });

/**
 * Check if URL is to be routed
 * 
 * @param url
 * @global routes
 */
function isRoutable(url){

  // To support paths linked with // to preserve relative protocol
  url = url.replace("//","/");

  /** Find the path needed to proceed
   * @todo This is nasty, fix this!
   */
  //util.puts(url);
  if(url != '/'){
    var currentRouteTmp  = url.split("/");
    
    currentRoute      = "/" + currentRouteTmp[1] + "/";
    
  } else {
    currentRoute = false;
  }  

  // If url is set, proceed
  if(routes.route.hasOwnProperty(currentRoute) && currentRoute !== false){        
    
    return true;
  } else {    
    
    currentRoute = false;
    return false;
  }  
}

function accessLog(logContent){

  
  access_log.write(logContent + "\n");

}

function routingLog(logContent){

  routing_log.write(logContent + "\n");

}

function errorLog(){


}

/**
 * Route incoming request to matched route
 * 
 * @param req
 * @param res
 * @param url
 * @param route 
 *
 */
function routeWebsite(webreq, webres, url){
  
  if(currentRoute){
    //util.puts('ROUTING PATH......' + url + ' : ' + currentRoute);
    var options = {  
       hostname:    routes.route[currentRoute].hostname[stage],        
       port:    routes.route[currentRoute].port,
       path:    url,
       method:  routes.route[currentRoute].method       
    };

    if(routes.route[currentRoute].headers !== false){
      
      options.headers = routes.route[currentRoute].headers;
    }
    var _contentType = '', page = '';

    //util.puts("CONNECTING TO: \n\n" + options.hostname + ':' + options.port + options.path +"\n\n");

    if(routes.route[currentRoute].contentType){
      webres.writeHead(200, {'content-type': routes.route[currentRoute].contentType + ', level=1'});
      _contentType = routes.route[currentRoute].contentType;
    } else {      
      webres.writeHead(200, {'content-type': 'text/html, level=1'});  
      _contentType = 'text/html';
    }

    // Check for protocol
    if(routes.route[currentRoute].protocol == 'http'){
      
      var req = http.request(options, function(res){      
        
        res.setEncoding('utf8');

        res.on('data', function(chunk){
          page += chunk;
          
          if(_contentType == 'text/html'){
            
            page = page.replace(/ href="\/\//g       , ' href="/');
            page = page.replace(/ src="\//g          , ' src="http://'  + routes.route[currentRoute].hostname[stage] + '/');
            page = page.replace(/ data-src="\//g     , ' data-src="http://' + routes.route[currentRoute].hostname[stage] + '/');
            page = page.replace(/ href="\//g         , ' href="http://'  + routes.route[currentRoute].hostname[stage] + '/');

          }
          

          webres.write(page);
          webres.end();
        });    

        res.on('error', function(e){
          util.puts(url);
          util.puts(e);
          webreq.abort();
          server.close();
          process.exit(1);   
        });
        
        res.on('end', function(){
          var now = new Date().toJSON();
          routingLog(options.hostname + ':' + options.port + options.path + ' [' + now + '] HTTP ' + _contentType) ;
             
        });
       

      });

      
    } else if(routes.route[currentRoute].protocol == 'https'){


      

      var req = https.request(options, function(res){      
        
        res.setEncoding('utf8');

        res.on('data', function(chunk){
          page += chunk;
          
          if(_contentType == 'text/html'){
          
            page = page.replace(/ href="\/\//g       , ' href="/');
            page = page.replace(/ src="\//g          , ' src="https://'  + routes.route[currentRoute].hostname[stage] + '/');
            page = page.replace(/ data-src="\//g     , ' data-src="https://' + routes.route[currentRoute].hostname[stage] + '/');
            page = page.replace(/ href="\//g         , ' href="https://'  + routes.route[currentRoute].hostname[stage] + '/');
            
          }
          
          webres.write(page);
          webres.end();
        });    

        res.on('error', function(e){
          util.puts(url);
          util.puts(e);
          webreq.abort();
          server.close();
          process.exit(1);   
        });
        
        res.on('end', function(){
          var now = new Date().toJSON();    
          routingLog(options.hostname + ':' + options.port + options.path + ' [' + now + '] HTTPS') ;
             
        });
        

      });
      


    }


    req.end();
    webreq.on('error', function(e){  

      pageGetError(e);
    });

    
    
    
    
    var pageGetError = function(e){
      util.puts("!!!!!!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR, GET: " + e.code + ' Error: ' + e.message);         
      if(e.code == 'ETIMEDOUT'){
        util.puts("You might want to figure out why the request timed out!");
      } else if(e.code == 'ECONNRESET'){
        util.puts("You might want to figure out why the socket hangs up!");

      } else {
        util.puts(e.code + " " + e.message);
      }
      util.puts('\n\nSHUTTING DOWN...\n\n') ;
      req.log('Closing server') ;
      webreq.end();
      
      server.close();
      process.exit(1);      
    }  
  }
}

function getClientAddress(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

/**
 * Serve static files
 * 
 * @param req
 * @param res
 * @todo Add a content type checker on files to serve correct content type in serveStaticFiles method
 */
function serveStaticFiles(webreq, webres){
  
  webreq.addListener('end', function(){

    
    //
    // Serve files!
    //
    file.serve(webreq, webres, function (err, response) {
      
        var now = new Date().toJSON();
      
        
        if (err) { // An error as occured
            util.puts("ERROR ->  " + webreq.url + " - " + err.message);
            webres.writeHead(err.status, err.headers);
            webres.end();
        } else { // The file was served successfully
            var contentType = webres.getHeader('content-type');
            webres.writeHead(200, {'content-type': contentType + ', level=1'});  
            
            accessLog(getClientAddress(webreq) + ' [' + now + '] "GET ' + webreq.url + ' HTTP/' + webreq.httpVersion + '" ' + webres.statusCode + ' ' + webres.getHeader('content-length'));
            
            webres.end();
        }
      

    });
  });
}

var port    = process.env.PORT || 8094;

util.puts("3. CREATING SERVER ON PORT " + port + "..");

/**
 * Create server
 */

var server  = http.createServer( function(webreq, webres){
    
    var url     = webreq.url;    
    
    

    // Is url routable (Do we have a match from routes.JSON?)
    if(isRoutable(url)){      
      

      routeWebsite(webreq, webres, url);
    } else {
      // Serve local files
      
      serveStaticFiles(webreq, webres);
    }
      
  });
  
  server.on('error', function(e){  
      util.puts("\n!!!!!!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR CREATING SERVER: " + e.message);   
    });




server.listen(port);

