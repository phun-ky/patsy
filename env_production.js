
var fs 				= require('fs');
var http  		= require('http');
var https     = require('https');
var connect   = require('connect');
var util      = require('util');
var stage     = 'production';

for(i = 0;i< 30;i++){
  util.puts(".");
}
util.puts('____________________________________________________________')
util.puts('____________________________________________________________')
util.puts('____________________________________________________________')
util.puts('-------------- 1. STARTING ROUTE ENGINE FOR PRODUCTION...');

function loadJSONfile (filename, encoding) {
	try {
		// default encoding is utf8
		if (typeof (encoding) == 'undefined') encoding = 'utf8';
		
		// read file synchroneously
		var contents = fs.readFileSync(__dirname + '/' + filename, encoding);
		// parse contents as JSON
		util.puts('-------------- 2. LOADED JSON FILE...');
		return JSON.parse(contents);
		
	} catch (err) {
		// an error occurred
		util.puts('\n!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR LOADING JSON FILE !!!!!!!!!!!!!!!!!!!!!!');
		throw err;	
	}
} // loadJSONfile

// this is what we needed to do now
var routes            = loadJSONfile('servers.JSON');
var foundMatchingURL  = false;
var currentRouteTmp   = '';

/**
 * Check url to be routed
 *
 * @param req
 * @param res
 * @param url
 * @global routes
 */
function checkUrlToBeRouted(req, res, url){

  /** Find the path needed to proceed
   * @todo This is nasty, fix this!
   */
  //util.puts(url);
	var currentRouteTmp  = url.split("/");
  //util.puts(currentRouteTmp);
  currentRoute     = "/" + currentRouteTmp[1] + "/";
  //util.puts(currentRoute);
  

  // If url is set, proceed
	if(url && routes.route[currentRoute]){
    util.puts('-------------- ROUTING SITE......');
  	routeWebsite(req, res, url, routes.route[currentRoute]);
    
  } else {
    util.puts(url + ' -> ' + routes.route[currentRoute] + ' -> ' + currentRoute);
    util.puts('\n!!!!!!!!!!!!!!!!!!!!!!!!!!! NO URL GIVEN !!!!!!!!!!!!!!!!!!!!!!!!!!!');
    throw "NoURLToMatchException";
  }
}

/**
 * Parse page result
 * 
 * @param pageResult
 * @param responseResult 
 *
 */
function parsePageResult(pageResult, res){
  var page = '';
  util.puts("-------------- GOT RESPONSE: " + pageResult.statusCode);   
  pageResult.on('data', function(chunk){
    page = page + chunk;
    util.puts(page + "\n\n");
  });  
  
  pageResult.on('error', function(e){  
    util.puts("!!!!!!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR, RESULT: " + e.message);   
  }); 
  //util.puts(pageResult);
  pageResult.on('end', function(){
    
    page = page.replace(/ href="\/\//g       , ' href="/');
    page = page.replace(/ src="\//g          , ' src="' + routes.route[currentRoute].protocol + '://'  + routes.route[currentRoute].host[stage] + '/');
    page = page.replace(/ data-src="\//g     , ' data-src="' + routes.route[currentRoute].protocol + '://' + routes.route[currentRoute].host[stage] + '/');
    page = page.replace(/ href="\//g         , ' href="' + routes.route[currentRoute].protocol + '://'  + routes.route[currentRoute].host[stage] + '/');
    res.write(page);
    res.end('');
  });
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
function routeWebsite(req, res, url, route){
  util.puts('-------------- LOADING SITE \n\n\n');
  if(route.contentType){
    res.writeHead(200, {'content-type': route.contentType + ', level=1'});
  } else {
    res.writeHead(200, {'content-type': 'text/html, level=1'});  
  }
  
  
  var options = {  
     host:    route.host[stage],        
     port:    route.port,
     path:    url,
     method:  route.method     
  };

  util.puts("-------------- CONNECTING TO: " + options.host[stage] + ':' + options.port + options.path +"\n\n");
  
  if(route.protocol == 'http'){
    var getPage = http.get(options, function(pageResult){      
      parsePageResult(pageResult, res);
      
    }).on('error', function(e){  
        util.puts("!!!!!!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR, GET: " + e.message);         
      });
  } else {
    var getPage = https.get(options, function(pageResult){      
      parsePageResult(pageResult, res);
      
    }).on('error', function(e){  
        util.puts("!!!!!!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR, GET: " + e.message);         
      });
  }
  

  
}


var port    = process.env.PORT || 8080;

/**
 * Create server
 */
var server  = http.createServer(function(req, res){
    var url     = req.url;    
    checkUrlToBeRouted(req, res, url);
      
  }).on('error', function(e){  
      util.puts("\n!!!!!!!!!!!!!!!!!!!!!!!!!!! FATAL ERROR CREATING SERVER: " + e.message);   
    });

server.listen(port);

util.puts('-------------- ACCEPTING CONNECTIONS ON PORT ' + port + '...\n\n');