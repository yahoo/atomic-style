/* globals describe, it, beforeEach */

'use strict';

var AtomicStyler = require('../../lib/AtomicStyler');
var assert = require('assert');

describe('AtomicStyler', function() {
    beforeEach(function() {
        this.atomize = new AtomicStyler({
            'btn': 'D(ib) C(white) Bg(gray)',
            'btn-blue': ['Bg(blue) Bg(grey):h', 'Bd(n) BdT']
        });
    });

    describe('#set', function() {
        it('sets styles as a map', function() {
            assert.deepEqual(this.atomize._styles, {
                'btn': {
                    'Bg': 'Bg(gray)',
                    'C': 'C(white)',
                    'D': 'D(ib)'
                },
                'btn-blue': {
                    'Bd': 'Bd(n)',
                    'BdT': 'BdT',
                    'Bg': 'Bg(blue)',
                    'Bg:h': 'Bg(grey):h'
                }
            });
        });

        it('override some styles', function() {
            this.atomize.set({
                'btn': 'P(10px)  Bg(pink)   '
            });

            assert.deepEqual(this.atomize._styles, {
                'btn': {
                    'Bg': 'Bg(pink)',
                    'P': 'P(10px)',
                    'C': 'C(white)',
                    'D': 'D(ib)'
                },
                'btn-blue': {
                    'Bd': 'Bd(n)',
                    'BdT': 'BdT',
                    'Bg': 'Bg(blue)',
                    'Bg:h': 'Bg(grey):h'
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
                    'Bg': 'Bg(gray)',
                    'C': 'C(white)',
                    'D': 'D(ib)'
                },
                'btn-blue': {
                    'Bd': 'Bd(n)',
                    'BdT': 'BdT',
                    'Bg': 'Bg(blue)',
                    'Bg:h': 'Bg(grey):h'
                },
                'btn-pink': {
                    'Bgc': 'Bgc(pink)',
                    'C': 'C(black)'
                },
                "box": {
                    "P": "P(10px)",
                    "M": "M(5px)"
                }
            });
        });
    });

    describe('#get', function() {
        it('gets the atomic classes', function() {
            assert.equal(this.atomize.get('btn'), 'D(ib) C(white) Bg(gray)');
            assert.equal(this.atomize.get('btn-blue'), 'Bg(blue) Bg(grey):h Bd(n) BdT');
        });

        it('mixes atomic classes', function() {
            assert.equal(this.atomize.get('btn btn-blue'),
                'D(ib) C(white) Bg(blue) Bg(grey):h Bd(n) BdT');
        });

        it('adds some overrides', function() {
            assert.equal(this.atomize.get('btn btn-blue'),
                'D(ib) C(white) Bg(blue) Bg(grey):h Bd(n) BdT');
        });

        it('overrides with an object', function() {
            assert.equal(this.atomize.get('btn', {
                'P(10px)': true,
                'M(0)': false
            }), 'D(ib) C(white) Bg(gray) P(10px)');
        });

        it('mixes atomic classes', function() {
            assert.equal(this.atomize.get('btn', 'BdB Bg(grey):h'),
                'D(ib) C(white) Bg(gray) BdB Bg(grey):h');
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
