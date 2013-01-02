#! /usr/bin/env node

"use strict";

/**
 * Declare system variables from other dependencies
 **/
var fs        = require('fs');

var util      = require('util');
var colors    = require('colors');


/**
 * Declare 
 */

var stdin     = process.stdin;
var stdout    = process.stdout;
 




var patsyHelpers = require('./lib/patsyHelpers');

patsyHelpers.appPath = require('path').dirname(require.main.filename) + "/";

stdin.resume();
stdin.setEncoding('utf8');

stdout.write("[King Arthur]: Come Patsy, my trusty servant!! <sound of two half coconuts banging together> .. \n".yellow);

patsyHelpers.checkProject();

stdin.on('data', patsyHelpers.checkInput);