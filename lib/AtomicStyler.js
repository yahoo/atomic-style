/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
'use strict';

var SPLIT_STYLES = /\s+/g;

var _ = {
    assign: require('lodash/object/assign')
};

function AtomicStyler(styles) {
    this._styles = {};
    styles && this.set(styles);
}

function classesFromObject(obj) {
    var classNames = '';
    var key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) {
            classNames += ' ' + key;
        }
    }

    return classNames;
}

function sanitizeArray(classes) {
    if (!classes) {
        return [];
    }

    if (Array.isArray(classes)) {
        classes = classes.join(' ');
    }

    if (typeof classes === 'object') {
        classes = classesFromObject(classes);
    }

    return classes.trim().split(SPLIT_STYLES);
}

function buildClassSet(classes) {
    classes = sanitizeArray(classes);
    return classes.reduce(function(result, match) {
        match = match.split('(');
        result[match[0]] = match[1] ? '(' + match[1] : null;
        return result;
    }, {});
}

function getClassNames(styles) {
    var classNames = '';
    var key;

    for (key in styles) {
        if (styles.hasOwnProperty(key)) {
            classNames += ' ' + key + (styles[key] || '');
        }
    }

    return classNames.trim();
}

function set(styles) {
    if (Array.isArray(styles)) {
        return styles.forEach(set, this);
    }

    Object.keys(styles).forEach(function(key) {
        this._styles[key] = _.assign(
                this._styles[key] || {},
                buildClassSet(styles[key]));
    }, this);
}

function get(styles, overrides) {
    var classes = {};

    sanitizeArray(styles).forEach(function(key) {
        _.assign(classes, this._styles[key]);
    }, this);

    overrides && _.assign(classes, buildClassSet(overrides));
    return getClassNames(classes);
}

function mergeStyles(result, style) {
    return _.assign(result, buildClassSet(style));
}

function dedupe() {
    return getClassNames([].reduce.call(arguments, mergeStyles, {}));
}

AtomicStyler.prototype = {
    set: set,
    get: get,
    dedupe: dedupe
};

module.exports = AtomicStyler;
