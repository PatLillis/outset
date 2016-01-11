// IMPORTS

import assign from 'lodash.assign'
import babelify from 'babelify'
import browserify from 'browserify'
import buffer from 'vinyl-buffer'
import changed from 'gulp-changed'
import cssnano from 'cssnano'
import cssnext from 'postcss-cssnext'
import fileinclude from 'gulp-file-include'
import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'
import imports from 'postcss-import'
import notifier from 'node-notifier'
import plumber from 'gulp-plumber'
import postcss from 'gulp-postcss'
import rucksack from 'rucksack-css'
import source from 'vinyl-source-stream'
import sourcemaps from 'gulp-sourcemaps'
import sync from 'browser-sync'
import uglify from 'gulp-uglify'
import watchify from 'watchify'

// ERROR HANDLER

const onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  })

  console.log(error)
  this.emit('end')
}

// HTML

gulp.task('html', () => {
  return gulp.src('src/html/**/*.html')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(fileinclude({ prefix: '@', basepath: 'dist/' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'))
})

// SASS

const processors = [
  imports({ from: 'src/css/style.css' }),
  cssnext({ browsers: [ 'last 2 versions'] }),
  rucksack({ responsiveType: false, quantityQueries: false, inputPseudo: false, easings: false }),
  cssnano({ safe: true })
]

gulp.task('css', () => {
  return gulp.src('src/css/style.css')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./maps', { addComment: false }))
    .pipe(gulp.dest('dist'))
})

// JS

const browserifyArgs = {
  entries: 'src/js/main.js',
  debug: true,
  transform: [ 'babelify' ]
}

const watchifyArgs = assign(watchify.args, browserifyArgs)
const bundler = watchify(browserify(watchifyArgs))

const build = () => {
  console.log('Bundling started...')
  console.time('Bundling finished')

  return bundler
    .bundle()
    .on('error', onError)
    .on('end', () => console.timeEnd('Bundling finished'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps', { addComment: false }))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream())
}

bundler.on('update', build)
gulp.task('js', build)

// IMAGES

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg}')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('dist'))
    .pipe(imagemin({ progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
})

// VIDEOS, FONTS, FAVICON

const inputs = [
  '/videos/**/*',
  '/fonts/**/*.{eot,svg,ttf,woff,woff2}',
  '/favicon.ico'
]

const outputs = [
  '/videos',
  '/fonts',
  ''
]

;['videos', 'fonts', 'favicon'].forEach((name, index) => {
  gulp.task(name, () => {
    return gulp.src('src' + inputs[index])
      .pipe(plumber({ errorHandler: onError }))
      .pipe(gulp.dest('dist' + outputs[index]))
  })
})

// SERVER

const server = sync.create()
const reload = sync.reload

const sendMaps = (req, res, next) => {
  const filename = req.url.split('/').pop()
  const extension = filename.split('.').pop()

  if(extension === 'css' || extension === 'js') {
    res.setHeader('X-SourceMap', '/maps/' + filename + '.map')
  }

  return next()
}

const options = {
  notify: false,
  server: {
    baseDir: 'dist',
    middleware: [
      sendMaps
    ]
  },
  watchOptions: {
    ignored: '*.map'
  }
}

gulp.task('server', () => sync(options))

// WATCH

gulp.task('watch', () => {
  gulp.watch('src/html/**/*.html', ['html', reload])
  gulp.watch('src/css/**/*.css', ['css', reload])
  gulp.watch('src/images/**/*.{gif,jpg,png,svg}', ['images', reload])
})

// BUILD & DEFAULT TASK

gulp.task('build', ['html', 'css', 'js', 'images', 'videos', 'fonts', 'favicon'])
gulp.task('default', ['server', 'build', 'watch'])
