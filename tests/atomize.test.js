/* globals describe, it */

'use strict';

var atomize = require('../index');
var AtomicStyler = require('../lib/AtomicStyler');
var assert = require('assert');

describe('atomize', function () {
    it('is a singlethon instance of AtomicStyler', function () {
        assert(AtomicStyler.prototype.isPrototypeOf(atomize));
    });

    it('starts with a empty list of styles', function () {
        assert.deepEqual(atomize._styles, {});
    });
});
