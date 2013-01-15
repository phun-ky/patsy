/**
 * File for patsy's proxy needs
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    proxy.js
 */
 /*jslint node: true */
'use strict';

/**
 * Set up proxy variable to be exported
 *
 * @var   Object
 */
var proxy         = module.exports = {};

/**
 * Require file system plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var fs            = require('fs');

/**
 * Require http plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var http          = require('http');

/**
 * Require url plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var node_url      = require('url');

/**
 * Require https plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var https         = require('https');

/**
 * Require connect plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var connect       = require('connect');

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util            = require('util');

/**
 * Require xtend plugin for deep object extending
 *
 * @var     Object
 */
var xtend         = require('xtend');

/**
 * Require node-static plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var node_static    = require('node-static');

proxy.verbose = false;

proxy.matchedRouteObject = false;

/**
 * Vars for log stream
 *
 * @var     Stream 
 */
var access_log    = fs.createWriteStream('access.log', {'flags': 'w'});
var routing_log   = fs.createWriteStream('route.log', {'flags': 'w'});

/**
 * Start static file server
 * 
 * @param   String  www_root 
 * @param   Object  options
 */
proxy.startStaticFileServer = function(www_root, options){
  options = options || { cache: 0, headers: {"Cache-Control": "no-cache, must-revaliate"} };
  if(typeof www_root === 'undefined'){

    return false;
  } else {

    return  new(node_static.Server)(www_root, options);
  }
};

/**
 * Check if URL is to be routed
 * 
 * @param url 
 */
proxy.isUrlRoutable = function(routes, url){

  if(typeof routes === 'undefined' || typeof url === 'undefined'){

    console.log('[Proxy]:'.magenta + ' No paths?! You have to give me paths so I can guide you to the correct trail!\n');

    if(proxy.verbose){

      console.log('>>'.red + ' Proxy: Routes or url is not defined\n');
    }
    return false;
  } else {

    return proxy.matchRoute(routes, url);
    
  }

  // To support paths linked with // to preserve relative protocol
//  url = url.replace("//","/");

  /** Find the path needed to proceed
   * @todo This is nasty, fix this!
   */
  //util.puts(url);
  /*
  if(url != '/'){
    var currentRouteTmp  = url.split("/");
    
    //currentRoute      = "/" + currentRouteTmp[1] + "/";
    
  } else {
    //currentRoute = false;
  }  

  // If url is set, proceed
  if(routes.route.hasOwnProperty(currentRoute) && currentRoute !== false){        
    
    return true;
  } else {    
    
    currentRoute = false;
    return false;
  }  */
};

proxy.matchRoute = function(routes, url_to_match){

  var _found_valid_route = false;

  var _isRoutePartOfURL = function(path, url){

    if(path !== '/' && url !== '/'){
      
      path  = String(path).substr(1);
      url   = String(url).substr(1);
      
      return url.indexOf(path) !== -1;
    } else {

      return false;
    }
  };

  if(typeof routes === 'object' && url_to_match){

    routes.forEach(function(resource){
      
      if(url_to_match == resource.path || _isRoutePartOfURL(resource.path, url_to_match)){

        _found_valid_route = true;        
        proxy.matchedRouteObject  = resource;

      } 
    });

    if(_found_valid_route){



      if(proxy.verbose){
        console.log('[Proxy]:'.magenta + ' Found valid route ' + url_to_match.cyan);
      }
      return true;
    } else {

      if(proxy.verbose){
        console.log('[Proxy]:'.magenta + ' No valid route found');
      }

      return false;
    }

  } else {

    if(proxy.verbose){
      console.log('>>'.red + ' FAIL: matchRoute: required variables not set');
    }
    
    return false;
  }
};

proxy.writeAccessLog = function(logContent){

  
  access_log.write(logContent + "\n");

};

proxy.writeRoutingLog = function(logContent){

  routing_log.write(logContent + "\n");

};

proxy.getMatchedRouteObject = function(path){
  return proxy.matchedRouteObject;
};

/**
 * Route incoming request to matched route
 * 
 * @param   Object  opts
 *
 */
proxy.route = function(opts){
  
  console.log('in proxy.route');

  if(opts){
    
    var _route  = opts.route;
    var _webres = opts.webres;
    var _webreq = opts.webreq;
    var _parsed_route_url;

    if(typeof _route.pass === 'object'){

      console.log('No support for passing staged environment routes!');

    } 
    else {
      _parsed_route_url = node_url.parse(_route.pass);

      var options = {
        hostname : _parsed_route_url.hostname,
        path: _parsed_route_url.pathname,
        port: _parsed_route_url.port || _route.port || 80,
        method: _route.method || 'GET',
        headers: opts.headers || {}
      };      

      console.log(options);
      
      var _resultHandler = function(res){
        //res.setEncoding('utf8');
        var page  = '';
        var content_type = res.headers['content-type'] || 'text/html';
_webreq.writeHead(200, {'content-type': content_type });
        res.on('data', function(chunk){

          page += chunk;          
          /*console.log('_webreq',_webreq );
          util.puts('__________________________________\n\n\n####################################');
          console.log('_webres',_webres);
          util.puts('__________________________________\n\n\n####################################');
          console.log('res', res);
          util.puts('__________________________________\n\n\n####################################');*/
          

          
            
          

          if(content_type == 'text/html'){
            
            page = page.replace(/ href="\/\//g       , ' href="/');
            page = page.replace(/ src="\//g          , ' src="http://'  + options.hostname + '/');
            page = page.replace(/ data-src="\//g     , ' data-src="http://' + options.hostname + '/');
            page = page.replace(/ href="\//g         , ' href="http://'  + options.hostname + '/');

          
          }

          _webreq.write(page);
          _webreq.end();
        });

        res.on('error', function(e){
          
          util.puts(e);
          _webreq.abort();
          _webreq.connection.destroy();
          process.exit(1);
        });
        
        res.on('end', function(){
          var now = new Date().toJSON();
          proxy.writeRoutingLog(options.hostname + ':' + options.port + options.path + ' [' + now + '] HTTP ' + _route.contentType) ;
             
        });
      };
      
      //var req = _parsed_route_url.protocol == 'https:' ? https.request(options,_resultHandler) : http.request(options,_resultHandler);
      var req = http.request(options,_resultHandler);
      //console.log('req', req);
      //util.puts('__________________________________\n\n\n####################################');
      req.end();

      _webreq.on('error', function(e){  

        _pageGetError(e);
      });

      var _pageGetError = function(e){
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
        _webreq.abort();
        _webreq.connection.destroy();
        process.exit(1); 
      };
    }
  } else {
    console.log('route: No options passed!');
  }



  /*
   

    

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
          proxy.writeRoutingLog(options.hostname + ':' + options.port + options.path + ' [' + now + '] HTTP ' + _contentType) ;
             
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
          proxy.writeRoutingLog(options.hostname + ':' + options.port + options.path + ' [' + now + '] HTTPS') ;
             
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
  */
};

proxy.getClientAddress = function(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

/**
 * Serve static files
 * 
 * @param req
 * @param res
 * @todo Add a content type checker on files to serve correct content type in serveStaticFiles method
 */
proxy.serveStaticFiles = function(static_server, webreq, webres){
  
  webreq.addListener('end', function(){

    
    //
    // Serve files!
    //
    static_server.serve(webreq, webres, function (err, response) {
      
        var now = new Date().toJSON();
      
        
        if (err) { // An error as occured
            util.puts("ERROR ->  " + webreq.url + " - " + err.message);
            webres.writeHead(err.status, err.headers);
            webres.end();
        } else { // The file was served successfully
            var contentType = webres.getHeader('content-type');
            webres.writeHead(200, {'content-type': contentType + ', level=1'});  
            
            proxy.writeAccessLog(proxy.getClientAddress(webreq) + ' [' + now + '] "GET ' + webreq.url + ' HTTP/' + webreq.httpVersion + '" ' + webres.statusCode + ' ' + webres.getHeader('content-length'));
            
            webres.end();
        }
      

    });
  });
};

proxy.serverHandler = function(webres, webreq){

  var _url     = webreq.url;

  // Is url routable (Do we have a match from the projects patsy config?)
  if(proxy.isUrlRoutable(_url)){
    

    proxy.routeWebsite(webreq, webres, _url);
  } else {

    console.log(webres,webreq);
  }
};

proxy.createServer = function(handler, options){

  handler = handler || proxy.serverHandler;
  
  return http.createServer(handler);
  
};
