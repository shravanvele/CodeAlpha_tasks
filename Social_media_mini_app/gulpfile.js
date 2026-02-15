const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // Updated to use 'sass'
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const fs = require('fs');

gulp.task('clean:assets', function (done) {
  console.log('Cleaning assets...');
  // Use fs.rm to remove the 'public/assets' directory
  fs.rm('./public/assets', { recursive: true }, (err) => {
    if (err) {
      console.error('Error cleaning assets:', err);
    }
    done();
  });
});

gulp.task('css', function (done) {
  console.log('Minifying CSS...');
  gulp.src('./assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError)) // Updated line
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

  gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
  done();
});

gulp.task('js', function (done) {
  console.log('Minifying JS...');
  gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
  done();
});

gulp.task('images', function (done) {
  console.log('Compressing images...');
  gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
  done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function (done) {
  console.log('Building assets');
  done();
});


//npm uninstall gulp-rev
 //npm install gulp-rev@9.0.0
 //npm install sass --save-dev
 //npm install gulp-imagemin@7.1.0







