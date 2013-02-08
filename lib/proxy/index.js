/**
 * File for patsy's proxy needs
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    index.js
 */
 /*jslint node: true */
'use strict';


/**
 * Require http plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var http        = require('http');

/**
 * Require node-http-proxy from modules
 *
 * @var     Object
 */
var httpProxy   = require('http-proxy');

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util          = require('util');

/**
 * Require url plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var node_url      = require('url');

/**
 * Require xtend plugin for deep object extending
 *
 * @var     Object
 */
var xtend         = require('xtend');


module.exports = function(opts){


  return {

    // The purpose of this method is to start the proxy server and route API urls
    // from the patsy config.proxy.resources object
    start  : function(cfg){



      var route_opts;



      util.print('[Patsy]'.yellow + ': Here\'s the proxy my King!\n');

      var _getHeaders = function(path, local_headers){

        var global_headers = {};

        if(typeof cfg.proxy.options.headers !== 'undefined' && typeof cfg.proxy.options.headers === 'object'){
          global_headers = cfg.proxy.options.headers;
        }

        if(typeof local_headers === 'undefined'){
          local_headers = {};
        }


        try{

          return xtend(global_headers, local_headers);
        } catch(e){

          util.puts('>> FAIL'.red + ': Could not extend headers',global_headers, local_headers, e);
        }
      };

      var gotMatch = false;

      // Find match method
      var _findMatch = function(url, resource){
        gotMatch = false;
        var parsed_resource_pass;

        if(typeof resource === 'array' || typeof resource === 'object'){

          resource.forEach(function(route){

            parsed_resource_pass  = node_url.parse(route.pass);

            // First, turn the URL into a regex.
            // NOTE: Turning user input directly into a Regular Expression is NOT SAFE.
            var matchPath         = new RegExp(route.path.replace(/\//, '\\/'));
            var matchedPath       = matchPath.exec(url);

            //if(url.match(route.path) && (url !== '/' && route.path.indexOf(url) !== -1)){
            if(matchedPath && matchedPath[0] !== '/'){

              route_opts =  {
                route : {
                  host: parsed_resource_pass.hostname,
                  port: parsed_resource_pass.port
                },
                url : url.replace(route.path, parsed_resource_pass.pathname),
                headers: _getHeaders(route.path, route.headers || {})
              };

              gotMatch = true;
            }


          });
        } else if(typeof resource === 'string'){
          gotMatch = false;
          parsed_resource_pass = node_url.parse(resource);

          if(url.match(resource) && resource.indexOf(url) !== -1){

            route_opts = {
              route : {
                host: parsed_resource_pass.hostname,
                port: parsed_resource_pass.port
              },
              url : url,
              headers: cfg.proxy.options.headers || {}
            };
            gotMatch = true;
          }
        }
      };

      try{


        //
        // Create a proxy server with custom application logic
        //
        httpProxy.createServer(function (req, res, proxy) {
          //
          // Put your custom server logic here
          //

          _findMatch(req.url, cfg.proxy.resources);

          var _opts   = typeof route_opts === 'object' ? route_opts : false;
          var _route;

          if(opts.verbose){
            util.print('>>'.cyan + ' Setting up route for ' + req.url + '...');
          }

          if(_opts && gotMatch){

            _route  = _opts.route;

            req.url     = _opts.url;

            if(opts.verbose){
              util.print("OK\n".green);
            }

            if(typeof _route !== 'object'){
              throw new Error('Required object for proxy is not valid');
            }

            // Set headers
            // Headers are overwritten like this:
            // Request headers are overwritten by global headers
            // Global headers are overwritten by local headers
            req.headers = xtend(req.headers,_opts.headers || {});

            if(opts.verbose){
              util.print('>>'.cyan + ' Guiding ' + req.url + ' to ' + _route.host + ':' + _route.port  +'...');
            }

            // Proxy the request
            proxy.proxyRequest(req, res, _route);

            if(opts.verbose){
              util.print("OK\n".green);
            }

          } else {
            // No match found in proxy table for incoming URL, try relay the request to the local webserver instead
            try{

              if(opts.verbose){

                util.print("WARN\n".yellow);
                util.print('>>'.yellow + ' No match found, relaying to ' + cfg.project.environment.host +':'+cfg.project.environment.port+ req.url + '...');
              }

              _route =  {
                host: cfg.project.environment.host,
                port: cfg.project.environment.port
              };

              // Set headers
              // Headers are overwritten like this:
              // Request headers are overwritten by global headers
              // Global headers are overwritten by local headers
              req.headers = xtend(req.headers,cfg.proxy.options.headers || {});

              // Proxy the request
              proxy.proxyRequest(req, res, _route);

              if(opts.verbose){
                util.print("OK\n".green);
              }

            } catch(e){

              util.print("FAILED\n".red);
              util.puts('>>'.red + ' Could not proxy given URL: ' + req.url, e);

              if(opts.verbose){
                console.log('Headers',req.headers,'Options',_opts);
              }

              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.write('Could not proxy given URL: ' + req.url +'\n' + 'Headers:' + JSON.stringify(req.headers, true, 2) +'\n' + 'Given options: ' + JSON.stringify(_opts, true, 2));
              res.end();
            }

          }




          // Clean up vars


        }).listen(cfg.proxy.options.port || 80);

      } catch(e){

        util.puts('>> FAIL'.red + ': Could not create proxy server',e);
      }
    }
  };

};
