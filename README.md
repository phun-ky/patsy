# patsy

> A staging and build environment for web developers. 

_Note that this application is depended on some bleeding edge plugins, like the development version of [GruntJS][grunt]. YMMV._

## Getting started

### Requirements

patsy requires [Nodejs >= 0.8.0][node] and is built with these plugins:

* Gruntjs
* UglifyJS
* Commander
* etc.. ( _Read full list in the package.json file under "dependencies"_ )

All of the dependencies are installed automatically when you install patsy. 

### Installation 

Following instructions will install patsy and all dependencies:

1. Install the required version of [node]
2. Then in your prefered CLI, type `npm install patsy`

> If you get the error "warn cannot run in wd" from npm, try to run it again with `sudo npm install patsy --unsafe-perm`

### How to use

Go to the folder of where you have your web project, type `patsy` and enjoy!

Patsy will generate a configuration file for you if you have not specified one in your project root folder. 
Patsy will ask you some questions to build a configuration file, or if you trust him, he will generate a default 
configuration file for you.

## Features

### Patsy currently does this

1. Bake mustache template files ( no variable passing ) into JSON string written to a *.js file
2. Check js files with JSHint
3. Minify files
4. Concatinates minified files into one single file
5. Automagic documentation generation

### We want patsy to do this aswell in the future

* Staging environment ( to pick sets of routes (read: proxy/reverse proxy) to use in given environment )
* Proxy support
* Static file server support
* Live content update when saving files
* Automated testing via Jasmine AND/OR Qunit
* Baking of LESS to CSS


For a full list of planned features to come, see [features to come][features_planned].

## Documentation 

See the [wiki] for full documentation. Documentation not found in the [wiki] can be found as inline comments in the code, 
if documentation is missing or incomplete, please submit an [issue][issues].


[node]: http://nodejs.org/
[grunt]: https://github.com/gruntjs/grunt
[npm]: http://npmjs.org/
[wiki]: http://github.com/phun-ky/patsy/wiki
[patsy]: http://github.com/phun-ky/patsy
[features_planned]: https://github.com/phun-ky/patsy/issues?labels=feature+planned&page=1&state=open
[issues]: https://github.com/phun-ky/patsy/issues

## Release History
_(Until v1.0.0, this will only be updated when major or breaking changes are made)_
