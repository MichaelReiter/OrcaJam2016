const gulp       = require('gulp');
const gutil      = require('gulp-util');
const concat     = require('gulp-concat');
// const sass       = require('gulp-sass');
const changed    = require('gulp-changed');
const imagemin   = require('gulp-imagemin');
const minifyHTML = require('gulp-minify-html');
const babel      = require('gulp-babel');

const jsSrc = [
  './src/js/main.js',
  './src/js/*.js'
];
const jsDst    = './build/js';
const libSrc   = './src/lib/*.js';
const libDst   = './build/lib';
const imgSrc   = './src/img/*';
const imgDst   = './build/img';
const htmlSrc  = './src/html/*.html';
const htmlDst  = './build/';
// const audioSrc = './src/audio/*';
// const audioDst = './build/audio';
// const styleSrc = './src/styles/*.scss';
// const styleDst = './build/css';

// Build JavaScript files
gulp.task('javascript', () => {
  gulp.src(jsSrc)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(jsDst))
});

// Copy JavaScript libraries
gulp.task('lib', () => {
  gulp.src(libSrc).pipe(gulp.dest(libDst));
});

// Copy image files
gulp.task('img', () => {
  gulp.src(imgSrc).pipe(gulp.dest(imgDst));
});

// Copy html files
gulp.task('html', () => {
  gulp.src(htmlSrc).pipe(minifyHTML()).pipe(gulp.dest(htmlDst));
});

// // Build stylesheet files
// gulp.task('style', () => {
//   gulp.src(styleSrc).pipe(sass()).pipe gulp.dest(styleDst)
// });

// // Copy audio
// gulp.task('audio', () => {
//   gulp.src(audioSrc).pipe gulp.dest(audioDst);
// });

// Default task((this is run when you type 'gulp' in the root directory)
gulp.task('default', [
  'javascript',
  'lib',
  'html',
  'img',
  // 'audio',
  // 'style',
  // 'fonts'
], () => {
  // watch for changes in JavaScript files
  gulp.watch(jsSrc, ['javascript']);
  // watch for changes in image files
  gulp.watch(imgSrc, ['img']);
  // watch for changes in html files
  gulp.watch(htmlSrc, ['html']);
  // watch for changes in stylesheets
  // gulp.watch(styleSrc, ['style']);
  // watch for changes in fonts
  // watch for changes in audio
  // gulp.watch(styleSrc, ['audio']);
});