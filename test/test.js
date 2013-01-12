/*jslint node: true */
'use strict';

/**
 * Require patsyHelpers from the library
 *
 * @var     Object
 * @source  patsy
 */
var patsyHelpers      = require('../lib/patsyHelpers');


exports.nodeunit = {
  please_work: function(test) {
    test.expect(1);
    test.ok(true, 'this had better work.');
    test.done();
  }
};