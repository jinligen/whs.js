import jsdoc from 'gulp-jsdoc3';
import gulp from 'gulp';
import watch from 'gulp-watch';
import sass from 'gulp-sass';
import del from 'del';
import {argv} from 'yargs';
import config from '../jsdoc.json';

gulp.task('docs', cb => {
  del('./docs/public/*.html');

  gulp.src('./docs/template/static/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./docs/public/styles/'));

  gulp.src(['./docs/data/**/*', argv.all ? './src/**/*.js' : './src/core/Component.js', '!./src/modules/extra/node_modules/**/*.js'])
    .pipe(jsdoc(config, cb));
});

gulp.task('docs:watch', ['docs'], () => {
  let i = 0;

  watch([
    './docs/template/**/*.scss'
  ], () => {
    console.log(`update styles #${i++}`);

    gulp.src('./docs/template/static/scss/*.scss')
      .pipe(less())
      .pipe(gulp.dest('./docs/public/styles/'));
  });

  return watch([
    './docs/template/**/*.tmpl',
    './docs/template/publish.js',
    './docs/data/**/*',
    argv.all ? './src/**/*.js' : './src/core/Component.js'
  ], () => {
    del('./docs/public/*.html');
    console.log(`update #${i++}`);

    gulp.src(['./docs/data/**/*.md', argv.all ? './src/**/*.js' : './src/core/Component.js', '!./src/modules/extra/node_modules/**/*.js'])
      .pipe(jsdoc(config));
  });
});
