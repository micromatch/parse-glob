/*!
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
var parse = require('./');

describe('`is` object:', function () {
  it('should detect when special characters are in a pattern:', function () {
    assert.equal(parse('!**{}[:[@()').is.negated, true);
    assert.equal(parse('!**{}[:[@()').is.glob, true);
    assert.equal(parse('!**{}[:[@()').is.extglob, true);
    assert.equal(parse('!**{}[:[@()').is.brackets, true);
    assert.equal(parse('!**{}[:[@()').is.braces, true);
  });

  it('should detect when the pattern is a glob pattern:', function () {
    assert.equal(parse('a.min.js').is.glob, false);
    assert.equal(parse('*.min.js').is.glob, true);
    assert.equal(parse('foo/{a,b}.min.js').is.glob, true);
    assert.equal(parse('foo/(a|b).min.js').is.glob, true);
    assert.equal(parse('foo/[a-b].min.js').is.glob, true);
    assert.equal(parse('!foo').is.glob, true);
  });

  it('should detect when a pattern is negated:', function () {
    assert.equal(parse('a.min.js').is.negated, false);
    assert.equal(parse('!*.min.js').is.negated, true);
    assert.equal(parse('!foo/{a,b}.min.js').is.negated, true);
    assert.equal(parse('!foo/(a|b).min.js').is.negated, true);
    assert.equal(parse('!foo/[a-b].min.js').is.negated, true);
    assert.equal(parse('foo').is.negated, false);
  });

  it('should detect when a pattern has a globstar:', function () {
    assert.equal(parse('**').is.globstar, true);
    assert.equal(parse('**/*.min.js').is.globstar, true);
    assert.equal(parse('**/*foo.js').is.globstar, true);
    assert.equal(parse('*/*').is.globstar, false);
    assert.equal(parse('*/*/**/a.js').is.globstar, true);
    assert.equal(parse('a.min.js').is.globstar, false);
    assert.equal(parse('!*.min.js').is.globstar, false);
    assert.equal(parse('!foo/{a,b}.min.js').is.globstar, false);
    assert.equal(parse('!foo/(a|b).min.js').is.globstar, false);
    assert.equal(parse('!foo/[a-b].min.js').is.globstar, false);
    assert.equal(parse('foo').is.globstar, false);
  });

  it('should detect when a pattern has brace patterns:', function () {
    assert.equal(parse('a/b/c').is.braces, false);
    assert.equal(parse('**/*.{js,min.js}').is.braces, true);
    assert.equal(parse('**/*{bar,foo}.js').is.braces, true);
  });
});

describe('should get a base path:', function () {
  it('should extract a base path from a glob pattern:', function () {
    assert.equal(parse('.*').base, '.');
    assert.equal(parse('.*').glob, '.*');

    assert.equal(parse('./*').base, '.');
    assert.equal(parse('./*').glob, '*');

    assert.equal(parse('*').base, '.');
    assert.equal(parse('*').glob, '*');

    assert.equal(parse('**').base, '.');
    assert.equal(parse('**').glob, '**');

    assert.equal(parse('**/*.md').base, '.');
    assert.equal(parse('**/*.md').glob, '**/*.md');

    assert.equal(parse('**/*.min.js').base, '.');
    assert.equal(parse('**/*.min.js').glob, '**/*.min.js');

    assert.equal(parse('**/*foo.js').base, '.');
    assert.equal(parse('**/*foo.js').glob, '**/*foo.js');

    assert.equal(parse('**/.*').base, '.');
    assert.equal(parse('**/.*').glob, '**/.*');

    assert.equal(parse('**/d').base, '.');
    assert.equal(parse('**/d').glob, '**/d');

    assert.equal(parse('*.*').base, '.');
    assert.equal(parse('*.*').glob, '*.*');

    assert.equal(parse('*.js').base, '.');
    assert.equal(parse('*.js').glob, '*.js');

    assert.equal(parse('*.md').base, '.');
    assert.equal(parse('*.md').glob, '*.md');

    assert.equal(parse('*.min.js').base, '.');
    assert.equal(parse('*.min.js').glob, '*.min.js');

    assert.equal(parse('*/*').base, '.');
    assert.equal(parse('*/*').glob, '*/*');

    assert.equal(parse('*/*/*/*').base, '.');
    assert.equal(parse('*/*/*/*').glob, '*/*/*/*');

    assert.equal(parse('*/*/*/e').base, '.');
    assert.equal(parse('*/*/*/e').glob, '*/*/*/e');

    assert.equal(parse('*/b/*/e').base, '.');
    assert.equal(parse('*/b/*/e').glob, '*/b/*/e');

    assert.equal(parse('*b').base, '.');
    assert.equal(parse('*b').glob, '*b');

    assert.equal(parse('./a/**/j/**/z/*.md').base, './a');
    assert.equal(parse('./a/**/j/**/z/*.md').glob, '**/j/**/z/*.md');

    assert.equal(parse('./a/**/z/*.md').base, './a');
    assert.equal(parse('./a/**/z/*.md').glob, '**/z/*.md');

    assert.equal(parse('./{a/b/{c,/foo.js}/e.f.g}').base, '.');
    assert.equal(parse('./{a/b/{c,/foo.js}/e.f.g}').glob, '{a/b/{c,/foo.js}/e.f.g}');

    assert.equal(parse('./node_modules/*-glob/**/*.js').base, './node_modules');
    assert.equal(parse('./node_modules/*-glob/**/*.js').glob, '*-glob/**/*.js');

    assert.equal(parse('a/b/{c,/.gitignore}').base, 'a/b');
    assert.equal(parse('a/b/{c,/.gitignore}').glob, '{c,/.gitignore}');

    assert.equal(parse('a/b/.{foo,bar}').base, 'a/b');
    assert.equal(parse('a/b/.{foo,bar}').glob, '.{foo,bar}');

    assert.equal(parse('a/b/*.{foo,bar}').base, 'a/b');
    assert.equal(parse('a/b/*.{foo,bar}').glob, '*.{foo,bar}');

    assert.equal(parse('a/**/b/*.{foo,bar}').base, 'a');
    assert.equal(parse('a/**/b/*.{foo,bar}').glob, '**/b/*.{foo,bar}');

    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').base, 'a/b');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').glob, '{c,.gitignore,{a,b}}/{a,b}/abc.foo.js');

    assert.equal(parse('a/b/{c,d}/').base, 'a/b');
    assert.equal(parse('a/b/{c,d}/').glob, '{c,d}/');

    assert.equal(parse('a/b/{c,d}/e/f.g').base, 'a/b');
    assert.equal(parse('a/b/{c,d}/e/f.g').glob, '{c,d}/e/f.g');

    assert.equal(parse('.a*').base, '.');
    assert.equal(parse('.a*').glob, '.a*');

    assert.equal(parse('.b*').base, '.');
    assert.equal(parse('.b*').glob, '.b*');

    assert.equal(parse('/*').base, '/');
    assert.equal(parse('/*').glob, '*');

    assert.equal(parse('a/***').base, 'a');
    assert.equal(parse('a/***').glob, '***');

    assert.equal(parse('a/**/b/*.{foo,bar}').base, 'a');
    assert.equal(parse('a/**/b/*.{foo,bar}').glob, '**/b/*.{foo,bar}');

    assert.equal(parse('a/**/c/*').base, 'a');
    assert.equal(parse('a/**/c/*').glob, '**/c/*');

    assert.equal(parse('a/**/c/*.md').base, 'a');
    assert.equal(parse('a/**/c/*.md').glob, '**/c/*.md');

    assert.equal(parse('a/**/e').base, 'a');
    assert.equal(parse('a/**/e').glob, '**/e');

    assert.equal(parse('a/**/j/**/z/*.md').base, 'a');
    assert.equal(parse('a/**/j/**/z/*.md').glob, '**/j/**/z/*.md');

    assert.equal(parse('a/**/z/*.md').base, 'a');
    assert.equal(parse('a/**/z/*.md').glob, '**/z/*.md');

    assert.equal(parse('a/**c*').base, 'a');
    assert.equal(parse('a/**c*').glob, '**c*');

    assert.equal(parse('a/**c/*').base, 'a');
    assert.equal(parse('a/**c/*').glob, '**c/*');

    assert.equal(parse('a/*/*/e').base, 'a');
    assert.equal(parse('a/*/*/e').glob, '*/*/e');

    assert.equal(parse('a/*/c/*.md').base, 'a');
    assert.equal(parse('a/*/c/*.md').glob, '*/c/*.md');

    assert.equal(parse('a/b/**/c{d,e}/**/xyz.md').base, 'a/b');
    assert.equal(parse('a/b/**/c{d,e}/**/xyz.md').glob, '**/c{d,e}/**/xyz.md');

    assert.equal(parse('a/b/**/e').base, 'a/b');
    assert.equal(parse('a/b/**/e').glob, '**/e');

    assert.equal(parse('a/b/*.{foo,bar}').base, 'a/b');
    assert.equal(parse('a/b/*.{foo,bar}').glob, '*.{foo,bar}');

    assert.equal(parse('a/b/*/e').base, 'a/b');
    assert.equal(parse('a/b/*/e').glob, '*/e');

    assert.equal(parse('a/b/c/*').base, 'a/b/c');
    assert.equal(parse('a/b/c/*').glob, '*');

    assert.equal(parse('a/b/c/*.md').base, 'a/b/c');
    assert.equal(parse('a/b/c/*.md').glob, '*.md');

    assert.equal(parse('a/b/c/.*.md').base, 'a/b/c');
    assert.equal(parse('a/b/c/.*.md').glob, '.*.md');

    assert.equal(parse('b/*/*/*').base, 'b');
    assert.equal(parse('b/*/*/*').glob, '*/*/*');
  });

  it('file extensions:', function () {
    assert.equal(parse('.md').base, '.');
    assert.equal(parse('.md').glob, '.md');
  });

  it('negation pattern:', function () {
    assert.equal(parse('!*.min.js').base, '.');
    assert.equal(parse('!*.min.js').glob, '!*.min.js');

    assert.equal(parse('!foo').base, '.');
    assert.equal(parse('!foo').glob, '!foo');

    assert.equal(parse('a/b/c/!foo').base, 'a/b/c');
    assert.equal(parse('a/b/c/!foo').glob, '!foo');

    assert.equal(parse('!foo/(a|b).min.js').base, '.');
    assert.equal(parse('!foo/(a|b).min.js').glob, '!foo/(a|b).min.js');

    assert.equal(parse('!foo/[a-b].min.js').base, '.');
    assert.equal(parse('!foo/[a-b].min.js').glob, '!foo/[a-b].min.js');

    assert.equal(parse('!foo/{a,b}.min.js').base, '.');
    assert.equal(parse('!foo/{a,b}.min.js').glob, '!foo/{a,b}.min.js');
  });

  describe('braces:', function () {
    it('should know when a base cannot be extracted:', function () {
      assert.equal(parse('/a/b/{c,/foo.js}/e.f.g/').base, '/a/b');
      assert.equal(parse('/a/b/{c,/foo.js}/e.f.g/').glob, '{c,/foo.js}/e.f.g/');

      assert.equal(parse('{a/b/c.js,/a/b/{c,/foo.js}/e.f.g/}').base, '.');
      assert.equal(parse('{a/b/c.js,/a/b/{c,/foo.js}/e.f.g/}').glob, '{a/b/c.js,/a/b/{c,/foo.js}/e.f.g/}');

      assert.equal(parse('/a/b/{c,d}/').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/').glob, '{c,d}/');

      assert.equal(parse('/a/b/{c,d}/*.js').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/*.js').glob, '{c,d}/*.js');

      assert.equal(parse('/a/b/{c,d}/*.min.js').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/*.min.js').glob, '{c,d}/*.min.js');

      assert.equal(parse('/a/b/{c,d}/e.f.g/').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').glob, '{c,d}/e.f.g/');

      assert.equal(parse('{.,*}').base, '.');
      assert.equal(parse('{.,*}').glob, '{.,*}');
    });

    it('should work when the basename has braces:', function () {
      assert.equal(parse('a/b/.{c,.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/.{c,.gitignore}').glob, '.{c,.gitignore}');

      assert.equal(parse('a/b/.{c,/.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/.{c,/.gitignore}').glob, '.{c,/.gitignore}');

      assert.equal(parse('a/b/.{foo,bar}').base, 'a/b');
      assert.equal(parse('a/b/.{foo,bar}').glob, '.{foo,bar}');

      assert.equal(parse('a/b/{c,.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore}').glob, '{c,.gitignore}');

      assert.equal(parse('a/b/{c,/.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/{c,/.gitignore}').glob, '{c,/.gitignore}');

      assert.equal(parse('a/b/{c,/gitignore}').base, 'a/b');
      assert.equal(parse('a/b/{c,/gitignore}').glob, '{c,/gitignore}');

      assert.equal(parse('a/b/{c,d}').base, 'a/b');
      assert.equal(parse('a/b/{c,d}').glob, '{c,d}');
    });

    it('should work when the dirname has braces:', function () {
      assert.equal(parse('a/b/{c,./d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,./d}/e/f.g').glob, '{c,./d}/e/f.g');

      assert.equal(parse('a/b/{c,./d}/e/f.min.g').base, 'a/b');
      assert.equal(parse('a/b/{c,./d}/e/f.min.g').glob, '{c,./d}/e/f.min.g');

      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').glob, '{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js');

      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').glob, '{c,.gitignore,{a,b}}/{a,b}/*.foo.js');

      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').glob, '{c,.gitignore,{a,b}}/{a,b}/abc.foo.js');

      assert.equal(parse('a/b/{c,/d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,/d}/e/f.g').glob, '{c,/d}/e/f.g');

      assert.equal(parse('a/b/{c,/d}/e/f.min.g').base, 'a/b');
      assert.equal(parse('a/b/{c,/d}/e/f.min.g').glob, '{c,/d}/e/f.min.g');

      assert.equal(parse('a/b/{c,d}/').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/').glob, '{c,d}/');

      assert.equal(parse('a/b/{c,d}/*.js').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/*.js').glob, '{c,d}/*.js');

      assert.equal(parse('a/b/{c,d}/*.min.js').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/*.min.js').glob, '{c,d}/*.min.js');

      assert.equal(parse('a/b/{c,d}/e.f.g/').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/e.f.g/').glob, '{c,d}/e.f.g/');

      assert.equal(parse('a/b/{c,d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/e/f.g').glob, '{c,d}/e/f.g');

      assert.equal(parse('a/b/{c,d}/e/f.min.g').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/e/f.min.g').glob, '{c,d}/e/f.min.g');

      assert.equal(parse('foo/{a,b}.min.js').base, 'foo');
      assert.equal(parse('foo/{a,b}.min.js').glob, '{a,b}.min.js');
    });
  });

  it('character classes:', function () {
    assert.equal(parse('/[.]bashrc').base, '/');
    assert.equal(parse('/[.]bashrc').glob, '[.]bashrc');
    assert.equal(parse('/[.]bashrc').path.basename, '[.]bashrc');
    assert.equal(parse('/[.]bashrc').path.filename, '[.]bashrc');
    assert.equal(parse('/[.]bashrc').path.extname, '');

    assert.equal(parse('[a-c]b*').base, '.');
    assert.equal(parse('[a-c]b*').glob, '[a-c]b*');

    assert.equal(parse('[a-j]*[^c]').base, '.');
    assert.equal(parse('[a-j]*[^c]').glob, '[a-j]*[^c]');

    assert.equal(parse('[a-j]*[^c]b/c').base, '.');
    assert.equal(parse('[a-j]*[^c]b/c').glob, '[a-j]*[^c]b/c');

    assert.equal(parse('[a-j]*[^c]bc').base, '.');
    assert.equal(parse('[a-j]*[^c]bc').glob, '[a-j]*[^c]bc');

    assert.equal(parse('[ab][ab]').base, '.');
    assert.equal(parse('[ab][ab]').glob, '[ab][ab]');

    assert.equal(parse('foo/[a-b].min.js').base, 'foo');
    assert.equal(parse('foo/[a-b].min.js').glob, '[a-b].min.js');
  });

  it('qmarks:', function () {
    assert.equal(parse('?').base, '.');
    assert.equal(parse('?').glob, '?');

    assert.equal(parse('?/?').base, '.');
    assert.equal(parse('?/?').glob, '?/?');

    assert.equal(parse('??').base, '.');
    assert.equal(parse('??').glob, '??');

    assert.equal(parse('???').base, '.');
    assert.equal(parse('???').glob, '???');

    assert.equal(parse('?a').base, '.');
    assert.equal(parse('?a').glob, '?a');

    assert.equal(parse('?b').base, '.');
    assert.equal(parse('?b').glob, '?b');

    assert.equal(parse('a?b').base, '.');
    assert.equal(parse('a?b').glob, 'a?b');

    assert.equal(parse('a/?/c.js').base, 'a');
    assert.equal(parse('a/?/c.js').glob, '?/c.js');

    assert.equal(parse('a/?/c.md').base, 'a');
    assert.equal(parse('a/?/c.md').glob, '?/c.md');

    assert.equal(parse('a/?/c/?/*/f.js').base, 'a');
    assert.equal(parse('a/?/c/?/*/f.js').glob, '?/c/?/*/f.js');

    assert.equal(parse('a/?/c/?/*/f.md').base, 'a');
    assert.equal(parse('a/?/c/?/*/f.md').glob, '?/c/?/*/f.md');

    assert.equal(parse('a/?/c/?/e.js').base, 'a');
    assert.equal(parse('a/?/c/?/e.js').glob, '?/c/?/e.js');

    assert.equal(parse('a/?/c/?/e.md').base, 'a');
    assert.equal(parse('a/?/c/?/e.md').glob, '?/c/?/e.md');

    assert.equal(parse('a/?/c/???/e.js').base, 'a');
    assert.equal(parse('a/?/c/???/e.js').glob, '?/c/???/e.js');

    assert.equal(parse('a/?/c/???/e.md').base, 'a');
    assert.equal(parse('a/?/c/???/e.md').glob, '?/c/???/e.md');

    assert.equal(parse('a/??/c.js').base, 'a');
    assert.equal(parse('a/??/c.js').glob, '??/c.js');

    assert.equal(parse('a/??/c.md').base, 'a');
    assert.equal(parse('a/??/c.md').glob, '??/c.md');

    assert.equal(parse('a/???/c.js').base, 'a');
    assert.equal(parse('a/???/c.js').glob, '???/c.js');

    assert.equal(parse('a/???/c.md').base, 'a');
    assert.equal(parse('a/???/c.md').glob, '???/c.md');

    assert.equal(parse('a/????/c.js').base, 'a');
    assert.equal(parse('a/????/c.js').glob, '????/c.js');
  });

  it('non-glob pattern:', function () {
    assert.equal(parse('').base, '.');
    assert.equal(parse('').glob, '');

    assert.equal(parse('.').base, '.');
    assert.equal(parse('.').glob, '.');

    assert.equal(parse('a').base, '.');
    assert.equal(parse('a').glob, 'a');

    assert.equal(parse('.a').base, '.');
    assert.equal(parse('.a').glob, '.a');

    assert.equal(parse('/a').base, '/');
    assert.equal(parse('/a').glob, 'a');

    assert.equal(parse('/a/b/c').base, '/a/b');
    assert.equal(parse('/a/b/c').glob, 'c');

    assert.equal(parse('/a/b/c/').base, '/a/b/c/');
    assert.equal(parse('/a/b/c/').glob, '');

    assert.equal(parse('a/b/c/').base, 'a/b/c/');
    assert.equal(parse('a/b/c/').glob, '');

    assert.equal(parse('a.min.js').base, '.');
    assert.equal(parse('a.min.js').glob, 'a.min.js');

    assert.equal(parse('a/.x.md').base, 'a');
    assert.equal(parse('a/.x.md').glob, '.x.md');

    assert.equal(parse('a/b/.gitignore').base, 'a/b');
    assert.equal(parse('a/b/.gitignore').glob, '.gitignore');

    assert.equal(parse('a/b/c/d.md').base, 'a/b/c');
    assert.equal(parse('a/b/c/d.md').glob, 'd.md');

    assert.equal(parse('a/b/c/d.e.f/g.min.js').base, 'a/b/c/d.e.f');
    assert.equal(parse('a/b/c/d.e.f/g.min.js').glob, 'g.min.js');

    assert.equal(parse('a/b/.git').base, 'a/b');
    assert.equal(parse('a/b/.git').glob, '.git');

    assert.equal(parse('a/b/.git/').base, 'a/b/.git/');
    assert.equal(parse('a/b/.git/').glob, '');

    assert.equal(parse('a/b/.gitignore').base, 'a/b');
    assert.equal(parse('a/b/.gitignore').glob, '.gitignore');

    assert.equal(parse('a/b/c').base, 'a/b');
    assert.equal(parse('a/b/c').glob, 'c');

    assert.equal(parse('a/b/c.d/e.md').base, 'a/b/c.d');
    assert.equal(parse('a/b/c.d/e.md').glob, 'e.md');

    assert.equal(parse('a/b/c.md').base, 'a/b');
    assert.equal(parse('a/b/c.md').glob, 'c.md');

    assert.equal(parse('a/b/c.min.js').base, 'a/b');
    assert.equal(parse('a/b/c.min.js').glob, 'c.min.js');

    assert.equal(parse('a/b/c/').base, 'a/b/c/');
    assert.equal(parse('a/b/c/').glob, '');

    assert.equal(parse('a/b/c/d.e.f/g.min.js').base, 'a/b/c/d.e.f');
    assert.equal(parse('a/b/c/d.e.f/g.min.js').glob, 'g.min.js');

    assert.equal(parse('a/b/c/d.md').base, 'a/b/c');
    assert.equal(parse('a/b/c/d.md').glob, 'd.md');

    assert.equal(parse('a/b/git/').base, 'a/b/git/');
    assert.equal(parse('a/b/git/').glob, '');

    assert.equal(parse('aa').base, '.');
    assert.equal(parse('aa').glob, 'aa');

    assert.equal(parse('c.md').base, '.');
    assert.equal(parse('c.md').glob, 'c.md');
  });
});

describe('path parts:', function () {
  describe('complex patterns:', function () {
    it('should get a dirname:', function () {
      assert.equal(parse('*.min.js').base, '.');
      assert.equal(parse('/a/b/c').base, '/a/b');
      assert.equal(parse('/a/b/c/').base, '/a/b/c/');
      assert.equal(parse('/a/b/{c,d}/').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/*.js').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/*.min.js').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').base, '/a/b');
      assert.equal(parse('/a/b/{c,/foo.js}/e.f.g/').base, '/a/b');
      assert.equal(parse('./{a/b/{c,/foo.js}/e.f.g}').base, '.');
      assert.equal(parse('[a-c]b*').base, '.');
      assert.equal(parse('[a-j]*[^c]').base, '.');
      assert.equal(parse('[a-j]*[^c]b/c').base, '.');
      assert.equal(parse('[a-j]*[^c]bc').base, '.');
      assert.equal(parse('a/b/{c,./d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/{c,/.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/{c,/d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,/gitignore}').base, 'a/b');
      assert.equal(parse('a/b/{c,d}').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/*.js').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/*.min.js').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/e.f.g/').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/e/f.g').base, 'a/b');
      assert.equal(parse('a').base, '.');
      assert.equal(parse('a/**/b/*.{foo,bar}').base, 'a');
      assert.equal(parse('a/b/*.{foo,bar}').base, 'a/b');
      assert.equal(parse('a/b/.gitignore').base, 'a/b');
      assert.equal(parse('a/b/.{c,.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/.{c,/.gitignore}').base, 'a/b');
      assert.equal(parse('a/b/.{foo,bar}').base, 'a/b');
      assert.equal(parse('a/b/c').base, 'a/b');
      assert.equal(parse('a/b/c.d/e.md').base, 'a/b/c.d');
      assert.equal(parse('a/b/c.md').base, 'a/b');
      assert.equal(parse('a/b/c.min.js').base, 'a/b');
      assert.equal(parse('a/b/c/').base, 'a/b/c/');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').base, 'a/b/c/d.e.f');
      assert.equal(parse('a/b/c/d.md').base, 'a/b/c');
      assert.equal(parse('c.md').base, '.');
    });

    it('should get a basename:', function () {
      assert.equal(parse('*.min.js').path.basename, '*.min.js');
      assert.equal(parse('/a/b/{c,d}/').path.basename, '');
      assert.equal(parse('/a/b/{c,d}/*.js').path.basename, '*.js');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.basename, '*.min.js');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('[a-j]*[^c]').path.basename, '[a-j]*[^c]');
      assert.equal(parse('[a-j]*[^c]bc').path.basename, '[a-j]*[^c]bc');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.basename, '*.{foo,bar}');
      assert.equal(parse('a/b/*.{foo,bar}').path.basename, '*.{foo,bar}');
      assert.equal(parse('a/b/.{c,.gitignore}').path.basename, '.{c,.gitignore}');
      assert.equal(parse('a/b/.{c,/.gitignore}').path.basename, '.{c,/.gitignore}');
      assert.equal(parse('a/b/.{foo,bar}').path.basename, '.{foo,bar}');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.basename, 'f.g');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.basename, 'abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.basename, '*.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.basename, 'abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore}').path.basename, '{c,.gitignore}');
      assert.equal(parse('a/b/{c,/.gitignore}').path.basename, '{c,/.gitignore}');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.basename, 'f.g');
      assert.equal(parse('a/b/{c,/gitignore}').path.basename, '{c,/gitignore}');
      assert.equal(parse('a/b/{c,d}').path.basename, '{c,d}');
      assert.equal(parse('a/b/{c,d}/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/*.js').path.basename, '*.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.basename, '*.min.js');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.basename, 'f.g');
    });

    it('should get a filename:', function () {
      assert.equal(parse('*.min.js').path.filename, '*');
      assert.equal(parse('/a/b/c').path.filename, 'c');
      assert.equal(parse('/a/b/c/').path.filename, '');
      assert.equal(parse('/a/b/{c,d}/').path.filename, '');
      assert.equal(parse('/a/b/{c,d}/*.js').path.filename, '*');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.filename, '*');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('[a-c]b*').path.filename, '[a-c]b*');
      assert.equal(parse('a').path.filename, 'a');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.filename, '*');
      assert.equal(parse('a/b/*.{foo,bar}').path.filename, '*');
      assert.equal(parse('a/b/.gitignore').path.filename, '');
      assert.equal(parse('a/b/.{c,.gitignore}').path.filename, '');
      assert.equal(parse('a/b/.{c,/.gitignore}').path.filename, '');
      assert.equal(parse('a/b/.{foo,bar}').path.filename, '');
      assert.equal(parse('a/b/c').path.filename, 'c');
      assert.equal(parse('a/b/c.d/e.md').path.filename, 'e');
      assert.equal(parse('a/b/c.md').path.filename, 'c');
      assert.equal(parse('a/b/c.min.js').path.filename, 'c');
      assert.equal(parse('a/b/c/').path.filename, '');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.filename, 'g');
      assert.equal(parse('a/b/c/d.md').path.filename, 'd');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.filename, 'f');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.filename, 'abc');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.filename, '*');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.filename, 'abc');
      assert.equal(parse('a/b/{c,.gitignore}').path.filename, '{c,.gitignore}');
      assert.equal(parse('a/b/{c,/.gitignore}').path.filename, '{c,/.gitignore}');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.filename, 'f');
      assert.equal(parse('a/b/{c,/gitignore}').path.filename, '{c,/gitignore}');
      assert.equal(parse('a/b/{c,d}').path.filename, '{c,d}');
      assert.equal(parse('a/b/{c,d}/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/*.js').path.filename, '*');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.filename, '*');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.filename, 'f');
      assert.equal(parse('c.md').path.filename, 'c');
    });

    it('should get an extname:', function () {
      assert.equal(parse('*.min.js').path.extname, '.min.js');
      assert.equal(parse('/a/b/c').path.extname, '');
      assert.equal(parse('/a/b/c/').path.extname, '');
      assert.equal(parse('/a/b/{c,d}/').path.extname, '');
      assert.equal(parse('/a/b/{c,d}/*.js').path.extname, '.js');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.extname, '.min.js');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.extname, '');
      assert.equal(parse('[a-c]b*').path.extname, '');
      assert.equal(parse('[a-j]*[^c]bc').path.extname, '');
      assert.equal(parse('a').path.extname, '');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.extname, '.{foo,bar}');
      assert.equal(parse('a/b/*.{foo,bar}').path.extname, '.{foo,bar}');
      assert.equal(parse('a/b/.gitignore').path.extname, '.gitignore');
      assert.equal(parse('a/b/.{c,.gitignore}').path.extname, '.{c,.gitignore}');
      assert.equal(parse('a/b/.{c,/.gitignore}').path.extname, '.{c,/.gitignore}');
      assert.equal(parse('a/b/.{foo,bar}').path.extname, '.{foo,bar}');
      assert.equal(parse('a/b/c').path.extname, '');
      assert.equal(parse('a/b/c.d/e.md').path.extname, '.md');
      assert.equal(parse('a/b/c.md').path.extname, '.md');
      assert.equal(parse('a/b/c.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/c/').path.extname, '');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/c/d.md').path.extname, '.md');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,./d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.extname, '.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.extname, '.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.extname, '.foo.js');
      assert.equal(parse('a/b/{c,.gitignore}').path.extname, '');
      assert.equal(parse('a/b/{c,/.gitignore}').path.extname, '');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,/d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,/gitignore}').path.extname, '');
      assert.equal(parse('a/b/{c,d}').path.extname, '');
      assert.equal(parse('a/b/{c,d}/').path.extname, '');
      assert.equal(parse('a/b/{c,d}/*.js').path.extname, '.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.extname, '');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('c.md').path.extname, '.md');
    });

    it('should match a path with an extension:', function () {
      assert.equal(parse('a/b/c.md').glob, 'c.md');
      assert.equal(parse('a/b/c.md').base, 'a/b');
      assert.equal(parse('a/b/c.md').path.basename, 'c.md');
      assert.equal(parse('a/b/c.md').path.filename, 'c');
      assert.equal(parse('a/b/c.md').path.extname, '.md');
      assert.equal(parse('a/b/c.md').path.ext, 'md');
      assert.equal(parse('c.md').glob, 'c.md');
      assert.equal(parse('c.md').base, '.');
      assert.equal(parse('c.md').path.basename, 'c.md');
      assert.equal(parse('c.md').path.filename, 'c');
      assert.equal(parse('c.md').path.extname, '.md');
      assert.equal(parse('c.md').path.ext, 'md');
    });

    it('should match a path with multiple extensions:', function () {
      assert.equal(parse('a/b/c.min.js').glob, 'c.min.js');
      assert.equal(parse('a/b/c.min.js').base, 'a/b');
      assert.equal(parse('a/b/c.min.js').path.basename, 'c.min.js');
      assert.equal(parse('a/b/c.min.js').path.filename, 'c');
      assert.equal(parse('a/b/c.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/c.min.js').path.ext, 'js');
    });

    it('should work with paths that have dots in the dirname:', function () {
      assert.equal(parse('a/b/c/d.e.f/g.min.js').glob, 'g.min.js');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').base, 'a/b/c/d.e.f');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.basename, 'g.min.js');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.filename, 'g');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.ext, 'js');
    });

    it('should match a path without an extension:', function () {
      assert.equal(parse('a').glob, 'a');
      assert.equal(parse('a').base, '.');
      assert.equal(parse('a').path.filename, 'a');
      assert.equal(parse('a').path.basename, 'a');
      assert.equal(parse('a').path.extname, '');
    });

    it('should match a file path ending with an extension:', function () {
      assert.equal(parse('a/b/c/d.md').glob, 'd.md');
      assert.equal(parse('a/b/c/d.md').base, 'a/b/c');
      assert.equal(parse('a/b/c/d.md').path.basename, 'd.md');
      assert.equal(parse('a/b/c/d.md').path.filename, 'd');
      assert.equal(parse('a/b/c/d.md').path.extname, '.md');
      assert.equal(parse('a/b/c/d.md').path.ext, 'md');

      assert.equal(parse('a/b/c.d/e.md').glob, 'e.md');
      assert.equal(parse('a/b/c.d/e.md').base, 'a/b/c.d');
      assert.equal(parse('a/b/c.d/e.md').path.basename, 'e.md');
      assert.equal(parse('a/b/c.d/e.md').path.filename, 'e');
      assert.equal(parse('a/b/c.d/e.md').path.extname, '.md');
      assert.equal(parse('a/b/c.d/e.md').path.ext, 'md');
    });

  });

  describe('glob characters:', function () {
    it('should match when the basename starts with a star:', function () {
      assert.equal(parse('a/b/*.{foo,bar}').glob, '*.{foo,bar}');
      assert.equal(parse('a/b/*.{foo,bar}').base, 'a/b');
      assert.equal(parse('a/b/*.{foo,bar}').path.basename, '*.{foo,bar}');
      assert.equal(parse('a/b/*.{foo,bar}').path.filename, '*');
      assert.equal(parse('a/b/*.{foo,bar}').path.extname, '.{foo,bar}');
      assert.equal(parse('a/b/*.{foo,bar}').path.ext, '{foo,bar}');
    });

    it('should match with globstars:', function () {
      assert.equal(parse('a/**/b/*.{foo,bar}').glob, '**/b/*.{foo,bar}');
      assert.equal(parse('a/**/b/*.{foo,bar}').base, 'a');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.basename, '*.{foo,bar}');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.filename, '*');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.extname, '.{foo,bar}');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.ext, '{foo,bar}');
    });

    it('should match complex patterns:', function () {
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').glob, '{c,.gitignore,{a,b}}/{a,b}/abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.basename, 'abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.filename, 'abc');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.extname, '.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.ext, 'js');

      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').glob, '{c,.gitignore,{a,b}}/{a,b}/*.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.basename, '*.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.filename, '*');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.extname, '.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.ext, 'js');

      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').glob, '{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.basename, 'abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.filename, 'abc');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.extname, '.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.ext, 'js');
    });
  });

  describe('should parse a glob:', function () {
    it('ending with a brace pattern:', function () {
      assert.equal(parse('a/b/{c,d}').glob, '{c,d}');
      assert.equal(parse('a/b/{c,d}').base, 'a/b');
      assert.equal(parse('a/b/{c,d}').path.basename, '{c,d}');
      assert.equal(parse('a/b/{c,d}').path.filename, '{c,d}');
      assert.equal(parse('a/b/{c,d}').path.extname, '');
      assert.equal(parse('a/b/{c,d}').path.ext, '');
    });

    it('with a brace pattern in the dirname:', function () {
      assert.equal(parse('a/b/{c,d}/*.js').orig, 'a/b/{c,d}/*.js');
      assert.equal(parse('a/b/{c,d}/*.js').glob, '{c,d}/*.js');
      assert.equal(parse('a/b/{c,d}/*.js').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/*.js').path.basename, '*.js');
      assert.equal(parse('a/b/{c,d}/*.js').path.filename, '*');
      assert.equal(parse('a/b/{c,d}/*.js').path.extname, '.js');
      assert.equal(parse('a/b/{c,d}/*.js').path.ext, 'js');

      assert.equal(parse('a/b/{c,d}/').orig, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/').glob, '{c,d}/');
      assert.equal(parse('a/b/{c,d}/').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/').path.extname, '');
      assert.equal(parse('a/b/{c,d}/').path.ext, '');

      assert.equal(parse('a/b/{c,d}/e.f.g/').orig, 'a/b/{c,d}/e.f.g/');
      assert.equal(parse('a/b/{c,d}/e.f.g/').glob, '{c,d}/e.f.g/');
      assert.equal(parse('a/b/{c,d}/e.f.g/').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.extname, '');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.ext, '');

      assert.equal(parse('/a/b/{c,d}/e.f.g/').orig, '/a/b/{c,d}/e.f.g/');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').glob, '{c,d}/e.f.g/');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.extname, '');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.ext, '');

      assert.equal(parse('a/b/{c,d}/*.min.js').orig, 'a/b/{c,d}/*.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').glob, '{c,d}/*.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.basename, '*.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.filename, '*');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.ext, 'js');

      assert.equal(parse('*.min.js').orig, '*.min.js');
      assert.equal(parse('*.min.js').glob, '*.min.js');
      assert.equal(parse('*.min.js').base, '.');
      assert.equal(parse('*.min.js').path.basename, '*.min.js');
      assert.equal(parse('*.min.js').path.filename, '*');
      assert.equal(parse('*.min.js').path.extname, '.min.js');
      assert.equal(parse('*.min.js').path.ext, 'js');

      assert.equal(parse('a/b/{c,d}/*.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.ext, 'js');

      assert.equal(parse('[a-j]*[^c]').glob, '[a-j]*[^c]');
      assert.equal(parse('[a-j]*[^c]').base, '.');
      assert.equal(parse('[a-j]*[^c]').path.dirname, '');
      assert.equal(parse('[a-j]*[^c]').path.basename, '[a-j]*[^c]');
      assert.equal(parse('[a-j]*[^c]b/c').glob, '[a-j]*[^c]b/c');
      assert.equal(parse('[a-j]*[^c]b/c').base, '.');
      assert.equal(parse('[a-j]*[^c]bc').glob, '[a-j]*[^c]bc');
      assert.equal(parse('[a-j]*[^c]bc').base, '.');
      assert.equal(parse('[a-j]*[^c]bc').path.basename, '[a-j]*[^c]bc');
    });

    it('ending with a slash:', function () {
      assert.equal(parse('a/b/{c,d}/').orig, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/').glob, '{c,d}/');
      assert.equal(parse('a/b/{c,d}/').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/').path.extname, '');
    });

    it('beginning with a slash:', function () {
      assert.equal(parse('/a/b/{c,d}/').orig, '/a/b/{c,d}/');
      assert.equal(parse('/a/b/{c,d}/').glob, '{c,d}/');
      assert.equal(parse('/a/b/{c,d}/').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/').path.basename, '');
      assert.equal(parse('/a/b/{c,d}/').path.filename, '');
      assert.equal(parse('/a/b/{c,d}/').path.extname, '');
    });

    it('with a brace pattern in the dirname:', function () {
      assert.equal(parse('a/b/{c,d}/e/f.g').orig, 'a/b/{c,d}/e/f.g');
      assert.equal(parse('a/b/{c,d}/e/f.g').glob, '{c,d}/e/f.g');
      assert.equal(parse('a/b/{c,d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.basename, 'f.g');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.filename, 'f');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.ext, 'g');

      assert.equal(parse('a/b/{c,./d}/e/f.g').orig, 'a/b/{c,./d}/e/f.g');
      assert.equal(parse('a/b/{c,./d}/e/f.g').glob, '{c,./d}/e/f.g');
      assert.equal(parse('a/b/{c,./d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.basename, 'f.g');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.filename, 'f');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,./d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.ext, 'g');

      assert.equal(parse('a/b/{c,/d}/e/f.g').orig, 'a/b/{c,/d}/e/f.g');
      assert.equal(parse('a/b/{c,/d}/e/f.g').glob, '{c,/d}/e/f.g');
      assert.equal(parse('a/b/{c,/d}/e/f.g').base, 'a/b');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.basename, 'f.g');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.filename, 'f');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,/d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.ext, 'g');
    });
  });

  describe('when the glob pattern has braces:', function () {
    it('should track the original pattern', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').orig, '/a/b/{c,d}/*.js');
      assert.equal(parse('/a/b/{c,d}/*.js').orig, '/a/b/{c,d}/*.js');
    });

    it('should extract the dirname', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/*.min.js').base, '/a/b');
      assert.equal(parse('/a/b/{c,d}/*.min.js').glob, '{c,d}/*.min.js');
    });

    it('should extract the basename', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').path.basename, '*.js');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.basename, '*.min.js');
    });

    it('should extract the filename', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').path.filename, '*');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.filename, '*');
    });

    it('should extract extname', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').path.extname, '.js');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.extname, '.min.js');
    });

    it('should extract ext', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').path.ext, 'js');
      assert.equal(parse('/a/b/{c,d}/*.js').path.ext, 'js');
    });
  });

  describe('trailing and leading slashs:', function () {
    it('should work without a trailing slash:', function () {
      assert.equal(parse('a/b/c').glob, 'c');
      assert.equal(parse('a/b/c').base, 'a/b');
      assert.equal(parse('a/b/c').path.filename, 'c');
      assert.equal(parse('a/b/c').path.basename, 'c');
      assert.equal(parse('a/b/c').path.extname, '');
    });

    it('should work with a trailing slash:', function () {
      assert.equal(parse('a/b/c/').glob, '');
      assert.equal(parse('a/b/c/').base, 'a/b/c/');
      assert.equal(parse('a/b/c/').path.filename, '');
      assert.equal(parse('a/b/c/').path.basename, '');
      assert.equal(parse('a/b/c/').path.extname, '');
    });

    it('should work with a leading slash:', function () {
      assert.equal(parse('/a/b/c').glob, 'c');
      assert.equal(parse('/a/b/c').base, '/a/b');
      assert.equal(parse('/a/b/c').path.filename, 'c');
      assert.equal(parse('/a/b/c').path.basename, 'c');
      assert.equal(parse('/a/b/c').path.extname, '');
    });

    it('should work with both trailing and leading slashes:', function () {
      assert.equal(parse('/a/b/c/').glob, '');
      assert.equal(parse('/a/b/c/').base, '/a/b/c/');
      assert.equal(parse('/a/b/c/').path.filename, '');
      assert.equal(parse('/a/b/c/').path.basename, '');
      assert.equal(parse('/a/b/c/').path.extname, '');
    });
  });

  describe('dotfile and dotdir:', function () {
    describe('dotfiles:', function () {
      it('should know when the file is a dotfile:', function () {
        assert.equal(parse('a/b/.gitignore').is.dotfile, true);
        assert.equal(parse('a/b/.gitignore').is.dotfile, true);
        assert.equal(parse('a/b/.git').is.dotfile, true);
        assert.equal(parse('a/b/.gitignore').is.dotdir, false);
        assert.equal(parse('a/b/.git').is.dotdir, false);
      });

      it('should work brace patterns:', function () {
        assert.equal(parse('a/b/.{foo,bar}').orig, 'a/b/.{foo,bar}');
        assert.equal(parse('a/b/.{foo,bar}').glob, '.{foo,bar}');
        assert.equal(parse('a/b/.{foo,bar}').base, 'a/b');
        assert.equal(parse('a/b/.{c,/.gitignore}').orig, 'a/b/.{c,/.gitignore}');
        assert.equal(parse('a/b/.{c,/.gitignore}').glob, '.{c,/.gitignore}');
        assert.equal(parse('a/b/.{c,/.gitignore}').base, 'a/b');
        assert.equal(parse('a/b/.{c,.gitignore}').orig, 'a/b/.{c,.gitignore}');
        assert.equal(parse('a/b/.{c,.gitignore}').glob, '.{c,.gitignore}');
        assert.equal(parse('a/b/.{c,.gitignore}').base, 'a/b');
      });
    });

    describe('dotdirs:', function () {
      it('should know when the file is a dot-directory:', function () {
        assert.equal(parse('a/b/.git/config').is.dotdir, true);
        assert.equal(parse('a/b/.git/').is.dotdir, true);
        assert.equal(parse('a/b/git/').is.dotdir, false);
        assert.equal(parse('a/b/.git/').is.dotfile, false);
      });

      it('should work with braces in the dirname:', function () {
        // assert.equal(parse('a/b/.{foo,bar}/foo.js').is.dotdir, true);
        assert.equal(parse('a/b/.{foo,bar}/foo.js').orig, 'a/b/.{foo,bar}/foo.js');
        assert.equal(parse('a/b/.{foo,bar}/foo.js').glob, '.{foo,bar}/foo.js');
        assert.equal(parse('a/b/.{foo,bar}/foo.js').base, 'a/b');
      });
    });
  });


  it('should match character classes:', function () {
    assert.equal(parse('[a-c]b*').glob, '[a-c]b*');
    assert.equal(parse('[a-j]*[^c]').glob, '[a-j]*[^c]');
    assert.equal(parse('[a-j]*[^c]').base, '.');
    assert.equal(parse('[a-j]*[^c]b/c').glob, '[a-j]*[^c]b/c');
    assert.equal(parse('[a-j]*[^c]bc').glob, '[a-j]*[^c]bc');
  });

  it('should work when a character class has trailing word characters:', function () {
    assert.equal(parse('[a-c]b*').glob, '[a-c]b*');
    assert.equal(parse('[a-c]b*').base, '.');
    assert.equal(parse('[a-j]*[^c]bc').base, '.');
  });
});

describe('when the glob has brace patterns:', function () {
  it('should extract the `base` from the glob:', function () {
    assert.equal(parse('a/b/{c,/.gitignore}').base, 'a/b');
    assert.equal(parse('a/b/{c,/.gitignore}').glob, '{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').orig, 'a/b/{c,/.gitignore}');

    assert.equal(parse('a/b/{c,/gitignore}').base, 'a/b');
    assert.equal(parse('a/b/{c,/gitignore}').glob, '{c,/gitignore}');

    assert.equal(parse('a/b/{c,.gitignore}').base, 'a/b');
    assert.equal(parse('a/b/{c,.gitignore}').glob, '{c,.gitignore}');
  });

  it('should work when the brace pattern has dots and slashes:', function () {
    assert.equal(parse('a/b/{c,/.gitignore}').orig, 'a/b/{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').glob, '{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').base, 'a/b');
    assert.equal(parse('a/b/{c,/.gitignore}').path.basename, '{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').path.filename, '{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').path.extname, '');

    assert.equal(parse('a/b/{c,/gitignore}').orig, 'a/b/{c,/gitignore}');
    assert.equal(parse('a/b/{c,/gitignore}').glob, '{c,/gitignore}');
    assert.equal(parse('a/b/{c,/gitignore}').base, 'a/b');
    assert.equal(parse('a/b/{c,/gitignore}').path.basename, '{c,/gitignore}');
    assert.equal(parse('a/b/{c,/gitignore}').path.filename, '{c,/gitignore}');
    assert.equal(parse('a/b/{c,/gitignore}').path.extname, '');

    assert.equal(parse('a/b/{c,.gitignore}').orig, 'a/b/{c,.gitignore}');
    assert.equal(parse('a/b/{c,.gitignore}').glob, '{c,.gitignore}');
    assert.equal(parse('a/b/{c,.gitignore}').base, 'a/b');
    assert.equal(parse('a/b/{c,.gitignore}').path.basename, '{c,.gitignore}');
    assert.equal(parse('a/b/{c,.gitignore}').path.filename, '{c,.gitignore}');
    assert.equal(parse('a/b/{c,.gitignore}').path.extname, '');
    parse('a/b/c/**/*.{yml,json}')
  });
});
