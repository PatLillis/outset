# outset

[![Outset on NPM](https://img.shields.io/npm/v/outset.svg)](https://www.npmjs.com/package/outset)

Minimal, unassuming, front-end foundation. Configured for HTML5 and Sass, built with Browserify and Gulp.

## Install

```bash
$ npm install outset -g
```

## Use

In your terminal:

```bash
$ outset [path]
$ npm i
$ gulp 			# start server
$ gulp --dev 	# start dev server (no uglifying)
```

In your browser:

```
http://localhost:3000/
```

Work in the `src` folder, deploy from the `dist` folder.

## Docs

### HTML

A minimal `index.html` file, with CSS and JS loaded.

```html
<!DOCTYPE html>

<html lang="en-US">
  <head>
    <title></title>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="style.css">
  </head>
  <body>

    <script src="bundle.js"></script>
  </body>
</html>
```

#### Includes

You can import files into HTML files - without dependence on a templating engine - using the following syntax:

```html
@include('path/to.html')
@include('path/to.svg')
```

Note that paths are relative to the `dist` folder, and as such have already run through the appropriate Gulp tasks.

### Sass

A minimal set of partials for building modular, reusable components.

```
sass/
├── components/
│   ├── _keyframes.scss       // empty partial, for storing reusable @keyframe animations
├── _font.scss                // html font size declaration, skeleton for body font styles
├── _layout.scss              // container style
├── _mixins.scss              // custom mixins - clearfix, media query, image replacement, and @font-face
├── _reset.scss               // custom, minimal reset
├── _vars.scss                // central variable file
├── _z-index.scss             // central z-index file
└── style.scss                // all @imports
```

### JS

Just an entry point to build around. No libraries!

Outset **supports ES6/7** syntax via [Babel.js](https://babeljs.io/), and **bundles modules** via [browserify/watchify](https://github.com/substack/node-browserify).

### Gulp

Never refresh again!

Tasks:

* HTML - file include, minify
* Sass - compile, autoprefix, minify, sourcemaps
* JS - transpile, bundle, minify, sourcemaps
* Images - minify
* Videos, Fonts, Favicon - move to deployment folder
* Server - auto refresh, serve sourcemaps
* Watch

Error Handling:

* No more broken pipes! `gulp-plumber` catches all errors.
* [Error handler](https://github.com/callmecavs/outset/blob/master/lib/gulpfile.babel.js#L23-L33) emits native system notification and logs to terminal.

### Browser Support

Targeting evergreen browsers and **IE10+**.

Note that this boilerplate **doesn't detect browsers or their features**.

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
