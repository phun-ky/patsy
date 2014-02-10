/**
 * File for patsy's mocking needs
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

module.exports = function(opts){



  return {
    /**
     * Prints out scripture text if allowed to
     *
     * @param   String  output
     */
    print : function(output){

      if(opts.scripture){

        util.puts(output);
      }
    }
  };
};
