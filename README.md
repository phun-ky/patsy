# patsy

> A staging and build environment for web developers. 

## Installation

### Requirements

patsy requires [Nodejs >= 0.8.0][node] and is built with these plugins:

* Gruntjs
* UglifyJS
* Commander

_Read full list in the package.json file under "dependencies"_ 

### Instructions

Following instructions will install patsy and all dependencies

1. Install the required version of [node]
2. Then in your prefered CLI, type `npm install patsy`

## Getting started

Go to the folder of where you have your web project, type `patsy` and enjoy!

### patsy currently does this

1. Bake mustache template files ( no variable passing ) into JSON string written to a *.js file
2. Check js files with JSHint
3. Minify files
4. Concatinates minified files into one single file

## Upcoming features

* Staging environment ( to pick sets of routes (read: proxy/reverse proxy) to use in given environment )
* Proxy support
* Static file server support
* Live content update when saving files

For a full list of planned features to come, see [features to come][features_planned]

## Documentation content

TOC for the [wiki]

### Supported configuration (current)

        {
          "nameOfProject": "",
          "pathToJavaScriptFiles": "js/src/",
          "pathToMinifiedFiles": "js/min/",
          "pathToBakedFiles": "js/dist/",
          "pathToTemplateFiles": "js/mustache/",
          "templatePrefix": "",
          "templatePostfix": ""
        }


[node]: http://nodejs.org/
[npm]: http://npmjs.org/
[wiki]: http://github.com/phun-ky/patsy/wiki
[patsy]: http://github.com/phun-ky/patsy
[features_planned]: https://github.com/phun-ky/patsy/issues?labels=feature+planned&page=1&state=open

## Release History
_(Until v1.0.0, this will only be updated when major or breaking changes are made)_
