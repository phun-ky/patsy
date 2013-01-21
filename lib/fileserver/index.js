/**
 * File for patsy's static file server needs
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    index.js
 */
 /*jslint node: true, es5:true*/
'use strict';

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util            = require('util');


module.exports = function(cfg){

  var opts = {
    webroot : cfg.project.environment.abs_path + cfg.project.environment.web_root,
    port    : cfg.project.environment.port || 80,
    verbose : cfg.options.verbose || false
  };

  return {
    load: function(){
      util.print("[Patsy]: Here's the server my King!\n".yellow);
      if(opts.verbose){
        console.log('Running static server from: ' + opts.webroot);
      }
      var connect = require('connect');
      connect.createServer(
          connect.static(opts.webroot)
      ).listen(opts.port);
    }
  };
};
