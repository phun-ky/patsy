# Deprecated

> Due to Grunt version > 0.4* and above with new plugins providing the needed features, this application is deprecated and no longer maintained.
If you want to develop this further, please contact the author.

# patsy

[![deprecated](http://hughsk.github.io/stability-badges/dist/deprecated.svg)](http://github.com/hughsk/stability-badges)
[![Build Status](https://travis-ci.org/phun-ky/patsy.png)](https://travis-ci.org/phun-ky/patsy)
[![Dependency Status](https://gemnasium.com/phun-ky/patsy.png)](https://gemnasium.com/phun-ky/patsy)
[![NPM version](https://badge.fury.io/js/patsy.png)](http://badge.fury.io/js/patsy)

> A staging and build environment for frontend web developers.

## Why use patsy?

Short: It speeds up your developing with frontend stuff.
Long: [Why Patsy?](https://github.com/phun-ky/patsy/wiki/Why-patsy).

> "Get on with it!"

## Introduction

To install and use patsy, take a look in our [getting started guide](https://github.com/phun-ky/patsy/wiki/Getting-started).

## Features

### Patsy currently does this

1. Bake mustache template files ( no variable passing ) into JSON string written to a *.js file
2. Check js files with JSHint
3. Minify files
4. Concatinates minified files into one single file
5. Automagic documentation generation
6. Baking of LESS to CSS
7. Automated testing via Nodeunit ( support for Qunit aswell )
8. Proxy support
9. Static file server support
10. Live content update when saving files (*)

### We want patsy to do this aswell in the future

* Staging environment ( to pick sets of routes (read: proxy/reverse proxy) to use in given environment )
* Image sprite generation with automated css generation **to be discussed**
* Proxy data mocking ( option to save/cache data results when resources are offline )

For a full list of planned features to come, see [features to come][features_planned].

## Documentation

See the [wiki] for full documentation. Documentation not found in the [wiki] can be found as inline comments in the code,
if documentation is missing or incomplete, please submit an [issue][issues].


[node]: http://nodejs.org/
[grunt]: https://github.com/gruntjs/grunt
[npm]: http://npmjs.org/
[wiki]: http://github.com/phun-ky/patsy/wiki/
[why]: http://github.com/phun-ky/patsy/wiki/Why-patsy%3F
[patsy]: http://github.com/phun-ky/patsy
[features_planned]: https://github.com/phun-ky/patsy/issues?labels=feature+planned&page=1&state=open
[issues]: https://github.com/phun-ky/patsy/issues

## Release History
_(Until v1.0.0, this will only be updated when major or breaking changes are made)_

23/09/2013: Removed jasmine testing support for the time beeing, fixed NodeJS v0.10* path.resolve issue

09/02/2013: Beta released!

21/01/2013: Made patsy ready for beta-release. Added support for proxy, static file server and live reload.

07/01/2013: Added support for passing options to build plugin, removed dependency of globally installed grunt,
added default configuration file and support for automated documentation generation.


