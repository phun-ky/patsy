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


/**
 * Require file system plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var fs            = require('fs');

/**
 * Require path plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var path          = require('path');

/**
 * Require internal utils
 *
 * @var     Object
 */
var utils       = require('../utils');

module.exports = function(opts){

  var patsy = opts.patsy;

  return {
    /**
    @todo move this into separate npm module, and create a grunt-plugin for it aswell
    */
    mock  : function(res, req){

      var routed_path     = req.headers['x-forwarded-path'].replace(/\//g,"_");
      var pathToMockFiles = path.resolve('js/data/' + routed_path + '.json');


      if(fs.existsSync(pathToMockFiles)){

        res.writeHead(200, {
          'Content-Type': 'application/json'
        });

        res.write(pathToMockFiles);

      } else {

        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });

        res.write(pathToMockFiles);
      }



      res.end();

    },
    // The purpose of this method is to start the proxy server and route API urls
    // from the patsy config.proxy.resources object
    start  : function(cfg){

      var self = this;

      var route_opts;

      patsy.scripture.print('[Patsy]'.yellow + ': Here\'s the proxy my King!\n');

      var _getHeaders = function(path, local_headers){

        var global_headers = {};

        if(typeof cfg.proxy.options.headers !== 'undefined' && typeof cfg.proxy.options.headers === 'object'){
          global_headers = xtend({},cfg.proxy.options.headers);

        }

        if(typeof local_headers === 'undefined'){
          local_headers = {};
        }


        try{

          return xtend(global_headers, local_headers);

        } catch(e){

          if(opts.verbose){

            utils.fail('Could not extend headers!');
            console.log(global_headers, local_headers, e);

          } else {

            utils.fail();

          }

        }
      };

      var gotMatch = false,
      // Find match method
      _findMatch = function(url, resource){
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
                from_path : route.path,
                url : url.replace(route.path, parsed_resource_pass.pathname),
                headers: _getHeaders(route.path, route.headers || {})
              };


              //console.log(matchedPath[0],url, route_opts.url, route.path);

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
        var proxyServer = httpProxy.createServer(function (req, res, proxy) {
          //
          // Put your custom server logic here
          //

          _findMatch(req.url, cfg.proxy.resources);

          var _opts   = typeof route_opts === 'object' ? route_opts : false;
          var _route;

          if(opts.verbose){

            util.print('>>'.cyan + ' Setting up route for ' + req.url.cyan + '...');

          }

          if(_opts && gotMatch){

            _route  = _opts.route;

            req.url     = _opts.url;

            if(opts.verbose){
              utils.ok();
            }

            if(typeof _route !== 'object'){
              throw new Error('Required object for proxy is not valid');
            }

            // Set headers
            // Headers are overwritten like this:
            // Request headers are overwritten by global headers
            // Global headers are overwritten by local headers
            req.headers = xtend(req.headers,_opts.headers || {});

            // Set headers with the path we're forwarding from
            req.headers = xtend(req.headers, {
              "x-forwarded-path" : _opts.from_path,
              "x-original-url" : req.url
            });


            if(opts.verbose){
              util.print('>>'.cyan + ' Guiding ' + req.url.cyan + ' to ' + _route.host.inverse.magenta + ':' + _route.port.inverse.magenta  +'...');
            }

            try{

              // Proxy the request
              proxy.proxyRequest(req, res, _route);

            } catch( error ){

              if(opts.verbose){

                utils.fail('Could not proxy given URL when we have match: ' + req.url.cyan);
                console.log(error, 'Headers',req.headers,'Options',_opts);

              } else {

                utils.fail();

              }

              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.write('Could not proxy given URL: ' + req.url +'\n' + 'Given route: ' + JSON.stringify(_route || 'no route found', true, 2) +'\n' +  'Headers:' + JSON.stringify(req.headers, true, 2) +'\n' + 'Given options: ' + JSON.stringify(_opts, true, 2));
              res.end();

            }

            if(opts.verbose){

              utils.ok();

            }

          } else {
            // No match found in proxy table for incoming URL, try relay the request to the local webserver instead
            try{

              util.print("WARN".yellow + '\n');

              if(opts.verbose){
                util.print('>> '.yellow + ' No match found, relaying to: ' + String(cfg.project.environment.host).inverse.magenta +':'+ String(cfg.project.environment.port).inverse.magenta + '...' );

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

                utils.ok();

              }

            } catch(error){

              if(opts.verbose){

                utils.fail('Could not proxy given URL with no match found: ' + req.url.cyan);
                console.log(error, 'Headers',req.headers,'Options',_opts);

              } else {

                utils.fail();

              }

              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.write('Could not proxy given URL: ' + req.url +'\n' + 'Headers:' + JSON.stringify(req.headers, true, 2) +'\n' + 'Given options: ' + JSON.stringify(_opts, true, 2));
              res.end();

            }

          }

          // Clean up vars


        });

        proxyServer.listen(cfg.proxy.options.port || 80);

        proxyServer.proxy.on('proxyError', function (err, req, res) {

          /*if(typeof req.headers['x-forwarded-path'] !== 'undefined'){

            self.mock(res, req);

          } else {*/
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.write('Something went wrong. And we are reporting a custom error message.')
            res.write('Could not proxy given URL: ' + req.url +'\n' + 'Headers:' + JSON.stringify(req.headers, true, 2) +'\n');
            res.end();
          //}


        });

      } catch(e){

        util.puts('>> FAIL'.red + ': Could not create proxy server',e);
      }
    }
  };

};
