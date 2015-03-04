/*!
 * parse-glob <https://github.com/jonschlinkert/parse-glob>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
var parse = require('./');

function getBase(glob) {
  return parse(glob, true);
}

describe('`is` object:', function () {
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
  });

  it('should detect when a pattern does not have a globstar:', function () {
    assert.equal(parse('*/*').is.globstar, false);
    assert.equal(parse('a.min.js').is.globstar, false);
    assert.equal(parse('!*.min.js').is.globstar, false);
    assert.equal(parse('!foo/{a,b}.min.js').is.globstar, false);
    assert.equal(parse('!foo/(a|b).min.js').is.globstar, false);
    assert.equal(parse('!foo/[a-b].min.js').is.globstar, false);
    assert.equal(parse('foo').is.globstar, false);
  });

  it('should detect when `dotdir` are defined:', function () {
    assert.equal(parse('a/b/.git/').is.dotdir, true);
    assert.equal(parse('a/b/git/').is.dotdir, false);
    assert.equal(parse('a/b/.git/').is.dotfile, false);
  });

  it('should detect when `dotfile` are defined:', function () {
    assert.equal(parse('a/b/.gitignore').is.dotfile, true);
    assert.equal(parse('a/b/.git').is.dotfile, true);
    assert.equal(parse('a/b/.gitignore').is.dotdir, false);
    assert.equal(parse('a/b/.git').is.dotdir, false);
  });
});

describe('should get a base path:', function () {
  it('should extract a base path from a glob pattern:', function () {
    assert.equal(getBase('.*').base, '.');
    assert.equal(getBase('.*').pattern, '.*');

    assert.equal(getBase('./*').base, '.');
    assert.equal(getBase('./*').pattern, '*');

    assert.equal(getBase('*').base, '.');
    assert.equal(getBase('*').pattern, '*');

    assert.equal(getBase('**').base, '.');
    assert.equal(getBase('**').pattern, '**');

    assert.equal(getBase('**/*.md').base, '.');
    assert.equal(getBase('**/*.md').pattern, '**/*.md');

    assert.equal(getBase('**/*.min.js').base, '.');
    assert.equal(getBase('**/*.min.js').pattern, '**/*.min.js');

    assert.equal(getBase('**/*foo.js').base, '.');
    assert.equal(getBase('**/*foo.js').pattern, '**/*foo.js');

    assert.equal(getBase('**/.*').base, '.');
    assert.equal(getBase('**/.*').pattern, '**/.*');

    assert.equal(getBase('**/d').base, '.');
    assert.equal(getBase('**/d').pattern, '**/d');

    assert.equal(getBase('*.*').base, '.');
    assert.equal(getBase('*.*').pattern, '*.*');

    assert.equal(getBase('*.js').base, '.');
    assert.equal(getBase('*.js').pattern, '*.js');

    assert.equal(getBase('*.md').base, '.');
    assert.equal(getBase('*.md').pattern, '*.md');

    assert.equal(getBase('*.min.js').base, '.');
    assert.equal(getBase('*.min.js').pattern, '*.min.js');

    assert.equal(getBase('*/*').base, '.');
    assert.equal(getBase('*/*').pattern, '*/*');

    assert.equal(getBase('*/*/*/*').base, '.');
    assert.equal(getBase('*/*/*/*').pattern, '*/*/*/*');

    assert.equal(getBase('*/*/*/e').base, '.');
    assert.equal(getBase('*/*/*/e').pattern, '*/*/*/e');

    assert.equal(getBase('*/b/*/e').base, '.');
    assert.equal(getBase('*/b/*/e').pattern, '*/b/*/e');

    assert.equal(getBase('*b').base, '.');
    assert.equal(getBase('*b').pattern, '*b');

    assert.equal(getBase('./a/**/j/**/z/*.md').base, './a');
    assert.equal(getBase('./a/**/j/**/z/*.md').pattern, '**/j/**/z/*.md');

    assert.equal(getBase('./a/**/z/*.md').base, './a');
    assert.equal(getBase('./a/**/z/*.md').pattern, '**/z/*.md');

    assert.equal(getBase('./{a/b/{c,/foo.js}/e.f.g}').base, '.');
    assert.equal(getBase('./{a/b/{c,/foo.js}/e.f.g}').pattern, '{a/b/{c,/foo.js}/e.f.g}');

    assert.equal(getBase('./node_modules/*-glob/**/*.js').base, './node_modules');
    assert.equal(getBase('./node_modules/*-glob/**/*.js').pattern, '*-glob/**/*.js');

    assert.equal(getBase('a/b/{c,/.gitignore}').base, 'a/b');
    assert.equal(getBase('a/b/{c,/.gitignore}').pattern, '{c,/.gitignore}');

    assert.equal(getBase('a/b/.{foo,bar}').base, 'a/b');
    assert.equal(getBase('a/b/.{foo,bar}').pattern, '.{foo,bar}');

    assert.equal(getBase('a/b/*.{foo,bar}').base, 'a/b');
    assert.equal(getBase('a/b/*.{foo,bar}').pattern, '*.{foo,bar}');

    assert.equal(getBase('a/**/b/*.{foo,bar}').base, 'a');
    assert.equal(getBase('a/**/b/*.{foo,bar}').pattern, '**/b/*.{foo,bar}');

    assert.equal(getBase('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').base, 'a/b');
    assert.equal(getBase('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').pattern, '{c,.gitignore,{a,b}}/{a,b}/abc.foo.js');

    assert.equal(getBase('a/b/{c,d}/').base, 'a/b');
    assert.equal(getBase('a/b/{c,d}/').pattern, '{c,d}/');

    assert.equal(getBase('a/b/{c,d}/e/f.g').base, 'a/b');
    assert.equal(getBase('a/b/{c,d}/e/f.g').pattern, '{c,d}/e/f.g');

    assert.equal(getBase('.a*').base, '.');
    assert.equal(getBase('.a*').pattern, '.a*');

    assert.equal(getBase('.b*').base, '.');
    assert.equal(getBase('.b*').pattern, '.b*');

    assert.equal(getBase('/*').base, '/');
    assert.equal(getBase('/*').pattern, '*');

    assert.equal(getBase('a/***').base, 'a');
    assert.equal(getBase('a/***').pattern, '***');

    assert.equal(getBase('a/**/b/*.{foo,bar}').base, 'a');
    assert.equal(getBase('a/**/b/*.{foo,bar}').pattern, '**/b/*.{foo,bar}');

    assert.equal(getBase('a/**/c/*').base, 'a');
    assert.equal(getBase('a/**/c/*').pattern, '**/c/*');

    assert.equal(getBase('a/**/c/*.md').base, 'a');
    assert.equal(getBase('a/**/c/*.md').pattern, '**/c/*.md');

    assert.equal(getBase('a/**/e').base, 'a');
    assert.equal(getBase('a/**/e').pattern, '**/e');

    assert.equal(getBase('a/**/j/**/z/*.md').base, 'a');
    assert.equal(getBase('a/**/j/**/z/*.md').pattern, '**/j/**/z/*.md');

    assert.equal(getBase('a/**/z/*.md').base, 'a');
    assert.equal(getBase('a/**/z/*.md').pattern, '**/z/*.md');

    assert.equal(getBase('a/**c*').base, 'a');
    assert.equal(getBase('a/**c*').pattern, '**c*');

    assert.equal(getBase('a/**c/*').base, 'a');
    assert.equal(getBase('a/**c/*').pattern, '**c/*');

    assert.equal(getBase('a/*/*/e').base, 'a');
    assert.equal(getBase('a/*/*/e').pattern, '*/*/e');

    assert.equal(getBase('a/*/c/*.md').base, 'a');
    assert.equal(getBase('a/*/c/*.md').pattern, '*/c/*.md');

    assert.equal(getBase('a/b/**/c{d,e}/**/xyz.md').base, 'a/b');
    assert.equal(getBase('a/b/**/c{d,e}/**/xyz.md').pattern, '**/c{d,e}/**/xyz.md');

    assert.equal(getBase('a/b/**/e').base, 'a/b');
    assert.equal(getBase('a/b/**/e').pattern, '**/e');

    assert.equal(getBase('a/b/*.{foo,bar}').base, 'a/b');
    assert.equal(getBase('a/b/*.{foo,bar}').pattern, '*.{foo,bar}');

    assert.equal(getBase('a/b/*/e').base, 'a/b');
    assert.equal(getBase('a/b/*/e').pattern, '*/e');

    assert.equal(getBase('a/b/c/*').base, 'a/b/c');
    assert.equal(getBase('a/b/c/*').pattern, '*');

    assert.equal(getBase('a/b/c/*.md').base, 'a/b/c');
    assert.equal(getBase('a/b/c/*.md').pattern, '*.md');

    assert.equal(getBase('a/b/c/.*.md').base, 'a/b/c');
    assert.equal(getBase('a/b/c/.*.md').pattern, '.*.md');

    assert.equal(getBase('b/*/*/*').base, 'b');
    assert.equal(getBase('b/*/*/*').pattern, '*/*/*');
  });

  it('file extensions:', function () {
    assert.equal(getBase('.md').base, '');
    assert.equal(getBase('.md').pattern, '.md');
  });

  it('negation pattern:', function () {
    assert.equal(getBase('!*.min.js').base, '.');
    assert.equal(getBase('!*.min.js').pattern, '!*.min.js');

    assert.equal(getBase('!foo').base, '.');
    assert.equal(getBase('!foo').pattern, '!foo');

    assert.equal(getBase('a/b/c/!foo').base, 'a/b/c');
    assert.equal(getBase('a/b/c/!foo').pattern, '!foo');

    assert.equal(getBase('!foo/(a|b).min.js').base, '.');
    assert.equal(getBase('!foo/(a|b).min.js').pattern, '!foo/(a|b).min.js');

    assert.equal(getBase('!foo/[a-b].min.js').base, '.');
    assert.equal(getBase('!foo/[a-b].min.js').pattern, '!foo/[a-b].min.js');

    assert.equal(getBase('!foo/{a,b}.min.js').base, '.');
    assert.equal(getBase('!foo/{a,b}.min.js').pattern, '!foo/{a,b}.min.js');
  });

  describe('braces:', function () {
    it('should know when a base cannot be extracted:', function () {
      assert.equal(getBase('/a/b/{c,/foo.js}/e.f.g/').base, '/a/b');
      assert.equal(getBase('/a/b/{c,/foo.js}/e.f.g/').pattern, '{c,/foo.js}/e.f.g/');

      assert.equal(getBase('{a/b/c.js,/a/b/{c,/foo.js}/e.f.g/}').base, '.');
      assert.equal(getBase('{a/b/c.js,/a/b/{c,/foo.js}/e.f.g/}').pattern, '{a/b/c.js,/a/b/{c,/foo.js}/e.f.g/}');

      assert.equal(getBase('/a/b/{c,d}/').base, '/a/b');
      assert.equal(getBase('/a/b/{c,d}/').pattern, '{c,d}/');

      assert.equal(getBase('/a/b/{c,d}/*.js').base, '/a/b');
      assert.equal(getBase('/a/b/{c,d}/*.js').pattern, '{c,d}/*.js');

      assert.equal(getBase('/a/b/{c,d}/*.min.js').base, '/a/b');
      assert.equal(getBase('/a/b/{c,d}/*.min.js').pattern, '{c,d}/*.min.js');

      assert.equal(getBase('/a/b/{c,d}/e.f.g/').base, '/a/b');
      assert.equal(getBase('/a/b/{c,d}/e.f.g/').pattern, '{c,d}/e.f.g/');

      assert.equal(getBase('{.,*}').base, '.');
      assert.equal(getBase('{.,*}').pattern, '{.,*}');
    });

    it('should work when the filename has braces:', function () {
      assert.equal(getBase('a/b/.{c,.gitignore}').base, 'a/b');
      assert.equal(getBase('a/b/.{c,.gitignore}').pattern, '.{c,.gitignore}');

      assert.equal(getBase('a/b/.{c,/.gitignore}').base, 'a/b');
      assert.equal(getBase('a/b/.{c,/.gitignore}').pattern, '.{c,/.gitignore}');

      assert.equal(getBase('a/b/.{foo,bar}').base, 'a/b');
      assert.equal(getBase('a/b/.{foo,bar}').pattern, '.{foo,bar}');

      assert.equal(getBase('a/b/{c,.gitignore}').base, 'a/b');
      assert.equal(getBase('a/b/{c,.gitignore}').pattern, '{c,.gitignore}');

      assert.equal(getBase('a/b/{c,/.gitignore}').base, 'a/b');
      assert.equal(getBase('a/b/{c,/.gitignore}').pattern, '{c,/.gitignore}');

      assert.equal(getBase('a/b/{c,/gitignore}').base, 'a/b');
      assert.equal(getBase('a/b/{c,/gitignore}').pattern, '{c,/gitignore}');

      assert.equal(getBase('a/b/{c,d}').base, 'a/b');
      assert.equal(getBase('a/b/{c,d}').pattern, '{c,d}');
    });

    it('should work when the dirname has braces:', function () {
      assert.equal(getBase('a/b/{c,./d}/e/f.g').base, 'a/b');
      assert.equal(getBase('a/b/{c,./d}/e/f.g').pattern, '{c,./d}/e/f.g');

      assert.equal(getBase('a/b/{c,./d}/e/f.min.g').base, 'a/b');
      assert.equal(getBase('a/b/{c,./d}/e/f.min.g').pattern, '{c,./d}/e/f.min.g');

      assert.equal(getBase('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(getBase('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').pattern, '{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js');

      assert.equal(getBase('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').base, 'a/b');
      assert.equal(getBase('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').pattern, '{c,.gitignore,{a,b}}/{a,b}/*.foo.js');

      assert.equal(getBase('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').base, 'a/b');
      assert.equal(getBase('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').pattern, '{c,.gitignore,{a,b}}/{a,b}/abc.foo.js');

      assert.equal(getBase('a/b/{c,/d}/e/f.g').base, 'a/b');
      assert.equal(getBase('a/b/{c,/d}/e/f.g').pattern, '{c,/d}/e/f.g');

      assert.equal(getBase('a/b/{c,/d}/e/f.min.g').base, 'a/b');
      assert.equal(getBase('a/b/{c,/d}/e/f.min.g').pattern, '{c,/d}/e/f.min.g');

      assert.equal(getBase('a/b/{c,d}/').base, 'a/b');
      assert.equal(getBase('a/b/{c,d}/').pattern, '{c,d}/');

      assert.equal(getBase('a/b/{c,d}/*.js').base, 'a/b');
      assert.equal(getBase('a/b/{c,d}/*.js').pattern, '{c,d}/*.js');

      assert.equal(getBase('a/b/{c,d}/*.min.js').base, 'a/b');
      assert.equal(getBase('a/b/{c,d}/*.min.js').pattern, '{c,d}/*.min.js');

      assert.equal(getBase('a/b/{c,d}/e.f.g/').base, 'a/b');
      assert.equal(getBase('a/b/{c,d}/e.f.g/').pattern, '{c,d}/e.f.g/');

      assert.equal(getBase('a/b/{c,d}/e/f.g').base, 'a/b');
      assert.equal(getBase('a/b/{c,d}/e/f.g').pattern, '{c,d}/e/f.g');

      assert.equal(getBase('a/b/{c,d}/e/f.min.g').base, 'a/b');
      assert.equal(getBase('a/b/{c,d}/e/f.min.g').pattern, '{c,d}/e/f.min.g');

      assert.equal(getBase('foo/{a,b}.min.js').base, 'foo');
      assert.equal(getBase('foo/{a,b}.min.js').pattern, '{a,b}.min.js');
    });
  });

  it('character classes:', function () {
    assert.equal(getBase('[a-c]b*').base, '.');
    assert.equal(getBase('[a-c]b*').pattern, '[a-c]b*');

    assert.equal(getBase('[a-j]*[^c]').base, '.');
    assert.equal(getBase('[a-j]*[^c]').pattern, '[a-j]*[^c]');

    assert.equal(getBase('[a-j]*[^c]b/c').base, '.');
    assert.equal(getBase('[a-j]*[^c]b/c').pattern, '[a-j]*[^c]b/c');

    assert.equal(getBase('[a-j]*[^c]bc').base, '.');
    assert.equal(getBase('[a-j]*[^c]bc').pattern, '[a-j]*[^c]bc');

    assert.equal(getBase('[ab][ab]').base, '.');
    assert.equal(getBase('[ab][ab]').pattern, '[ab][ab]');

    assert.equal(getBase('foo/[a-b].min.js').base, 'foo');
    assert.equal(getBase('foo/[a-b].min.js').pattern, '[a-b].min.js');
  });

  it('qmarks:', function () {
    assert.equal(getBase('?').base, '.');
    assert.equal(getBase('?').pattern, '?');

    assert.equal(getBase('?/?').base, '.');
    assert.equal(getBase('?/?').pattern, '?/?');

    assert.equal(getBase('??').base, '.');
    assert.equal(getBase('??').pattern, '??');

    assert.equal(getBase('???').base, '.');
    assert.equal(getBase('???').pattern, '???');

    assert.equal(getBase('?a').base, '.');
    assert.equal(getBase('?a').pattern, '?a');

    assert.equal(getBase('?b').base, '.');
    assert.equal(getBase('?b').pattern, '?b');

    assert.equal(getBase('a?b').base, '.');
    assert.equal(getBase('a?b').pattern, 'a?b');

    assert.equal(getBase('a/?/c.js').base, 'a');
    assert.equal(getBase('a/?/c.js').pattern, '?/c.js');

    assert.equal(getBase('a/?/c.md').base, 'a');
    assert.equal(getBase('a/?/c.md').pattern, '?/c.md');

    assert.equal(getBase('a/?/c/?/*/f.js').base, 'a');
    assert.equal(getBase('a/?/c/?/*/f.js').pattern, '?/c/?/*/f.js');

    assert.equal(getBase('a/?/c/?/*/f.md').base, 'a');
    assert.equal(getBase('a/?/c/?/*/f.md').pattern, '?/c/?/*/f.md');

    assert.equal(getBase('a/?/c/?/e.js').base, 'a');
    assert.equal(getBase('a/?/c/?/e.js').pattern, '?/c/?/e.js');

    assert.equal(getBase('a/?/c/?/e.md').base, 'a');
    assert.equal(getBase('a/?/c/?/e.md').pattern, '?/c/?/e.md');

    assert.equal(getBase('a/?/c/???/e.js').base, 'a');
    assert.equal(getBase('a/?/c/???/e.js').pattern, '?/c/???/e.js');

    assert.equal(getBase('a/?/c/???/e.md').base, 'a');
    assert.equal(getBase('a/?/c/???/e.md').pattern, '?/c/???/e.md');

    assert.equal(getBase('a/??/c.js').base, 'a');
    assert.equal(getBase('a/??/c.js').pattern, '??/c.js');

    assert.equal(getBase('a/??/c.md').base, 'a');
    assert.equal(getBase('a/??/c.md').pattern, '??/c.md');

    assert.equal(getBase('a/???/c.js').base, 'a');
    assert.equal(getBase('a/???/c.js').pattern, '???/c.js');

    assert.equal(getBase('a/???/c.md').base, 'a');
    assert.equal(getBase('a/???/c.md').pattern, '???/c.md');

    assert.equal(getBase('a/????/c.js').base, 'a');
    assert.equal(getBase('a/????/c.js').pattern, '????/c.js');
  });

  it('non-glob pattern:', function () {
    assert.equal(getBase('').base, '');
    assert.equal(getBase('').pattern, '');

    assert.equal(getBase('.').base, '');
    assert.equal(getBase('.').pattern, '.');

    assert.equal(getBase('a').base, '');
    assert.equal(getBase('a').pattern, 'a');

    assert.equal(getBase('.a').base, '');
    assert.equal(getBase('.a').pattern, '.a');

    assert.equal(getBase('/a').base, '/');
    assert.equal(getBase('/a').pattern, 'a');

    assert.equal(getBase('/a/b/c').base, '/a/b/');
    assert.equal(getBase('/a/b/c').pattern, 'c');

    assert.equal(getBase('/a/b/c/').base, '/a/b/c/');
    assert.equal(getBase('/a/b/c/').pattern, '');

    assert.equal(getBase('a/b/c/').base, 'a/b/c/');
    assert.equal(getBase('a/b/c/').pattern, '');

    assert.equal(getBase('a.min.js').base, '');
    assert.equal(getBase('a.min.js').pattern, 'a.min.js');

    assert.equal(getBase('a/.x.md').base, 'a/');
    assert.equal(getBase('a/.x.md').pattern, '.x.md');

    assert.equal(getBase('a/b/.gitignore').base, 'a/b/');
    assert.equal(getBase('a/b/.gitignore').pattern, '.gitignore');

    assert.equal(getBase('a/b/c/d.md').base, 'a/b/c/');
    assert.equal(getBase('a/b/c/d.md').pattern, 'd.md');

    assert.equal(getBase('a/b/c/d.e.f/g.min.js').base, 'a/b/c/d.e.f/');
    assert.equal(getBase('a/b/c/d.e.f/g.min.js').pattern, 'g.min.js');

    assert.equal(getBase('a/b/.git').base, 'a/b/');
    assert.equal(getBase('a/b/.git').pattern, '.git');

    assert.equal(getBase('a/b/.git/').base, 'a/b/.git/');
    assert.equal(getBase('a/b/.git/').pattern, '');

    assert.equal(getBase('a/b/.gitignore').base, 'a/b/');
    assert.equal(getBase('a/b/.gitignore').pattern, '.gitignore');

    assert.equal(getBase('a/b/c').base, 'a/b/');
    assert.equal(getBase('a/b/c').pattern, 'c');

    assert.equal(getBase('a/b/c.d/e.md').base, 'a/b/c.d/');
    assert.equal(getBase('a/b/c.d/e.md').pattern, 'e.md');

    assert.equal(getBase('a/b/c.md').base, 'a/b/');
    assert.equal(getBase('a/b/c.md').pattern, 'c.md');

    assert.equal(getBase('a/b/c.min.js').base, 'a/b/');
    assert.equal(getBase('a/b/c.min.js').pattern, 'c.min.js');

    assert.equal(getBase('a/b/c/').base, 'a/b/c/');
    assert.equal(getBase('a/b/c/').pattern, '');

    assert.equal(getBase('a/b/c/d.e.f/g.min.js').base, 'a/b/c/d.e.f/');
    assert.equal(getBase('a/b/c/d.e.f/g.min.js').pattern, 'g.min.js');

    assert.equal(getBase('a/b/c/d.md').base, 'a/b/c/');
    assert.equal(getBase('a/b/c/d.md').pattern, 'd.md');

    assert.equal(getBase('a/b/git/').base, 'a/b/git/');
    assert.equal(getBase('a/b/git/').pattern, '');

    assert.equal(getBase('aa').base, '');
    assert.equal(getBase('aa').pattern, 'aa');

    assert.equal(getBase('ab').base, '');
    assert.equal(getBase('ab').pattern, 'ab');

    assert.equal(getBase('bb').base, '');
    assert.equal(getBase('bb').pattern, 'bb');

    assert.equal(getBase('c.md').base, '');
    assert.equal(getBase('c.md').pattern, 'c.md');

    assert.equal(getBase('foo').base, '');
    assert.equal(getBase('foo').pattern, 'foo');
  });
});

describe('path parts:', function () {
  describe('complex patterns:', function () {
    it('should get a dirname:', function () {
      assert.equal(parse('*.min.js').path.dirname, '');
      assert.equal(parse('/a/b/c').path.dirname, '/a/b/');
      assert.equal(parse('/a/b/c/').path.dirname, '/a/b/c/');
      assert.equal(parse('/a/b/{c,d}/').path.dirname, '/a/b/{c,d}/');
      assert.equal(parse('/a/b/{c,d}/*.js').path.dirname, '/a/b/{c,d}/');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.dirname, '/a/b/{c,d}/');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.dirname, '/a/b/{c,d}/e.f.g/');
      assert.equal(parse('/a/b/{c,/foo.js}/e.f.g/').path.dirname, '/a/b/{c,/foo.js}/e.f.g/');
      assert.equal(parse('./{a/b/{c,/foo.js}/e.f.g}').path.dirname, './{a/b/{c,/foo.js}/e.f.g}');
      assert.equal(parse('[a-c]b*').path.dirname, '');
      assert.equal(parse('[a-j]*[^c]').path.dirname, '');
      assert.equal(parse('[a-j]*[^c]b/c').path.dirname, '[a-j]*[^c]b/');
      assert.equal(parse('[a-j]*[^c]bc').path.dirname, '');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.dirname, 'a/b/{c,./d}/e/');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.dirname, 'a/b/{c,.gitignore,{a,./b}}/{a,b}/');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
      assert.equal(parse('a/b/{c,.gitignore}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/{c,/.gitignore}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.dirname, 'a/b/{c,/d}/e/');
      assert.equal(parse('a/b/{c,/gitignore}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/{c,d}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/{c,d}/').path.dirname, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/*.js').path.dirname, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.dirname, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.dirname, 'a/b/{c,d}/e.f.g/');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.dirname, 'a/b/{c,d}/e/');
      assert.equal(parse('a').path.dirname, '');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.dirname, 'a/**/b/');
      assert.equal(parse('a/b/*.{foo,bar}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/.gitignore').path.dirname, 'a/b/');
      assert.equal(parse('a/b/.{c,.gitignore}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/.{c,/.gitignore}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/.{foo,bar}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/c').path.dirname, 'a/b/');
      assert.equal(parse('a/b/c.d/e.md').path.dirname, 'a/b/c.d/');
      assert.equal(parse('a/b/c.md').path.dirname, 'a/b/');
      assert.equal(parse('a/b/c.min.js').path.dirname, 'a/b/');
      assert.equal(parse('a/b/c/').path.dirname, 'a/b/c/');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.dirname, 'a/b/c/d.e.f/');
      assert.equal(parse('a/b/c/d.md').path.dirname, 'a/b/c/');
      assert.equal(parse('c.md').path.dirname, '');
    });

    it('should get a filename:', function () {
      assert.equal(parse('*.min.js').path.filename, '*.min.js');
      assert.equal(parse('/a/b/{c,d}/').path.filename, '');
      assert.equal(parse('/a/b/{c,d}/*.js').path.filename, '*.js');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.filename, '*.min.js');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('[a-j]*[^c]').path.filename, '[a-j]*[^c]');
      assert.equal(parse('[a-j]*[^c]bc').path.filename, '[a-j]*[^c]bc');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.filename, '*.{foo,bar}');
      assert.equal(parse('a/b/*.{foo,bar}').path.filename, '*.{foo,bar}');
      assert.equal(parse('a/b/.{c,.gitignore}').path.filename, '.{c,.gitignore}');
      assert.equal(parse('a/b/.{c,/.gitignore}').path.filename, '.{c,/.gitignore}');
      assert.equal(parse('a/b/.{foo,bar}').path.filename, '.{foo,bar}');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.filename, 'f.g');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.filename, 'abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.filename, '*.foo.js');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.filename, 'abc.foo.js');
      assert.equal(parse('a/b/{c,.gitignore}').path.filename, '{c,.gitignore}');
      assert.equal(parse('a/b/{c,/.gitignore}').path.filename, '{c,/.gitignore}');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.filename, 'f.g');
      assert.equal(parse('a/b/{c,/gitignore}').path.filename, '{c,/gitignore}');
      assert.equal(parse('a/b/{c,d}').path.filename, '{c,d}');
      assert.equal(parse('a/b/{c,d}/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/*.js').path.filename, '*.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.filename, '*.min.js');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.filename, 'f.g');
    });

    it('should get a basename:', function () {
      assert.equal(parse('*.min.js').path.basename, '*');
      assert.equal(parse('/a/b/c').path.basename, 'c');
      assert.equal(parse('/a/b/c/').path.basename, '');
      assert.equal(parse('/a/b/{c,d}/').path.basename, '');
      assert.equal(parse('/a/b/{c,d}/*.js').path.basename, '*');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.basename, '*');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('[a-c]b*').path.basename, '[a-c]b*');
      assert.equal(parse('a').path.basename, 'a');
      assert.equal(parse('a/**/b/*.{foo,bar}').path.basename, '*');
      assert.equal(parse('a/b/*.{foo,bar}').path.basename, '*');
      assert.equal(parse('a/b/.gitignore').path.basename, '');
      assert.equal(parse('a/b/.{c,.gitignore}').path.basename, '');
      assert.equal(parse('a/b/.{c,/.gitignore}').path.basename, '');
      assert.equal(parse('a/b/.{foo,bar}').path.basename, '');
      assert.equal(parse('a/b/c').path.basename, 'c');
      assert.equal(parse('a/b/c.d/e.md').path.basename, 'e');
      assert.equal(parse('a/b/c.md').path.basename, 'c');
      assert.equal(parse('a/b/c.min.js').path.basename, 'c');
      assert.equal(parse('a/b/c/').path.basename, '');
      assert.equal(parse('a/b/c/d.e.f/g.min.js').path.basename, 'g');
      assert.equal(parse('a/b/c/d.md').path.basename, 'd');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.basename, 'f');
      assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.basename, 'abc');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.basename, '*');
      assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.basename, 'abc');
      assert.equal(parse('a/b/{c,.gitignore}').path.basename, '{c,.gitignore}');
      assert.equal(parse('a/b/{c,/.gitignore}').path.basename, '{c,/.gitignore}');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.basename, 'f');
      assert.equal(parse('a/b/{c,/gitignore}').path.basename, '{c,/gitignore}');
      assert.equal(parse('a/b/{c,d}').path.basename, '{c,d}');
      assert.equal(parse('a/b/{c,d}/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/*.js').path.basename, '*');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.basename, '*');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.basename, 'f');
      assert.equal(parse('c.md').path.basename, 'c');
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
  });

  describe('should parse a glob:', function () {
    it('ending with a brace pattern:', function () {
      assert.equal(parse('a/b/{c,d}').pattern, 'a/b/{c,d}');
      assert.equal(parse('a/b/{c,d}').path.dirname, 'a/b/');
      assert.equal(parse('a/b/{c,d}').path.filename, '{c,d}');
      assert.equal(parse('a/b/{c,d}').path.basename, '{c,d}');
      assert.equal(parse('a/b/{c,d}').path.extname, '');
      assert.equal(parse('a/b/{c,d}').path.ext, '');
    });

    it('with a brace pattern in the dirname:', function () {
      assert.equal(parse('a/b/{c,d}/*.js').pattern, 'a/b/{c,d}/*.js');
      assert.equal(parse('a/b/{c,d}/*.js').path.dirname, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/*.js').path.filename, '*.js');
      assert.equal(parse('a/b/{c,d}/*.js').path.basename, '*');
      assert.equal(parse('a/b/{c,d}/*.js').path.extname, '.js');
      assert.equal(parse('a/b/{c,d}/*.js').path.ext, 'js');

      assert.equal(parse('a/b/{c,d}/').pattern, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/').path.dirname, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/').path.extname, '');
      assert.equal(parse('a/b/{c,d}/').path.ext, '');

      assert.equal(parse('a/b/{c,d}/e.f.g/').pattern, 'a/b/{c,d}/e.f.g/');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.dirname, 'a/b/{c,d}/e.f.g/');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.extname, '');
      assert.equal(parse('a/b/{c,d}/e.f.g/').path.ext, '');

      assert.equal(parse('/a/b/{c,d}/e.f.g/').pattern, '/a/b/{c,d}/e.f.g/');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.dirname, '/a/b/{c,d}/e.f.g/');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.filename, '');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.basename, '');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.extname, '');
      assert.equal(parse('/a/b/{c,d}/e.f.g/').path.ext, '');

      assert.equal(parse('a/b/{c,d}/*.min.js').pattern, 'a/b/{c,d}/*.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.dirname, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.filename, '*.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.basename, '*');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.ext, 'js');

      assert.equal(parse('*.min.js').pattern, '*.min.js');
      assert.equal(parse('*.min.js').path.dirname, '');
      assert.equal(parse('*.min.js').path.filename, '*.min.js');
      assert.equal(parse('*.min.js').path.basename, '*');
      assert.equal(parse('*.min.js').path.extname, '.min.js');
      assert.equal(parse('*.min.js').path.ext, 'js');

      assert.equal(parse('a/b/{c,d}/*.min.js').path.extname, '.min.js');
      assert.equal(parse('a/b/{c,d}/*.min.js').path.ext, 'js');

      assert.equal(parse('[a-j]*[^c]').pattern, '[a-j]*[^c]');
      assert.equal(parse('[a-j]*[^c]').path.dirname, '');
      assert.equal(parse('[a-j]*[^c]').path.filename, '[a-j]*[^c]');
      assert.equal(parse('[a-j]*[^c]b/c').pattern, '[a-j]*[^c]b/c');
      assert.equal(parse('[a-j]*[^c]b/c').path.dirname, '[a-j]*[^c]b/');
      assert.equal(parse('[a-j]*[^c]bc').pattern, '[a-j]*[^c]bc');
      assert.equal(parse('[a-j]*[^c]bc').path.dirname, '');
      assert.equal(parse('[a-j]*[^c]bc').path.filename, '[a-j]*[^c]bc');
    });

    it('ending with a slash:', function () {
      assert.equal(parse('a/b/{c,d}/').pattern, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/').path.dirname, 'a/b/{c,d}/');
      assert.equal(parse('a/b/{c,d}/').path.filename, '');
      assert.equal(parse('a/b/{c,d}/').path.basename, '');
      assert.equal(parse('a/b/{c,d}/').path.extname, '');
    });

    it('beginning with a slash:', function () {
      assert.equal(parse('/a/b/{c,d}/').pattern, '/a/b/{c,d}/');
      assert.equal(parse('/a/b/{c,d}/').path.dirname, '/a/b/{c,d}/');
      assert.equal(parse('/a/b/{c,d}/').path.filename, '');
      assert.equal(parse('/a/b/{c,d}/').path.basename, '');
      assert.equal(parse('/a/b/{c,d}/').path.extname, '');
    });

    it('with a brace pattern in the dirname:', function () {
      assert.equal(parse('a/b/{c,d}/e/f.g').pattern, 'a/b/{c,d}/e/f.g');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.dirname, 'a/b/{c,d}/e/');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.filename, 'f.g');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.basename, 'f');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,d}/e/f.g').path.ext, 'g');

      assert.equal(parse('a/b/{c,./d}/e/f.g').pattern, 'a/b/{c,./d}/e/f.g');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.dirname, 'a/b/{c,./d}/e/');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.filename, 'f.g');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.basename, 'f');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,./d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,./d}/e/f.g').path.ext, 'g');

      assert.equal(parse('a/b/{c,/d}/e/f.g').pattern, 'a/b/{c,/d}/e/f.g');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.dirname, 'a/b/{c,/d}/e/');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.filename, 'f.g');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.basename, 'f');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.extname, '.g');
      assert.equal(parse('a/b/{c,/d}/e/f.min.g').path.extname, '.min.g');
      assert.equal(parse('a/b/{c,/d}/e/f.g').path.ext, 'g');
    });
  });

  describe('when the glob pattern has braces:', function () {
    it('should track the original pattern', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').original, '/a/b/{c,d}/*.js');
      assert.equal(parse('/a/b/{c,d}/*.js').original, '/a/b/{c,d}/*.js');
    });

    it('should extract the dirname', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').path.dirname, '/a/b/{c,d}/');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.dirname, '/a/b/{c,d}/');
    });

    it('should extract the filename', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').path.filename, '*.js');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.filename, '*.min.js');
    });

    it('should extract the basename', function () {
      assert.equal(parse('/a/b/{c,d}/*.js').path.basename, '*');
      assert.equal(parse('/a/b/{c,d}/*.min.js').path.basename, '*');
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

  it('should match when the filename starts with a star:', function () {
    assert.equal(parse('a/b/*.{foo,bar}').pattern, 'a/b/*.{foo,bar}');
    assert.equal(parse('a/b/*.{foo,bar}').path.dirname, 'a/b/');
    assert.equal(parse('a/b/*.{foo,bar}').path.filename, '*.{foo,bar}');
    assert.equal(parse('a/b/*.{foo,bar}').path.basename, '*');
    assert.equal(parse('a/b/*.{foo,bar}').path.extname, '.{foo,bar}');
    assert.equal(parse('a/b/*.{foo,bar}').path.ext, '{foo,bar}');
  });

  it('should match with globstars:', function () {
    assert.equal(parse('a/**/b/*.{foo,bar}').pattern, 'a/**/b/*.{foo,bar}');
    assert.equal(parse('a/**/b/*.{foo,bar}').path.dirname, 'a/**/b/');
    assert.equal(parse('a/**/b/*.{foo,bar}').path.filename, '*.{foo,bar}');
    assert.equal(parse('a/**/b/*.{foo,bar}').path.basename, '*');
    assert.equal(parse('a/**/b/*.{foo,bar}').path.extname, '.{foo,bar}');
    assert.equal(parse('a/**/b/*.{foo,bar}').path.ext, '{foo,bar}');
  });

  it('should match complex patterns:', function () {
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').pattern, 'a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.filename, 'abc.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.basename, 'abc');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.extname, '.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/abc.foo.js').path.ext, 'js');

    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').pattern, 'a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.dirname, 'a/b/{c,.gitignore,{a,b}}/{a,b}/');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.filename, '*.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.basename, '*');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.extname, '.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,b}}/{a,b}/*.foo.js').path.ext, 'js');

    assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').pattern, 'a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.dirname, 'a/b/{c,.gitignore,{a,./b}}/{a,b}/');
    assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.filename, 'abc.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.basename, 'abc');
    assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.extname, '.foo.js');
    assert.equal(parse('a/b/{c,.gitignore,{a,./b}}/{a,b}/abc.foo.js').path.ext, 'js');
  });

  it('should match a path with an extension:', function () {
    assert.equal(parse('a/b/c.md').pattern, 'a/b/c.md');
    assert.equal(parse('a/b/c.md').path.dirname, 'a/b/');
    assert.equal(parse('a/b/c.md').path.filename, 'c.md');
    assert.equal(parse('a/b/c.md').path.basename, 'c');
    assert.equal(parse('a/b/c.md').path.extname, '.md');
    assert.equal(parse('a/b/c.md').path.ext, 'md');
    assert.equal(parse('c.md').pattern, 'c.md');
    assert.equal(parse('c.md').path.dirname, '');
    assert.equal(parse('c.md').path.filename, 'c.md');
    assert.equal(parse('c.md').path.basename, 'c');
    assert.equal(parse('c.md').path.extname, '.md');
    assert.equal(parse('c.md').path.ext, 'md');
  });

  it('should match a path with multiple extensions:', function () {
    assert.equal(parse('a/b/c.min.js').pattern, 'a/b/c.min.js');
    assert.equal(parse('a/b/c.min.js').path.dirname, 'a/b/');
    assert.equal(parse('a/b/c.min.js').path.filename, 'c.min.js');
    assert.equal(parse('a/b/c.min.js').path.basename, 'c');
    assert.equal(parse('a/b/c.min.js').path.extname, '.min.js');
    assert.equal(parse('a/b/c.min.js').path.ext, 'js');
  });

  it('should work with paths that have dots in the dirname:', function () {
    assert.equal(parse('a/b/c/d.e.f/g.min.js').pattern, 'a/b/c/d.e.f/g.min.js');
    assert.equal(parse('a/b/c/d.e.f/g.min.js').path.dirname, 'a/b/c/d.e.f/');
    assert.equal(parse('a/b/c/d.e.f/g.min.js').path.filename, 'g.min.js');
    assert.equal(parse('a/b/c/d.e.f/g.min.js').path.basename, 'g');
    assert.equal(parse('a/b/c/d.e.f/g.min.js').path.extname, '.min.js');
    assert.equal(parse('a/b/c/d.e.f/g.min.js').path.ext, 'js');
  });

  it('should match a path without an extension:', function () {
    assert.equal(parse('a').pattern, 'a');
    assert.equal(parse('a').path.dirname, '');
    assert.equal(parse('a').path.filename, 'a');
    assert.equal(parse('a').path.basename, 'a');
    assert.equal(parse('a').path.extname, '');
  });

  it('should match a file path ending with an extension:', function () {
    assert.equal(parse('a/b/c/d.md').pattern, 'a/b/c/d.md');
    assert.equal(parse('a/b/c/d.md').path.dirname, 'a/b/c/');
    assert.equal(parse('a/b/c/d.md').path.filename, 'd.md');
    assert.equal(parse('a/b/c/d.md').path.basename, 'd');
    assert.equal(parse('a/b/c/d.md').path.extname, '.md');
    assert.equal(parse('a/b/c/d.md').path.ext, 'md');

    assert.equal(parse('a/b/c.d/e.md').pattern, 'a/b/c.d/e.md');
    assert.equal(parse('a/b/c.d/e.md').path.dirname, 'a/b/c.d/');
    assert.equal(parse('a/b/c.d/e.md').path.filename, 'e.md');
    assert.equal(parse('a/b/c.d/e.md').path.basename, 'e');
    assert.equal(parse('a/b/c.d/e.md').path.extname, '.md');
    assert.equal(parse('a/b/c.d/e.md').path.ext, 'md');
  });

  describe('trailing and leading slashs:', function () {
    it('should work without a trailing slash:', function () {
      assert.equal(parse('a/b/c').pattern, 'a/b/c');
      assert.equal(parse('a/b/c').path.dirname, 'a/b/');
      assert.equal(parse('a/b/c').path.filename, 'c');
      assert.equal(parse('a/b/c').path.basename, 'c');
      assert.equal(parse('a/b/c').path.extname, '');
    });

    it('should work with a trailing slash:', function () {
      assert.equal(parse('a/b/c/').pattern, 'a/b/c/');
      assert.equal(parse('a/b/c/').path.dirname, 'a/b/c/');
      assert.equal(parse('a/b/c/').path.filename, '');
      assert.equal(parse('a/b/c/').path.basename, '');
      assert.equal(parse('a/b/c/').path.extname, '');
    });

    it('should work with a leading slash:', function () {
      assert.equal(parse('/a/b/c').pattern, '/a/b/c');
      assert.equal(parse('/a/b/c').path.dirname, '/a/b/');
      assert.equal(parse('/a/b/c').path.filename, 'c');
      assert.equal(parse('/a/b/c').path.basename, 'c');
      assert.equal(parse('/a/b/c').path.extname, '');
    });

    it('should work with both trailing and leading slashes:', function () {
      assert.equal(parse('/a/b/c/').pattern, '/a/b/c/');
      assert.equal(parse('/a/b/c/').path.dirname, '/a/b/c/');
      assert.equal(parse('/a/b/c/').path.filename, '');
      assert.equal(parse('/a/b/c/').path.basename, '');
      assert.equal(parse('/a/b/c/').path.extname, '');
    });
  });


  describe('dotfile and dotdir:', function () {
    it('should know when the file is dotfile:', function () {
      assert.equal(parse('a/b/.gitignore').path.dirname, 'a/b/');
      assert.equal(parse('a/b/.gitignore').path.filename, '.gitignore');
      assert.equal(parse('a/b/.gitignore').path.basename, '');
      assert.equal(parse('a/b/.gitignore').path.extname, '.gitignore');
      assert.equal(parse('a/b/.gitignore').path.ext, 'gitignore');
    });
  });


  it('should match character classes:', function () {
    assert.equal(parse('[a-c]b*').pattern, '[a-c]b*');
    assert.equal(parse('[a-j]*[^c]').pattern, '[a-j]*[^c]');
    assert.equal(parse('[a-j]*[^c]').path.dirname, '');
    assert.equal(parse('[a-j]*[^c]').path.filename, '[a-j]*[^c]');
    assert.equal(parse('[a-j]*[^c]b/c').pattern, '[a-j]*[^c]b/c');
    assert.equal(parse('[a-j]*[^c]bc').pattern, '[a-j]*[^c]bc');
  });

  it('should work when a character class has trailing word characters:', function () {
    assert.equal(parse('[a-c]b*').pattern, '[a-c]b*');
    assert.equal(parse('[a-c]b*').path.dirname, '');
    assert.equal(parse('[a-c]b*').path.filename, '[a-c]b*');
    assert.equal(parse('[a-c]b*').path.basename, '[a-c]b*');
    assert.equal(parse('[a-c]b*').path.extname, '');
    assert.equal(parse('[a-j]*[^c]bc').path.dirname, '');
    assert.equal(parse('[a-j]*[^c]bc').path.filename, '[a-j]*[^c]bc');
    assert.equal(parse('[a-j]*[^c]bc').path.basename, '[a-j]*[^c]bc');
    assert.equal(parse('[a-j]*[^c]bc').path.extname, '');
  });
});

describe('when the glob has brace patterns:', function () {
  it('should extract the `base` from the glob:', function () {
    assert.equal(getBase('a/b/{c,/.gitignore}').base, 'a/b');
    assert.equal(getBase('a/b/{c,/.gitignore}').pattern, '{c,/.gitignore}');

    assert.equal(getBase('a/b/{c,/gitignore}').base, 'a/b');
    assert.equal(getBase('a/b/{c,/gitignore}').pattern, '{c,/gitignore}');

    assert.equal(getBase('a/b/{c,.gitignore}').base, 'a/b');
    assert.equal(getBase('a/b/{c,.gitignore}').pattern, '{c,.gitignore}');
  });

  it('should work when the brace pattern has dots and slashes:', function () {
    assert.equal(parse('a/b/{c,/.gitignore}').pattern, 'a/b/{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').path.dirname, 'a/b/');
    assert.equal(parse('a/b/{c,/.gitignore}').path.filename, '{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').path.basename, '{c,/.gitignore}');
    assert.equal(parse('a/b/{c,/.gitignore}').path.extname, '');

    assert.equal(parse('a/b/{c,/gitignore}').pattern, 'a/b/{c,/gitignore}');
    assert.equal(parse('a/b/{c,/gitignore}').path.dirname, 'a/b/');
    assert.equal(parse('a/b/{c,/gitignore}').path.filename, '{c,/gitignore}');
    assert.equal(parse('a/b/{c,/gitignore}').path.basename, '{c,/gitignore}');
    assert.equal(parse('a/b/{c,/gitignore}').path.extname, '');

    assert.equal(parse('a/b/{c,.gitignore}').pattern, 'a/b/{c,.gitignore}');
    assert.equal(parse('a/b/{c,.gitignore}').path.dirname, 'a/b/');
    assert.equal(parse('a/b/{c,.gitignore}').path.filename, '{c,.gitignore}');
    assert.equal(parse('a/b/{c,.gitignore}').path.basename, '{c,.gitignore}');
    assert.equal(parse('a/b/{c,.gitignore}').path.extname, '');
  });

  it('should work when the brace pattern has a leading dot in the dirname:', function () {
    assert.equal(parse('a/b/.{foo,bar}/foo.js').pattern, 'a/b/.{foo,bar}/foo.js');
    assert.equal(parse('a/b/.{foo,bar}/foo.js').path.dirname, 'a/b/.{foo,bar}/');
    assert.equal(parse('a/b/.{foo,bar}/foo.js').path.filename, 'foo.js');
    assert.equal(parse('a/b/.{foo,bar}/foo.js').path.basename, 'foo');
    assert.equal(parse('a/b/.{foo,bar}/foo.js').path.extname, '.js');
    assert.equal(parse('a/b/.{foo,bar}/foo.js').path.ext, 'js');
  });

  it('should work when the brace pattern has a leading dot in the filename:', function () {
    assert.equal(parse('a/b/.{foo,bar}').pattern, 'a/b/.{foo,bar}');
    assert.equal(parse('a/b/.{foo,bar}').path.dirname, 'a/b/');
    assert.equal(parse('a/b/.{foo,bar}').path.filename, '.{foo,bar}');
    assert.equal(parse('a/b/.{foo,bar}').path.basename, '');
    assert.equal(parse('a/b/.{foo,bar}').path.extname, '.{foo,bar}');
    assert.equal(parse('a/b/.{foo,bar}').path.ext, '{foo,bar}');

    assert.equal(parse('a/b/.{c,/.gitignore}').pattern, 'a/b/.{c,/.gitignore}');
    assert.equal(parse('a/b/.{c,/.gitignore}').path.dirname, 'a/b/');
    assert.equal(parse('a/b/.{c,/.gitignore}').path.filename, '.{c,/.gitignore}');
    assert.equal(parse('a/b/.{c,/.gitignore}').path.basename, '');
    assert.equal(parse('a/b/.{c,/.gitignore}').path.extname, '.{c,/.gitignore}');

    assert.equal(parse('a/b/.{c,.gitignore}').pattern, 'a/b/.{c,.gitignore}');
    assert.equal(parse('a/b/.{c,.gitignore}').path.dirname, 'a/b/');
    assert.equal(parse('a/b/.{c,.gitignore}').path.filename, '.{c,.gitignore}');
    assert.equal(parse('a/b/.{c,.gitignore}').path.basename, '');
    assert.equal(parse('a/b/.{c,.gitignore}').path.extname, '.{c,.gitignore}');
    assert.equal(parse('a/b/.{c,.gitignore}').path.ext, '{c,.gitignore}');
  });
});
