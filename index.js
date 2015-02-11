/*!
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var pathRe = require('glob-path-regex');
var isGlob = require('is-glob');

/**
 * Parse a glob pattern into sections
 *
 * When no paths or '**' are in the glob, we use a
 * different strategy for parsing the filename, since
 * file names can contain braces and other difficult
 * patterns. such as:
 *
 *  - `*.{a,b}`
 *  - `(**|*.js)`
 */

module.exports = function parseGlob(pattern) {
  // leave `pattern` unmodified
  var glob = pattern;
  var tok = {};

  tok.pattern = pattern;
  tok.isGlob = isGlob(pattern);
  tok.isNegated = pattern.charAt(0) === '!';

  var braces = pattern.indexOf('{') !== -1;
  if (braces) {
    glob = glob.substr(0, braces) + escape(glob.substr(braces));
  }

  tok.globstar = glob.indexOf('**') !== -1;
  if (!/\//.test(glob) && !tok.globstar) {
    tok.dirname = '';
    tok.filename = pattern;
    tok.globstar = false;

    var basename = /^([^.]*)/.exec(glob);
    if (basename) {
      tok.basename = basename[0];
      tok.extname = glob.substr(tok.basename.length);
    } else {
      tok.basename = glob;
      tok.extname = '';
    }

  } else {
    var m = pathRe().exec(glob) || [];
    tok.dirname = m[1];
    tok.filename = glob.substr(tok.dirname.length);
    var dot = tok.filename.indexOf('.', 1);
    if (dot !== -1) {
      tok.basename = tok.filename.substr(0, dot);
      tok.extname = tok.filename.substr(dot);
      tok.ext = tok.extname.substr(tok.extname.indexOf('.', 1));
    } else if (tok.filename.charAt(0) === '.') {
      tok.basename = '';
      tok.extname = tok.filename;
    } else {
      tok.basename = tok.filename;
      tok.extname = '';
    }
  }

  tok.ext = tok.extname.split('.').slice(-1)[0];

  if (braces) {
    tok.dirname = tok.dirname ? unescape(tok.dirname) : '';
    tok.filename = tok.filename ? unescape(tok.filename) : '';
    tok.basename = tok.basename ? unescape(tok.basename) : '';
    tok.extname = tok.extname ? unescape(tok.extname) : '';
    tok.ext = tok.ext ? unescape(tok.ext) : '';
  }

  tok.dotfiles = tok.filename.charAt(0) === '.';
  tok.dotdirs = tok.dirname.indexOf('/.') !== -1
    || tok.dirname.charAt(0) === '.';
  return tok;
};

function escape(str) {
  return str.replace(/.*\{([^}]*?)}.*$/g, function (match, inner) {
    if (!inner) { return match; }
    return match.split(inner).join(esc(inner));
  });
}

function esc(str) {
  str = str.split('/').join('__ESC_SLASH__');
  str = str.split('.').join('__ESC_DOT__');
  return str;
}

function unescape(str) {
  str = str.split('__ESC_SLASH__').join('/');
  str = str.split('__ESC_DOT__').join('.');
  return str;
}
