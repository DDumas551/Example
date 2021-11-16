const gulp         = require('gulp');

const fs           = require('file-system');
const path         = require('path');
const del          = require('del');
const zip          = require('gulp-zip');
const flatmap      = require('gulp-flatmap');
const glob         = require('glob');

const htmlmin      = require('gulp-htmlmin');
const imagemin     = require('gulp-imagemin');
const sass         = require('gulp-sass');
const uglify       = require('gulp-uglify');

const browsersync  = require('browser-sync').create();


const variants = [
  'anniversary',
  'hypercharge',
  'honcho',
];

const sizes = [
  '300x600',
  '970x250',
  '160x600',
  '728x90',
  '300x250',
  '320x50',
];

//let dirNames = [];

function scaffold() {
  return new Promise(function(resolve, reject) {
    variants.forEach( variant => {
      sizes.forEach( size => {
        const dirName = `${variant}_${size}`;
        gulp.src(['boilerplate/**/*'])
          .pipe(gulp.dest(`src/${dirName}`, {overwrite: false}));
      });
    });
    resolve();
  });
}

function index() {
  return new Promise(function(resolve, reject) {
    glob('dist/*/index.html', null, (er, files) => {
      const adLinks = files.map(uri => {
        const rel = uri.slice(5);
        const name = rel.substring(0, rel.indexOf('/index.html'));
        return `<li><a href="${rel}">${name}</a></li>`;
      });
      const indexMarkup = `<html><head><title>Index</title></head><body><h1>Index</h1><ul>${adLinks.join('')}</ul></body></html>`;
      fs.writeFile('dist/index.html', indexMarkup, resolve());
    });
  });
}

function html() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      caseSensitive: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.stream());
}

function styles() {
  return gulp.src(['src/**/*.scss','src/**/*.css'])
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.stream());
}

function scripts() {
  return gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.stream());
}

function images() {
  return gulp.src('src/**/images/*')
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest('dist'))
    .pipe(browsersync.stream());
}

function clean() {
  return del(['dist']);
}

function cleanZip() {
  return del(['zip']);
}

function compress() {
  return new Promise(function(resolve, reject) {
    glob('dist/*', null, (er, files) => {
      files.forEach( function(file) {
        return gulp.src(`${file}/**/*`, {
          base: 'dist/',
          ignore: 'dist/index.html',
        })
          .pipe(zip(`${file.slice(5)}.zip`))
          .pipe(gulp.dest('zip/'));
      });
    });
    resolve();
  });
}

function watchFiles() {
  gulp.watch(['src/**/*.scss','src/**/*.css'], styles);
  //gulp.watch('src/**/*.js', scripts);
  gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
  gulp.watch('src/**/images/*', images);
}

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './',
      index: 'dist/index.html'
    },
    port: 3000
  });
  done();
}

function browserSyncReload(done) {
  browsersync.reload();
  done();
}

const setup = gulp.series(scaffold);
const build = gulp.series(clean, gulp.parallel(html, styles, /*scripts,*/ images), index);
const watch = gulp.parallel(watchFiles, browserSync);
const zipit = gulp.series(cleanZip, compress);

exports.images  = images;
//exports.scripts = scripts;
exports.clean   = clean;
exports.styles  = styles;
exports.html    = html;
exports.setup   = setup;
exports.zip     = zipit;
exports.build   = build;
exports.watch   = watch;
exports.default = build;

