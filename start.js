#! /usr/bin/env node

"use strict";

/**
 * Declare system variables from other dependencies
 **/
var fs        = require('fs');
var path      = require('path');
var util      = require('util');
var colors    = require('colors');




/**
 * Declare 
 */

var stdin     = process.stdin;
var stdout    = process.stdout;
 




var patsyHelpers = require('./lib/patsyHelpers');



stdin.resume();
stdin.setEncoding('utf8');


stdout.write('\n'+
'..............................................................................,,\n'.inverse.yellow + 
'...............................................................................,\n'.inverse.yellow + 
'...............................................................................,\n'.inverse.yellow + 
'.............................................................................,,,\n'.inverse.yellow + 
'......................................................,:::::::,,,,............,,\n'.inverse.yellow + 
'................................................,,::~~~~~~======+=,..........,,,\n'.inverse.yellow + 
'.........................,$$~I+..............,::~~::::::::::::::~+=,........,,,,\n'.inverse.yellow + 
'...................++Z7$7=~~~+?7ZOZZO?.....,:~~::::::::::~~~~::::+?:......,,,,,,\n'.inverse.yellow + 
'................OZ$~?~:::,,:,,,,,,::~IZZ8Z:~::::::::::~:~~~~~:::~II:,.....,.,,,,\n'.inverse.yellow + 
'..............ZZZ~::,:,,,,,.,.....,,,,::=78~~::::::::::::~~~:::~IZI:,......,,,,,\n'.inverse.yellow + 
'...........I:IZO~:,,,.,,,,,::~:,,,,...,,,::78,::::::::::::::::=7ZZI:,,,.....,,,,\n'.inverse.yellow + 
'...........=IZO~:,,,.,~~~~~~==~=~~~~:,,...,:~DO,,,:::::::::~=IZZZZ?:.........,,,\n'.inverse.yellow + 
'...........~Z7$:,,,,,=~~=~========~=~~~~...,,:IO~~~~~~~=?I$OOZZZZ$=,...........,\n'.inverse.yellow + 
'..........Z$O$O~:,,,~=~~~==============~~,,,,::$O$ZZZOOOOOOOOZZZZ?:............,\n'.inverse.yellow + 
'..........ZO$$Z~:,,,=~~~~~~==============~:,,::~OOZOOZZOOOOOOOOZ$~,.............\n'.inverse.yellow + 
'.........~ZOZOO7:,,,=~~~~~~~~=============~:,,,:~OZZZOOOOOOOOOOO+,..............\n'.inverse.yellow + 
'.........O8OOOZZ::,,:~~~~~~~~~====~~=======~,,,,~IZOOOOOOOOOZOZ?:,,.............\n'.inverse.yellow + 
'.........NZ$788ZI:,,,~~~~~~~~~~=~~~~~======~,.,,:~OIO8888888Z7+~~:::,,,,........\n'.inverse.yellow + 
'........=Z$Z8OZ$$7:,,,~~~~~~~~=~~~~~~~====~~,,,,::ZODDDDD8Z7+=~~~~::::::,,,.....\n'.inverse.yellow + 
'........:$8$OZZOZO7:,,,,~~~~~~~~~~~~~~===~~~,.,,:~ZO?IIIII?+=~~~::::::,,,,......\n'.inverse.yellow + 
'.......+?Z$O$OZZZOOO:,,,,:~~~~~~~~~~~~=~~~~,.,,,:~ZI::::::::::,,,,,,............\n'.inverse.yellow + 
'.........Z78ZO88OZ7$$=:,,,,~~~~~~~~=~~~~~::.,,,,:7Z=,,,,,,,,,,,,,,,.............\n'.inverse.yellow + 
'.........:OZ8ZZ8ZZ$?$$$:,,,,.,,,:::=::...,..,,::~ZI,,,,,,,,,,,,,,,..............\n'.inverse.yellow + 
'..........7ZZO88OZ8ZOOZOO:,,,,,.....,,,,,,,,,::=ZI......,.,,,,,.................\n'.inverse.yellow + 
'...........IZ$88OOOOZZ88Z7OZ~:,,,,,,,,,,,::::$OZZ:..............................\n'.inverse.yellow + 
'............ZZZZO$Z$OOOZOO$77OZI77+:::ZOOOZZZZ$8................................\n'.inverse.yellow + 
'............+878$$ZZDZZOOZZZOO$ZOOZO7Z7$$Z$OO7?.................................\n'.inverse.yellow + 
'.....,,,,,,,,,Z$OZOZ8ZOOO$O$O7Z$OO$$$8OOOOZZZ7..................................\n'.inverse.yellow + 
'..,,,,,,,,,,,,,,OOO8Z88OZD8OOO$8Z8$8OZZO7Z7O....................................\n'.inverse.yellow + 
'..,,,,,,,,,,,,:~+?OD8D$O888OOOOZ$88OZ$Z8O~~~::,,................................\n'.inverse.yellow + 
'...,,,,,,,,,~=+++???8D8DD8NDDDO88NOD8?7===~~~:::::,,,...........................\n'.inverse.yellow + 
'.......,,,::=++??IZ78O8NNDDNMNM8MZZ$7I?+==~~~::::,,,,,,,,............... . .    \n'.inverse.yellow + 
'............,:=+??I7$$$ZZZOOO8OOOZ$7I?+=~~::::,,,,,,,,,..............           \n'.inverse.yellow + 
'         ......,,:~~==============~~~~:::::,,,,,,....................  .        \n'.inverse.yellow);

stdout.write("[King Arthur]: Come Patsy, my trusty servant!! <sound of two half coconuts banging together> .. \n".yellow);

patsyHelpers.checkProject();

stdin.on('data', patsyHelpers.checkInput);