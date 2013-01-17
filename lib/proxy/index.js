/**
 * File for patsy's proxy needs
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    index.js
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

// The purpose of this method is to start the proxy server and route API urls
// from the patsy config.proxy.resources object
proxy.start     = function(cfg){

  console.log(cfg);

  console.log(cfg.proxy);


  util.print("[Patsy]: Here's the proxy my King!\n".yellow);
  //
  // Create a proxy server with custom application logic
  //
  httpProxy.createServer(function (req, res, proxy) {
    //
    // Put your custom server logic here
    //
    var route = proxy.find(req.url, cfg.proxy.resources);

    if (req.url.match('/api/open/prognosis')) {
      req.url = req.url.replace('/api/open/prognosis', '/prognosis-rest-api/open/prognosis');
      route = {
        host: 'alt-stb-002.stb.local',
        port: 12010
      };

    } else if (req.url.match('/chrome')) {

      route = {
        host: 'google.no',
        port: 80
      };

    } else {
      route = {
        host: 'localhost',
        port: 8094
      };
    }



    proxy.proxyRequest(req, res, route);


  }).listen(8000);
};

proxy.find = function(url, resource){
  console.log(url, resource);
};
