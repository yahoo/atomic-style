/* globals describe, it, beforeEach */

'use strict';

var AtomicStyler = require('../../lib/AtomicStyler');
var assert = require('assert');

describe('AtomicStyler', function() {
    beforeEach(function() {
        this.atomize = new AtomicStyler({
            'btn': 'D(ib) C(white) Bg(gray)',
            'btn-blue': ['Bg(blue)', 'Bd(n) BdT']
        });
    });

    describe('#set', function() {
        it('sets styles as a map', function() {
            assert.deepEqual(this.atomize._styles, {
                'btn': {
                    'Bg': '(gray)',
                    'C': '(white)',
                    'D': '(ib)'
                },
                'btn-blue': {
                    'Bd': '(n)',
                    'BdT': null,
                    'Bg': '(blue)'
                }
            });
        });

        it('override some styles', function() {
            this.atomize.set({
                'btn': 'P(10px)  Bg(pink)   '
            });

            assert.deepEqual(this.atomize._styles, {
                'btn': {
                    'Bg': '(pink)',
                    'P': '(10px)',
                    'C': '(white)',
                    'D': '(ib)'
                },
                'btn-blue': {
                    'Bd': '(n)',
                    'BdT': null,
                    'Bg': '(blue)'
                }
            });
        });

        it('merges many styles if an array is given', function () {
            this.atomize.set([
                {
                    'box': 'P(10px) M(5px)'
                },
                {
                    'btn-pink': 'Bgc(pink) C(black)'
                }
            ]);

            assert.deepEqual(this.atomize._styles, {
                'btn': {
                    'Bg': '(gray)',
                    'C': '(white)',
                    'D': '(ib)'
                },
                'btn-blue': {
                    'Bd': '(n)',
                    'BdT': null,
                    'Bg': '(blue)'
                },
                'btn-pink': {
                    'Bgc': '(pink)',
                    'C': '(black)'
                },
                "box": {
                    "P": "(10px)",
                    "M": "(5px)"
                }
            });
        });
    });

    describe('#get', function() {
        it('gets the atomic classes', function() {
            assert.equal(this.atomize.get('btn'), 'D(ib) C(white) Bg(gray)');
            assert.equal(this.atomize.get('btn-blue'), 'Bg(blue) Bd(n) BdT');
        });

        it('mixes atomic classes', function() {
            assert.equal(this.atomize.get('btn btn-blue'),
                'D(ib) C(white) Bg(blue) Bd(n) BdT');
        });

        it('adds some overrides', function() {
            assert.equal(this.atomize.get('btn btn-blue'),
                'D(ib) C(white) Bg(blue) Bd(n) BdT');
        });

        it('overrides with an object', function() {
            assert.equal(this.atomize.get('btn', {
                'P(10px)': true,
                'M(0)': false
            }), 'D(ib) C(white) Bg(gray) P(10px)');
        });

        it('mixes atomic classes', function() {
            assert.equal(this.atomize.get('btn btn-blue', 'BdB'),
                'D(ib) C(white) Bg(blue) Bd(n) BdT BdB');
        });

        it('trims empty spaces', function() {
            assert.equal(this.atomize.get('btn', 'BdB    P(n)  '),
                'D(ib) C(white) Bg(gray) BdB P(n)');

            assert.equal(this.atomize.get('btn', ['BdB  ', ' P(n)  M(n)']),
                'D(ib) C(white) Bg(gray) BdB P(n) M(n)');
        });
    });

    describe('#dedupe', function () {
        it('dedupes atomic classes', function () {
            assert.equal(this.atomize.dedupe('P(10px)', 'P(5px)'), 'P(5px)');
            assert.equal(this.atomize.dedupe('P(10px)', ['P(5px)']), 'P(5px)');
            assert.equal(this.atomize.dedupe('P(10px) C(blue)', {
                'P(5px)': true,
                'M(0)': false
            }), 'P(5px) C(blue)');
        });
    });
});
