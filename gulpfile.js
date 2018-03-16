const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

const reload = browserSync.reload;
/**
 * Gulp Tasks
 */
gulp.task('browser-sync', ['nodemon'], () => {
  browserSync({
    proxy: 'localhost:4000', // local node app address
    port: 5000, // use *different* port than above
    notify: true,
  });
});

gulp.task('nodemon', (cb) => {
  let called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
    ],
  })
    .on('start', () => {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', () => {
      setTimeout(() => {
        reload({ stream: false });
      }, 1000);
    });
});
gulp.task('default', ['browser-sync'], () => {
  gulp.watch(['views/*.pug'], reload);
  gulp.watch(['public/*.css'], reload);
  gulp.watch(['public/*.css'], reload);
  gulp.watch('*.js', ['eslint']);
});

gulp.task('eslint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
