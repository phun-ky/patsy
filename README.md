# patsy [![Build Status](https://travis-ci.org/phun-ky/patsy.png)](https://travis-ci.org/phun-ky/patsy)

> A staging and build environment for web developers.

_Note that this application is depended on some bleeding edge plugins, like the development version of [GruntJS][grunt]. YMMV._

## Why use patsy?

Short excerpt here with link to  [Why Patsy?](https://github.com/phun-ky/patsy/wiki/Why-patsy).

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
7. Automated testing via Nodeunit ( support for Jasmine and Qunit aswell )
8. Proxy support
9. Static file server support
10. Live content update when saving files

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

09/02/2013: Beate released!

21/01/2013: Made patsy ready for beta-release. Added support for proxy, static file server and live reload.

07/01/2013: Added support for passing options to build plugin, removed dependency of globally installed grunt,
added default configuration file and support for automated documentation generation.


