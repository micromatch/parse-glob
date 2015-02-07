/*!
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var pathRe = require('glob-path-regex');

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
  var glob = pattern;
  var tok = {};

  var braces = pattern.indexOf('{') !== -1;
  if (braces) {
    glob = glob.substr(0, braces) + escape(glob.substr(braces));
  }

  if (!/(\/|\*\*)/.test(glob)) {
    tok.pattern = pattern;
    tok.dirname = '';
    tok.filename = pattern;

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
    tok.pattern = pattern;
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
    tok.dirname = unescape(tok.dirname);
    tok.filename = unescape(tok.filename);
    tok.basename = unescape(tok.basename);
    tok.extname = unescape(tok.extname);
    tok.ext = unescape(tok.ext);
  }

  tok.dotfiles = tok.filename.charAt(0) === '.';
  tok.dotdirs = tok.dirname.indexOf('/.') !== -1
    || tok.dirname.charAt(0) === '.';
  return tok;
};

function escape(str) {
  return str.replace(/.*\{([^}]*?)}.*$/g, function (match, inner) {
    if (!inner) { return match; }
    var temp = inner.replace(/\//g, '__ESC_SLASH__');
    temp = temp.replace(/\./g, '__ESC_DOT__');
    return match.replace(new RegExp(inner, 'g'), temp);
  });
}

function unescape(str) {
  str = str.split('__ESC_SLASH__').join('/');
  str = str.split('__ESC_DOT__').join('.');
  return str;
}
