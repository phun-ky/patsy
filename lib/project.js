/**
 * File for patsy's project needs
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
var util          = require('util');

/**
 * Require commander
 *
 * @var     Object
 */
var program       = require('commander');


module.exports = function(opts){



  return {
    /**
     * Check project
     *
     * @return  Boolean
     */
    check : function(_patsy){


      try {

        /**
         * Require config from the library
         *
         * @var     Object
         * @source  patsy
         */
        var config      = require('./config')({
          app_path  : opts.app_path,
          verbose   : opts.verbose
        });

        var _config    = config.load();


        if(typeof _config !== 'undefined'){

          util.print('[Patsy]: I found a scripture of configuration Sire! It reads: \n'.yellow);
          util.print('[Patsy]: "F..fo..\n'.yellow);
          util.print('[Patsy]: Foo..foo.foou..\n'.yellow);
          util.print('[Patsy]: Follow the path of "'.yellow + _config.project.environment.abs_path.yellow + '" to complete the quest of.. \n'.yellow);
          util.print('[Patsy]: Of.. ehm, of '.yellow + _config.project.details.name.yellow + '"! \n'.yellow );
          util.print("[King Arthur]: Well? Don't just stand there, saddle up! And summon the other squires!\n".yellow);

          _patsy.load(_config);

          //return true;
        } else {

          config.ask(_patsy);

        }

      } catch (err) {
        console.log('project.check', err);
        //return false;
      }
    }
  };
};
