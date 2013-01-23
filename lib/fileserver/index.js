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
    port    : cfg.fileserver.port || 8080,
    host    : cfg.fileserver.host || 'localhost',
    verbose : cfg.options.verbose || false
  };

  return {
    load: function(){

      util.print('[Patsy]'.yellow + ': Here\'s the server my King!\n');

      if(opts.verbose){

        console.log('>>'.cyan + ' Running static server from: '.white +
          String(opts.webroot).inverse.cyan + ' on '+ String(opts.host).inverse.magenta + ':'.white + String(opts.port).inverse.magenta);
      }

      var connect = require('connect');
      connect.createServer(
          connect.static(opts.webroot)
      ).listen(opts.port);
    }
  };
};
