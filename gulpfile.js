const gulp       = require('gulp');
const gutil      = require('gulp-util');
const concat     = require('gulp-concat');
const stylus     = require('gulp-stylus');
const changed    = require('gulp-changed');
const imagemin   = require('gulp-imagemin');
const minifyHTML = require('gulp-minify-html');
const babel      = require('gulp-babel');

const jsSrc = [
  './src/js/*.js',
  './src/js/main.js'
];
const jsDst     = './build/js';
const libSrc    = './src/lib/*.js';
const libDst    = './build/lib';
const htmlSrc   = './src/html/*.html';
const htmlDst   = './build/';
const stylesSrc = './src/styles/*.styl';
const stylesDst = './build/css';
const imgSrc    = './src/img/*';
const imgDst    = './build/img';
const audioSrc  = './src/audio/*';
const audioDst  = './build/audio';

// Build JavaScript files
gulp.task('javascript', () => {
  gulp.src(jsSrc)
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(jsDst));
});

// Copy JavaScript libraries
gulp.task('lib', () => {
  gulp.src(libSrc).pipe(gulp.dest(libDst));
});

// Copy html files
gulp.task('html', () => {
  gulp.src(htmlSrc).pipe(minifyHTML()).pipe(gulp.dest(htmlDst));
});

// Build stylesheet files
gulp.task('style', () => {
  gulp.src(stylesSrc).pipe(stylus()).pipe(gulp.dest(stylesDst));
});

// Copy image files
gulp.task('img', () => {
  gulp.src(imgSrc).pipe(gulp.dest(imgDst));
});

// Copy audio
gulp.task('audio', () => {
  gulp.src(audioSrc).pipe(gulp.dest(audioDst));
});

// Default task((this is run when you type 'gulp' in the root directory)
gulp.task('default', [
  'javascript',
  'lib',
  'html',
  'style',
  'img',
  'audio',
], () => {
  // watch for changes in JavaScript files
  gulp.watch(jsSrc, ['javascript']);
  // watch for changes in html files
  gulp.watch(htmlSrc, ['html']);
  // watch for changes in stylesheets
  gulp.watch(stylesSrc, ['style']);
  // watch for changes in image files
  gulp.watch(imgSrc, ['img']);
  // watch for changes in audio
  gulp.watch(audioSrc, ['audio']);
});