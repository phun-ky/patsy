/**
 * File for patsy's static file server needs
 *
 * @author  Alexander Vassbotn Røyne-Helgesen   <alexander@phun-ky.net>
 * @file    index.js
 */
 /*jslint node: true */
'use strict';

/**
 * Require util plugin from node
 *
 * @var     Object
 * @source  NodeJS
 */
var util            = require('util');


module.exports = function(config){

  return {
    load: function(){
      util.print("[Patsy]: Here's the server my King!\n".yellow);
    }
  };
};
