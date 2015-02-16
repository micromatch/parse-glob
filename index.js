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
  var glob = pattern;
  var tok = {};

  // store original pattern
  tok.original = pattern;
  tok.pattern = pattern;


  // is the pattern actually a glob?
  tok.isGlob = isGlob(glob);

  // is it a negation pattern?
  tok.isNegated = glob.charAt(0) === '!';

  // does the pattern contain braces?
  var braces = glob.indexOf('{') !== -1;
  if (braces) {
    glob = glob.substr(0, braces) + escape(glob.substr(braces));
  }

  // does the pattern contain a globstar (`**`)?
  tok.globstar = glob.indexOf('**') !== -1;
  if (glob.indexOf('/') === -1 && !tok.globstar) {
    tok.dirname = '';
    tok.filename = tok.original;
    tok.globstar = false;

    var basename = /^([^.]*)/.exec(glob);
    if (basename) {
      tok.basename = basename[0] ? unescape(basename[0]) : '';
      tok.extname = glob.substr(tok.basename.length);
    } else {
      tok.basename = tok.original;
      tok.extname = '';
    }
    tok.ext = tok.extname.split('.').slice(-1)[0];
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

    tok.ext = tok.extname.split('.').slice(-1)[0];
    if (braces) {
      tok = unscapeBraces(tok);
    }
  }

  tok.dotfiles = tok.filename.charAt(0) === '.';
  tok = dotdirs(tok);
    console.log(tok)

  tok.parsed = true;
  return tok;
};

function dotdirs(tok) {
  tok.dotdirs = false;
  if (tok.dirname.indexOf('/.') !== -1) {
    tok.dotdirs = true;
  }
  if (tok.dirname.charAt(0) === '.' && tok.dirname.charAt(1) !== '/') {
    tok.dotdirs = true;
  }
  return tok;
}

function unscapeBraces(tok) {
  tok.dirname = tok.dirname ? unescape(tok.dirname) : '';
  tok.filename = tok.filename ? unescape(tok.filename) : '';
  tok.basename = tok.basename ? unescape(tok.basename) : '';
  tok.extname = tok.extname ? unescape(tok.extname) : '';
  tok.ext = tok.ext ? unescape(tok.ext) : '';
  return tok;
}

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

function trim(str, ch) {
  if (str.slice(-1) === ch) {
    return str[str.length - ch.length];
  }
  return str;
}
