/**
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');
var parse = require('./');

it('should detect when the pattern is a glob pattern:', function () {
  assert.equal(parse('a.min.js').isGlob, false);
  assert.equal(parse('*.min.js').isGlob, true);
  assert.equal(parse('foo/{a,b}.min.js').isGlob, true);
  assert.equal(parse('foo/(a|b).min.js').isGlob, true);
  assert.equal(parse('foo/[a-b].min.js').isGlob, true);
  assert.equal(parse('!foo').isGlob, true);
});

it('should get a filename from a complex pattern:', function () {
  assert.equal(parse('*.min.js').dirname, '');
  assert.equal(parse('/a/b/c').dirname, '/a/b/');
  assert.equal(parse('/a/b/c/').dirname, '/a/b/c/');
  assert.equal(parse('/a/b/{c,d}/').dirname, '/a/b/{c,d}/');
  assert.equal(parse('/a/b/{c,d}/*.js').dirname, '/a/b/{c,d}/');
  assert.equal(parse('/a/b/{c,d}/*.min.js').dirname, '/a/b/{c,d}/');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').dirname, '/a/b/{c,d}/e.f.g/');
  assert.equal(parse('/a/b/{c,/foo.js}/e.f.g/').dirname, '/a/b/{c,/foo.js}/e.f.g/');
  assert.equal(parse('./{a/b/{c,/foo.js}/e.f.g}').dirname, './{a/b/{c,/foo.js}/e.f.g}');
  assert.equal(parse('[a-c]b*').dirname, '');
  assert.equal(parse('[a-j]*[^c]').dirname, '');
  assert.equal(parse('[a-j]*[^c]b/c').dirname, '[a-j]*[^c]b/');
  assert.equal(parse('[a-j]*[^c]bc').dirname, '');
  assert.equal(parse('a/b/{c,./d}/e/f.g').dirname, 'a/b/{c,./d}/e/');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').dirname, 'a/b/{c,.gitignore,{a,./b}}/{a,b}/');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
  assert.equal(parse('a/b/{c,.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,/.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,/d}/e/f.g').dirname, 'a/b/{c,/d}/e/');
  assert.equal(parse('a/b/{c,/gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,d}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,d}/').dirname, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/*.js').dirname, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/*.min.js').dirname, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/e.f.g/').dirname, 'a/b/{c,d}/e.f.g/');
  assert.equal(parse('a/b/{c,d}/e/f.g').dirname, 'a/b/{c,d}/e/');
  assert.equal(parse('a').dirname, '');
  assert.equal(parse('a/**/b/*.{foo,bar}').dirname, 'a/**/b/');
  assert.equal(parse('a/b/*.{foo,bar}').dirname, 'a/b/');
  assert.equal(parse('a/b/.gitignore').dirname, 'a/b/');
  assert.equal(parse('a/b/.{c,.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/.{c,/.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/.{foo,bar}').dirname, 'a/b/');
  assert.equal(parse('a/b/c').dirname, 'a/b/');
  assert.equal(parse('a/b/c.d/e.md').dirname, 'a/b/c.d/');
  assert.equal(parse('a/b/c.md').dirname, 'a/b/');
  assert.equal(parse('a/b/c.min.js').dirname, 'a/b/');
  assert.equal(parse('a/b/c/').dirname, 'a/b/c/');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').dirname, 'a/b/c/d.e.f/');
  assert.equal(parse('a/b/c/d.md').dirname, 'a/b/c/');
  assert.equal(parse('c.md').dirname, '');
});

it('should get a filename from a complex pattern:', function () {
  assert.equal(parse('*.min.js').filename, '*.min.js');
  assert.equal(parse('/a/b/{c,d}/').filename, '');
  assert.equal(parse('/a/b/{c,d}/*.js').filename, '*.js');
  assert.equal(parse('/a/b/{c,d}/*.min.js').filename, '*.min.js');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').filename, '');
  assert.equal(parse('[a-j]*[^c]').filename, '[a-j]*[^c]');
  assert.equal(parse('[a-j]*[^c]bc').filename, '[a-j]*[^c]bc');
  assert.equal(parse('a/**/b/*.{foo,bar}').filename, '*.{foo,bar}');
  assert.equal(parse('a/b/*.{foo,bar}').filename, '*.{foo,bar}');
  assert.equal(parse('a/b/.{c,.gitignore}').filename, '.{c,.gitignore}');
  assert.equal(parse('a/b/.{c,/.gitignore}').filename, '.{c,/.gitignore}');
  assert.equal(parse('a/b/.{foo,bar}').filename, '.{foo,bar}');
  assert.equal(parse('a/b/{c,./d}/e/f.g').filename, 'f.g');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').filename, 'abc.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').filename, '*.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').filename, 'abc.foo.js');
  assert.equal(parse('a/b/{c,.gitignore}').filename, '{c,.gitignore}');
  assert.equal(parse('a/b/{c,/.gitignore}').filename, '{c,/.gitignore}');
  assert.equal(parse('a/b/{c,/d}/e/f.g').filename, 'f.g');
  assert.equal(parse('a/b/{c,/gitignore}').filename, '{c,/gitignore}');
  assert.equal(parse('a/b/{c,d}').filename, '{c,d}');
  assert.equal(parse('a/b/{c,d}/').filename, '');
  assert.equal(parse('a/b/{c,d}/*.js').filename, '*.js');
  assert.equal(parse('a/b/{c,d}/*.min.js').filename, '*.min.js');
  assert.equal(parse('a/b/{c,d}/e.f.g/').filename, '');
  assert.equal(parse('a/b/{c,d}/e/f.g').filename, 'f.g');
});

it('should get a basename from a complex pattern:', function () {
  assert.equal(parse('*.min.js').basename, '*');
  assert.equal(parse('/a/b/c').basename, 'c');
  assert.equal(parse('/a/b/c/').basename, '');
  assert.equal(parse('/a/b/{c,d}/').basename, '');
  assert.equal(parse('/a/b/{c,d}/*.js').basename, '*');
  assert.equal(parse('/a/b/{c,d}/*.min.js').basename, '*');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').basename, '');
  assert.equal(parse('[a-c]b*').basename, '[a-c]b*');
  assert.equal(parse('a').basename, 'a');
  assert.equal(parse('a/**/b/*.{foo,bar}').basename, '*');
  assert.equal(parse('a/b/*.{foo,bar}').basename, '*');
  assert.equal(parse('a/b/.gitignore').basename, '');
  assert.equal(parse('a/b/.{c,.gitignore}').basename, '');
  assert.equal(parse('a/b/.{c,/.gitignore}').basename, '');
  assert.equal(parse('a/b/.{foo,bar}').basename, '');
  assert.equal(parse('a/b/c').basename, 'c');
  assert.equal(parse('a/b/c.d/e.md').basename, 'e');
  assert.equal(parse('a/b/c.md').basename, 'c');
  assert.equal(parse('a/b/c.min.js').basename, 'c');
  assert.equal(parse('a/b/c/').basename, '');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').basename, 'g');
  assert.equal(parse('a/b/c/d.md').basename, 'd');
  assert.equal(parse('a/b/{c,./d}/e/f.g').basename, 'f');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').basename, 'abc');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').basename, '*');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').basename, 'abc');
  assert.equal(parse('a/b/{c,.gitignore}').basename, '{c,.gitignore}');
  assert.equal(parse('a/b/{c,/.gitignore}').basename, '{c,/.gitignore}');
  assert.equal(parse('a/b/{c,/d}/e/f.g').basename, 'f');
  assert.equal(parse('a/b/{c,/gitignore}').basename, '{c,/gitignore}');
  assert.equal(parse('a/b/{c,d}').basename, '{c,d}');
  assert.equal(parse('a/b/{c,d}/').basename, '');
  assert.equal(parse('a/b/{c,d}/*.js').basename, '*');
  assert.equal(parse('a/b/{c,d}/*.min.js').basename, '*');
  assert.equal(parse('a/b/{c,d}/e.f.g/').basename, '');
  assert.equal(parse('a/b/{c,d}/e/f.g').basename, 'f');
  assert.equal(parse('c.md').basename, 'c');
});

it('should get an extname from a complex pattern:', function () {
  assert.equal(parse('*.min.js').extname, '.min.js');
  assert.equal(parse('/a/b/c').extname, '');
  assert.equal(parse('/a/b/c/').extname, '');
  assert.equal(parse('/a/b/{c,d}/').extname, '');
  assert.equal(parse('/a/b/{c,d}/*.js').extname, '.js');
  assert.equal(parse('/a/b/{c,d}/*.min.js').extname, '.min.js');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').extname, '');
  assert.equal(parse('[a-c]b*').extname, '');
  assert.equal(parse('[a-j]*[^c]bc').extname, '');
  assert.equal(parse('a').extname, '');
  assert.equal(parse('a/**/b/*.{foo,bar}').extname, '.{foo,bar}');
  assert.equal(parse('a/b/*.{foo,bar}').extname, '.{foo,bar}');
  assert.equal(parse('a/b/.gitignore').extname, '.gitignore');
  assert.equal(parse('a/b/.{c,.gitignore}').extname, '.{c,.gitignore}');
  assert.equal(parse('a/b/.{c,/.gitignore}').extname, '.{c,/.gitignore}');
  assert.equal(parse('a/b/.{foo,bar}').extname, '.{foo,bar}');
  assert.equal(parse('a/b/c').extname, '');
  assert.equal(parse('a/b/c.d/e.md').extname, '.md');
  assert.equal(parse('a/b/c.md').extname, '.md');
  assert.equal(parse('a/b/c.min.js').extname, '.min.js');
  assert.equal(parse('a/b/c/').extname, '');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').extname, '.min.js');
  assert.equal(parse('a/b/c/d.md').extname, '.md');
  assert.equal(parse('a/b/{c,./d}/e/f.g').extname, '.g');
  assert.equal(parse('a/b/{c,./d}/e/f.min.g').extname, '.min.g');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').extname, '.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').extname, '.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').extname, '.foo.js');
  assert.equal(parse('a/b/{c,.gitignore}').extname, '');
  assert.equal(parse('a/b/{c,/.gitignore}').extname, '');
  assert.equal(parse('a/b/{c,/d}/e/f.g').extname, '.g');
  assert.equal(parse('a/b/{c,/d}/e/f.min.g').extname, '.min.g');
  assert.equal(parse('a/b/{c,/gitignore}').extname, '');
  assert.equal(parse('a/b/{c,d}').extname, '');
  assert.equal(parse('a/b/{c,d}/').extname, '');
  assert.equal(parse('a/b/{c,d}/*.js').extname, '.js');
  assert.equal(parse('a/b/{c,d}/*.min.js').extname, '.min.js');
  assert.equal(parse('a/b/{c,d}/e.f.g/').extname, '');
  assert.equal(parse('a/b/{c,d}/e/f.g').extname, '.g');
  assert.equal(parse('a/b/{c,d}/e/f.min.g').extname, '.min.g');
  assert.equal(parse('c.md').extname, '.md');
});


it('should parse path ending with a brace pattern:', function () {
  assert.equal(parse('a/b/{c,d}').pattern, 'a/b/{c,d}');
  assert.equal(parse('a/b/{c,d}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,d}').filename, '{c,d}');
  assert.equal(parse('a/b/{c,d}').basename, '{c,d}');
  assert.equal(parse('a/b/{c,d}').extname, '');
  assert.equal(parse('a/b/{c,d}').ext, '');
});

it('should parse a path with a brace pattern in the dirname:', function () {
  assert.equal(parse('a/b/{c,d}/*.js').pattern, 'a/b/{c,d}/*.js');
  assert.equal(parse('a/b/{c,d}/*.js').dirname, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/*.js').filename, '*.js');
  assert.equal(parse('a/b/{c,d}/*.js').basename, '*');
  assert.equal(parse('a/b/{c,d}/*.js').extname, '.js');
  assert.equal(parse('a/b/{c,d}/*.js').ext, 'js');

  assert.equal(parse('a/b/{c,d}/').pattern, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/').dirname, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/').filename, '');
  assert.equal(parse('a/b/{c,d}/').basename, '');
  assert.equal(parse('a/b/{c,d}/').extname, '');
  assert.equal(parse('a/b/{c,d}/').ext, '');

  assert.equal(parse('a/b/{c,d}/e.f.g/').pattern, 'a/b/{c,d}/e.f.g/');
  assert.equal(parse('a/b/{c,d}/e.f.g/').dirname, 'a/b/{c,d}/e.f.g/');
  assert.equal(parse('a/b/{c,d}/e.f.g/').filename, '');
  assert.equal(parse('a/b/{c,d}/e.f.g/').basename, '');
  assert.equal(parse('a/b/{c,d}/e.f.g/').extname, '');
  assert.equal(parse('a/b/{c,d}/e.f.g/').ext, '');

  assert.equal(parse('/a/b/{c,d}/e.f.g/').pattern, '/a/b/{c,d}/e.f.g/');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').dirname, '/a/b/{c,d}/e.f.g/');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').filename, '');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').basename, '');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').extname, '');
  assert.equal(parse('/a/b/{c,d}/e.f.g/').ext, '');

  assert.equal(parse('a/b/{c,d}/*.min.js').pattern, 'a/b/{c,d}/*.min.js');
  assert.equal(parse('a/b/{c,d}/*.min.js').dirname, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/*.min.js').filename, '*.min.js');
  assert.equal(parse('a/b/{c,d}/*.min.js').basename, '*');
  assert.equal(parse('a/b/{c,d}/*.min.js').extname, '.min.js');
  assert.equal(parse('a/b/{c,d}/*.min.js').ext, 'js');

  assert.equal(parse('*.min.js').pattern, '*.min.js');
  assert.equal(parse('*.min.js').dirname, '');
  assert.equal(parse('*.min.js').filename, '*.min.js');
  assert.equal(parse('*.min.js').basename, '*');
  assert.equal(parse('*.min.js').extname, '.min.js');
  assert.equal(parse('*.min.js').ext, 'js');

  assert.equal(parse('a/b/{c,d}/*.min.js').extname, '.min.js');
  assert.equal(parse('a/b/{c,d}/*.min.js').ext, 'js');

  assert.equal(parse('[a-j]*[^c]').pattern, '[a-j]*[^c]');
  assert.equal(parse('[a-j]*[^c]').dirname, '');
  assert.equal(parse('[a-j]*[^c]').filename, '[a-j]*[^c]');
  assert.equal(parse('[a-j]*[^c]b/c').pattern, '[a-j]*[^c]b/c');
  assert.equal(parse('[a-j]*[^c]b/c').dirname, '[a-j]*[^c]b/');
  assert.equal(parse('[a-j]*[^c]bc').pattern, '[a-j]*[^c]bc');
  assert.equal(parse('[a-j]*[^c]bc').dirname, '');
  assert.equal(parse('[a-j]*[^c]bc').filename, '[a-j]*[^c]bc');
});

it('should detect when `dotdirs` are defined:', function () {
  assert.equal(parse('a/b/.git/').dotdirs, true);
  assert.equal(parse('a/b/git/').dotdirs, false);
  assert.equal(parse('a/b/.git/').dotfiles, false);
});

it('should detect when `dotfiles` are defined:', function () {
  assert.equal(parse('a/b/.gitignore').dotfiles, true);
  assert.equal(parse('a/b/.git').dotfiles, true);
  assert.equal(parse('a/b/.gitignore').dotdirs, false);
  assert.equal(parse('a/b/.git').dotdirs, false);
});

it('should match a glob path ending with a slash:', function () {
  assert.equal(parse('a/b/{c,d}/').pattern, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/').dirname, 'a/b/{c,d}/');
  assert.equal(parse('a/b/{c,d}/').filename, '');
  assert.equal(parse('a/b/{c,d}/').basename, '');
  assert.equal(parse('a/b/{c,d}/').extname, '');
});

it('should match a glob path beginning with a slash:', function () {
  assert.equal(parse('/a/b/{c,d}/').pattern, '/a/b/{c,d}/');
  assert.equal(parse('/a/b/{c,d}/').dirname, '/a/b/{c,d}/');
  assert.equal(parse('/a/b/{c,d}/').filename, '');
  assert.equal(parse('/a/b/{c,d}/').basename, '');
  assert.equal(parse('/a/b/{c,d}/').extname, '');
});

it('should match a filename glob:', function () {
  assert.equal(parse('/a/b/{c,d}/*.js').pattern, '/a/b/{c,d}/*.js');
  assert.equal(parse('/a/b/{c,d}/*.js').dirname, '/a/b/{c,d}/');
  assert.equal(parse('/a/b/{c,d}/*.js').filename, '*.js');
  assert.equal(parse('/a/b/{c,d}/*.js').basename, '*');
  assert.equal(parse('/a/b/{c,d}/*.js').extname, '.js');
  assert.equal(parse('/a/b/{c,d}/*.js').ext, 'js');

  assert.equal(parse('/a/b/{c,d}/*.min.js').pattern, '/a/b/{c,d}/*.min.js');
  assert.equal(parse('/a/b/{c,d}/*.min.js').dirname, '/a/b/{c,d}/');
  assert.equal(parse('/a/b/{c,d}/*.min.js').filename, '*.min.js');
  assert.equal(parse('/a/b/{c,d}/*.min.js').basename, '*');
  assert.equal(parse('/a/b/{c,d}/*.min.js').extname, '.min.js');
  assert.equal(parse('/a/b/{c,d}/*.js').ext, 'js');
});

it('should match a glob path with a brace pattern:', function () {
  assert.equal(parse('a/b/{c,d}/e/f.g').pattern, 'a/b/{c,d}/e/f.g');
  assert.equal(parse('a/b/{c,d}/e/f.g').dirname, 'a/b/{c,d}/e/');
  assert.equal(parse('a/b/{c,d}/e/f.g').filename, 'f.g');
  assert.equal(parse('a/b/{c,d}/e/f.g').basename, 'f');
  assert.equal(parse('a/b/{c,d}/e/f.g').extname, '.g');
  assert.equal(parse('a/b/{c,d}/e/f.min.g').extname, '.min.g');
  assert.equal(parse('a/b/{c,d}/e/f.g').ext, 'g');

  assert.equal(parse('a/b/{c,./d}/e/f.g').pattern, 'a/b/{c,./d}/e/f.g');
  assert.equal(parse('a/b/{c,./d}/e/f.g').dirname, 'a/b/{c,./d}/e/');
  assert.equal(parse('a/b/{c,./d}/e/f.g').filename, 'f.g');
  assert.equal(parse('a/b/{c,./d}/e/f.g').basename, 'f');
  assert.equal(parse('a/b/{c,./d}/e/f.g').extname, '.g');
  assert.equal(parse('a/b/{c,./d}/e/f.min.g').extname, '.min.g');
  assert.equal(parse('a/b/{c,./d}/e/f.g').ext, 'g');

  assert.equal(parse('a/b/{c,/d}/e/f.g').pattern, 'a/b/{c,/d}/e/f.g');
  assert.equal(parse('a/b/{c,/d}/e/f.g').dirname, 'a/b/{c,/d}/e/');
  assert.equal(parse('a/b/{c,/d}/e/f.g').filename, 'f.g');
  assert.equal(parse('a/b/{c,/d}/e/f.g').basename, 'f');
  assert.equal(parse('a/b/{c,/d}/e/f.g').extname, '.g');
  assert.equal(parse('a/b/{c,/d}/e/f.min.g').extname, '.min.g');
  assert.equal(parse('a/b/{c,/d}/e/f.g').ext, 'g');
});

it('should work when brace patterns have dots and slashes:', function () {
  assert.equal(parse('a/b/{c,/.gitignore}').pattern, 'a/b/{c,/.gitignore}');
  assert.equal(parse('a/b/{c,/.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,/.gitignore}').filename, '{c,/.gitignore}');
  assert.equal(parse('a/b/{c,/.gitignore}').basename, '{c,/.gitignore}');
  assert.equal(parse('a/b/{c,/.gitignore}').extname, '');

  assert.equal(parse('a/b/{c,/gitignore}').pattern, 'a/b/{c,/gitignore}');
  assert.equal(parse('a/b/{c,/gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,/gitignore}').filename, '{c,/gitignore}');
  assert.equal(parse('a/b/{c,/gitignore}').basename, '{c,/gitignore}');
  assert.equal(parse('a/b/{c,/gitignore}').extname, '');

  assert.equal(parse('a/b/{c,.gitignore}').pattern, 'a/b/{c,.gitignore}');
  assert.equal(parse('a/b/{c,.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/{c,.gitignore}').filename, '{c,.gitignore}');
  assert.equal(parse('a/b/{c,.gitignore}').basename, '{c,.gitignore}');
  assert.equal(parse('a/b/{c,.gitignore}').extname, '');
});

it('should work when brace patterns have a leading dot:', function () {
  assert.equal(parse('a/b/.{foo,bar}').pattern, 'a/b/.{foo,bar}');
  assert.equal(parse('a/b/.{foo,bar}').dirname, 'a/b/');
  assert.equal(parse('a/b/.{foo,bar}').filename, '.{foo,bar}');
  assert.equal(parse('a/b/.{foo,bar}').basename, '');
  assert.equal(parse('a/b/.{foo,bar}').extname, '.{foo,bar}');
  assert.equal(parse('a/b/.{foo,bar}').ext, '{foo,bar}');

  assert.equal(parse('a/b/.{c,/.gitignore}').pattern, 'a/b/.{c,/.gitignore}');
  assert.equal(parse('a/b/.{c,/.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/.{c,/.gitignore}').filename, '.{c,/.gitignore}');
  assert.equal(parse('a/b/.{c,/.gitignore}').basename, '');
  assert.equal(parse('a/b/.{c,/.gitignore}').extname, '.{c,/.gitignore}');

  assert.equal(parse('a/b/.{c,.gitignore}').pattern, 'a/b/.{c,.gitignore}');
  assert.equal(parse('a/b/.{c,.gitignore}').dirname, 'a/b/');
  assert.equal(parse('a/b/.{c,.gitignore}').filename, '.{c,.gitignore}');
  assert.equal(parse('a/b/.{c,.gitignore}').basename, '');
  assert.equal(parse('a/b/.{c,.gitignore}').extname, '.{c,.gitignore}');
  assert.equal(parse('a/b/.{c,.gitignore}').ext, '{c,.gitignore}');
});

it('should match when the filename starts with a star:', function () {
  assert.equal(parse('a/b/*.{foo,bar}').pattern, 'a/b/*.{foo,bar}');
  assert.equal(parse('a/b/*.{foo,bar}').dirname, 'a/b/');
  assert.equal(parse('a/b/*.{foo,bar}').filename, '*.{foo,bar}');
  assert.equal(parse('a/b/*.{foo,bar}').basename, '*');
  assert.equal(parse('a/b/*.{foo,bar}').extname, '.{foo,bar}');
  assert.equal(parse('a/b/*.{foo,bar}').ext, '{foo,bar}');
});

it('should match with globstars:', function () {
  assert.equal(parse('a/**/b/*.{foo,bar}').pattern, 'a/**/b/*.{foo,bar}');
  assert.equal(parse('a/**/b/*.{foo,bar}').dirname, 'a/**/b/');
  assert.equal(parse('a/**/b/*.{foo,bar}').filename, '*.{foo,bar}');
  assert.equal(parse('a/**/b/*.{foo,bar}').basename, '*');
  assert.equal(parse('a/**/b/*.{foo,bar}').extname, '.{foo,bar}');
  assert.equal(parse('a/**/b/*.{foo,bar}').ext, '{foo,bar}');
});

it('should match complex patterns:', function () {
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').pattern, 'a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').filename, 'abc.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').basename, 'abc');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').extname, '.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').ext, 'js');

  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').pattern, 'a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').filename, '*.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').basename, '*');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').extname, '.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').ext, 'js');

  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').pattern, 'a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').dirname, 'a/b/{c,.gitignore,{a,./b}}/{a,b}/');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').filename, 'abc.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').basename, 'abc');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').extname, '.foo.js');
  assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').ext, 'js');
});

it('should match a path with an extension:', function () {
  assert.equal(parse('a/b/c.md').pattern, 'a/b/c.md');
  assert.equal(parse('a/b/c.md').dirname, 'a/b/');
  assert.equal(parse('a/b/c.md').filename, 'c.md');
  assert.equal(parse('a/b/c.md').basename, 'c');
  assert.equal(parse('a/b/c.md').extname, '.md');
  assert.equal(parse('a/b/c.md').ext, 'md');
  assert.equal(parse('c.md').pattern, 'c.md');
  assert.equal(parse('c.md').dirname, '');
  assert.equal(parse('c.md').filename, 'c.md');
  assert.equal(parse('c.md').basename, 'c');
  assert.equal(parse('c.md').extname, '.md');
  assert.equal(parse('c.md').ext, 'md');
});

it('should match a path with multiple extensions:', function () {
  assert.equal(parse('a/b/c.min.js').pattern, 'a/b/c.min.js');
  assert.equal(parse('a/b/c.min.js').dirname, 'a/b/');
  assert.equal(parse('a/b/c.min.js').filename, 'c.min.js');
  assert.equal(parse('a/b/c.min.js').basename, 'c');
  assert.equal(parse('a/b/c.min.js').extname, '.min.js');
  assert.equal(parse('a/b/c.min.js').ext, 'js');
});

it('should work with paths that have dots in the dirname:', function () {
  assert.equal(parse('a/b/c/d.e.f/g.min.js').pattern, 'a/b/c/d.e.f/g.min.js');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').dirname, 'a/b/c/d.e.f/');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').filename, 'g.min.js');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').basename, 'g');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').extname, '.min.js');
  assert.equal(parse('a/b/c/d.e.f/g.min.js').ext, 'js');
});

it('should match a path without an extension:', function () {
  assert.equal(parse('a').pattern, 'a');
  assert.equal(parse('a').dirname, '');
  assert.equal(parse('a').filename, 'a');
  assert.equal(parse('a').basename, 'a');
  assert.equal(parse('a').extname, '');
});

it('should match a file path ending with an extension:', function () {
  assert.equal(parse('a/b/c/d.md').pattern, 'a/b/c/d.md');
  assert.equal(parse('a/b/c/d.md').dirname, 'a/b/c/');
  assert.equal(parse('a/b/c/d.md').filename, 'd.md');
  assert.equal(parse('a/b/c/d.md').basename, 'd');
  assert.equal(parse('a/b/c/d.md').extname, '.md');
  assert.equal(parse('a/b/c/d.md').ext, 'md');
});

it('should match a file path ending with an extension:', function () {
  assert.equal(parse('a/b/c.d/e.md').pattern, 'a/b/c.d/e.md');
  assert.equal(parse('a/b/c.d/e.md').dirname, 'a/b/c.d/');
  assert.equal(parse('a/b/c.d/e.md').filename, 'e.md');
  assert.equal(parse('a/b/c.d/e.md').basename, 'e');
  assert.equal(parse('a/b/c.d/e.md').extname, '.md');
  assert.equal(parse('a/b/c.d/e.md').ext, 'md');
});

it('should match a file path without a trailing slash:', function () {
  assert.equal(parse('a/b/c').pattern, 'a/b/c');
  assert.equal(parse('a/b/c').dirname, 'a/b/');
  assert.equal(parse('a/b/c').filename, 'c');
  assert.equal(parse('a/b/c').basename, 'c');
  assert.equal(parse('a/b/c').extname, '');
});

it('should match a file path with a trailing slash:', function () {
  assert.equal(parse('a/b/c/').pattern, 'a/b/c/');
  assert.equal(parse('a/b/c/').dirname, 'a/b/c/');
  assert.equal(parse('a/b/c/').filename, '');
  assert.equal(parse('a/b/c/').basename, '');
  assert.equal(parse('a/b/c/').extname, '');
});

it('should match a file path with a leading slash:', function () {
  assert.equal(parse('/a/b/c').pattern, '/a/b/c');
  assert.equal(parse('/a/b/c').dirname, '/a/b/');
  assert.equal(parse('/a/b/c').filename, 'c');
  assert.equal(parse('/a/b/c').basename, 'c');
  assert.equal(parse('/a/b/c').extname, '');
});

it('should match a file path with trailing and leading slashes:', function () {
  assert.equal(parse('/a/b/c/').pattern, '/a/b/c/');
  assert.equal(parse('/a/b/c/').dirname, '/a/b/c/');
  assert.equal(parse('/a/b/c/').filename, '');
  assert.equal(parse('/a/b/c/').basename, '');
  assert.equal(parse('/a/b/c/').extname, '');
});


it('should match a path with a dotfile:', function () {
  assert.equal(parse('a/b/.gitignore').dirname, 'a/b/');
  assert.equal(parse('a/b/.gitignore').filename, '.gitignore');
  assert.equal(parse('a/b/.gitignore').basename, '');
  assert.equal(parse('a/b/.gitignore').extname, '.gitignore');
  assert.equal(parse('a/b/.gitignore').ext, 'gitignore');
});


it('should match character classes:', function () {
  assert.equal(parse('[a-c]b*').pattern, '[a-c]b*');
  assert.equal(parse('[a-j]*[^c]').pattern, '[a-j]*[^c]');
  assert.equal(parse('[a-j]*[^c]').dirname, '');
  assert.equal(parse('[a-j]*[^c]').filename, '[a-j]*[^c]');
  assert.equal(parse('[a-j]*[^c]b/c').pattern, '[a-j]*[^c]b/c');
  assert.equal(parse('[a-j]*[^c]bc').pattern, '[a-j]*[^c]bc');
});

it('should work when a character class has trailing word characters:', function () {
  assert.equal(parse('[a-c]b*').pattern, '[a-c]b*');
  assert.equal(parse('[a-c]b*').dirname, '');
  assert.equal(parse('[a-c]b*').filename, '[a-c]b*');
  assert.equal(parse('[a-c]b*').basename, '[a-c]b*');
  assert.equal(parse('[a-c]b*').extname, '');
  assert.equal(parse('[a-j]*[^c]bc').dirname, '');
  assert.equal(parse('[a-j]*[^c]bc').filename, '[a-j]*[^c]bc');
  assert.equal(parse('[a-j]*[^c]bc').basename, '[a-j]*[^c]bc');
  assert.equal(parse('[a-j]*[^c]bc').extname, '');
});
