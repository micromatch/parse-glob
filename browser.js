(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var findBase = require('glob-base');
var pathRe = require('glob-path-regex');
var isGlob = require('is-glob');

/**
 * Expose `parseGlob` and cache results in memory
 */

module.exports = function (pattern, getbase) {
  return globCache(parseGlob, pattern, getbase);
};

/**
 * Parse a glob pattern into tokens.
 *
 * When no paths or '**' are in the glob, we use a
 * different strategy for parsing the filename, since
 * file names can contain braces and other difficult
 * patterns. such as:
 *
 *  - `*.{a,b}`
 *  - `(**|*.js)`
 */

function parseGlob(pattern, getbase) {
  var glob = pattern;
  var tok = {path: {}, is: {}, match: {}};
  var path = {};

  // store original pattern
  tok.original = pattern;
  tok.pattern = pattern;
  path.whole = tok.pattern;

  // Boolean values
  tok.is.glob = isGlob(glob);
  tok.is.negated = glob.charAt(0) === '!';
  tok.is.globstar = glob.indexOf('**') !== -1;

  var braces = glob.indexOf('{') !== -1;
  if (tok.is.glob && braces) {
    tok.is.braces = true;
    glob = glob.substr(0, braces) + escape(glob.substr(braces));
  }

  // if there is no `/` and no `**`, this means our
  // pattern can only match file names
  if (glob.indexOf('/') === -1 && !tok.is.globstar) {
    path.dirname = '';
    path.filename = tok.original;
    tok.is.globstar = false;

    var basename = /^([^.]*)/.exec(glob);
    if (basename) {
      path.basename = basename[0] || '';
      path.extname = glob.substr(path.basename.length);
    } else {
      path.basename = tok.original;
      path.extname = '';
    }

    path.ext = path.extname.split('.').slice(-1)[0];
    if (braces) {
      path.basename = unescape(path.basename);
    }

  // we either have a `/` or `**`
  } else {
    var m = pathRe().exec(glob) || [];
    path.dirname = m[1];
    path.filename = glob.substr(path.dirname.length);

    // does the filename have a `.`?
    var dot = path.filename.indexOf('.', 1);
    if (dot !== -1) {
      path.basename = path.filename.substr(0, dot);
      path.extname = path.filename.substr(dot);
      path.ext = path.extname.substr(path.extname.indexOf('.', 1));
    } else if (path.filename.charAt(0) === '.') {
      path.basename = '';
      path.extname = path.filename;
    } else {
      path.basename = path.filename;
      path.extname = '';
    }

    path.ext = path.extname.split('.').slice(-1)[0];
    // remove any escaping that was applied for braces
    if (braces) {
      path = unscapeBraces(path);
    }
  }

  tok.is.dotfile = path.filename.charAt(0) === '.';
  tok = matchesDotdirs(tok, path);
  tok.path = path;

  // get the `base` from glob pattern
  if (getbase) {
    var segs = findBase(tok.pattern);
    tok.pattern = segs.pattern;
    tok.base = segs.base;

    if (tok.is.glob === false) {
      tok.base = tok.path.dirname;
      tok.pattern = tok.path.filename;
    }
  }
  return tok;
}

/**
 * Updates the tokens to reflect if the pattern
 * matches dot-directories
 *
 * @param  {Object} `tok` The tokens object
 * @param  {Object} `path` The path object
 * @return {Object}
 */

function matchesDotdirs(tok, path) {
  tok.is.dotdir = false;
  if (path.dirname.indexOf('/.') !== -1) {
    tok.is.dotdir = true;
  }
  if (path.dirname.charAt(0) === '.' && path.dirname.charAt(1) !== '/') {
    tok.is.dotdir = true;
  }
  return tok;
}

/**
 * Unescape brace patterns in each segment on the
 * `path` object.
 *
 * TODO: this can be reduced by only escaping/unescaping
 * segments that need to be escaped based on whether
 * or not the pattern has a directory in it.
 *
 * @param  {Object} `path`
 * @return {Object}
 */

function unscapeBraces(path) {
  path.dirname = path.dirname ? unescape(path.dirname) : '';
  path.filename = path.filename ? unescape(path.filename) : '';
  path.basename = path.basename ? unescape(path.basename) : '';
  path.extname = path.extname ? unescape(path.extname) : '';
  path.ext = path.ext ? unescape(path.ext) : '';
  return path;
}

/**
 * Cache the glob string to avoid parsing the same
 * pattern more than once.
 *
 * @param  {Function} fn
 * @param  {String} pattern
 * @param  {Options} options
 * @return {RegExp}
 */

function globCache(fn, pattern, getbase) {
  var key = pattern + (getbase || '');
  return cache[key] || (cache[key] = fn(pattern, getbase));
}

/**
 * Expose the glob `cache`
 */

var cache = module.exports.cache = {};

/**
 * Escape/unescape utils
 */

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

},{"glob-base":4,"glob-path-regex":7,"is-glob":8}],2:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
/*!
 * glob-base <https://github.com/jonschlinkert/glob-base>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var isGlob = require('is-glob');
var parent = require('glob-parent');

module.exports = function globBase(glob) {
  if (typeof glob !== 'string') {
    throw new TypeError('glob-base expects a string.');
  }

  var res = {};
  res.base = parent(glob);

  if (res.base !== '.') {
    res.pattern = glob.substr(res.base.length);
    if (res.pattern.charAt(0) === '/') {
      res.pattern = res.pattern.substr(1);
    }
  } else {
    res.pattern = glob;
  }

  if (res.base === glob) {
    res.base = dirname(glob);
    res.pattern = res.base === '.' ? glob : glob.substr(res.base.length);
  }

  if (res.pattern.substr(0, 2) === './') {
    res.pattern = res.pattern.substr(2);
  }

  if (res.pattern.charAt(0) === '/') {
    res.pattern = res.pattern.substr(1);
  }
  return res;
}

function dirname(glob) {
  if (glob[glob.length - 1] === '/') {
    return glob;
  }
  return path.dirname(glob);
}

},{"glob-parent":5,"is-glob":6,"path":2}],5:[function(require,module,exports){
'use strict';

var path = require('path');
var isglob = require('is-glob');

module.exports = function globParent(str) {
	while (isglob(str)) str = path.dirname(str);
	return str;
};

},{"is-glob":6,"path":2}],6:[function(require,module,exports){
/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function isGlob(str) {
  return typeof str === 'string'
    && /[!*{}?(|)[\]]/.test(str);
};

},{}],7:[function(require,module,exports){
/*!
 * glob-path-regex <https://github.com/regexps/glob-path-regex>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

module.exports = function globPathRegex() {
  return /^(.*?)(([\w*]*|[.\\*]*\{[^}]*\})((\.([\w*]*))*))$/;
};

},{}],8:[function(require,module,exports){
/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

module.exports = function isGlob(str) {
  return typeof str === 'string'
    && /[!*{}?(|)[\]]/.test(str);
};

},{}]},{},[1]);
